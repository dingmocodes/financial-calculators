from decimal import Decimal
import json

# assumptions:
min_percentage = Decimal(0.025)  # somewhere in the range of 0.01 - 0.04
billing_cycle = Decimal(30)
days_in_year = Decimal(365)  # could be 360
months = Decimal(12)
# debt_list = []

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
        day_counter += 1
        balance *= (1 + dpr)
        # check if a month has passed to pay
        if day_counter == billing_cycle:
            day_counter = 0
            if payment > balance:
                total_cost += balance
            else:
                total_cost += payment
            balance -= payment
            total_months += 1

    response = {
        'total_interest_paid' : Decimal(round(total_cost - old_balance, 2)),
        'total_cost' : Decimal(round(total_cost, 2)),
        'total_months' : Decimal(total_months)
    }

    return response

def calculate_bt(balance: Decimal, interest: Decimal, payment: Decimal, 
                 transfer_fee: Decimal, intro_period: Decimal) -> dict:
    
    # interest = round(interest * Decimal(0.01), 2)
    # transfer_fee = round(transfer_fee * Decimal(0.01), 2)
    # total_cost = 0
    # old_balance = round(balance, 2)
    # mpr = round(interest / months, 2)  # monthly periodic rate

    # while balance > 0:
    #     balance = round(balance * (1 + mpr), 2)
    #     if payment > balance:
    #         total_cost += balance
    #     else:
    #         total_cost += payment
    #     balance -= payment

    # return {'savings' : round((total_cost - old_balance) - 
    #                                   (old_balance * transfer_fee), 2)}

    interest *= Decimal(0.01)
    transfer_fee *= Decimal(0.01)
    total_cost = 0
    day_counter = 0
    old_balance = balance
    dpr = interest / days_in_year  # daily periodic rate

    while balance > 0:
        day_counter += 1
        balance *= (1 + dpr)
        # check if a month has passed to pay
        if day_counter == billing_cycle:
            day_counter = 0
            if payment > balance:
                total_cost += balance
            else:
                total_cost += payment
            balance -= payment

    return {'savings' : Decimal(round((total_cost - old_balance) - 
                                      (old_balance * transfer_fee), 2))}

def calculate_paymentplan(debt_list: list, isSnowball: bool, payment: Decimal) -> dict:
    paid_debts = 0
    sorted_debts = []
    
    if isSnowball:
        # sorting debts greatest balance to smallest
        sorted_debts = sorted(debt_list, key=lambda x: x.balance, reverse=True)
    else:
        # sorting debts smallest interest to greatest
        sorted_debts = sorted(debt_list, key=lambda x: x.interest)

    debts_left = len(sorted_debts)

    # loop until we haven't paid all our debts
    while paid_debts < len(sorted_debts):
        print('yuh we got ' + str(debts_left) + ' debts left')

        monthly_payment = round(payment, 2)

        # loop through all unpaid debts
        for i in range(debts_left):
            # calculate balance w/ interest for that month
            debt = sorted_debts[i]
            interest = round(debt.interest * Decimal(0.01), 2)
            mpr = round(interest / months, 2)
            balance = round(debt.balance * (Decimal(1) + mpr), 2)
            debt.balance = balance
            print('yuh we payin debt ' + str(i) + 'its balance at ' + str(balance))

            # check if we're at last debt in list
            # (aka the one w/ smallest balance or highest interest)
            payment_amount = 0
            if i == (debts_left - 1):
                payment_amount = monthly_payment
            else:
                payment_amount = debt.min_payment

            # handle payment
            if balance > 0:
                if balance <= payment_amount:
                    debt.balance = 0
                    debt.total_cost += balance
                    monthly_payment -= balance
                else:
                    debt.balance -= payment_amount
                    debt.total_cost += payment_amount
                    monthly_payment -= payment_amount
                debt.total_months += 1
            
            # check if debt is paid off
            if debt.balance <= 0:
                debts_left -= 1
                paid_debts += 1

    return [debt.dict() for debt in sorted_debts]
