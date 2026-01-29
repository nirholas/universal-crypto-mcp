// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title AIServiceMarketplace
 * @notice On-chain registry and reputation system for AI services
 * @dev Manages service registration, ratings, subscriptions, and escrow
 */
contract AIServiceMarketplace is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Service structure
    struct Service {
        address owner;
        string endpoint;
        uint256 payPerUsePrice;
        uint256 monthlyPrice;
        uint256 rating; // Weighted average * 100 (e.g., 450 = 4.5 stars)
        uint32 reviewCount;
        uint32 requestCount;
        bool active;
        uint64 createdAt;
    }

    // Rating structure
    struct Rating {
        address reviewer;
        uint8 stars; // 1-5
        string review;
        uint64 timestamp;
        bool verified; // User has paid for service
    }

    // Subscription structure
    struct Subscription {
        address subscriber;
        uint256 expiresAt;
        bool autoRenew;
        uint256 renewalCount;
    }

    // Dispute structure
    struct Dispute {
        address initiator;
        string reason;
        uint256 amount;
        uint64 createdAt;
        DisputeStatus status;
    }

    enum DisputeStatus {
        Open,
        Investigating,
        Resolved,
        Rejected
    }

    // State variables
    mapping(bytes32 => Service) public services;
    mapping(bytes32 => mapping(address => Rating)) public ratings;
    mapping(bytes32 => Rating[]) public serviceRatings;
    mapping(bytes32 => mapping(address => Subscription)) public subscriptions;
    mapping(bytes32 => Dispute[]) public disputes;
    mapping(bytes32 => uint256) public escrowBalances;

    bytes32[] public serviceIds;
    IERC20 public paymentToken; // USDC or other stablecoin
    uint256 public platformFee = 250; // 2.5% in basis points
    uint256 public constant MAX_FEE = 1000; // 10% max
    address public feeCollector;

    // Events
    event ServiceRegistered(
        bytes32 indexed serviceId,
        address indexed owner,
        string endpoint
    );
    event ServiceUpdated(bytes32 indexed serviceId);
    event ServiceStatusChanged(bytes32 indexed serviceId, bool active);
    event RatingSubmitted(
        bytes32 indexed serviceId,
        address indexed reviewer,
        uint8 stars
    );
    event PaymentReceived(
        bytes32 indexed serviceId,
        address indexed payer,
        uint256 amount
    );
    event SubscriptionCreated(
        bytes32 indexed serviceId,
        address indexed subscriber,
        uint256 expiresAt
    );
    event SubscriptionRenewed(
        bytes32 indexed serviceId,
        address indexed subscriber
    );
    event SubscriptionCancelled(
        bytes32 indexed serviceId,
        address indexed subscriber
    );
    event DisputeFiled(
        bytes32 indexed serviceId,
        address indexed initiator,
        uint256 disputeIndex
    );
    event DisputeResolved(
        bytes32 indexed serviceId,
        uint256 disputeIndex,
        DisputeStatus status
    );
    event FundsWithdrawn(
        bytes32 indexed serviceId,
        address indexed owner,
        uint256 amount
    );

    constructor(address _paymentToken, address _feeCollector) {
        paymentToken = IERC20(_paymentToken);
        feeCollector = _feeCollector;
    }

    /**
     * @notice Register a new AI service
     * @param serviceId Unique identifier for the service
     * @param endpoint API endpoint URL (stored as hash reference)
     * @param payPerUsePrice Price per API call (in payment token units)
     * @param monthlyPrice Monthly subscription price
     */
    function registerService(
        bytes32 serviceId,
        string memory endpoint,
        uint256 payPerUsePrice,
        uint256 monthlyPrice
    ) external {
        require(services[serviceId].owner == address(0), "Service exists");
        require(payPerUsePrice > 0 || monthlyPrice > 0, "Invalid pricing");

        services[serviceId] = Service({
            owner: msg.sender,
            endpoint: endpoint,
            payPerUsePrice: payPerUsePrice,
            monthlyPrice: monthlyPrice,
            rating: 0,
            reviewCount: 0,
            requestCount: 0,
            active: true,
            createdAt: uint64(block.timestamp)
        });

        serviceIds.push(serviceId);
        emit ServiceRegistered(serviceId, msg.sender, endpoint);
    }

    /**
     * @notice Pay for a single API request
     * @param serviceId Service to pay for
     */
    function payForRequest(bytes32 serviceId) external nonReentrant {
        Service storage service = services[serviceId];
        require(service.active, "Service inactive");
        require(service.payPerUsePrice > 0, "Pay-per-use not available");

        uint256 amount = service.payPerUsePrice;
        uint256 fee = (amount * platformFee) / 10000;
        uint256 serviceAmount = amount - fee;

        paymentToken.safeTransferFrom(msg.sender, address(this), amount);
        escrowBalances[serviceId] += serviceAmount;

        if (fee > 0) {
            paymentToken.safeTransfer(feeCollector, fee);
        }

        service.requestCount++;
        emit PaymentReceived(serviceId, msg.sender, amount);
    }

    /**
     * @notice Subscribe to a service
     * @param serviceId Service to subscribe to
     * @param autoRenew Whether to automatically renew
     */
    function subscribe(
        bytes32 serviceId,
        bool autoRenew
    ) external nonReentrant {
        Service storage service = services[serviceId];
        require(service.active, "Service inactive");
        require(service.monthlyPrice > 0, "Subscriptions not available");

        Subscription storage sub = subscriptions[serviceId][msg.sender];
        require(
            sub.expiresAt < block.timestamp,
            "Active subscription exists"
        );

        uint256 amount = service.monthlyPrice;
        uint256 fee = (amount * platformFee) / 10000;
        uint256 serviceAmount = amount - fee;

        paymentToken.safeTransferFrom(msg.sender, address(this), amount);
        escrowBalances[serviceId] += serviceAmount;

        if (fee > 0) {
            paymentToken.safeTransfer(feeCollector, fee);
        }

        sub.subscriber = msg.sender;
        sub.expiresAt = block.timestamp + 30 days;
        sub.autoRenew = autoRenew;
        sub.renewalCount++;

        emit SubscriptionCreated(serviceId, msg.sender, sub.expiresAt);
    }

    /**
     * @notice Cancel a subscription
     * @param serviceId Service subscription to cancel
     */
    function cancelSubscription(bytes32 serviceId) external {
        Subscription storage sub = subscriptions[serviceId][msg.sender];
        require(sub.subscriber == msg.sender, "Not subscribed");

        sub.autoRenew = false;
        emit SubscriptionCancelled(serviceId, msg.sender);
    }

    /**
     * @notice Submit a rating for a service
     * @param serviceId Service to rate
     * @param stars Rating (1-5)
     * @param review Text review
     */
    function rateService(
        bytes32 serviceId,
        uint8 stars,
        string memory review
    ) external {
        require(stars >= 1 && stars <= 5, "Invalid rating");
        require(services[serviceId].owner != address(0), "Service not found");

        // Check if user has paid for service
        Subscription memory sub = subscriptions[serviceId][msg.sender];
        bool verified = sub.expiresAt > block.timestamp;

        Rating memory rating = Rating({
            reviewer: msg.sender,
            stars: stars,
            review: review,
            timestamp: uint64(block.timestamp),
            verified: verified
        });

        ratings[serviceId][msg.sender] = rating;
        serviceRatings[serviceId].push(rating);

        // Update weighted average rating
        Service storage service = services[serviceId];
        uint256 totalRating = service.rating * service.reviewCount;
        totalRating += stars * 100;
        service.reviewCount++;
        service.rating = totalRating / service.reviewCount;

        emit RatingSubmitted(serviceId, msg.sender, stars);
    }

    /**
     * @notice File a dispute for a service
     * @param serviceId Service to dispute
     * @param reason Dispute reason
     * @param amount Amount to dispute
     */
    function fileDispute(
        bytes32 serviceId,
        string memory reason,
        uint256 amount
    ) external {
        require(services[serviceId].owner != address(0), "Service not found");

        Dispute memory dispute = Dispute({
            initiator: msg.sender,
            reason: reason,
            amount: amount,
            createdAt: uint64(block.timestamp),
            status: DisputeStatus.Open
        });

        disputes[serviceId].push(dispute);
        emit DisputeFiled(serviceId, msg.sender, disputes[serviceId].length - 1);
    }

    /**
     * @notice Resolve a dispute (owner only)
     * @param serviceId Service with dispute
     * @param disputeIndex Index of dispute
     * @param status New status
     * @param refundAmount Amount to refund (0 to reject)
     */
    function resolveDispute(
        bytes32 serviceId,
        uint256 disputeIndex,
        DisputeStatus status,
        uint256 refundAmount
    ) external onlyOwner {
        require(disputeIndex < disputes[serviceId].length, "Invalid dispute");
        
        Dispute storage dispute = disputes[serviceId][disputeIndex];
        require(
            dispute.status == DisputeStatus.Open ||
            dispute.status == DisputeStatus.Investigating,
            "Already resolved"
        );

        dispute.status = status;

        if (refundAmount > 0) {
            require(
                escrowBalances[serviceId] >= refundAmount,
                "Insufficient escrow"
            );
            escrowBalances[serviceId] -= refundAmount;
            paymentToken.safeTransfer(dispute.initiator, refundAmount);
        }

        emit DisputeResolved(serviceId, disputeIndex, status);
    }

    /**
     * @notice Withdraw accumulated earnings (service owner only)
     * @param serviceId Service to withdraw from
     */
    function withdrawEarnings(bytes32 serviceId) external nonReentrant {
        Service storage service = services[serviceId];
        require(service.owner == msg.sender, "Not owner");

        uint256 amount = escrowBalances[serviceId];
        require(amount > 0, "No funds to withdraw");

        escrowBalances[serviceId] = 0;
        paymentToken.safeTransfer(msg.sender, amount);

        emit FundsWithdrawn(serviceId, msg.sender, amount);
    }

    /**
     * @notice Update service status
     * @param serviceId Service to update
     * @param active New status
     */
    function setServiceStatus(bytes32 serviceId, bool active) external {
        Service storage service = services[serviceId];
        require(service.owner == msg.sender, "Not owner");
        
        service.active = active;
        emit ServiceStatusChanged(serviceId, active);
    }

    /**
     * @notice Update platform fee (owner only)
     * @param newFee New fee in basis points
     */
    function setPlatformFee(uint256 newFee) external onlyOwner {
        require(newFee <= MAX_FEE, "Fee too high");
        platformFee = newFee;
    }

    /**
     * @notice Get service details
     */
    function getService(bytes32 serviceId) external view returns (Service memory) {
        return services[serviceId];
    }

    /**
     * @notice Get all ratings for a service
     */
    function getServiceRatings(
        bytes32 serviceId
    ) external view returns (Rating[] memory) {
        return serviceRatings[serviceId];
    }

    /**
     * @notice Get subscription details
     */
    function getSubscription(
        bytes32 serviceId,
        address subscriber
    ) external view returns (Subscription memory) {
        return subscriptions[serviceId][subscriber];
    }

    /**
     * @notice Check if subscription is active
     */
    function isSubscriptionActive(
        bytes32 serviceId,
        address subscriber
    ) external view returns (bool) {
        return subscriptions[serviceId][subscriber].expiresAt > block.timestamp;
    }

    /**
     * @notice Get total number of services
     */
    function getServiceCount() external view returns (uint256) {
        return serviceIds.length;
    }
}
