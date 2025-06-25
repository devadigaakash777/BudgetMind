export interface Wallet {
  balance: number;
}

export interface SteadyWallet extends Wallet {
  month: number;
  date: number;
  monthlyAmount: number;
}

export interface AmountHolder {
  amount: number;
}

export interface WalletState {
  MainWallet: Wallet;
  TemporaryWallet: Wallet;
  SteadyWallet: SteadyWallet;
  DailyBuffer: Wallet;
  TotalWealth: AmountHolder;
  PendingPayments: AmountHolder;
  threshold: number;
}
