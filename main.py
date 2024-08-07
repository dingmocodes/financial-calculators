from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, field_validator, ValidationInfo
from decimal import Decimal
from typing import List
import uvicorn
import calculators
from fastapi.middleware.cors import CORSMiddleware

class RepaymentInput(BaseModel):
    balance: Decimal = Field(
        gt=0,
        le=99999,
        description="Balance must be greater than zero"
    )
    print('validated balance')
    interest: Decimal = Field(
        ge=0,
        le=100,
        description="Interest must be between 0 and 100"
    )
    print('validated interest')

    payment: Decimal
    
    @field_validator("payment")
    @classmethod
    def check_payment(cls, p: Decimal, info: ValidationInfo) -> Decimal:
        balance = info.data['balance']
        if balance is not None:
            min_payment = calculators.get_minpayment(balance)
            if p < min_payment:
                raise ValueError('Payment must be greater than ' + str(min_payment))
        return p
    print('validated payment')

class RepaymentOutput(BaseModel):
    total_interest_paid: Decimal
    total_cost: Decimal
    total_months: Decimal

class BalanceTransferInput(BaseModel):
    balance: Decimal = Field(
        gt=0,
        le=99999,
        description="Balance must be greater than zero"
    )

    interest: Decimal = Field(
        ge=0,
        le=100,
        description="Interest must be between 0 and 100"
    )

    payment: Decimal

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

    @field_validator("payment")
    @classmethod
    def check_payment(cls, p: Decimal, info: ValidationInfo) -> Decimal:
        balance = info.data['balance']
        if balance is not None:
            min_payment = calculators.get_minpayment(balance)
            if p < min_payment:
                raise ValueError('Payment must be greater than ' + str(min_payment))
        return p

class BalanceTransferOutput(BaseModel):
    savings: Decimal
    monthly_payment: Decimal

class Debt(BaseModel):
    total_cost: Decimal
    balance: Decimal
    interest: Decimal
    min_payment: Decimal
    total_months: Decimal

class PaymentPlanInput(BaseModel):
    data: list[Debt]
    plan: bool
    mnthly_pay: Decimal
    

if __name__ == "__main__":
    uvicorn.run("app.api:app", host="0.0.0.0", port=8000, reload=True)

app = FastAPI()

origins = [
    "http://localhost:3000",
    "localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get('/')
async def root():
    return {'root': 'Hello World'}

@app.post("/repayment", response_model=RepaymentOutput)
async def get_repayment(input: RepaymentInput):
    print('you abouta start calculations')
    result = calculators.calculate_repayment(Decimal(input.balance), Decimal(input.interest), Decimal(input.payment))
    print('you at least made it past the calculation')
    return RepaymentOutput(**result)

@app.post("/balance-transfer", response_model=BalanceTransferOutput)
async def get_balancetransfer(input: BalanceTransferInput):
    result = calculators.calculate_bt(input.balance, input.interest, input.payment, 
                                    input.transfer_fee, input.intro_period)
    return BalanceTransferOutput(**result)
    
@app.post('/payment-plan')
async def add_debt(input: PaymentPlanInput):
    debt = calculators.calculate_paymentplan(input.data, input.plan, input.mnthly_pay)
    return debt
