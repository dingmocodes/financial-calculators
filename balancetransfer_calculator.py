from decimal import Decimal

# assumptions:
min_percentage = Decimal(0.025)  # somewhere in the range of 0.01 - 0.04
billing_cycle = Decimal(30)
days_in_year = Decimal(365)  # could be 360

# balance = 0
# while balance <= 0:
#     balance = Decimal(input('Enter a balance (£): '))
# old_balance = balance

# min_payment = balance * min_percentage

# # lowest minimum payment can be is £5
# if min_payment < 5:
#     min_payment = Decimal(5)

# interest = 0
# while interest <= 0:
#     interest = Decimal(input('Enter your annual interest rate (%): '))
# interest *= Decimal(0.01)

# payment = 0
# while payment < min_payment:
#     payment = Decimal(input('Enter a monthly payment of £' + str(round(min_payment, 2)) + ' or higher: '))

# # two more inputs below for balance transfer calculation

# transfer_fee = 0
# while transfer_fee <= 0:
#     transfer_fee = Decimal(input('Enter the balance transfer fee (%): '))
# transfer_fee *= Decimal(0.01)

# intro_period = 0
# while intro_period <= 0:
#     intro_period = Decimal(input('Length of 0% APR period (months): '))

def get_minpayment(balance: Decimal) -> Decimal:
    result = balance * min_percentage
    if result < 5:
        result = Decimal(5)
    return result

def calculate_bt(balance: Decimal, interest: Decimal, payment: Decimal, 
                 transfer_fee: Decimal, intro_period: Decimal) -> dict:

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
