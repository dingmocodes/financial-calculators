from decimal import Decimal

# assumptions:
min_percentage = Decimal(0.025)  # somewhere in the range of 0.01 - 0.04
billing_cycle = Decimal(30)
days_in_year = Decimal(365)  # could be 360
months = Decimal(12)

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
    mpr = interest / 12

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

    # while balance > 0:
    #     balance *= (1 + mpr)
    #     if payment > balance:
    #         total_cost += balance
    #     else:
    #         total_cost += payment
    #     balance -= payment
    #     total_months += 1



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

    transfer_cost = old_balance * transfer_fee

    return {'savings' : Decimal(round((total_cost - old_balance) - transfer_cost, 2)),
            'monthly_payment' : Decimal(round((old_balance + transfer_cost) / 12, 2))}

def calculate_paymentplan(debt_list: list, isSnowball: bool, payment: Decimal) -> dict:
    paid_debts = 0
    payment_amount = 0
    day_counter = 0
    sorted_debts = []
    
    # sorted so that the last element is the target for extra payments
    if isSnowball:  # sorting debts greatest balance to smallest
        sorted_debts = sorted(debt_list, key=lambda x: x.balance, reverse=True)
    else:  # sorting debts smallest interest to greatest
        sorted_debts = sorted(debt_list, key=lambda x: x.interest)

    debts_left = len(sorted_debts)

    # loop until we haven't paid all our debts
    while paid_debts < len(sorted_debts):
        # print('we have paid ' + str(paid_debts) + ' debts')

        monthly_payment = round(payment, 2)
        day_counter += 1

        # loop through all unpaid debts
        for i in range(debts_left):
            debt = sorted_debts[i]

            # handle payment
            if debt.balance > 0:
                print('this debt ' + str(i) + ' still has ' + str(debt.balance) + ' left')

                # tack on daily interest
                interest = debt.interest * Decimal(0.01)
                dpr = interest / days_in_year
                debt.balance *= (Decimal(1) + dpr)

                if day_counter == billing_cycle:

                    # check if we're at last debt in list
                    # (aka the one w/ smallest balance or highest interest)
                    if i == (debts_left - 1):
                        payment_amount = monthly_payment
                        # since we're paying off last debt of cycle, reset the counter
                        # day_counter = 0
                    else:
                        payment_amount = debt.min_payment
                        
                    # payment is either the remaining balance or the monthly payment
                    payment_amount = min(payment_amount, debt.balance)
                    debt.balance -= payment_amount
                    debt.total_cost += payment_amount
                    monthly_payment -= payment_amount
                    debt.total_months += 1

            # check if debt is paid off
            if debt.balance <= 0 and debt.total_months > 0:
                debts_left -= 1
                paid_debts += 1
                if isSnowball:  # sorting debts greatest balance to smallest
                    sorted_debts = sorted(debt_list, key=lambda x: x.balance, reverse=True)
                else:  # sorting debts smallest interest to greatest
                    sorted_debts = sorted(debt_list, key=lambda x: x.interest)

        if day_counter == billing_cycle:
            day_counter = 0
    
    print('finna return something')
    return [debt.dict() for debt in sorted_debts]
