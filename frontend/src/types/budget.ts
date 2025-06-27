export interface Expense {
  id: string;
  billName: string;
  status: 'pending' | 'paid' | 'expired';
  dueDate: number;
  isPaid: boolean;
  amount: number;
  isPermanent: boolean;
  isFunded: boolean;
  durationInMonths: number;
  amountToFund: number;
}

export interface FixedExpensesState {
  expenses: Expense[];
  rowsPerPage: number;
  totalSavedAmount: number;
}

export interface BudgetState {
  MonthlyBudget: {
    amount: number;
  };
  DailyBudget: {
    amount: number;
    min: number;
    max: number;
  };
  FixedExpenses: FixedExpensesState;
}
