import { initializeState } from '../handlers/initializeState.js';
import { deepClone } from '../utils/deepClone.js';
import { globalState } from './globalState.js';

describe('initializeState', () => {
  let initialState;

  beforeEach(() => {
    initialState = deepClone(globalState);
    console.log(initialState);
  });

  test('should initialize state when totalWealth >= threshold and has salary', () => {
    initialState.User.hasSalary = true;

    const newState = initializeState(initialState, 10000, 2000);

    expect(newState.MainWallet.balance).toBe(2000);
    expect(newState.TemporaryWallet.balance).toBe(8000);
    expect(newState.SteadyWallet.balance).toBe(0);
    expect(newState.TotalWealth.amount).toBe(10000);
    expect(newState.threshold).toBe(2000);
  });

  test('should initialize state when totalWealth >= threshold and no salary with sufficient funds for steadyWallet', () => {
    initialState.User.hasSalary = false;
    initialState.SteadyWallet.monthlyAmount = 3000;
    initialState.SteadyWallet.month = 2; // Needs 6000

    const newState = initializeState(initialState, 10000, 2000);

    expect(newState.MainWallet.balance).toBe(2000);
    expect(newState.SteadyWallet.balance).toBe(6000);
    expect(newState.TemporaryWallet.balance).toBe(2000);
    expect(newState.TotalWealth.amount).toBe(10000);
    expect(newState.threshold).toBe(2000);
  });

  test('should return null when totalWealth >= threshold and no salary but insufficient funds for steadyWallet', () => {
    initialState.User.hasSalary = false;
    initialState.SteadyWallet.monthlyAmount = 5000;
    initialState.SteadyWallet.month = 3; // Needs 15000, which exceeds remaining

    const result = initializeState(initialState, 12000, 2000);

    expect(result).toBeNull();
  });

  test('should initialize state when totalWealth < threshold but has salary', () => {
    initialState.User.hasSalary = true;

    const newState = initializeState(initialState, 1500, 2000);

    expect(newState.MainWallet.balance).toBe(1500);
    expect(newState.TemporaryWallet.balance).toBe(0);
    expect(newState.SteadyWallet.balance).toBe(0);
    expect(newState.TotalWealth.amount).toBe(1500);
    expect(newState.threshold).toBe(2000);
  });

  test('should return null when totalWealth < threshold and no salary', () => {
    initialState.User.hasSalary = false;

    const result = initializeState(initialState, 1500, 2000);

    expect(result).toBeNull();
  });

});
