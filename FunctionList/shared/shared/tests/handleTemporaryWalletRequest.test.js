import { handleTemporaryWalletRequest } from '../handlers/handleTemporaryWalletRequest.js';
import { globalState } from './globalState';

describe('handleTemporaryWalletRequest', () => {
  it('should return an object with amountCollected', () => {
    const result = handleTemporaryWalletRequest(globalState, 150000, 'main');
    expect(result).toHaveProperty('amountCollected');
  });
});
