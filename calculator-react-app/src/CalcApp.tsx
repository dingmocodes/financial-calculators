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
    // const Item = styled(Paper)(({ theme }) => ({
    //   backgroundColor: theme.palette.primary.dark,
    //   //padding: theme.spacing(1),
    //   textAlign: 'center',
    //   color: theme.palette.primary.contrastText,
    //   cursor: 'pointer',
    //   height: 30,
    //   borderRadius: '15px',
    //   boxShadow: theme.shadows[5],
    // }));

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
        <Typography variant='body1' sx={{ fontWeight: weight, color: textColor}}>
          { type }
        </Typography>
      );
    };

    return (
            <Box sx={{ flexGrow: 1, fontFamily: 'Satoshi-Variable'}}>
              <Grid container spacing ={0} sx={{ px: 16, py: 8, height: 122, fontSize: '1rem' }} direction="row" justifyContent="flex-start" alignItems="flex-start">
                  <Grid item xs={10} md={2.5}>
                      <Button variant='text' disableRipple onClick={this.doRepaymentClick} sx={{ textTransform: 'none' }}>
                        { printCalcTypes('Credit Card Repayment Calculator', this.state.page.kind) }
                      </Button>
                  </Grid>
                  <Grid item xs={10} md={2.5}>
                    <Button variant='text' disableRipple onClick={this.doBTClick} sx={{ textTransform: 'none' }}>
                      { printCalcTypes('Balance Transfer Calculator', this.state.page.kind) }
                    </Button>
                  </Grid>
                  <Grid item xs={10} md={2.5}>
                    <Button variant='text' disableRipple onClick={this.doMultiClick} sx={{ textTransform: 'none' }}>
                      { printCalcTypes('Debt Snowball/Avalanche', this.state.page.kind) }
                    </Button>
                  </Grid>
              </Grid>
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
