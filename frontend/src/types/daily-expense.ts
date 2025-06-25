export type AmountStatus = 'above' | 'equal' | 'below';

export interface DailyExpense {
  id: number;
  userId: number;
  amount: number;
  date: string;
  details: string;
  balance: number;
  amountStatus: AmountStatus;
  amountDifference: number;
}

export interface DailyExpenseState {
  data: DailyExpense[];
  page: number;
  rowsPerPage: number;
  selectedIds: number[];
  numberOfDays: number;
  totalAmount: number;
  canReduceBudget: boolean;
  source: 'wishlist' | 'main';
}
