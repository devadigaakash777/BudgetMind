import { handleFixedExpensePayment } from '../handlers/handleFixedExpensePayment.js';

describe('handleFixedExpensePayment', () => {
  it('should update state after payment', () => {
    const result = handleFixedExpensePayment(globalState, 1, 1000);
    expect(result).toBeDefined();
  });
});
