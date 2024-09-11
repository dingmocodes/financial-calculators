import React, { Component, ChangeEvent, MouseEvent } from "react";
import { isRecord } from './record';
import { TextField, Typography, InputAdornment, Box, Paper, FormControl, FormLabel, FormControlLabel, Radio, RadioGroup, Button, Slide, Grid } from "@mui/material"

type RepaymentProps = {}

type RepaymentResponse = {
  total_interest_paid: number,
  total_cost: number,
  total_months: number
};

type RepaymentState = {
  balance: number,
  interest: number,
  payment: number,
  output: RepaymentResponse,
  min_payment: number,
  checked: boolean,
  hasInteracted: {
    balance: boolean,
    interest: boolean,
    amount: boolean
  }
};

export class Repayment extends Component<RepaymentProps, RepaymentState> {

  containerRef: React.RefObject<HTMLDivElement>;
  inputBoxRef: React.RefObject<HTMLDivElement>;

  constructor(props: {}) {
    super(props);
    this.state = {
      balance: 0,
      interest: 0,
      payment: 0,
      output: {
        total_interest_paid: 0,
        total_cost: 0,
        total_months: 0
      },
      min_payment: 0,
      checked: false,
      hasInteracted: {
        balance: false,
        interest: false,
        amount: false,
      },
    };
    this.containerRef = React.createRef();
    this.inputBoxRef = React.createRef();
  }

