from fastapi import FastAPI
from pydantic import BaseModel, Field
from decimal import Decimal
import calculators

class RepaymentInput(BaseModel):
    balance: Decimal = Field(
        gt=0,
        description="Balance must be greater than zero"
    )
    interest: Decimal = Field(
        ge=0,
        le=100,
        description="Interest must be between 0 and 100"
    )
    payment: Decimal = Field(
        ge=calculators.get_minpayment(balance),
        description="The balance must be greater than " + str(calculators.get_minpayment(balance))
    )

class RepaymentOutput(BaseModel):
    total_interest_paid: Decimal
    total_cost: Decimal
    total_months: Decimal

class BalanceTransferInput(BaseModel):
    balance: Decimal = Field(
        gt=0,
        description="Balance must be greater than zero"
    )
    interest: Decimal = Field(
        ge=0,
        le=100,
        description="Interest must be between 0 and 100"
    )
    payment: Decimal = Field(
        ge=calculators.get_minpayment(balance),
        description="The balance must be greater than " + str(calculators.get_minpayment(balance))
    )
    transfer_fee: Decimal = Field(
        ge=0,
        le=100,
        description="Transfer fee must be between 0 and 100"
    )
    intro_period: Decimal = Field(
        ge=0,
        le=48,
        description="Intro period must be between 0 and 48"
    )

class BalanceTransferOutput(BaseModel):
    savings: Decimal

app = FastAPI()

@app.post("/repayment", response_model=RepaymentOutput)
async def get_repayment(input: RepaymentInput):
    result = calculators.calculate_repayment(input.balance, input.interest, input.payment)
    return RepaymentOutput(**result)

@app.post("/balance-transfer", response_model=BalanceTransferOutput)
async def get_balancetransfer(input: BalanceTransferInput):
    result = calculators.calculate_bt(input.balance, input.interest, input.payment, 
                                    input.transfer_fee, input.intro_period)
    return BalanceTransferOutput(**result)