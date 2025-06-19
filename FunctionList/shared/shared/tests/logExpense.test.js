import { logExpense } from '../handlers/logExpense.js';

describe('logExpense', () => {
  it('should log an expense and update state', () => {
    const expense = { amount: 200, type: 'daily' };
    const updatedState = logExpense(globalState, expense, new Date());
    expect(updatedState).toBeDefined();
  });
});
