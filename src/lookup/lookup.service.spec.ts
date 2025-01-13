import { Test, TestingModule } from '@nestjs/testing';
import { LookupService } from './lookup.service';
import axios from 'axios';

jest.mock('axios');

describe('LookupService', () => {
  let service: LookupService;
  const mockAxios = axios as jest.Mocked<typeof axios>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LookupService],
    }).compile();

    service = module.get<LookupService>(LookupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return cached data if available and valid', async () => {
    const cachedResponse = { whois: 'cached response data' };
    const timestamp = Date.now();
    service['cache']['test-query'] = { data: cachedResponse, timestamp };

    const result = await service.lookup('test-query');
    expect(result).toEqual({ success: true, data: cachedResponse });
  });

  it('should call axios if no cached data or cache is expired', async () => {
    const mockResponse = { data: { whois: 'fetched data' } };
    mockAxios.get.mockResolvedValue(mockResponse);

    const result = await service.lookup('new-query');
    expect(mockAxios.get).toHaveBeenCalledWith('https://api.whois.vu/?q=new-query');
    expect(result).toEqual(mockResponse.data.whois);
  });

  it('should cache the data after fetching from API', async () => {
    const mockResponse = { data: { whois: 'new data' } };
    mockAxios.get.mockResolvedValue(mockResponse); 

    const result = await service.lookup('new-query');
    expect(service['cache']['new-query']).toBeDefined();
    expect(service['cache']['new-query'].data).toEqual(mockResponse.data.whois);
  });

  it('should not return cached data if cache is expired', async () => {
    const expiredTimestamp = Date.now() - service['CACHE_TTL'] - 1;
    const cachedResponse = { whois: 'expired data' };
    service['cache']['expired-query'] = { data: cachedResponse, timestamp: expiredTimestamp };

    const mockResponse = { data: { whois: 'fetched data after expiration' } };
    mockAxios.get.mockResolvedValue(mockResponse);

    const result = await service.lookup('expired-query');
    expect(mockAxios.get).toHaveBeenCalledWith('https://api.whois.vu/?q=expired-query');
    expect(result).toEqual(mockResponse.data.whois);
  });
});
