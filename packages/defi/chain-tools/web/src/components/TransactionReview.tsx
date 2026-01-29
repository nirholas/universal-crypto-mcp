import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  Alert
} from '@mui/material';
import { formatEther } from 'ethers/lib/utils';
import { useWallet } from '../hooks/useWallet';
import { getTransaction, submitTransaction } from '../services/transactionService';
import { getChainById } from '../services/chainService';

// Define transaction status type
type TransactionStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUBMITTED' | 'CONFIRMED' | 'FAILED';

// Transaction details type
type Transaction = {
  id: string;
  chainId: string;
  from?: string;
  to: string;
  value: string;
  data?: string;
  gasLimit?: string;
  status: TransactionStatus;
  txHash?: string;
  createdAt: string;
  updatedAt: string;
};

// Chain information type
type Chain = {
  id: string;
  name: string;
  currency: string;
  rpcUrl: string;
  explorerUrl: string;
};

const TransactionReview: React.FC = () => {
  const { txId } = useParams<{ txId: string }>();
  const navigate = useNavigate();
  const { account, connect, signTransaction, chainId, switchChain } = useWallet();
  
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [chain, setChain] = useState<Chain | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  // Fetch transaction details
  useEffect(() => {
    const fetchTransaction = async () => {
      setLoading(true);
      try {
        if (!txId) {
          throw new Error('Transaction ID is missing');
        }
        
        const tx = await getTransaction(txId);
        setTransaction(tx);
        
        // Fetch chain details
        const chainInfo = await getChainById(tx.chainId);
        setChain(chainInfo);
      } catch (err) {
        setError('Failed to load transaction: ' + (err instanceof Error ? err.message : String(err)));
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransaction();
  }, [txId]);

  // Handle wallet connection
  const handleConnect = async () => {
    try {
      await connect();
    } catch (err) {
      setError('Failed to connect wallet: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  // Handle chain switching
  const handleSwitchChain = async () => {
    if (!chain) return;
    
    try {
      await switchChain(chain.id);
    } catch (err) {
      setError('Failed to switch network: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  // Handle transaction approval
  const handleApprove = async () => {
    if (!transaction || !account || !chain) return;
    
    setSubmitting(true);
    setError(null);
    
    try {
      // Ensure user is connected to correct chain
      if (chainId !== transaction.chainId) {
        await switchChain(transaction.chainId);
      }
      
      // Create transaction object
      const tx = {
        to: transaction.to,
        value: ethers.utils.parseEther(transaction.value),
        data: transaction.data || '0x',
        gasLimit: transaction.gasLimit ? ethers.BigNumber.from(transaction.gasLimit) : undefined,
        chainId: parseInt(transaction.chainId)
      };
      
      // Sign transaction
      const signedTx = await signTransaction(tx);
      
      // Submit signed transaction
      const result = await submitTransaction(transaction.id, signedTx);
      
      setSuccess(true);
      setTimeout(() => {
        navigate(`/tx/${transaction.id}/success`);
      }, 2000);
    } catch (err) {
      setError('Transaction failed: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSubmitting(false);
    }
  };

  // Handle transaction rejection
  const handleReject = async () => {
    // Implement rejection logic here
    navigate('/');
  };

  // Display loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Display error state
  if (error) {
    return (
      <Box p={4}>
        <Alert severity="error">{error}</Alert>
        <Button variant="outlined" color="primary" onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Return to Home
        </Button>
      </Box>
    );
  }

  // Display transaction not found
  if (!transaction || !chain) {
    return (
      <Box p={4}>
        <Alert severity="warning">Transaction not found</Alert>
        <Button variant="outlined" color="primary" onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Return to Home
        </Button>
      </Box>
    );
  }

  // Check if transaction can be approved
  const canApprove = transaction.status === 'PENDING' && account && chainId === transaction.chainId;

  return (
    <Box p={4} maxWidth={800} mx="auto">
      <Card>
        <CardHeader
          title="Transaction Review"
          subheader={`Transaction ID: ${transaction.id}`}
        />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Network: {chain.name}
              </Typography>
              
              {account ? (
                chainId !== transaction.chainId ? (
                  <Alert severity="warning" action={
                    <Button color="inherit" size="small" onClick={handleSwitchChain}>
                      Switch Network
                    </Button>
                  }>
                    Please switch to {chain.name} to approve this transaction
                  </Alert>
                ) : (
                  <Alert severity="success">Connected: {account}</Alert>
                )
              ) : (
                <Alert severity="info" action={
                  <Button color="inherit" size="small" onClick={handleConnect}>
                    Connect
                  </Button>
                }>
                  Please connect your wallet to review and sign this transaction
                </Alert>
              )}
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Transaction Details
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">Status</TableCell>
                      <TableCell>
                        <Typography color={
                          transaction.status === 'CONFIRMED' ? 'success.main' :
                          transaction.status === 'FAILED' ? 'error.main' :
                          transaction.status === 'PENDING' ? 'warning.main' :
                          'text.primary'
                        }>
                          {transaction.status}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell component="th" scope="row">To</TableCell>
                      <TableCell>{transaction.to}</TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell component="th" scope="row">Amount</TableCell>
                      <TableCell>{transaction.value} {chain.currency}</TableCell>
                    </TableRow>
                    
                    {transaction.gasLimit && (
                      <TableRow>
                        <TableCell component="th" scope="row">Gas Limit</TableCell>
                        <TableCell>{transaction.gasLimit}</TableCell>
                      </TableRow>
                    )}
                    
                    {transaction.data && transaction.data !== '0x' && (
                      <TableRow>
                        <TableCell component="th" scope="row">Data</TableCell>
                        <TableCell sx={{ wordBreak: 'break-all' }}>{transaction.data}</TableCell>
                      </TableRow>
                    )}
                    
                    {transaction.txHash && (
                      <TableRow>
                        <TableCell component="th" scope="row">Transaction Hash</TableCell>
                        <TableCell>
                          <Link 
                            href={`${chain.explorerUrl}/tx/${transaction.txHash}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            {transaction.txHash}
                          </Link>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            {transaction.status === 'PENDING' && (
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Box display="flex" justifyContent="space-between">
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleReject}
                    disabled={submitting}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleApprove}
                    disabled={!canApprove || submitting}
                  >
                    {submitting ? <CircularProgress size={24} /> : 'Approve & Sign'}
                  </Button>
                </Box>
              </Grid>
            )}
            
            {success && (
              <Grid item xs={12}>
                <Alert severity="success">
                  Transaction successfully submitted! Redirecting...
                </Alert>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TransactionReview;
