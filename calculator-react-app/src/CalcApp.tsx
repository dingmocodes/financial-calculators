import React, { Component } from "react";
import { Repayment } from './Repayment';
import { BalanceTransfer } from './BalanceTransfer'
import App from './PaymentPlans'

type Page = {kind: "home"} | {kind: "repayment"} | {kind: "bt"} | {kind: "multi"};

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
    if (this.state.page.kind === "repayment") {
      return (<div>
                {this.renderHome()}
                <Repayment/>
              </div>);
    }
    if (this.state.page.kind === "bt") {
      return (<div>
                {this.renderHome()}
                <BalanceTransfer/>
              </div>);
    }
    if (this.state.page.kind === "multi") {
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
    return (<div>
              <h1>Calculators</h1>
              <button onClick={this.doRepaymentClick}>Repayment</button>
              <button onClick={this.doBTClick}>Balance transfer</button>
              <button onClick={this.doMultiClick}>Multiple debts payoff</button>
            </div>);
  }

  doRepaymentClick = (): void => {
    this.setState({page: {kind: "repayment"}});
  };

  doBTClick = (): void => {
    this.setState({page: {kind: "bt"}});
  };

  doMultiClick = (): void => {
    this.setState({page: {kind: "multi"}});
  };
}
