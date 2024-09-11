import React, { Component, ChangeEvent, MouseEvent } from "react";
import { isRecord } from './record';
import { TextField, Typography, InputAdornment, Box, Paper, FormControl, FormLabel, FormControlLabel, Radio, RadioGroup, Button, Slide, Grid } from "@mui/material"

type BTProps = {}

type BTState = {
  balance: number,
  interest: number,
  payment: number,
  transfer_fee: number,
  intro_period: number,
  savings: number,
  monthly_payment: number
  min_payment: number,
  checked: boolean,
  hasInteracted: {
    balance: boolean,
    interest: boolean,
    amount: boolean,
    transfer_fee: boolean,
    intro_period: boolean
  }
}

export class BalanceTransfer extends Component<BTProps, BTState> {

  containerRef: React.RefObject<HTMLDivElement>;
  inputBoxRef: React.RefObject<HTMLDivElement>;

  constructor(props: {}) {
    super(props);
    this.state = {
      balance: 0,
      interest: 0,
      payment: 0,
      transfer_fee: 0,
      intro_period: 0,
      savings: 0,
      monthly_payment: 0,
      min_payment: 0,
      checked: false,
      hasInteracted: {
        balance: false,
        interest: false,
        amount: false,
        transfer_fee: false,
        intro_period: false
      },
    }
    this.containerRef = React.createRef();
    this.inputBoxRef = React.createRef();
  }

  render = (): JSX.Element => {
    return (<Box>
              <Box sx={{ px: '5rem', py: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 'auto', whiteSpace: 'nowrap', width: '100%' }}>
                <Typography variant='h1' sx={{ fontFamily: 'NaNJaune-MidiBold', fontSize: 'clamp(1.25rem, 4vw, 4rem)' }}>
                  BALANCE TRANSFER 
                </Typography>
                <Typography variant='h1' sx={{ fontFamily: 'NaNJaune-MidiBold', fontSize: 'clamp(1.25rem, 4vw, 4rem)' }}>
                  CALCULATOR
                </Typography>
              </Box>

              <Box sx={{ px: {xs: '1rem', sm: '2.5rem', md: '5rem'}, py: '2.5rem', height: 'auto', display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
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
                        Monthly Payment
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
                        Transfer Fee
                        <TextField
                          type='number'
                          id='tf_input'
                          onChange={this.doTFChange}
                          sx={{ width: '100%' }}
                          error={this.state.hasInteracted.transfer_fee && (this.state.transfer_fee <= 0 || this.state.transfer_fee > 100) ? true : false}
                          helperText={this.state.hasInteracted.transfer_fee && (this.state.transfer_fee <= 0 || this.state.transfer_fee > 100) ? 'Enter fee: 1% - 99%' : ''}
                          InputProps={{
                            endAdornment: <InputAdornment position='end'>%</InputAdornment>,
                          }}
                        />
                        Intro Period
                        <TextField
                          type='number'
                          id='ip_input'
                          onChange={this.doIPChange} 
                          sx={{ width: '100%' }}
                          error={this.state.hasInteracted.intro_period && (this.state.intro_period < 3 || this.state.intro_period > 24) ? true : false}
                          helperText={this.state.hasInteracted.intro_period && (this.state.intro_period < 3 || this.state.intro_period > 24) ? 'Enter intro period: 3 - 24 months' : ''}
                          InputProps={{
                            endAdornment: <InputAdornment position='end'>months</InputAdornment>,
                          }}
                        />
                        <Button variant='contained' onClick={this.doSubmitClick} disableRipple sx={{ borderRadius: 5, textTransform: 'none'}}>Calculate Now</Button>
                      </Box>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={4} xl={3}>
                    <Box sx={{width: 'auto', position: 'relative', height: '100%'}}>
                      <Box sx={{width: '100%'}} ref={this.containerRef}>
                        <Slide in={this.state.checked} container={this.containerRef.current} direction='up'>
                          <Box sx={{ height: this.inputBoxRef.current ? `${this.inputBoxRef.current.offsetHeight}px` : '0px', px: '1.56rem', py: '1.56rem', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', color: 'primary.contrastText', backgroundColor: 'secondary.main'}}>
                            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                              <Typography variant='h3' sx={{ mb: '1.25rem', alignSelf: 'flex-start', fontWeight: 700 }}>
                                Estimated Savings
                              </Typography>
                              <Typography variant='h4' sx={{pl: 10}}>
                                £{this.state.savings}
                              </Typography>
                            </Box>
                            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                              <Typography variant='h3' sx={{ mb: '1.25rem', alignSelf: 'flex-start', fontWeight: 700 }}>
                                New Monthly Payment
                              </Typography>
                              <Typography variant='h4' sx={{pl: 10}}>
                                £{this.state.monthly_payment}
                              </Typography>
                            </Box>
                          </Box>
                        </Slide>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
    );
  };

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

  doTFChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ 
      transfer_fee: evt.target.valueAsNumber,
      hasInteracted: { ...this.state.hasInteracted, transfer_fee: true }
    });
  };

  doIPChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ 
      intro_period: evt.target.valueAsNumber,
      hasInteracted: { ...this.state.hasInteracted, intro_period: true }
    });
  };

  doSubmitClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    const min_percentage: number = 0.025;
    const curr_balance: number = this.state.balance;
    const curr_interest: number = this.state.interest;
    const curr_payment: number = this.state.payment;
    const min_payment: number = Number((min_percentage * curr_balance).toFixed(2)) < 5 ? 5
                                : Number((min_percentage * curr_balance).toFixed(2));
    const curr_tf: number = this.state.transfer_fee;
    const curr_ip: number = this.state.intro_period;
    if (curr_balance <= 0 || curr_balance >= 100000) {
      return;
    }
    if (curr_interest <= 0 || curr_interest >= 100) {
      return;
    }
    if (curr_payment < this.state.min_payment) {
      return;
    }
    if (curr_tf <= 0 || curr_tf >= 100) {
      return;
    }
    if (curr_ip < 3 || curr_ip > 24) {
      return;
    }
    this.setState({ checked: false})
    this.setState({ checked: true})
    const args = {
      balance: curr_balance,
      interest: curr_interest,
      payment: curr_payment,
      transfer_fee: curr_tf,
      intro_period: curr_ip
    }
    fetch("http://localhost:8000/balance-transfer", {
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
      this.doSubmitError(`bad status code from /balance-transfer: ${res.status}`);
    }
  };

  doSubmitJson = (data: unknown): void => {
    if (!isRecord(data)) {
      console.error("bad data from /balance-transfer: not a record", data);
      return;
    }

    const totalSavings = Number(data.savings);
    const payments = Number(data.monthly_payment)

    if (isNaN(totalSavings) || isNaN(payments)) {
      console.error("bad data from /balance-transfer: not a valid number", data);
      return;
    }

    this.setState({savings: totalSavings, monthly_payment: payments});
  };

  doSubmitError = (msg: string): void => {
    console.error(`Error fetching /balance-transfer: ${msg}`);
  };
  
}