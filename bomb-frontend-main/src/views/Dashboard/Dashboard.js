import React, { useMemo, useState } from 'react';
import Page from '../../components/Page';
import { Helmet } from 'react-helmet';
import { makeStyles } from '@material-ui/core/styles';
import { styled } from '@material-ui/core/styles';
import { Box, Card, CardContent, Button, Typography, Grid, Paper } from '@material-ui/core';
import ProgressCountdown from '../Boardroom/components/ProgressCountdown';
import useCurrentEpoch from '../../hooks/useCurrentEpoch';
import useTreasuryAllocationTimes from '../../hooks/useTreasuryAllocationTimes';
import moment from 'moment';
import TokenSymbol from '../../components/TokenSymbol';
import useBombFinance from '../../hooks/useBombFinance';
import MetamaskFox from '../../assets/img/metamask-fox.svg';
import { roundAndFormatNumber } from '../../0x';
import useBombStats from '../../hooks/useBombStats';
import usebShareStats from '../../hooks/usebShareStats';
import useBondStats from '../../hooks/useBondStats';
import { Bomb as bombTesting } from '../../bomb-finance/deployments/deployments.testing.json';
import { Bomb as bombProd } from '../../bomb-finance/deployments/deployments.mainnet.json';
import CountUp from 'react-countup';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
import { ReactComponent as IconDiscord } from '../../assets/img/discord.svg';
import { getDisplayBalance } from '../../utils/formatBalance';
import useTotalStakedOnBoardroom from '../../hooks/useTotalStakedOnBoardroom';
import BShareimg from '../../assets/img/bshare-256.png';
import bsharebnbimg from '../../assets/img/bshare-bnb-LP.png';
import Bombimg from '../../assets/img/bomb1.png';
import BBondimg from '../../assets/img/bbond.png';
import bomb_bitcoin from '../../assets/img/bomb-bitcoin-LP.png';
import useCashPriceInEstimatedTWAP from '../../hooks/useCashPriceInEstimatedTWAP';
import useCashPriceInLastTWAP from '../../hooks/useCashPriceInLastTWAP';
import Label from '../../components/Label';
import Value from '../../components/Value';
import useEarningsOnBoardroom from '../../hooks/useEarningsOnBoardroom';
import useStakedBalanceOnBoardroom from '../../hooks/useStakedBalanceOnBoardroom';
import useStakedTokenPriceInDollars from '../../hooks/useStakedTokenPriceInDollars';
import bondimg from '../../assets/img/xbomb.png';
import useTokenBalance from '../../hooks/useTokenBalance';
const TITLE = 'bomb.money | Dashboard';
const useStyles = makeStyles((theme) => ({
  gridItem: {
    height: '100%',
    [theme.breakpoints.up('md')]: {
      height: '90px',
    },
  },
}));
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#23284B',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Dashboard = () => {
  const classes = useStyles();
  const currentEpoch = useCurrentEpoch();
  const TVL = useTotalValueLocked();
  const { to } = useTreasuryAllocationTimes();
  const bombFinance = useBombFinance();
  const bombStats = useBombStats();
  const bShareStats = usebShareStats();
  const tBondStats = useBondStats();
  const bondStat = useBondStats();
  const totalStaked = useTotalStakedOnBoardroom();
  const cashStat = useCashPriceInEstimatedTWAP();
  const earnings = useEarningsOnBoardroom();
  const stakedTokenPriceInDollars = useStakedTokenPriceInDollars('BSHARE', bombFinance.BSHARE);
  const tokenPriceInDollars = useMemo(
    () => (bombStats ? Number(bombStats.priceInDollars).toFixed(2) : null),
    [bombStats],
  );
  // const tokenPriceInDollars = useMemo(
  //   () =>
  //     stakedTokenPriceInDollars
  //       ? (Number(stakedTokenPriceInDollars) * Number(getDisplayBalance(stakedBalance))).toFixed(2).toString()
  //       : null,
  //   [stakedTokenPriceInDollars, stakedBalance],
  // );

  const earnedInDollars = (Number(tokenPriceInDollars) * Number(getDisplayBalance(earnings))).toFixed(2);

  const scalingFactor = useMemo(() => (cashStat ? Number(cashStat.priceInDollars).toFixed(4) : null), [cashStat]);
  const stakedBalance = useStakedBalanceOnBoardroom();
  const bondBalance = useTokenBalance(bombFinance?.BBOND);

  let bomb;
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    bomb = bombTesting;
  } else {
    bomb = bombProd;
  }
  const buyBombAddress =
    //  'https://pancakeswap.finance/swap?inputCurrency=0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c&outputCurrency=' +
    'https://app.bogged.finance/bsc/swap?tokenIn=0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c&tokenOut=' + bomb.address;
  //https://pancakeswap.finance/swap?outputCurrency=0x531780FAcE85306877D7e1F05d713D1B50a37F7A';
  const buyBShareAddress =
    'https://app.bogged.finance/bsc/swap?tokenIn=BNB&tokenOut=0x531780FAcE85306877D7e1F05d713D1B50a37F7A';
  const bombPriceInBNB = useMemo(() => (bombStats ? Number(bombStats.tokenInFtm).toFixed(4) : null), [bombStats]);
  const bombPriceInDollars = useMemo(
    () => (bombStats ? Number(bombStats.priceInDollars).toFixed(2) : null),
    [bombStats],
  );
  const bombCirculatingSupply = useMemo(() => (bombStats ? String(bombStats.circulatingSupply) : null), [bombStats]);
  const bombTotalSupply = useMemo(() => (bombStats ? String(bombStats.totalSupply) : null), [bombStats]);
  const bSharePriceInDollars = useMemo(
    () => (bShareStats ? Number(bShareStats.priceInDollars).toFixed(2) : null),
    [bShareStats],
  );
  const bSharePriceInBNB = useMemo(
    () => (bShareStats ? Number(bShareStats.tokenInFtm).toFixed(4) : null),
    [bShareStats],
  );
  const bShareCirculatingSupply = useMemo(
    () => (bShareStats ? String(bShareStats.circulatingSupply) : null),
    [bShareStats],
  );
  const bShareTotalSupply = useMemo(() => (bShareStats ? String(bShareStats.totalSupply) : null), [bShareStats]);

  const tBondPriceInDollars = useMemo(
    () => (tBondStats ? Number(tBondStats.priceInDollars).toFixed(2) : null),
    [tBondStats],
  );
  const tBondPriceInBNB = useMemo(() => (tBondStats ? Number(tBondStats.tokenInFtm).toFixed(4) : null), [tBondStats]);
  const tBondCirculatingSupply = useMemo(
    () => (tBondStats ? String(tBondStats.circulatingSupply) : null),
    [tBondStats],
  );
  const tBondTotalSupply = useMemo(() => (tBondStats ? String(tBondStats.totalSupply) : null), [tBondStats]);
  const cashPrice = useCashPriceInLastTWAP();
  const bondScale = (Number(cashPrice) / 100000000000000).toFixed(4);

  return (
    <Page>
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      <Typography color="textPrimary" align="center" variant="h4" gutterBottom>
        Bomb Finance Summary
      </Typography>
      <hr />
      <div style={{ display: 'flex', backgroundColor: '#23284B' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={0}>
            <Grid item xs={6}>
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={0}>
                  <Grid item xs={1}>
                    <Item></Item>
                  </Grid>
                  <Grid item xs={2}>
                    <Item style={{ color: '#FFFFFF' }}></Item>
                  </Grid>
                  <Grid item xs={2}>
                    <Item style={{ color: '#FFFFFF' }}>Current Supply</Item>
                  </Grid>
                  <Grid item xs={2}>
                    <Item style={{ color: '#FFFFFF' }}>Total Supply</Item>
                  </Grid>
                  <Grid item xs={2}>
                    <Item style={{ color: '#FFFFFF' }}>Price</Item>
                  </Grid>
                  <Grid item xs={2}>
                    <Item></Item>
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={0}>
                  <Grid item xs={1}>
                    <Item>
                      <img style={{ width: '20px' }} src={Bombimg} />
                      {/* <p style={{ color: '#FFFFFF' }}></p> */}
                    </Item>
                  </Grid>
                  <Grid item xs={2}>
                    <Item style={{ color: '#FFFFFF' }}>$BBOMB</Item>
                  </Grid>
                  <Grid item xs={2}>
                    <Item style={{ color: '#FFFFFF' }}>{roundAndFormatNumber(bombCirculatingSupply, 2)}</Item>
                  </Grid>
                  <Grid item xs={2}>
                    <Item style={{ color: '#FFFFFF' }}>{roundAndFormatNumber(bombTotalSupply, 2)}</Item>
                  </Grid>
                  <Grid item xs={2}>
                    <Item style={{ color: '#FFFFFF' }}>
                      ${bombPriceInDollars ? roundAndFormatNumber(bombPriceInDollars, 2) : '-.--'}
                      <br />
                      {bombPriceInBNB ? bombPriceInBNB : '-.----'} BTC
                    </Item>
                  </Grid>
                  <Grid item xs={2}>
                    <Item>
                      <Button
                        onClick={() => {
                          bombFinance.watchAssetInMetamask('BOMB');
                        }}
                        // style={{ position: 'absolute', top: '10px', right: '10px', border: '1px grey solid' }}
                      >
                        {' '}
                        &nbsp;&nbsp;
                        <img alt="metamask fox" style={{ width: '20px' }} src={MetamaskFox} />
                      </Button>
                    </Item>
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={0}>
                  <Grid Item xs={1}>
                    <Item>
                      {' '}
                      <img style={{ width: '20px' }} src={BShareimg} />
                      {/* <p style={{ color: '#FFFFFF' }}>$BSHARE</p> */}
                    </Item>
                  </Grid>
                  <Grid item xs={2}>
                    <Item style={{ color: '#FFFFFF' }}>$BSHARE</Item>
                  </Grid>
                  <Grid item xs={2}>
                    <Item style={{ color: '#FFFFFF' }}>{roundAndFormatNumber(bShareCirculatingSupply, 2)}</Item>
                  </Grid>
                  <Grid Item xs={2}>
                    <Item style={{ color: '#FFFFFF' }}>{roundAndFormatNumber(bShareTotalSupply, 2)}</Item>
                  </Grid>
                  <Grid Item xs={2}>
                    <Item style={{ color: '#FFFFFF' }}>
                      ${bSharePriceInDollars ? bSharePriceInDollars : '-.--'}
                      <br />
                      {bSharePriceInBNB ? bSharePriceInBNB : '-.----'} BNB
                    </Item>
                  </Grid>
                  <Grid item xs={2}>
                    <Item>
                      <Button
                        onClick={() => {
                          bombFinance.watchAssetInMetamask('BSHARE');
                        }}
                        // style={{ position: 'absolute', top: '10px', right: '10px', border: '1px grey solid' }}
                      >
                        {' '}
                        &nbsp;&nbsp;
                        <img alt="metamask fox" style={{ width: '20px' }} src={MetamaskFox} />
                      </Button>
                    </Item>
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ flexGrow1: 1 }}>
                <Grid container spacing={0}>
                  <Grid Item xs={1}>
                    <Item>
                      {' '}
                      <img style={{ width: '20px' }} src={BBondimg} />
                      {/* <p style={{ color: '#FFFFFF' }}>$BBOND</p> */}
                    </Item>
                  </Grid>
                  <Grid item xs={2}>
                    <Item style={{ color: '#FFFFFF' }}>$BBOND</Item>
                  </Grid>
                  <Grid Item xs={2}>
                    <Item style={{ color: '#FFFFFF' }}>{roundAndFormatNumber(tBondCirculatingSupply, 2)}</Item>
                  </Grid>
                  <Grid Item xs={2}>
                    <Item style={{ color: '#FFFFFF' }}>{roundAndFormatNumber(tBondTotalSupply, 2)}</Item>
                  </Grid>
                  <Grid Item xs={2}>
                    <Item style={{ color: '#FFFFFF' }}>
                      ${tBondPriceInDollars ? tBondPriceInDollars : '-.--'}
                      <br />
                      {tBondPriceInBNB ? tBondPriceInBNB : '-.----'} BTC
                    </Item>
                  </Grid>
                  <Grid Item xs={2}>
                    <Item>
                      <Button
                        onClick={() => {
                          bombFinance.watchAssetInMetamask('BBOND');
                        }}
                        // style={{ position: 'absolute', top: '10px', right: '10px', border: '1px grey solid' }}
                      >
                        {' '}
                        &nbsp;&nbsp;
                        <img alt="metamask fox" style={{ width: '20px' }} src={MetamaskFox} />
                      </Button>
                    </Item>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            {/* Trial */}
            <Grid item xs={6}>
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Item>
                      <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Item style={{ color: '#FFFFFF' }}>
                              <span style={{ color: '#FFFFFF', fontSize: '25px' }}>
                                <Typography style={{ fontSize: '15px', textTransform: 'uppercase', color: '##FFFFFF' }}>
                                  {' '}
                                  Current Epoch{' '}
                                </Typography>
                                <Typography style={{ fontSize: '25px' }}>{Number(currentEpoch)}</Typography>
                                <ProgressCountdown
                                  base={moment().toDate()}
                                  hideBar={true}
                                  deadline={to}
                                  description="Next Epoch"
                                />
                              </span>
                              <Typography style={{ fontSize: '15px', textTransform: 'uppercase', color: '##FFFFFF' }}>
                                {' '}
                                Next Epoch in{' '}
                              </Typography>
                              <Typography>Live TWAP: {scalingFactor} </Typography>
                              TVL: <CountUp style={{ fontSize: '25px' }} end={TVL} separator="," prefix="$" />
                              <Typography>Last Epoch TWAP: {bondScale || '-'} </Typography>
                            </Item>
                          </Grid>
                        </Grid>
                      </Box>
                    </Item>
                  </Grid>
                  <Grid item xs={6}>
                    {/* graphs remaining  */}
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </div>
      <hr />

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Item style={{ textAlign: 'right', color: '#B0E0E6' }}>
              <a>Read Investment Strategy</a>
            </Item>
            <Item>Invest Now</Item>
          </Grid>
          <Grid item xs={4}>
            <Item style={{ textAlign: 'left' }}>Latest News</Item>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Item>
              <a
                href="http://discord.bomb.money/"
                rel="noopener noreferrer"
                target="_blank"
                className={classes.link}
                style={{ textDecoration: 'none', Color: '#FFFFFF' }}
              >
                <IconDiscord style={{ fill: '#dddfee', height: '20px' }} /> Chat on Discord
              </a>
            </Item>
          </Grid>
          <Grid item xs={4}>
            <Item>
              {' '}
              <a href="https://docs.bomb.money/welcome-start-here/readme">Read Docs</a>
            </Item>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={1}>
          <Grid item xs={8}>
            <Item>
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={0}>
                  <Grid item xs={1}>
                    <Item>
                      <img style={{ width: '20px' }} src={BShareimg} />
                    </Item>
                  </Grid>
                  <Grid item xs={2}>
                    <Item>BoardRoom</Item>
                  </Grid>
                  <Grid item xs={2}>
                    <Item style={{ backgroundColor: '#00E8A2' }}>Recommended</Item>
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={0}>
                  <Grid item xs={1}></Grid>
                  <Grid item xs={10}>
                    <Item style={{ textAlign: 'left' }}>Stake BSHARE and earn BOMB every epoch</Item>
                  </Grid>
                  <Grid item xs={12}>
                    <Item style={{ textAlign: 'right' }}>
                      TVL: <CountUp style={{ fontSize: '20px' }} end={TVL} separator="," prefix="$" />
                    </Item>
                  </Grid>
                </Grid>
              </Box>
              <hr />
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Item style={{ textAlign: 'right' }}>
                    <Typography>
                      Total Stacked: <img style={{ width: '20px' }} src={BShareimg} /> {getDisplayBalance(totalStaked)}
                    </Typography>
                  </Item>
                </Grid>
              </Grid>
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={2}>
                    <Item>Daily Returns</Item>
                    <Item></Item>
                  </Grid>
                  <Grid item xs={2}>
                    <Item>Your Stake:</Item>
                    <Item> {getDisplayBalance(stakedBalance)}</Item>
                    <Item>{`≈ $${tokenPriceInDollars}`}</Item>
                  </Grid>
                  <Grid item xs={2}>
                    <Item>Earned:</Item>
                    <Item> {getDisplayBalance(earnings)} </Item>
                    <Item>{`≈ $${earnedInDollars}`} </Item>
                  </Grid>
                  {/* <Grid item xs={4}>
                    <Item styel = {{}} >Deposit</Item>
                    <Item> {getDisplayBalance(earnings)} </Item>
                      <Item>{`≈ $${earnedInDollars}`}  </Item>
                  </Grid> */}
                </Grid>
              </Box>
            </Item>
          </Grid>
        </Grid>
      </Box>
      {/*Bomb_BTCB and Bshare-BNB */}
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Item>
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={0}>
                  <Grid item xs={12}>
                    <Item style={{ textAlign: 'left' }}>Bomb Farms</Item>
                    <Item style={{ textAlign: 'left' }}>
                      Stake your LP tokens in our farms to start earning $ BSHARE
                    </Item>
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={0}>
                  <Grid item xs={1}>
                    <Item>
                      <img style={{ width: '20px' }} src={bomb_bitcoin} />
                    </Item>
                  </Grid>
                  <Grid item xs={2}>
                    <Item>BOMB-BTCB</Item>
                  </Grid>
                  <Grid item xs={2}>
                    <Item style={{ backgroundColor: '#00E8A2' }}>Recommended</Item>
                  </Grid>
                  <Grid item xs={7}>
                    <Item style={{ textAlign: 'right' }}>
                      TVL: <CountUp style={{ fontSize: '20px' }} end={TVL} separator="," prefix="$" />
                    </Item>
                  </Grid>
                </Grid>
              </Box>
              <hr />

              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={2}>
                    <Item>Daily Returns</Item>
                    <Item></Item>
                  </Grid>
                  <Grid item xs={2}>
                    <Item>Your Stake:</Item>
                    {/* <Item> {getDisplayBalance(stakedBalance)}</Item> 
                   <Item>{`≈ $${tokenPriceInDollars}`}</Item>  */}
                  </Grid>
                  <Grid item xs={2}>
                    <Item>Earned:</Item>
                    {/* <Item> {getDisplayBalance(earnings)} </Item>
                      <Item>{`≈ $${earnedInDollars}`}  </Item> */}
                  </Grid>
                  {/* <Grid item xs={4}>
                    <Item styel = {{}} >Deposit</Item>
                    <Item> {getDisplayBalance(earnings)} </Item>
                      <Item>{`≈ $${earnedInDollars}`}  </Item>
                  </Grid> */}
                </Grid>
              </Box>
              <hr />
            </Item>

            <Item>
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={0}>
                  <Grid item xs={1}>
                    <Item>
                      <img style={{ width: '20px' }} src={bsharebnbimg} />
                    </Item>
                  </Grid>
                  <Grid item xs={2}>
                    <Item>BSHARE-BNB</Item>
                  </Grid>
                  <Grid item xs={2}>
                    <Item style={{ backgroundColor: '#00E8A2' }}>Recommended</Item>
                  </Grid>
                  <Grid item xs={7}>
                    <Item style={{ textAlign: 'right' }}>
                      TVL: <CountUp style={{ fontSize: '20px' }} end={TVL} separator="," prefix="$" />
                    </Item>
                  </Grid>
                </Grid>
              </Box>

              <hr />

              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={2}>
                    <Item>Daily Returns</Item>
                    <Item></Item>
                  </Grid>
                  <Grid item xs={2}>
                    <Item>Your Stake:</Item>
                    {/* <Item> {getDisplayBalance(stakedBalance)}</Item> 
                   <Item>{`≈ $${tokenPriceInDollars}`}</Item>  */}
                  </Grid>
                  <Grid item xs={2}>
                    <Item>Earned:</Item>
                    {/* <Item> {getDisplayBalance(earnings)} </Item>
                      <Item>{`≈ $${earnedInDollars}`}  </Item> */}
                  </Grid>
                  {/* <Grid item xs={4}>
                    <Item styel = {{}} >Deposit</Item>
                    <Item> {getDisplayBalance(earnings)} </Item>
                      <Item>{`≈ $${earnedInDollars}`}  </Item>
                  </Grid> */}
                </Grid>
              </Box>
            </Item>
          </Grid>
        </Grid>
      </Box>

      {/* Bonds Page */}
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Item>
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={1}>
                  <Grid item xs={1}>
                    <img style={{ width: '20px' }} src={bondimg} />
                  </Grid>
                  <Grid item xs={11}>
                    <Item style={{ textAlign: 'left' }}>Bonds</Item>
                    <Item style={{ textAlign: 'left' }}>
                      BBOND can be purchased only on contraction periods, when TWAP of BOMB is below 1.
                    </Item>
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <Item>Current Price: (Bomb)^2</Item>
                    <Item>10000 BBOND ={Number(bondStat?.tokenInFtm).toFixed(4) || '-'}BTCB</Item>
                  </Grid>
                  <Grid item xs={4}>
                    <Item>Available to redeem</Item>
                    <Item>
                      <img style={{ width: '20px' }} src={bondimg}></img>
                      {`${getDisplayBalance(bondBalance)}`}
                    </Item>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Grid container spacing={0}>
                        <Grid item xs={6}>
                          <Item>Purchase BBond</Item>
                          <Item>Bomb is over peg</Item>
                        </Grid>
                        <Grid item xs={6}>
                          Purchase
                        </Grid>
                      </Grid>
                    </Box>
                    <hr />
                    <Box sx={{ flexGrow: 1 }}>
                      <Grid container spacing={0}>
                        <Grid item xs={6}>
                          Redeem Bomb
                        </Grid>
                        <Grid item xs={6}>
                          <Item>Redeem</Item>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              

              <hr />
            </Item>
          </Grid>
        </Grid>
      </Box>
      
    </Page>
  );
};
export default Dashboard;
