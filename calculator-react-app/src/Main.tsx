import React, { Component } from "react";
import { Repayment } from './Repayment'
import { BalanceTransfer } from './BalanceTransfer'
import './Main.css';

type Page = {kind: "home"} | {kind: "repayment"} | {kind: "bt"};

type MainState = {
  page: Page;
}

export class Main extends Component<{}, MainState> {

  constructor(props: {}) {
    super(props);
    this.state = {page: {kind: "home"}};
  }

  render = (): JSX.Element => {
    if (this.state.page.kind === "home") {
      return (<div>
                <h1>Calculators</h1>
                <button onClick={this.doRepaymentClick}>Repayment</button>
                <button onClick={this.doBTClick}>Balance transfer</button>
              </div>)
    }
    if (this.state.page.kind === "repayment") {
      return <Repayment/>
    }
    if (this.state.page.kind === "bt") {
      return <BalanceTransfer/>
    } else {
      return <div></div>
    }
  }

  doRepaymentClick = (): void => {
    this.setState({page: {kind: "repayment"}})
  }

  doBTClick = (): void => {
    this.setState({page: {kind: "bt"}})
  }
}
