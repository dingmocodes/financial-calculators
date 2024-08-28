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
  }

  render = (): JSX.Element => {
    return (<Box>
              <Box sx={{ px: '5rem', py: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 'auto', whiteSpace: 'nowrap', width: '100%' }}>
                <Typography variant='h1' sx={{ fontFamily: 'NaNJaune-MidiBold', fontSize: 'clamp(1.5rem, 4vw, 3rem)' }}>
                  CREDIT CARD 
                </Typography>
                <Typography variant='h1' sx={{ fontFamily: 'NaNJaune-MidiBold', fontSize: 'clamp(1.5rem, 4vw, 3rem)' }}>
                  REPAYMENT CALCULATOR
                </Typography>
              </Box>
              <Box sx={{ px: {xs: '2.5rem', sm: '2.5rem', md: '5rem'}, py: '2.5rem', height: {xs: '42.5rem', sm: '37.5rem'}, display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
                <Paper variant='outlined' sx={{mr: '1rem', px: '1.5rem', py: '1.5rem', width: '25.8rem', display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'secondary.light', borderRadius: 5}}>
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
                      id='amount-input'
                      value={this.state.payment === 0 ? '' : this.state.payment}
                      onChange={this.doPaymentChange}
                      sx={{ width: '100%' }}
                      error={this.state.hasInteracted.amount && (this.state.payment < this.state.min_payment || this.state.payment > this.state.balance) ? true : false}
                      helperText={this.state.hasInteracted.amount && (this.state.payment < this.state.min_payment || this.state.payment > this.state.balance) ? 'Enter amount greater than: £' + this.state.min_payment: ''}
                      InputProps={{
                        startAdornment: <InputAdornment position='start'>£</InputAdornment>,
                      }}
                    />
                    <Button variant='contained' onClick={this.doSubmitClick} disableRipple sx={{ borderRadius: 5, textTransform: 'none'}}>Calculate Now</Button>
                  </Box>
                </Paper>

                  <Box sx={{width: '21.875rem', height: '100%', position: 'relative'}}>
                    <Box sx={{position: 'absolute', width: '100%', height: '100%'}} ref={this.containerRef}>
                      <Slide in={this.state.checked} container={this.containerRef.current} direction='up'>
                        <Box sx={{px: 2, py: 2, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: 'primary.contrastText' ,height: (100 - ((this.state.output.total_interest_paid / this.state.output.total_cost) * 100)) + '%', backgroundColor: 'secondary.main'}}>
                        <Typography sx={{ alignSelf: 'flex-start' }}>
                          £{this.state.output.total_cost} Total Paid
                        </Typography>
                        <Typography sx={{ alignSelf: 'flex-start' }}>
                          £{this.state.output.total_interest_paid} Interest Paid
                        </Typography>
                        </Box>
                      </Slide>
                      <Slide in={this.state.checked} container={this.containerRef.current} direction='up'>
                        <Box sx={{width: '100%', height: ((this.state.output.total_interest_paid / this.state.output.total_cost) * 100) + '%', backgroundColor: 'primary.light'}}></Box>
                      </Slide>
                    </Box>
                  </Box>
              </Box>
            </Box>);
  };

  doUpdateAmount = (evt: ChangeEvent<HTMLInputElement>): void => {
    const min_percentage: number = 0.025;
    const min_amount: number = Number((min_percentage * this.state.balance).toFixed(2)) < 5 ? 5
                              : Number((min_percentage * this.state.balance).toFixed(2));
    if (evt.target.value === "minimum") {
      this.setState({payment: min_amount, min_payment: min_amount})
    }
  }

  doBalanceChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      balance: evt.target.valueAsNumber,
      hasInteracted: { ...this.state.hasInteracted, balance: true }
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
    if (curr_payment < this.state.min_payment) {
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
