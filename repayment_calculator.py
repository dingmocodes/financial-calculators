from decimal import Decimal

# did not fully test all inputs types

# assumptions:
min_percentage = Decimal(0.025)  # somewhere in the range of 0.01 - 0.04 
billing_cycle = Decimal(30)
days_in_year = Decimal(365)  # could be 360

balance = 0
while balance <= 0:  # input 1
    balance = Decimal(input('Enter a balance (£): '))
old_balance = balance

min_payment = balance * min_percentage

# lowest minimum payment can be is £5
if min_payment < 5:
    min_payment = Decimal(5)

interest = 0
while interest <= 0:  # input 2
    interest = Decimal(input('Enter your annual interest rate (%): '))
interest *= Decimal(0.01)

# daily periodic rate
dpr = interest / days_in_year

payment = 0
while payment < min_payment:  # input 3
    payment = Decimal(input('Enter a monthly payment of £' + str(round(min_payment, 2)) + ' or higher: '))


def calculate_repayment(balance: Decimal, interest: Decimal, payment: Decimal) -> dict:

    total_cost = 0
    total_months = 0
    day_counter = 0

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
        'total_interest_paid' : round(total_cost - old_balance, 2),
        'total_cost' : round(total_cost, 2),
        'total_months' : total_months
    }

    return response

print(calculate_repayment(balance, interest, payment))
