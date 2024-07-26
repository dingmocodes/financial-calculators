from decimal import Decimal

# assumptions:
min_percentage = Decimal(0.025)  # somewhere in the range of 0.01 - 0.04
billing_cycle = Decimal(30)
days_in_year = Decimal(365)  # could be 360
loan_list = []

def get_minpayment(balance) -> Decimal:
    result = Decimal(balance) * min_percentage
    if result < 5:
        result = 5
    return Decimal(round(result, 2))

def calculate_repayment(balance, interest, payment) -> dict:

    interest *= Decimal(0.01)
    total_cost = 0
    total_months = 0
    day_counter = 0
    old_balance = balance
    dpr = interest / days_in_year  # daily periodic rate

    while balance > 0:
        # check if a month has passed to pay
        if day_counter == billing_cycle:
            day_counter = 0
            if payment > balance:
                total_cost += balance
            else:
                total_cost += payment
            balance -= payment
            total_months += 1
        # otherwise a day passes and we tack on interest for that day
        day_counter += 1
        balance *= (1 + dpr)

    response = {
        'total_interest_paid' : Decimal(round(total_cost - old_balance, 2)),
        'total_cost' : Decimal(round(total_cost, 2)),
        'total_months' : Decimal(total_months)
    }

    return response

def calculate_bt(balance: Decimal, interest: Decimal, payment: Decimal, 
                 transfer_fee: Decimal, intro_period: Decimal) -> dict:

    interest *= Decimal(0.01)
    transfer_fee *= Decimal(0.01)
    total_cost = 0
    day_counter = 0
    old_balance = balance
    dpr = interest / days_in_year  # daily periodic rate

    while balance > 0:
        # check if a month has passed to pay
        if day_counter == billing_cycle:
            day_counter = 0
            if payment > balance:
                total_cost += balance
            else:
                total_cost += payment
            balance -= payment
        # otherwise a day passes and we tack on interest for that day
        day_counter += 1
        balance *= (1 + dpr)

    return {'savings' : Decimal(round((total_cost - old_balance) - 
                                      (old_balance * transfer_fee), 2))}
