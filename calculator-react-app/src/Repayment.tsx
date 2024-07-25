import React, { Component, ChangeEvent, MouseEvent } from "react";
import { isRecord } from './record';

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
  output: RepaymentResponse
};

export class Repayment extends Component<RepaymentProps, RepaymentState> {

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
    this.setState({ balance: evt.target.valueAsNumber });
  };

  doInterestChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    // what if a user doesn't enter numbers
    this.setState({ interest: evt.target.valueAsNumber });
  };

  doPaymentChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    // what if a user doesn't enter numbers
    this.setState({ payment: evt.target.valueAsNumber });
  };

  doSubmitClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    const args = {
      balance: this.state.balance.toString(),
      interest: this.state.interest.toString(),
      payment: this.state.payment.toString()
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

    if (typeof data.total_interest_paid !== 'number') {
      console.error("bad data from /repayment: total_interest_paid is not a number", data);
      return;
    }

    if (typeof data.total_cost !== 'number') {
      console.error("bad data from /repayment: total_cost is not a number", data);
      return;
    }

    if (typeof data.total_months !== 'number') {
      console.error("bad data from /repayment: total_months is not a number", data);
      return;
    }

    this.setState({output: {
      total_interest_paid: data.total_interest_paid,
      total_cost: data.total_cost,
      total_months: data.total_months
    }})
  };

  doSubmitError = (msg: string): void => {
    console.error(`Error fetching /repayment: ${msg}`);
  };

}

