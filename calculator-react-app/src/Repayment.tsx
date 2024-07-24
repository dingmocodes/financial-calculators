import React, { Component } from "react";

type RepaymentProps = {}

type RepaymentResponse = {
    total_interest_paid: number;
    total_cost: number;
    total_months: number;
}

type RepaymentState = {
    balance: number;
    interest: number;
    payment: number;
    output: RepaymentResponse
}

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
        return (<div>
                
                </div>)
    }
}