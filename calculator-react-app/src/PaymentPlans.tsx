import React, { ChangeEvent, useState } from "react";
import { isRecord } from './record';

type InputField = {
  total_cost: number | string;
  balance: number | string;
  interest: number | string;
  min_payment: number | string;
  total_months: number | string;
};

function App() {
  const [inputFields, setInputField] = useState<InputField[]>([
    { total_cost: 0, balance: '', interest: '', min_payment: '', total_months: 0 }
  ]);

  // when plan = true then snowball, otherwise avalanche
  const [plan, setPlan] = useState(true);
  const [mnthly_pay, setPay] = useState(0);
  const [oldInput, setOldInput] = useState<InputField[]>([]);
  const [output, setOutput] = useState<InputField[]>([]);
  const [totalCost, setCost] = useState(0);
  const [totalInterest, setInterest] = useState(0);
  const [totalMonths, setMonths] = useState(0);



  const handleChangeInput = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const values = [...inputFields];

    console.log(`Index: ${index}, Name: ${name}, Value: ${value}`);

    values[index][name as keyof InputField] = value === '' ? '' : parseFloat(value);
    setInputField(values);

    console.log('Updated inputFields:', values);
  }

  const handlePayChangeInput = (event: ChangeEvent<HTMLInputElement>) => {;
    setPay(event.target.valueAsNumber);
  }

  const addFields = () => {
    let newField = { total_cost: 0, balance: '', interest: '', min_payment: '', total_months: 0 }
    setInputField([...inputFields, newField]);
  }

  const removeField = (index: number) => {
    let data = [...inputFields];
    data.splice(index, 1);
    setInputField(data)
  }

  const getTotalAttr = (attr: string): number => {
    let total: number = 0;
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

  const submit = () => {
    // would want a way to prevent users from refreshing page
    setOldInput([...inputFields]);
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
    setCost(getTotalAttr("cost"));
    setInterest(getTotalAttr("interest"));
    setMonths(getTotalAttr("months"));
  };

  const doSubmitError = (msg: string): void => {
    console.error(`Error fetching /repayment: ${msg}`);
  };
  
  return (
    <div>
      <form>
        { inputFields.map((inputFields, index) => (
          <div key={index}>
            <input 
              type="number" 
              name="balance" 
              placeholder="Enter balance"
              value={inputFields.balance}
              onChange={e => handleChangeInput(index, e)}
              required
            />
            <input 
              type="number" 
              name="interest" 
              placeholder="Enter interest"
              value={inputFields.interest}
              onChange={e => handleChangeInput(index, e)}
              required
            />
            <input 
              type="number" 
              name="min_payment" 
              placeholder="Enter minimum payment"
              value={inputFields.min_payment}
              onChange={e => handleChangeInput(index, e)}
              required
            />
            <button onClick={() => removeField(index)}>Remove</button>
          </div>
        ))}
      </form>
      <button onClick={addFields}>Add debt</button>
      <button onClick={submit}>Submit</button>
      <button onClick={() => setPlan(true)}>Snowball</button>
      <button onClick={() => setPlan(false)}>Avalanche</button>
      <input 
        type="number"
        name='mnthly_pay'
        placeholder="Enter monthly payment"
        value={mnthly_pay}
        onChange={e => handlePayChangeInput(e)}>
      </input>
      <h3>Total cost: £ {totalCost}</h3>
      <h3>Interest paid: £ {totalInterest}</h3>
      <h3>Total months: {totalMonths}</h3>
    </div>
  );
}

export default App;
