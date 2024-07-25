import React, { Component, ChangeEvent, MouseEvent } from "react";
import { isRecord } from './record';

type RepaymentProps = {}

type RepaymentResponse = {
  total_interest_paid: number,
  total_cost: number,
  total_months: number
};

type RepaymentState = {
  balance: string,
  interest: string,
  payment: string,
  output: RepaymentResponse
};

export class Repayment extends Component<RepaymentProps, RepaymentState> {

  constructor(props: {}) {
    super(props);
    this.state = {
      balance: '0',
      interest: '0',
      payment: '0',
      output: {
        total_interest_paid: 0,
        total_cost: 0,
        total_months: 0
      }
    };
  }

  render = (): JSX.Element => {
    return (
      <div>
        <label>
          Balance: <input name="balanceInput" onChange={this.doBalanceChange}/>
        </label>
        <label>
          Interest: <input name="interestInput" onChange={this.doInterestChange}/>
        </label>
        <label>
          Payment: <input name="paymentInput" onChange={this.doPaymentChange}/>
        </label>
        <button className="submitInput" type="button" onClick={this.doSubmitClick}>
          Submit
        </button>
        <h3>Total cost: {this.state.output.total_cost}</h3>
        <h3>Interest paid: {this.state.output.total_interest_paid}</h3>
        <h3>Total months: {this.state.output.total_months}</h3>
      </div>
    );
  };

  doBalanceChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    // what if a user doesn't enter numbers
    this.setState({ balance: evt.target.value });
  };

  doInterestChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    // what if a user doesn't enter numbers
    this.setState({ interest: evt.target.value });
  };

  doPaymentChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    // what if a user doesn't enter numbers
    this.setState({ payment: evt.target.value });
  };

  doSubmitClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    const args = {
      balance: Number(this.state.balance),
      interest: Number(this.state.interest),
      payment: Number(this.state.payment)
    }
    fetch("http://localhost:8000/repayment", {
    // fetch("/repayment", {
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

