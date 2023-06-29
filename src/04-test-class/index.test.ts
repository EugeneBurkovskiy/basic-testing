// Uncomment the code below and write your tests
import { getBankAccount, BankAccount, SynchronizationFailedError } from '.';

const balance = 236;
describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const account = getBankAccount(balance);
    expect(account).toBeInstanceOf(BankAccount);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const withdraw = () => getBankAccount(balance).withdraw(300);
    expect(withdraw).toThrowError(
      `Insufficient funds: cannot withdraw more than ${balance}`,
    );
  });

  test('should throw error when transferring more than balance', () => {
    const account2 = getBankAccount(400);
    const transfer = () => getBankAccount(balance).transfer(300, account2);
    expect(transfer).toThrowError(
      `Insufficient funds: cannot withdraw more than ${balance}`,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const account = getBankAccount(balance);
    const transfer = () => account.transfer(300, account);
    expect(transfer).toThrowError('Transfer failed');
  });

  test('should deposit money', () => {
    const account = getBankAccount(balance);
    account.deposit(balance);
    const result = account.getBalance();
    expect(result).toBe(balance * 2);
  });

  test('should withdraw money', () => {
    const account = getBankAccount(balance);
    account.withdraw(balance);
    const result = account.getBalance();
    expect(result).toBe(0);
  });

  test('should transfer money', () => {
    const account1 = getBankAccount(balance);
    const account2 = getBankAccount(0);
    account1.transfer(balance, account2);
    const result = account2.getBalance();
    expect(result).toBe(balance);
  });

  test('should return number in case if request did not fail', async () => {
    const account = new BankAccount(balance);
    const result = await account.fetchBalance();
    if (result) {
      expect(typeof result).toBe('number');
    }
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const initialBalance = balance;
    const newBalance = balance * 2;

    const account = getBankAccount(initialBalance);

    jest.spyOn(account, 'fetchBalance').mockResolvedValueOnce(newBalance);

    await account.synchronizeBalance();

    expect(account.getBalance()).toEqual(newBalance);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const account = getBankAccount(balance);

    jest.spyOn(account, 'fetchBalance').mockResolvedValueOnce(null);

    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
