// Uncomment the code below and write your tests
import axios from 'axios';
import { throttledGetDataFromApi } from './index';

const testURL = '/posts/1';
const baseURL = 'https://jsonplaceholder.typicode.com';
const mockData = {
  someField: 'someValue',
  otherField: 25,
};

jest.mock('axios');

describe('throttledGetDataFromApi', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should create instance with provided base url', async () => {
    (axios.create as jest.Mock).mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: mockData }),
    });

    await throttledGetDataFromApi(testURL);

    expect(axios.create).toHaveBeenCalledWith({ baseURL: baseURL });
  });

  test('should perform request to correct provided url', async () => {
    (axios.create as jest.Mock).mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: mockData }),
    });

    await throttledGetDataFromApi(testURL);

    jest.runAllTimers();

    const instance = axios.create();
    expect(instance.get).toHaveBeenCalledWith(testURL);
  });

  test('should return response data', async () => {
    (axios.create as jest.Mock).mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: mockData }),
    });

    const receivedData = await throttledGetDataFromApi(testURL);

    expect(receivedData).toBe(mockData);
  });
});
