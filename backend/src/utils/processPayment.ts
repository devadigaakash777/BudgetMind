import { handleTempWallet } from "../services/payment.service.js";
import { Wallet } from "../models/wallet.model.js";

export async function collectAmount(userId: string, sourceID: string, cost: number, savedAmount: number, preference: 'wishlist' | 'main' = 'main', reduceDailyBudget = false){
    let required = cost - savedAmount;
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) throw new Error(`Wallet not found for user ${userId}`);
      
    const tempWalletBudget = wallet.TemporaryWallet.balance;
    
    required = Math.max(required - tempWalletBudget, 0);
    console.log("required after deducting from temp wallet: ", required);
    for(let i=0; i<2 ; i++){
        if(required > 0){
            const newState = await handleTempWallet(userId, sourceID, required, preference, reduceDailyBudget);
            required -= (newState.amountCollected - newState.freedBudget);
            preference = (preference === 'main') ? 'wishlist' : 'main';
            console.warn("Required ",required);
        }
    }
    if(required > 0){
        throw new Error("Insufficient balance");
    }

    const remaining = Math.max(tempWalletBudget - (cost - savedAmount), 0);
    // wallet.TemporaryWallet.balance = remaining;
    // await wallet.save();
    console.log("updated value of temp wallet budget is ",remaining);
}