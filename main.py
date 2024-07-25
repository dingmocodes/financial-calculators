from fastapi import FastAPI
from pydantic import BaseModel, Field, field_validator, ValidationInfo
from decimal import Decimal
import uvicorn
import calculators
from fastapi.middleware.cors import CORSMiddleware

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
    result = calculators.calculate_repayment(input.balance, input.interest, input.payment)
    return RepaymentOutput(**result)

@app.post("/balance-transfer", response_model=BalanceTransferOutput)
async def get_balancetransfer(input: BalanceTransferInput):
    result = calculators.calculate_bt(input.balance, input.interest, input.payment, 
                                    input.transfer_fee, input.intro_period)
    return BalanceTransferOutput(**result)