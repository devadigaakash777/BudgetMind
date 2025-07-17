import { getDaysRemaining } from '../utils/dateUtils.js';
import { getNextSalaryDateISO } from '../utils/convertToDate.js';
import { smartBudget } from '../services/smartBudget.js';
import { deepClone } from '../utils/deepClone.js';

export function reAllocateBudget(state, unpaidDays) {
    console.debug('reAllocate called with:', state, unpaidDays);
    const newState = deepClone(state);

    const usableBudget = newState.MonthlyBudget.amount + newState.TemporaryWallet.balance;
    console.debug('reAllocate usableBudget:', usableBudget);
    newState.TemporaryWallet.balance = 0;
    let salaryDay = newState.User.hasSalary ? newState.User.salary.date : newState.steadyWallet.date;
    salaryDay -= 1;

    const salaryDate = getNextSalaryDateISO(salaryDay);
    console.debug('[reAllocate] salaryDate:', salaryDate);
    const daysLeft = getDaysRemaining(salaryDate) + unpaidDays;
    if(daysLeft === 0) throw new Error("No days left to allocate budget.")
    console.debug('[reAllocate] daysLeft:', daysLeft);
    const predefinedBudget = newState.DailyBudget.setAmount;
    console.debug('[reAllocate] predefined Budget:', predefinedBudget);

    let remaining;
    let monthlyBudget;
    let result;
    try{
        console.debug('[reAllocate] try called:');
        if(predefinedBudget === 0){
            result = smartBudget(newState, usableBudget, daysLeft);
            remaining = result.remaining;
            monthlyBudget = result.monthlyBudget;
        }
        else{
            monthlyBudget = predefinedBudget * daysLeft;
            console.debug('[reAllocate] monthlyBudget: ',monthlyBudget,' and usable budget ',usableBudget);
            if(monthlyBudget <= usableBudget){
                newState.DailyBudget.amount = predefinedBudget;
                remaining = usableBudget - monthlyBudget;
            }
            else{
                throw new Error("unable to set budget, try by decreasing min and max");
            }
        }
    }
    catch{
        newState.DailyBudget.min = 0;
        newState.DailyBudget.max = Math.floor(usableBudget / daysLeft);
        console.debug('[reAllocate] catch called:');
        result = smartBudget(newState, usableBudget, daysLeft);
        remaining = result.remaining;
        monthlyBudget = result.monthlyBudget;
    }
    newState.TemporaryWallet.balance = remaining;
    newState.MonthlyBudget.amount = monthlyBudget;
    newState.MonthlyBudget.amountFunded = monthlyBudget;
    console.log("[reAllocate] MonthlyBudget: ", monthlyBudget);
    console.log("[reAllocate] TemporaryWallet: ", remaining);
    return newState;
}
