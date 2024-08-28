import React, { Component } from "react";
import { Repayment } from './Repayment';
import { BalanceTransfer } from './BalanceTransfer'
import App from './PaymentPlans'
import { Container, Typography, Grid, ButtonBase, Box, styled, Paper, Button } from "@mui/material"

type Page = {kind: "home"} | {kind: "Credit Card Repayment Calculator"} | {kind: "Balance Transfer Calculator"} | {kind: "Debt Snowball/Avalanche"};

type CalcAppState = {
  page: Page
};

export default class CalcApp extends Component<{}, CalcAppState> {

  constructor(props: {}) {
    super(props);
    this.state = {page: {kind: "home"}};
  }

  render = (): JSX.Element => {
    if (this.state.page.kind === "home") {
      return this.renderHome();
    }
    if (this.state.page.kind === "Credit Card Repayment Calculator") {
      return (<div>
                {this.renderHome()}
                <Repayment/>
                {this.renderTerms()}
              </div>);
    }
    if (this.state.page.kind === "Balance Transfer Calculator") {
      return (<div>
                {this.renderHome()}
                <BalanceTransfer/>
              </div>);
    }
    if (this.state.page.kind === "Debt Snowball/Avalanche") {
      return (<div>
                {this.renderHome()}
                <App/>
              </div>);
    } 
    else {
      return <div></div>;
    }
  };

  renderHome = (): JSX.Element => {

    const printCalcTypes = (type: string, pageState: string): JSX.Element => {
      let weight: number = 0;
      let textColor: string = ''
      if (type === pageState) {  // it is selected
        type = "• " + type;
        weight = 700;
      } else {
        weight = 400
        textColor = 'secondary.contrastText'
      }
      return (
        <Typography variant='body1' sx={{ fontWeight: weight, color: textColor }}>
          { type }
        </Typography>
      );
    };

    return (
            // <Box sx={{ flexGrow: 1, fontFamily: 'Satoshi-Variable', height: '7.625rem' }}>
            <Box sx={{ flexGrow: 1, fontFamily: 'Satoshi-Variable', height: 'auto' }}>
              <Grid container spacing ={2} sx={{ px: '5rem', py: '2.5rem', whiteSpace: { xs: 'nowrap', sm: 'normal', md: 'normal' } }} direction="row" justifyContent="flex-start" alignItems="flex-start">
                  <Grid item xs={12} sm={4} md={2.5}>
                      <Button variant='text' disableRipple onClick={this.doRepaymentClick} sx={{ textTransform: 'none' }}>
                        { printCalcTypes('Credit Card Repayment Calculator', this.state.page.kind) }
                      </Button>
                  </Grid>
                  <Grid item xs={12} sm={4} md={2.5}>
                    <Button variant='text' disableRipple onClick={this.doBTClick} sx={{ textTransform: 'none' }}>
                      { printCalcTypes('Balance Transfer Calculator', this.state.page.kind) }
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={4} md={2.5}>
                    <Button variant='text' disableRipple onClick={this.doMultiClick} sx={{ textTransform: 'none' }}>
                      { printCalcTypes('Debt Snowball/Avalanche', this.state.page.kind) }
                    </Button>
                  </Grid>
              </Grid>
            </Box>
          );
  }

  renderTerms = (): JSX.Element => {

    const printTerms = (num: number, term: string, def: string): JSX.Element => {
      return (
              <Paper variant='outlined' sx={{px: '1.563rem', py: '1.563rem', width: '25rem', height: 'auto', borderRadius: '10px'}}>
                <Grid container spacing={0}>
                  <Grid item xs={2.5}>
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'primary.main', color: '#fff', borderRadius: '50%', width: '3.25rem', height: '3.25rem', fontSize: '1.5rem', fontWeight: 700}}>
                      {num}
                    </Box>
                  </Grid>
                  <Grid item xs={9.5} sx={{display: 'flex', flexDirection: 'column'}}>
                    <Typography sx={{pb: '0.75rem',fontSize: '1.5rem', fontWeight: 700}}>
                      {term}
                    </Typography>
                    <Typography sx={{fontSize: '0.875rem'}}>
                      {def}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
             );
    }

    return (
            <Box sx={{ px: 16, py: 8}}>
              <Typography sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '3rem', fontFamily: 'NaNJaune-MidiBold', marginBottom: -3}}>ALL TERMS</Typography>
              <Typography sx={{pb: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '3rem', fontFamily: 'NaNJaune-MidiBold'}}>YOU NEED TO KNOW</Typography>
              {printTerms(1, 'Credit Card Balance', 'This is the total dollar amount you owe to a credit card company. You might have multiple different balances if you have multiple credit cards')}
            </Box>
           );
  }

  doRepaymentClick = (): void => {
    this.setState({page: {kind: "Credit Card Repayment Calculator"}});
  };

  doBTClick = (): void => {
    this.setState({page: {kind: "Balance Transfer Calculator"}});
  };

  doMultiClick = (): void => {
    this.setState({page: {kind: "Debt Snowball/Avalanche"}});
  };
}