  render = (): JSX.Element => {
    return (<Box>
              <Box sx={{ px: '5rem', py: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 'auto', whiteSpace: 'nowrap', width: '100%' }}>
                <Typography variant='h1' sx={{ fontFamily: 'NaNJaune-MidiBold', fontSize: 'clamp(1.25rem, 4vw, 4rem)' }}>
                  CREDIT CARD 
                </Typography>
                <Typography variant='h1' sx={{ fontFamily: 'NaNJaune-MidiBold', fontSize: 'clamp(1.25rem, 4vw, 4rem)' }}>
                  REPAYMENT CALCULATOR
                </Typography>
              </Box>

              
              <Box sx={{ px: {xs: '2.5rem', sm: '2.5rem', md: '5rem'}, py: '2.5rem', height: 'auto', width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                <Grid container spacing={2} sx={{justifyContent: "center", alignItems: "center"}}>
                  <Grid item xs={12} sm={4} xl={3}>
                    <Paper variant='outlined' ref={this.inputBoxRef} sx={{mr: {xs: '1rem', sm: '2rem', md: '5rem'}, px: '1.5rem', py: '1.5rem', width: 'auto', display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'secondary.light', borderRadius: 5}}>
                      <Box sx={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                        Enter Balance
                        <TextField
                          type='number'
                          id='balance_input'
                          onChange={this.doBalanceChange} 
                          sx={{ width: '100%' }}
                          error={this.state.hasInteracted.balance && (this.state.balance <= 0 || this.state.balance > 100000) ? true : false}
                          helperText={this.state.hasInteracted.balance && (this.state.balance <= 0 || this.state.balance > 100000) ? 'Enter balance: £1 - £99,999' : ''}
                          InputProps={{
                            startAdornment: <InputAdornment position='start'>£</InputAdornment>,
                          }}
                        />
                        Interest Rate
                        <TextField
                          type='number'
                          id='interest_input'
                          onChange={this.doInterestChange}
                          sx={{ width: '100%' }}
                          error={this.state.hasInteracted.interest && (this.state.interest <= 0 || this.state.interest > 100) ? true : false}
                          helperText={this.state.hasInteracted.interest && (this.state.interest <= 0 || this.state.interest > 100) ? 'Enter rate: 1% - 99%' : ''}
                          InputProps={{
                            endAdornment: <InputAdornment position='end'>%</InputAdornment>,
                          }}
                        />
                        <FormControl>
                          <FormLabel id="monthly-payment-type-label">Pick Your Monthly Payment</FormLabel>
                          <RadioGroup
                            row
                            aria-labelledby="monthly-payment-type-label"
                            name="monthly-payment-type"
                            onChange={(event) => this.doUpdateAmount(event)}
                          >
                            <FormControlLabel value="fixed" control={<Radio />} label="Fixed" />
                            <FormControlLabel value="minimum" control={<Radio />} label="Minimum" />
                          </RadioGroup>
                        </FormControl>
                        Amount
                        <TextField
                          type='number'
                          id='amount_input'
                          value={this.state.payment === 0 ? '' : this.state.payment}
                          onChange={this.doPaymentChange}
                          sx={{ width: '100%' }}
                          error={this.state.hasInteracted.amount && (this.state.payment < this.state.min_payment || this.state.payment > this.state.balance) ? true : false}
                          helperText={this.state.hasInteracted.amount && (this.state.payment < this.state.min_payment) ? 'Enter amount greater than: £' + this.state.min_payment
                                    : (this.state.hasInteracted.amount && (this.state.payment > this.state.balance) ? 'Payment amount cannot exceed the total balance.' : '')}
                          InputProps={{
                            startAdornment: <InputAdornment position='start'>£</InputAdornment>,
                          }}
                        />
                        <Button variant='contained' onClick={this.doSubmitClick} disableRipple sx={{ borderRadius: 5, textTransform: 'none'}}>Calculate Now</Button>
                      </Box>
                    </Paper>
                  </Grid>
      
                  <Grid item xs={12} sm={4} xl={3}>
                    <Box sx={{ width: '100%', position: 'relative', height: this.inputBoxRef.current ? this.inputBoxRef.current.clientHeight + 'px' : '0px' }}>
                      <Box sx={{ position: 'absolute', width: '100%', height: '100%' }} ref={this.containerRef}>
                        <Slide in={this.state.checked} container={this.containerRef.current} direction='up'>
                          <Box sx={{
                            px: 2,
                            py: 2,
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            color: 'primary.contrastText',
                            height: this.inputBoxRef.current ? (100 - ((this.state.output.total_interest_paid / this.state.output.total_cost) * 100)) + '%' : '0px',
                            backgroundColor: 'secondary.main'
                          }}>
                            <Typography variant='h4' sx={{ alignSelf: 'flex-start' }}>
                              £{this.state.output.total_cost} Total Paid
                            </Typography>
                            <Typography variant='h4' sx={{ alignSelf: 'flex-start' }}>
                              £{this.state.output.total_interest_paid} Interest Paid
                            </Typography>
                          </Box>
                        </Slide>
                        <Slide in={this.state.checked} container={this.containerRef.current} direction='up'>
                          <Box sx={{ width: '100%', height: this.inputBoxRef.current ? ((this.state.output.total_interest_paid / this.state.output.total_cost) * 100) + '%' : 'auto', backgroundColor: 'primary.light' }}></Box>
                        </Slide>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>);
  };

  doUpdateAmount = (evt: ChangeEvent<HTMLInputElement>): void => {
    if (evt.target.value === "minimum") {
      this.setState({payment: this.state.min_payment})
    }
  }

  doBalanceChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    const min_percentage: number = 0.025;
    this.setState({
      balance: evt.target.valueAsNumber,
      hasInteracted: { ...this.state.hasInteracted, balance: true },
      min_payment: Number((min_percentage * evt.target.valueAsNumber).toFixed(2)) < 5 ? 5
                   : Number((min_percentage * evt.target.valueAsNumber).toFixed(2))
    });
  };

  doInterestChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      interest: evt.target.valueAsNumber,
      hasInteracted: { ...this.state.hasInteracted, interest: true }
    });
  };

  doPaymentChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      payment: evt.target.valueAsNumber,
      hasInteracted: { ...this.state.hasInteracted, amount: true }
    });
  };

  doSubmitClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    const min_percentage: number = 0.025;
    const curr_balance: number = this.state.balance;
    const curr_interest: number = this.state.interest;
    const curr_payment: number = this.state.payment;
    const min_payment: number = Number((min_percentage * curr_balance).toFixed(2)) < 5 ? 5
                                : Number((min_percentage * curr_balance).toFixed(2));
    if (curr_balance <= 0 || curr_balance >= 100000) {
      return;
    }
    if (curr_interest <= 0 || curr_interest >= 100) {
      return;
    }
    if (curr_payment < this.state.min_payment || curr_payment > curr_balance) {
      return;
    }
    this.setState({ checked: false})
    this.setState({ checked: true})
    const args = {
      balance: curr_balance,
      interest: curr_interest,
      payment: curr_payment
    }
    fetch("http://localhost:8000/repayment", {
      method: "POST",
      body: JSON.stringify(args),
      headers: {"Content-Type": "application/json"} })
      .then(this.doSubmitResp)
      .catch(() => this.doSubmitError("failed to connect to server"));
  };

  doSubmitResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.doSubmitJson)
          .catch(() => this.doSubmitError("200 response is not JSON"))
    } else if (res.status === 400) {
      res.text().then(this.doSubmitError)
        .catch(() => this.doSubmitError("400 response is not text"))
    } else {
      this.doSubmitError(`bad status code from /repayment: ${res.status}`);
    }
  };

  doSubmitJson = (data: unknown): void => {
    if (!isRecord(data)) {
      console.error("bad data from /repayment: not a record", data);
      return;
    }

    const totalInterestPaid = Number(data.total_interest_paid);
    const totalCost = Number(data.total_cost);
    const totalMonths = Number(data.total_months);

    if (isNaN(totalInterestPaid) || isNaN(totalCost) || isNaN(totalMonths)) {
      console.error("bad data from /repayment: one of the fields is not a valid number", data);
      return;
    }

    this.setState({output: {
      total_interest_paid: totalInterestPaid,
      total_cost: totalCost,
      total_months: totalMonths
    }})
  };

  doSubmitError = (msg: string): void => {
    console.error(`Error fetching /repayment: ${msg}`);
  };

}
