import React, { Component, ChangeEvent, MouseEvent } from "react";
import { isRecord } from './record';

type BTProps = {}

type BTState = {
  balance: number,
  interest: number,
  payment: number,
  transfer_fee: number,
  intro_period: number,
  savings: number,
  monthly_payment: number
}

export class BalanceTransfer extends Component<BTProps, BTState> {

  constructor(props: {}) {
    super(props);
    this.state = {
      balance: 0,
      interest: 0,
      payment: 0,
      transfer_fee: 0,
      intro_period: 0,
      savings: 0,
      monthly_payment: 0
    }
  }

  render = (): JSX.Element => {
    return (
      <div>
        <label>
          Balance: <input 
                      type="number" 
                      name="balanceInput" 
                      onChange={this.doBalanceChange} 
                      required />
        </label>
        <label>
          Interest: <input 
                      type="number" 
                      name="interestInput" 
                      onChange={this.doInterestChange} 
                      required />
        </label>
        <label>
          Payment: <input 
                      type="number" 
                      name="paymentInput" 
                      onChange={this.doPaymentChange}
                      required />
        </label>
        <label>
          Transfer fee: <input 
                          type="number" 
                          name="tpInput" 
                          onChange={this.doTFChange}
                          required />
        </label>
        <label>
          Intro period: <input 
                          type="number" 
                          name="ipInput" 
                          onChange={this.doIPChange}
                          required />
        </label>
        <button className="submitInput" type="button" onClick={this.doSubmitClick}>
          Submit
        </button>
        <h3>Total savings: £ {this.state.savings}</h3>
        <h3>Monthly payment: £ {this.state.monthly_payment}</h3>
      </div>
    );
  };

  doBalanceChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ balance: evt.target.valueAsNumber });
  };

  doInterestChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ interest: evt.target.valueAsNumber });
  };

  doPaymentChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ payment: evt.target.valueAsNumber });
  };

  doTFChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ transfer_fee: evt.target.valueAsNumber });
  };

  doIPChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ intro_period: evt.target.valueAsNumber });
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
      return alert('Please enter a valid balance within the range £1 - £99,999');
    }
    if (curr_interest <= 0 || curr_interest >= 100) {
      return alert('Please enter a valid interest rate within the range 1% - 99%');
    }
    if (curr_payment < min_payment) {
      return alert('Payment must be at least £' + min_payment);
    }
    if (curr_tf <= 0 || curr_tf >= 100) {
      return alert('Please enter a valid transfer fee within the range 1% - 99%');
    }
    if (curr_ip <= 0 || curr_ip >= 49) {
      return alert('Please enter a valid intro period within the range 1 - 48 months');
    }
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