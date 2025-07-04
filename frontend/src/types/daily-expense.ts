export type AmountStatus = 'above' | 'equal' | 'below';

export interface DailyExpense {
  _id: string;
  userId: string;
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
  selectedIds: string[];
  numberOfDays: number;
  totalAmount: number;
  canReduceBudget: boolean;
  source: 'wishlist' | 'main';
}
