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
                {this.renderTerms()}
              </div>);
    }
    if (this.state.page.kind === "Debt Snowball/Avalanche") {
      return (<div>
                {this.renderHome()}
                <App/>
                {this.renderTerms()}
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
            <Box sx={{maxWidth: '1920px', margin: '0 auto', flexGrow: 1, fontFamily: 'Satoshi-Variable', height: 'auto' }}>
              <Grid container spacing ={0} sx={{ px: '5rem', py: '2.5rem', whiteSpace: { xs: 'nowrap', sm: 'normal', md: 'normal' } }} direction="row" justifyContent="flex-start" alignItems="flex-start">
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
              <Paper variant='outlined' sx={{px: '1.563rem', py: '1.563rem', width: '100%', height: 'auto', borderRadius: '10px'}}>
                <Grid container rowSpacing={2} columnSpacing={{ xs: 8, sm: 9, md: 10 }}>
                  <Grid item sm={12} md={2.5}>
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'primary.main', color: '#fff', borderRadius: '50%', width: '3.25rem', height: '3.25rem', fontSize: '1.5rem', fontWeight: 700}}>
                      {num}
                    </Box>
                  </Grid>
                  <Grid item sm={12} md={9.5} sx={{display: 'flex', flexDirection: 'column'}}>
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

    const columnOne = (): JSX.Element => {
      return (
        <Box>
          <Grid container spacing={3} direction='column'>
            <Grid item>
              {printTerms(1, 'Credit Card Balance', 'This is the total dollar amount you owe to a credit card company. You might have multiple different balances if you have multiple credit cards.')}
            </Grid>
            <Grid item>
              {printTerms(2, 'Utilization Ratio', 'Also called your credit utilization rate, this is your current credit debt - how much you are currently borrowing - divided by your total available credit - the maximum amount you can borrow.')}
            </Grid>
            <Grid item>
              {printTerms(3, 'Credit Limit', 'This refers to the maximum amount you can borrow from - and therefore, owe to - your credit card company before being penalized.')}
            </Grid>
            <Grid item>
              {printTerms(4, 'Credit Score', 'This is a number assigned to you as an evaluation of your capacity to return borrowed money and an indication of your future creditworthiness. A high credit score is earned by making prompt debt repayments on credit cards and other loans.')}
            </Grid>
          </Grid>
        </Box>
      );
    }

    const columnTwo = (): JSX.Element => {
      return (
        <Box>
          <Grid container spacing={3} direction='column'>
            <Grid item>
              {printTerms(5, 'Balance Transfer', 'Like transferring money from your checkings account to savings, a balance transfer is a credit card transaction that moves your debt from one account to another - oftentimes, to one with a lower interest rate.')}
            </Grid>
            <Grid item>
              {printTerms(6, 'Minimum Payment / Monthly Payment', 'Your minimum monthly payment is the absolute least amount of money you can pay towards your credit debt while remaining in good standing with the credit card company.')}
            </Grid>
            <Grid item>
              {printTerms(7, 'Interest Rate / Interest Charge', 'Your interest rate is the percentage you\'ll be charged for borrowing money. Your interest charge, then, is the actual amount you owe the credit card company, based on your interest rate and the amount of money you\'ve borrowed.')}
            </Grid>
          </Grid>
        </Box>
      );
    }

    const columnThree = (): JSX.Element => {
      return (
        <Box>
          <Grid container spacing={3} direction='column'>
            <Grid item>
              {printTerms(8, 'Debt Consolidation', 'This combines multiple - usually high-interest - debts into a single payment, sometimes with a lower interest rate.')}
            </Grid>
            <Grid item>
              {printTerms(9, 'Current Balance', 'Much like your credit card balance, this is the total amount you owe on your account, minus pending interest charges.')}
            </Grid>
            <Grid item>
              {printTerms(10, 'APR', 'Similar to your interest rate, your Annual Percentage Rate is the cost of borrowing money - the percentage you\'ll be charged - plus additional costs and service fees.')}
            </Grid>
          </Grid>
        </Box>
      );
    }

    return (<Box sx={{maxWidth: '1920px', margin: '0 auto', backgroundColor: 'secondary.light'}}>
              <Box sx={{ px: '5rem', py: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 'auto', whiteSpace: 'nowrap', width: '100%' }}>
                <Typography variant='h3' sx={{ fontFamily: 'NaNJaune-MidiBold', fontSize: 'clamp(1.3rem, 1vw, 2rem)' }}>
                  ALL TERMS
                </Typography>
                <Typography variant='h3' sx={{ fontFamily: 'NaNJaune-MidiBold', fontSize: 'clamp(1.3rem, 1vw, 2rem)' }}>
                  YOU NEED TO KNOW
                </Typography>
              </Box>
              <Box sx={{ px: '5rem', py: '2.5rem', height: 'auto', flexGrow: 1 }}>
                <Grid container spacing={3} sx={{ justifyContent: 'center'}}>
                  <Grid item spacing={3} sm={12} md={4} sx={{maxWidth: '25rem'}}>
                    {columnOne()}
                  </Grid>
                  <Grid item spacing={3} sm={12} md={4} sx={{maxWidth: '25rem'}}>
                    {columnTwo()}
                  </Grid>
                  <Grid item spacing={3} sm={12} md={4} sx={{maxWidth: '25rem'}}>
                    {columnThree()}
                  </Grid>
                </Grid>
              </Box>
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
