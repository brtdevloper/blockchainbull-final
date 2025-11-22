import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  CircularProgress,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarsIcon from '@mui/icons-material/Stars';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import { formatCurrency, formatDate } from '../utils/utils';

// Utility function to format ROI
const formatROI = (roiPercent) => {
  if (typeof roiPercent !== 'number') return 'N/A';
  return `${(roiPercent / 100)}%`;
};

const cardSx = {
  p: 2,
  boxShadow: 2,
  height: '100%',
  backgroundColor: '#051f1e',
  color: '#ffffff',
  border: '1px solid rgba(184, 146, 80, 0.3)',
  width: '100%',
  mx: 0, // no side margin
  minWidth: { xs: '100%', sm: 'auto' }, // Full width on mobile
};


const PerformanceOverview = ({ mlmData = {}, stakes = [], notRegistered, handleWithdrawStake, isLoading }) => {
  const [loadingStakes, setLoadingStakes] = useState({}); // Track loading state per stake index
  const [error, setError] = useState(null); // Track errors for user feedback
  console.log("mlm", mlmData);

  const handleClaimClick = async (stakeIndex) => {
    setLoadingStakes((prev) => ({ ...prev, [stakeIndex]: true }));
    setError(null); // Clear previous errors
    try {
      await handleWithdrawStake(stakeIndex);
    } catch (error) {
      console.error('Claim error:', error);
      setError('Failed to claim rewards. Please try again.');
    } finally {
      setLoadingStakes((prev) => ({ ...prev, [stakeIndex]: false }));
    }
  };

  // Split useMemo for better readability and performance
  const financialMetrics = useMemo(() => {
    const totalClaimed = stakes.reduce((sum, stake) => sum + (stake.rewardClaimed || 0), 0);
    const totalClaimable = stakes.reduce((sum, stake) => sum + (stake.claimable || 0), 0);
    const totalWithdrawn = mlmData.totalWithdrawn || 0;
    const totalRewards =  totalClaimed + totalClaimable;
    const earningLimit = (mlmData.totalInvestment || 0) * 2.0075;
    const used =  totalClaimed + totalClaimable;
    const remaining = Math.max(0, earningLimit - used);
    const percentage = earningLimit > 0 ? Math.min(100, (used / earningLimit) * 100) : 0;

    return { totalClaimed, totalClaimable, totalRewards, earningLimit, used, remaining, percentage };
  }, [stakes, mlmData.totalInvestment, mlmData.totalWithdrawn]);

  if (isLoading) {
    return (
      <Card sx={{
        p: { xs: 2, sm: 3 },
        boxShadow: 3,
        textAlign: 'center',
        backgroundColor: '#051f1e',
        color: '#ffffff',
        width: '100%', // Important: Full width for loading state on mobile
        mx: 'auto' // Centers if needed, but ensures full width
      }}>
        <CircularProgress sx={{ color: '#b89250' }} />
        <Typography variant="body1" sx={{ mt: 2, color: '#ffffff', fontSize: { xs: '1.1rem', sm: '1.2rem' } }}>
          Loading performance data...
        </Typography>
      </Card>
    );
  }

  return (
    <Card sx={{
      p: { xs: 2, sm: 3 },
      boxShadow: 3,
      backgroundColor: '#051f1e',
      color: '#ffffff',
      width: '100%', // Important: Full width for main container on mobile
      mx: 'auto' // Safe centering
    }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ color: '#b89250', fontWeight: 'bold', mb: { xs: 2, sm: 3 }, fontSize: { xs: '1.75rem', sm: '2rem' } }}
      >
        Performance Overview
      </Typography>

      {error && (
        <Typography variant="body2" sx={{ mb: 2, color: '#ff6b6b', fontSize: { xs: '1rem', sm: '1.1rem' } }}>
          {error}
        </Typography>
      )}

      <Typography
        variant="h6"
        gutterBottom
        sx={{ color: '#b89250', mb: { xs: 2, sm: 3 }, fontSize: { xs: '1.4rem', sm: '1.6rem' } }}
      >
        Financial Overview
      </Typography>
      <Grid
        container
        spacing={{ xs: 2, sm: 2 }}
        sx={{
          width: '100%',
          mx: 0,
          px: { xs: 0, sm: 0 }, // No padding on mobile
        }}
      >

        <Grid item xs={12} sm={6} md={4} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Card sx={cardSx}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <AccountBalanceWalletIcon sx={{ color: '#b89250', mr: 1, fontSize: { xs: '2rem', sm: '2.2rem' } }} />
                <Typography variant="h6" sx={{ fontSize: { xs: '1.2rem', sm: '1.3rem' }, color: '#b89250', fontWeight: 'bold' }}>
                  Total Investment
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#b89250', fontSize: { xs: '1.6rem', sm: '1.8rem' } }}>
                {formatCurrency(mlmData.totalInvestment || 0)}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: { xs: '1rem', sm: '1.1rem' }, color: '#ffffff' }}>
                USDT
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* <Grid item xs={12} sm={6} md={4} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Card sx={cardSx}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <MonetizationOnIcon sx={{ color: '#b89250', mr: 1, fontSize: { xs: '2rem', sm: '2.2rem' } }} />
                <Typography variant="h6" sx={{ fontSize: { xs: '1.2rem', sm: '1.3rem' }, color: '#b89250', fontWeight: 'bold' }}>
                  Referral Bonus
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#b89250', fontSize: { xs: '1.6rem', sm: '1.8rem' } }}>
                {formatCurrency(mlmData.referrerBonus || 0)}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: { xs: '1rem', sm: '1.1rem' }, color: '#ffffff' }}>
                USDT
              </Typography>
            </CardContent>
          </Card>
        </Grid> */}
        <Grid item xs={12} sm={6} md={4} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Card sx={cardSx}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <PeopleIcon sx={{ color: '#b89250', mr: 1, fontSize: { xs: '2rem', sm: '2.2rem' } }} />
                <Typography variant="h6" sx={{ fontSize: { xs: '1.2rem', sm: '1.3rem' }, color: '#b89250', fontWeight: 'bold' }}>
                  Active Packages
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#b89250', fontSize: { xs: '1.6rem', sm: '1.8rem' } }}>
                {mlmData.stakeCount || 0}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: { xs: '1rem', sm: '1.1rem' }, color: '#ffffff' }}>
                Investments
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Card sx={cardSx}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <TrendingUpIcon sx={{ color: '#b89250', mr: 1, fontSize: { xs: '2rem', sm: '2.2rem' } }} />
                <Typography variant="h6" sx={{ fontSize: { xs: '1.2rem', sm: '1.3rem' }, color: '#b89250', fontWeight: 'bold' }}>
                  Total Claimed
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#b89250', fontSize: { xs: '1.6rem', sm: '1.8rem' } }}>
                {formatCurrency(financialMetrics.totalClaimed)}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: { xs: '1rem', sm: '1.1rem' }, color: '#ffffff' }}>
                USDT
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Card sx={cardSx}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <AccessTimeIcon sx={{ color: '#b89250', mr: 1, fontSize: { xs: '2rem', sm: '2.2rem' } }} />
                <Typography variant="h6" sx={{ fontSize: { xs: '1.2rem', sm: '1.3rem' }, color: '#b89250', fontWeight: 'bold' }}>
                  Total Claimable
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#b89250', fontSize: { xs: '1.6rem', sm: '1.8rem' } }}>
                {formatCurrency(financialMetrics.totalClaimable)}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: { xs: '1rem', sm: '1.1rem' }, color: '#ffffff' }}>
                USDT
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Card sx={cardSx}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <StarsIcon sx={{ color: '#b89250', mr: 1, fontSize: { xs: '2rem', sm: '2.2rem' } }} />
                <Typography variant="h6" sx={{ fontSize: { xs: '1.2rem', sm: '1.3rem' }, color: '#b89250', fontWeight: 'bold' }}>
                  Total Rewards
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#b89250', fontSize: { xs: '1.6rem', sm: '1.8rem' } }}>
                {formatCurrency(financialMetrics.totalRewards)}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: { xs: '1rem', sm: '1.1rem' }, color: '#ffffff' }}>
                USDT
              </Typography>
            </CardContent>
          </Card>
        </Grid>



        <Grid item xs={12} sm={6} md={4} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Card sx={cardSx}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <BusinessCenterIcon sx={{ color: '#b89250', mr: 1, fontSize: { xs: '2rem', sm: '2.2rem' } }} />
                <Typography variant="h6" sx={{ fontSize: { xs: '1.2rem', sm: '1.3rem' }, color: '#b89250', fontWeight: 'bold' }}>
                  Direct Business
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#b89250', fontSize: { xs: '1.6rem', sm: '1.8rem' } }}>
                {formatCurrency(mlmData.directBusiness || 0)}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: { xs: '1rem', sm: '1.1rem' }, color: '#ffffff' }}>
                USDT
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Card sx={cardSx}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <AccountBalanceWalletIcon sx={{ color: '#b89250', mr: 1, fontSize: { xs: '2rem', sm: '2.2rem' } }} />
                <Typography variant="h6" sx={{ fontSize: { xs: '1.2rem', sm: '1.3rem' }, color: '#b89250', fontWeight: 'bold' }}>
                  Referrer
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#b89250', fontSize: { xs: '1.6rem', sm: '1.8rem' } }}>
                {mlmData.referrer && mlmData.referrer !== '0x0000000000000000000000000000000000000000' ? `${mlmData.referrer.slice(0, 6)}...${mlmData.referrer.slice(-4)}` : 'None'}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: { xs: '1rem', sm: '1.1rem' }, color: '#ffffff' }}>
                Address
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Card sx={cardSx}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <CheckCircleIcon sx={{ color: '#b89250', mr: 1, fontSize: { xs: '2rem', sm: '2.2rem' } }} />
                <Typography variant="h6" sx={{ fontSize: { xs: '1.2rem', sm: '1.3rem' }, color: '#b89250', fontWeight: 'bold' }}>
                  Contract Status
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#b89250', fontSize: { xs: '1.6rem', sm: '1.8rem' } }}>
                Active
              </Typography>
              <Typography variant="body2" sx={{ fontSize: { xs: '1rem', sm: '1.1rem' }, color: '#ffffff' }}>
                Operational
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {!notRegistered && (
        <>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: '#b89250', mb: { xs: 2, sm: 3 }, fontSize: { xs: '1.4rem', sm: '1.6rem' } }}
          >
            Your Active Stakes
          </Typography>
          {stakes.length === 0 ? (
            <Typography variant="body2" sx={{ color: '#ffffff', fontSize: { xs: '1.1rem', sm: '1.2rem' } }}>
              No active stakes available.
            </Typography>
          ) : (
            <TableContainer
              component={Paper}
              sx={{
                mb: { xs: 2, sm: 3 },
                backgroundColor: '#051f1e',
                overflowX: 'auto', // Important: Horizontal scroll for table on mobile if needed
                width: '100%' // Full width for table container
              }}
            >
              <Table size="small" aria-label="Active stakes table">
                <TableHead sx={{ backgroundColor: '#0a3c2e' }}>
                  <TableRow>
                    <TableCell scope="col" sx={{ color: '#b89250', fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.1rem' } }}>Package</TableCell>
                    <TableCell scope="col" sx={{ color: '#b89250', fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.1rem' } }}>Price (USDT)</TableCell>
                    <TableCell scope="col" sx={{ color: '#b89250', fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.1rem' } }}>ROI %</TableCell>
                    <TableCell scope="col" sx={{ color: '#b89250', fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.1rem' } }}>Last Claim</TableCell>
                    <TableCell scope="col" sx={{ color: '#b89250', fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.1rem' } }}>Rewards Claimed</TableCell>
                    <TableCell scope="col" sx={{ color: '#b89250', fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.1rem' } }}>Claimable</TableCell>
                    <TableCell scope="col" sx={{ color: '#b89250', fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.1rem' } }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stakes.map((stake) => (
                    <TableRow key={stake.index}>
                      <TableCell sx={{ color: '#ffffff', fontSize: { xs: '0.95rem', sm: '1rem' } }}>{stake.packageName || 'Unknown'}</TableCell>
                      <TableCell sx={{ color: '#ffffff', fontSize: { xs: '0.95rem', sm: '1rem' } }}>{formatCurrency(stake.packagePrice || 0)}</TableCell>
                      <TableCell sx={{ color: '#ffffff', fontSize: { xs: '0.95rem', sm: '1rem' } }}>{formatROI(stake.roiPercent)}</TableCell>
                      <TableCell sx={{ color: '#ffffff', fontSize: { xs: '0.95rem', sm: '1rem' } }}>{formatDate(stake.lastClaimTime)}</TableCell>
                      <TableCell sx={{ color: '#ffffff', fontSize: { xs: '0.95rem', sm: '1rem' } }}>{formatCurrency(stake.rewardClaimed || 0)}</TableCell>
                      <TableCell sx={{ color: '#ffffff', fontSize: { xs: '0.95rem', sm: '1rem' } }}>{formatCurrency(stake.claimable || 0)}</TableCell>
                      <TableCell>
                        <Tooltip
                          title={
                            stake.claimable <= 0
                              ? 'No rewards available to claim'
                              : loadingStakes[stake.index]
                                ? 'Processing claim...'
                                : 'Claim available rewards'
                          }
                          aria-describedby={`claim-tooltip-${stake.index}`}
                        >
                          <span>
<Button
  variant="contained"
  size="small"
  disableElevation
  onClick={() => handleClaimClick(stake.index)}
  disabled={loadingStakes[stake.index] || stake.claimable <= 0}
  startIcon={loadingStakes[stake.index] ? <CircularProgress size={16} sx={{ color: 'white !important' }} /> : null}
  sx={{
    backgroundColor: stake.claimable <= 0 ? 'grey.500' : '#b89250',
    color: '#ffffff !important',
    fontWeight: 600,
    border: '2px solid #b89250',
    boxShadow: '0 4px 8px rgba(184, 146, 80, 0.3)',
    fontSize: { xs: '1rem', sm: '1.1rem' },
    '&:hover': {
      backgroundColor: stake.claimable <= 0 ? 'grey.600' : '#a07a40',
      borderColor: stake.claimable <= 0 ? 'grey.600' : '#a07a40',
      color: '#ffffff !important',
      boxShadow:
        stake.claimable <= 0
          ? 'none'
          : '0 6px 12px rgba(184, 146, 80, 0.4)',
    },
  }}
>
  {loadingStakes[stake.index]
    ? 'Claiming...'
    : stake.claimable <= 0
    ? 'No Claim'
    : 'Claim'}
</Button>


                          </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Card sx={{
            p: 2,
            boxShadow: 2,
            mt: 3,
            backgroundColor: '#051f1e',
            color: '#ffffff',
            border: '1px solid rgba(184, 146, 80, 0.3)',
            width: '100%' // Full width for earning limit card
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <MonetizationOnIcon sx={{ color: '#b89250', mr: 1, fontSize: { xs: '2rem', sm: '2.2rem' } }} />
                <Typography variant="h6" sx={{ fontSize: { xs: '1.2rem', sm: '1.3rem' }, color: '#b89250', fontWeight: 'bold' }}>
                  Earning Limit
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#b89250', mb: 2, fontSize: { xs: '1.5rem', sm: '1.7rem' } }}>
                {formatCurrency(financialMetrics.earningLimit)}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={financialMetrics.percentage}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: '#0a3c2e',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#b89250',
                    },
                    width: '100%' // Full width for progress bar
                  }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, textAlign: 'right', fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                  {financialMetrics.percentage.toFixed(2)}% Used
                </Typography>
              </Box>
              <Grid container spacing={1} sx={{ width: '100%' }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="warning.main" sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                    Used: {formatCurrency(financialMetrics.used)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="success.main" sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                    Remaining: {formatCurrency(financialMetrics.remaining)}
                  </Typography>
                </Grid>
              </Grid>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '1rem', sm: '1.1rem' }, mt: 1 }}>
                USDT
              </Typography>
            </CardContent>
          </Card>
        </>
      )}
    </Card>
  );
};

export default PerformanceOverview;