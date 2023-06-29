// Uncomment the code below and write your tests
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import fs from 'fs';
import path from 'path';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();

    doStuffByTimeout(callback, 1000);
    jest.runAllTimers();

    expect(callback).toBeCalled();
  });

  test('should call callback only after timeout', async () => {
    const callback = jest.fn();

    doStuffByTimeout(callback, 1000);

    expect(callback).not.toBeCalled();

    jest.runAllTimers();

    expect(callback).toBeCalled();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    const interval = 1000;

    doStuffByInterval(callback, interval);

    expect(callback).toHaveBeenCalledTimes(0);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    const interval = 1000;
    const numIntervals = 5;

    doStuffByInterval(callback, interval);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(interval * numIntervals);

    expect(callback).toHaveBeenCalledTimes(numIntervals);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const pathToFile = path.join('jest.config.js');

    const existsSyncSpy = jest.spyOn(fs, 'existsSync');

    await readFileAsynchronously(pathToFile);

    expect(existsSyncSpy).toHaveBeenCalled();
  });

  test('should return null if file does not exist', async () => {
    const pathToFile = 'none.txt';

    const fileContent = await readFileAsynchronously(pathToFile);

    expect(fileContent).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const pathToFile = 'index.test.ts';

    const fileContent = await readFileAsynchronously(pathToFile);

    expect(fileContent).toBeTruthy();
  });
});
