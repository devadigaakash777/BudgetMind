import { handleTempWallet } from "../services/payment.service.js";
import { Wallet } from "../models/wallet.model.js";
import { getDaysSinceLastExpense } from "./expensePending.js";

export async function collectAmount(userId: string, sourceID: string, cost: number, savedAmount: number, preference: 'wishlist' | 'main' = 'main', reduceDailyBudget = false){
    let required = cost - savedAmount;
    console.log(cost," and ", savedAmount);
    const wallet = await Wallet.findOne({ userId });
    // const todayDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    // const existingExpenses = await DailyExpense.findOne({ userId, date: todayDate });

    // const hasBudgetPaid = existingExpenses ? true : false; 

    const daysBetween = await getDaysSinceLastExpense(userId) || 0;

    if (!wallet) throw new Error(`Wallet not found for user ${userId}`);
      
    const tempWalletBudget = wallet.TemporaryWallet.balance;
    
    required = Math.max(required - tempWalletBudget, 0);
    console.log("required after deducting from temp wallet: ", required);

    const newState = await handleTempWallet(userId, sourceID, required, preference, reduceDailyBudget, true, daysBetween);

    const updatedWallet = await Wallet.findOne({ userId });
    if (!updatedWallet) throw new Error(`Wallet not found for user ${userId}`);
    const updatedTempWallet = updatedWallet.TemporaryWallet.balance;

    console.log("updatedTempWallet is ",updatedTempWallet);

    if(updatedTempWallet < (cost - savedAmount)) throw new Error("Insufficient balance");

    const remaining = Math.max(updatedTempWallet - (cost - savedAmount), 0);
    console.log("remaining ",remaining," after calculating updatedTempWallet - (cost - savedAmount) ", updatedTempWallet - (cost - savedAmount));

    updatedWallet.TemporaryWallet.balance = remaining;
    updatedWallet.markModified('TemporaryWallet');
    await updatedWallet.save();
    console.log("updated value of temp wallet budget is ",remaining);
}