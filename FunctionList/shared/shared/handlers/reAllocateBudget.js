import { getDaysRemaining } from '../utils/dateUtils.js';
import { getNextSalaryDateISO } from '../utils/convertToDate.js';
import { smartBudget } from '../services/smartBudget.js';
import { deepClone } from '../utils/deepClone.js';

export function reAllocateBudget(state, hasBudgetPaid) {
    console.debug('reAllocate called with:', state, hasBudgetPaid);
    const newState = deepClone(state);

    const usableBudget = newState.MonthlyBudget.amount + newState.TemporaryWallet.balance;
    console.debug('reAllocate usableBudget:', usableBudget);
    newState.TemporaryWallet.balance = 0;
    let salaryDay = newState.User.hasSalary ? newState.User.salary.date : newState.steadyWallet.date;
    if(hasBudgetPaid){
        salaryDay -= 1;
    }
    const salaryDate = getNextSalaryDateISO(salaryDay);
    console.debug('[reAllocate] salaryDate:', salaryDate);
    const daysLeft = getDaysRemaining(salaryDate);
    console.debug('[reAllocate] daysLeft:', daysLeft);
    let result;
    try{
        console.debug('[reAllocate] try called:');
        result = smartBudget(newState, usableBudget, daysLeft);
    }
    catch{
        newState.DailyBudget.min = 0;
        newState.DailyBudget.max = Math.floor(usableBudget / daysLeft);
        console.debug('[reAllocate] catch called:');
        result = smartBudget(newState, usableBudget, daysLeft);
    }
    newState.TemporaryWallet.balance = result.remaining;
    newState.MonthlyBudget.amount = result.monthlyBudget;
    newState.MonthlyBudget.amountFunded = result.monthlyBudget;
    console.log("[reAllocate] MonthlyBudget: ", result.monthlyBudget);
    console.log("[reAllocate] TemporaryWallet: ", result.remaining);
    return newState;
}
