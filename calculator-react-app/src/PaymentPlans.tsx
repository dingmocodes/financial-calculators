import React, { ChangeEvent, useState, useRef, useEffect } from "react";
import { isRecord } from './record';
import { TextField, Typography, InputAdornment, Box, Paper, FormControl, FormLabel, FormControlLabel, Radio, RadioGroup, Button, Slide, Grid, Divider } from "@mui/material"

type InputField = {
  total_cost: number,
  balance: number,
  interest: number,
  mnthly_payment: number, // the minimum that the user sets
  min_payment: number,  // the actual minimum that the user cannot set below
  total_months: number,
  hasInteracted: {
    balance: boolean,
    interest: boolean,
    mnthly_payment: boolean
  }
};

function App() {
  const [inputFields, setInputField] = useState<InputField[]>([
    { total_cost: 0,
      balance: 0,
      interest: 0,
      mnthly_payment: 0,
      min_payment: 0,
      total_months: 0,
      hasInteracted: {
        balance: false,
        interest: false,
        mnthly_payment: false
      }
    }
  ]);

  // when plan = true then snowball, otherwise avalanche
  const [plan, setPlan] = useState(true);
  const [mnthly_pay, setPay] = useState(0);
  const [interacted_pay, setInteract] = useState(false);
  const [oldInput, setOldInput] = useState<InputField[]>([]);
  const [output, setOutput] = useState<InputField[]>([]);
  const [totalMinPayment, setTotalMinPay] = useState(0);
  const [totalCost, setCost] = useState(0);
  const [totalInterest, setInterest] = useState(0);
  const [totalMonths, setMonths] = useState(0);
  const [checked, setChecked] = useState(false);
  const containerRef = useRef(null);
  const inputBoxRef = useRef(null);

  useEffect(() => {
    const total = inputFields.reduce((acc, field) => acc + field.mnthly_payment, 0);
    setTotalMinPay(total);
  }, [inputFields]);

  useEffect(() => {
    if (output && output.length > 0) {
      const newCost = Number(getTotalAttr("cost").toFixed(2));
      const newInterest = Number(getTotalAttr("interest").toFixed(2));
      const newMonths = getTotalAttr("months");
  
      setCost(newCost);
      setInterest(newInterest);
      setMonths(newMonths);
  
      console.log('Updated cost:', newCost);
      console.log('Updated interest:', newInterest);
      console.log('Updated months:', newMonths);
    }
  }, [output]);

  const handleChangeInput = (index: number, field: keyof InputField, value: number | boolean) => {
    const min_percentage: number = 0.025;
    setInputField((prevDebts) => 
      prevDebts.map((debt, i) => 
        i === index
          ? {
            ...debt,
            [field]: value,
            min_payment: field === 'balance' 
              ? (
                Number((min_percentage * Number(value)).toFixed(2)) < 5 
                ? 5
                : Number((min_percentage * Number(value)).toFixed(2))
              ) 
              : debt.min_payment,
            hasInteracted: {
              ...debt.hasInteracted,
              [field]: true
            }
          }
          : debt
      )
    )
  }

  const handlePayChangeInput = (event: ChangeEvent<HTMLInputElement>) => {;
    setPay(event.target.valueAsNumber);
  }

  const addFields = () => {
    let newField = { 
      total_cost: 0,
      balance: 0,
      interest: 0,
      mnthly_payment: 0,
      min_payment: 0,
      total_months: 0,
      hasInteracted: {
        balance: false,
        interest: false,
        min_payment: false,
        mnthly_payment: false
      }
    }
    setInputField([...inputFields, newField]);
  }

  const removeField = (index: number) => {
    let data = [...inputFields];
    data.splice(index, 1);
    setInputField(data)
  }

  const getTotalAttr = (attr: string): number => {
    let total: number = 0
    const input: InputField[] = oldInput
    const result: InputField[] = output
    for (let i = 0; i < input.length; i++) {
      if (attr === "cost") {
        total += Number(result[i].total_cost);
      }
      if (attr === "interest") {
        total += (Number(result[i].total_cost) - Number(input[i].balance));
      }
      if (attr === "months") {
        total = Math.max(Number(result[i].total_months), total);
      }
    }
    return total;
  }

  const validateFields = (): boolean => {
    for (let field of inputFields) {
      if (field.balance <= 0 || field.balance >= 100000) {
        return false;
      }
      if (field.interest <= 0 || field.interest >= 100) {
        return false;
      }
      if (field.mnthly_payment < field.min_payment || field.mnthly_payment > field.balance) {
        return false;
      }
    }
    if (mnthly_pay < totalMinPayment) {
      return false;
    }
    return true;
  }

  const submit = () => {
    // would want a way to prevent users from refreshing page
    if (!validateFields()) {
      return;
    }
    setOldInput([...inputFields]);
    setChecked(false);
    setChecked(true);
    const args = {
      data: inputFields,
      plan: plan,
      mnthly_pay: mnthly_pay 
    }
    fetch("http://localhost:8000/payment-plan", {
      method: "POST",
      body: JSON.stringify(args),
      headers: {"Content-Type": "application/json"} })
      .then(doSubmitResp)
      .catch(() => doSubmitError("failed to connect to server"));    
  }

  const doSubmitResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(doSubmitJson)
          .catch(() => doSubmitError("200 response is not JSON"))
    } else if (res.status === 400) {
      res.text().then(doSubmitError)
        .catch(() => doSubmitError("400 response is not text"))
    } else {
      doSubmitError(`bad status code from /payment-plan: ${res.status}`);
    }
  };

  const doSubmitJson = (data: unknown): void => {
    if (!Array.isArray(data)) {
      console.error("bad data from /payment-plan: not a list", data);
      return;
    }

    if (data.length === 0 || !isRecord(data[0])) {
      console.error("bad data from /payment-plan: array is empty or first element is not a record", data);
      return;
    }

    setOutput(data);
  };

  const doSubmitError = (msg: string): void => {
    console.error(`Error fetching /repayment: ${msg}`);
  };

  return (<Box>
            <Box sx={{ px: '5rem', py: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 'auto', whiteSpace: 'nowrap', width: '100%' }}>
              <Typography variant='h1' sx={{ fontFamily: 'NaNJaune-MidiBold', fontSize: 'clamp(1.25rem, 4vw, 4rem)' }}>
                SNOWBALL / AVALANCHE
              </Typography>
              <Typography variant='h1' sx={{ fontFamily: 'NaNJaune-MidiBold', fontSize: 'clamp(1.25rem, 4vw, 4rem)' }}>
                CALCULATOR
              </Typography>
            </Box>

          
            <Box sx={{ px: {xs: '1rem', sm: '2.5rem', md: '5rem'}, py: '2.5rem', height: 'auto', display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>

              <Grid container spacing={2} sx={{justifyContent: "center", alignItems: "center"}}>

                <Grid item xs={12} sm={4} xl={3}>
                  
                  <Paper variant='outlined' ref={inputBoxRef} sx={{mr: {xs: '1rem', sm: '2rem', md: '5rem'}, px: '1.5rem', py: '1.5rem', width: 'auto', display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'secondary.light', borderRadius: 5}}>
                    {inputFields.map((debt, index) => (
                      <Box key={index} sx={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                        Enter Balance
                        <TextField
                          type='number'
                          id='balance_input'
                          onChange={e => handleChangeInput(index, 'balance', parseFloat(e.target.value))} 
                          sx={{ width: '100%' }}
                          error={debt.hasInteracted.balance && (debt.balance <= 0 || debt.balance > 100000) ? true : false}
                          helperText={debt.hasInteracted.balance && (debt.balance <= 0 || debt.balance > 100000) ? 'Enter balance: £1 - £99,999' : ''}
                          InputProps={{
                            startAdornment: <InputAdornment position='start'>£</InputAdornment>,
                          }}
                        />
                        Interest Rate
                        <TextField
                          type='number'
                          id='interest_input'
                          onChange={e => handleChangeInput(index, 'interest', parseFloat(e.target.value))} 
                          sx={{ width: '100%' }}
                          error={debt.hasInteracted.interest && (debt.interest <= 0 || debt.interest > 100) ? true : false}
                          helperText={debt.hasInteracted.interest && (debt.interest <= 0 || debt.interest > 100) ? 'Enter rate: 1% - 99%' : ''}
                          InputProps={{
                            endAdornment: <InputAdornment position='end'>%</InputAdornment>,
                          }}
                        />
                        Minimum Payment
                        <TextField
                          type='number'
                          id='min_payment_input'
                          value={debt.mnthly_payment === 0 ? '' : debt.mnthly_payment}
                          onChange={e => {handleChangeInput(index, 'mnthly_payment', parseFloat(e.target.value))}}
                          sx={{ width: '100%' }}
                          error={debt.hasInteracted.mnthly_payment && (debt.mnthly_payment < debt.min_payment || debt.mnthly_payment > debt.balance) ? true : false}
                          helperText={debt.hasInteracted.mnthly_payment && (debt.mnthly_payment < debt.min_payment) ? 'Enter amount greater than: £' + debt.min_payment
                                    : (debt.hasInteracted.mnthly_payment && (debt.mnthly_payment > debt.balance) ? 'Payment amount cannot exceed the total balance.' : '')}
                          InputProps={{
                            startAdornment: <InputAdornment position='start'>£</InputAdornment>,
                          }}
                        />
                        {index !== 0 && (<Button variant='contained' onClick={() => removeField(index)} disableRipple sx={{ borderRadius: 5, textTransform: 'none'}}>Remove</Button>)}
                        <Divider variant="middle" orientation="horizontal" flexItem/>
                        {index === inputFields.length - 1 && (
                          <Box sx={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                            <Button variant='contained' onClick={addFields} disableRipple sx={{ borderRadius: 5, textTransform: 'none'}}>Add Debt</Button>
                              <FormControl>
                              <FormLabel id="payment-type-label">Pick a Payment Plan</FormLabel>
                              <RadioGroup
                                row
                                aria-labelledby="payment-type-label"
                                name="payment-type"
                                onChange={(evt) => {
                                  if (evt.target.value === 'snowball') {
                                    setPlan(true)
                                  } else {
                                    setPlan(false)
                                  }
                                }}
                              >
                                <FormControlLabel value="snowball" control={<Radio />} label="Snowball" />
                                <FormControlLabel value="avalanche" control={<Radio />} label="Avalanche" />
                              </RadioGroup>
                            </FormControl>
                            Monthly Payment
                            <TextField
                              type='number'
                              id='monthly_payment_input'
                              onChange={(e) => {
                                setInteract(true)
                                setPay(parseFloat(e.target.value))
                              }}
                              sx={{ width: '100%' }}
                              error={interacted_pay && (mnthly_pay < totalMinPayment) ? true : false}
                              helperText={interacted_pay && (mnthly_pay < totalMinPayment) ? 'Enter amount greater than: £' + totalMinPayment : ''}
                              InputProps={{
                                startAdornment: <InputAdornment position='start'>£</InputAdornment>,
                              }}
                            />
                            <Button variant='contained' onClick={submit} disableRipple sx={{ borderRadius: 5, textTransform: 'none'}}>Calculate Now</Button>

                          </Box>
                        )}
                      </Box>
                    ))}
                  </Paper>

                </Grid>
          

                <Grid item xs={12} sm={4} xl={3}>
                  {output && output.length > 0 && (
                    <Box sx={{width: 'auto', position: 'relative', height: '100%'}}>
                      <Box sx={{width: '100%'}} ref={containerRef}>
                        <Slide in={checked} container={containerRef.current} direction='up'>
                          <Box sx={{ height: inputBoxRef.current ? `650px` : 'auto', px: '1.56rem', py: '1.56rem', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', color: 'primary.contrastText', backgroundColor: 'secondary.main'}}>
                            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                              <Typography variant='h3' sx={{ mb: '1.25rem', alignSelf: 'flex-start', fontWeight: 700 }}>
                                Total Paid
                              </Typography>
                              <Typography variant='h4' sx={{pl: 10}}>
                                £{totalCost}
                              </Typography>
                            </Box>
                            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                              <Typography variant='h3' sx={{ mb: '1.25rem', alignSelf: 'flex-start', fontWeight: 700 }}>
                                Interest Paid
                              </Typography>
                              <Typography variant='h4' sx={{pl: 10}}>
                                £{totalInterest}
                              </Typography>
                            </Box>
                            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                              <Typography variant='h3' sx={{ mb: '1.25rem', alignSelf: 'flex-start', fontWeight: 700 }}>
                                Months to Debt Freedom
                              </Typography>
                              <Typography variant='h4' sx={{pl: 10}}>
                                {totalMonths} months
                              </Typography>
                            </Box>
                          </Box>
                        </Slide>
                      </Box>
                    </Box>
                  )}
                
                </Grid>

              </Grid>

            </Box>

          </Box>

  );
}

export default App;
