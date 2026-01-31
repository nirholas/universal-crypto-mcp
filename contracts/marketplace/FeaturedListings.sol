// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title FeaturedListings
 * @notice Manages featured listing spots for the AI Service Marketplace
 * @dev Service providers can pay to have their services prominently displayed
 * 
 * Pricing Tiers:
 * - Bronze (1): $50/week - Highlighted in category
 * - Silver (2): $100/week - Category + Homepage sidebar  
 * - Gold (3): $200/week - Top of homepage, all categories
 */
contract FeaturedListings is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Featured tier enum
    enum FeaturedTier {
        None,    // 0 - Not featured
        Bronze,  // 1 - $50/week - Highlighted in category
        Silver,  // 2 - $100/week - Category + Homepage sidebar
        Gold     // 3 - $200/week - Top of homepage, all categories
    }

    // Featured listing info
    struct FeaturedInfo {
        bytes32 serviceId;
        FeaturedTier tier;
        uint256 featuredUntil;
        address owner;
        uint256 totalSpent;
    }

    // State variables
    mapping(bytes32 => uint256) public featuredUntil;
    mapping(bytes32 => FeaturedTier) public featuredTier;
    mapping(bytes32 => address) public serviceOwners;
    mapping(bytes32 => uint256) public totalSpentOnFeaturing;
    
    // Pricing: [Bronze, Silver, Gold] per week in USDC (6 decimals)
    uint256[3] public featuredPrices;
    
    // Track all featured services
    bytes32[] private _allFeaturedServices;
    mapping(bytes32 => uint256) private _featuredIndex;
    mapping(bytes32 => bool) private _isTracked;

    IERC20 public paymentToken;
    address public feeCollector;
    
    // Revenue tracking
    uint256 public totalFeaturedRevenue;

    // Events
    event ServiceFeatured(
        bytes32 indexed serviceId,
        FeaturedTier tier,
        uint256 expiresAt,
        uint256 amountPaid
    );
    
    event FeaturedRenewed(
        bytes32 indexed serviceId,
        uint256 newExpiry,
        uint256 amountPaid
    );
    
    event FeaturedUpgraded(
        bytes32 indexed serviceId,
        FeaturedTier oldTier,
        FeaturedTier newTier,
        uint256 newExpiry
    );
    
    event FeaturedExpired(bytes32 indexed serviceId);
    
    event FeaturedPricesUpdated(
        uint256 bronzePrice,
        uint256 silverPrice,
        uint256 goldPrice
    );

    constructor(
        address _paymentToken,
        address _feeCollector,
        uint256[3] memory _initialPrices
    ) {
        require(_paymentToken != address(0), "Invalid payment token");
        require(_feeCollector != address(0), "Invalid fee collector");
        
        paymentToken = IERC20(_paymentToken);
        feeCollector = _feeCollector;
        featuredPrices = _initialPrices;
    }

    /**
     * @notice Purchase a featured spot for a service
     * @param serviceId Unique identifier for the service
     * @param tier Featured tier (1=Bronze, 2=Silver, 3=Gold)
     * @param weeks Number of weeks to feature
     */
    function purchaseFeaturedSpot(
        bytes32 serviceId,
        uint8 tier,
        uint8 weeks
    ) external nonReentrant {
        require(tier >= 1 && tier <= 3, "Invalid tier");
        require(weeks >= 1 && weeks <= 52, "Invalid duration");
        require(
            featuredUntil[serviceId] < block.timestamp,
            "Already featured, use renew or upgrade"
        );

        uint256 price = featuredPrices[tier - 1] * weeks;
        require(price > 0, "Price not set");

        // Transfer payment
        paymentToken.safeTransferFrom(msg.sender, feeCollector, price);

        // Set featured status
        featuredUntil[serviceId] = block.timestamp + (weeks * 1 weeks);
        featuredTier[serviceId] = FeaturedTier(tier);
        serviceOwners[serviceId] = msg.sender;
        totalSpentOnFeaturing[serviceId] += price;
        totalFeaturedRevenue += price;

        // Track this service
        if (!_isTracked[serviceId]) {
            _featuredIndex[serviceId] = _allFeaturedServices.length;
            _allFeaturedServices.push(serviceId);
            _isTracked[serviceId] = true;
        }

        emit ServiceFeatured(
            serviceId,
            FeaturedTier(tier),
            featuredUntil[serviceId],
            price
        );
    }

    /**
     * @notice Renew an existing featured spot
     * @param serviceId Service to renew
     * @param weeks Number of weeks to extend
     */
    function renewFeaturedSpot(
        bytes32 serviceId,
        uint8 weeks
    ) external nonReentrant {
        require(weeks >= 1 && weeks <= 52, "Invalid duration");
        require(
            featuredTier[serviceId] != FeaturedTier.None,
            "Service not featured"
        );
        require(
            serviceOwners[serviceId] == msg.sender,
            "Not the service owner"
        );

        uint8 currentTier = uint8(featuredTier[serviceId]);
        uint256 price = featuredPrices[currentTier - 1] * weeks;

        // Transfer payment
        paymentToken.safeTransferFrom(msg.sender, feeCollector, price);

        // Extend from current expiry or now, whichever is later
        uint256 startTime = featuredUntil[serviceId] > block.timestamp
            ? featuredUntil[serviceId]
            : block.timestamp;
        
        featuredUntil[serviceId] = startTime + (weeks * 1 weeks);
        totalSpentOnFeaturing[serviceId] += price;
        totalFeaturedRevenue += price;

        emit FeaturedRenewed(serviceId, featuredUntil[serviceId], price);
    }

    /**
     * @notice Upgrade a featured spot to a higher tier
     * @param serviceId Service to upgrade
     * @param newTier New tier (must be higher than current)
     * @param additionalWeeks Optional additional weeks to add
     */
    function upgradeFeaturedSpot(
        bytes32 serviceId,
        uint8 newTier,
        uint8 additionalWeeks
    ) external nonReentrant {
        require(newTier >= 1 && newTier <= 3, "Invalid tier");
        require(
            serviceOwners[serviceId] == msg.sender,
            "Not the service owner"
        );

        FeaturedTier currentTier = featuredTier[serviceId];
        require(
            newTier > uint8(currentTier),
            "New tier must be higher"
        );
        require(
            featuredUntil[serviceId] > block.timestamp,
            "Feature expired, use purchase"
        );

        // Calculate remaining time
        uint256 remainingTime = featuredUntil[serviceId] - block.timestamp;
        uint256 remainingWeeks = remainingTime / 1 weeks;
        if (remainingWeeks == 0) remainingWeeks = 1;

        // Calculate upgrade cost (difference in tier prices for remaining time)
        uint256 currentPrice = featuredPrices[uint8(currentTier) - 1];
        uint256 newPrice = featuredPrices[newTier - 1];
        uint256 priceDiff = newPrice - currentPrice;
        uint256 upgradeCost = priceDiff * remainingWeeks;

        // Add cost for additional weeks at new tier
        if (additionalWeeks > 0) {
            upgradeCost += newPrice * additionalWeeks;
        }

        // Transfer payment
        paymentToken.safeTransferFrom(msg.sender, feeCollector, upgradeCost);

        // Update tier and optionally extend
        featuredTier[serviceId] = FeaturedTier(newTier);
        if (additionalWeeks > 0) {
            featuredUntil[serviceId] += additionalWeeks * 1 weeks;
        }
        totalSpentOnFeaturing[serviceId] += upgradeCost;
        totalFeaturedRevenue += upgradeCost;

        emit FeaturedUpgraded(
            serviceId,
            currentTier,
            FeaturedTier(newTier),
            featuredUntil[serviceId]
        );
    }

    /**
     * @notice Get all currently featured services
     * @return Array of FeaturedInfo for active featured services
     */
    function getFeaturedServices() external view returns (FeaturedInfo[] memory) {
        // First, count active featured services
        uint256 activeCount = 0;
        for (uint256 i = 0; i < _allFeaturedServices.length; i++) {
            bytes32 serviceId = _allFeaturedServices[i];
            if (featuredUntil[serviceId] > block.timestamp) {
                activeCount++;
            }
        }

        // Build result array
        FeaturedInfo[] memory result = new FeaturedInfo[](activeCount);
        uint256 resultIndex = 0;
        
        for (uint256 i = 0; i < _allFeaturedServices.length; i++) {
            bytes32 serviceId = _allFeaturedServices[i];
            if (featuredUntil[serviceId] > block.timestamp) {
                result[resultIndex] = FeaturedInfo({
                    serviceId: serviceId,
                    tier: featuredTier[serviceId],
                    featuredUntil: featuredUntil[serviceId],
                    owner: serviceOwners[serviceId],
                    totalSpent: totalSpentOnFeaturing[serviceId]
                });
                resultIndex++;
            }
        }

        return result;
    }

    /**
     * @notice Get featured services by tier
     * @param tier Tier to filter by
     * @return Array of service IDs at that tier
     */
    function getFeaturedServicesByTier(
        FeaturedTier tier
    ) external view returns (bytes32[] memory) {
        // Count matching services
        uint256 count = 0;
        for (uint256 i = 0; i < _allFeaturedServices.length; i++) {
            bytes32 serviceId = _allFeaturedServices[i];
            if (
                featuredTier[serviceId] == tier &&
                featuredUntil[serviceId] > block.timestamp
            ) {
                count++;
            }
        }

        // Build result
        bytes32[] memory result = new bytes32[](count);
        uint256 resultIndex = 0;
        
        for (uint256 i = 0; i < _allFeaturedServices.length; i++) {
            bytes32 serviceId = _allFeaturedServices[i];
            if (
                featuredTier[serviceId] == tier &&
                featuredUntil[serviceId] > block.timestamp
            ) {
                result[resultIndex] = serviceId;
                resultIndex++;
            }
        }

        return result;
    }

    /**
     * @notice Check featured status of a service
     * @param serviceId Service to check
     * @return isFeatured Whether the service is currently featured
     * @return tier Current tier (0 if not featured)
     * @return expiresAt When the featuring expires
     * @return daysRemaining Days remaining in featured period
     */
    function checkFeaturedStatus(
        bytes32 serviceId
    ) external view returns (
        bool isFeatured,
        FeaturedTier tier,
        uint256 expiresAt,
        uint256 daysRemaining
    ) {
        expiresAt = featuredUntil[serviceId];
        isFeatured = expiresAt > block.timestamp;
        tier = isFeatured ? featuredTier[serviceId] : FeaturedTier.None;
        
        if (isFeatured) {
            daysRemaining = (expiresAt - block.timestamp) / 1 days;
        }
    }

    /**
     * @notice Get the price for a tier per week
     * @param tier Tier to get price for (1-3)
     * @return Price in payment token units
     */
    function getTierPrice(uint8 tier) external view returns (uint256) {
        require(tier >= 1 && tier <= 3, "Invalid tier");
        return featuredPrices[tier - 1];
    }

    /**
     * @notice Calculate cost for featuring a service
     * @param tier Tier level (1-3)
     * @param weeks Number of weeks
     * @return Total cost in payment token units
     */
    function calculateCost(
        uint8 tier,
        uint8 weeks
    ) external view returns (uint256) {
        require(tier >= 1 && tier <= 3, "Invalid tier");
        require(weeks >= 1 && weeks <= 52, "Invalid duration");
        return featuredPrices[tier - 1] * weeks;
    }

    // ============ Admin Functions ============

    /**
     * @notice Update featured prices (owner only)
     * @param prices New prices [Bronze, Silver, Gold] per week
     */
    function setFeaturedPrices(uint256[3] memory prices) external onlyOwner {
        require(prices[0] > 0 && prices[1] > 0 && prices[2] > 0, "Invalid prices");
        require(prices[0] < prices[1] && prices[1] < prices[2], "Prices must increase");
        
        featuredPrices = prices;
        
        emit FeaturedPricesUpdated(prices[0], prices[1], prices[2]);
    }

    /**
     * @notice Update fee collector address
     * @param newCollector New fee collector address
     */
    function setFeeCollector(address newCollector) external onlyOwner {
        require(newCollector != address(0), "Invalid address");
        feeCollector = newCollector;
    }

    /**
     * @notice Get total count of tracked services (including expired)
     */
    function getTotalTrackedServices() external view returns (uint256) {
        return _allFeaturedServices.length;
    }

    /**
     * @notice Get revenue statistics
     */
    function getRevenueStats() external view returns (
        uint256 totalRevenue,
        uint256 activeFeaturingCount
    ) {
        totalRevenue = totalFeaturedRevenue;
        
        for (uint256 i = 0; i < _allFeaturedServices.length; i++) {
            if (featuredUntil[_allFeaturedServices[i]] > block.timestamp) {
                activeFeaturingCount++;
            }
        }
    }
}

