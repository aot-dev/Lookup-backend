import { Injectable } from '@nestjs/common';
import axios from 'axios';
@Injectable()
export class LookupService {
  private readonly CACHE_TTL = 300000;
  private cache: Record<string, { data: any; timestamp: number }> = {};

  async lookup(query: string): Promise<any> {
    try {
      // Checking if ip/domain is cached
      if (query && this.cache[query] && this.isCacheValid(this.cache[query].timestamp)) {
        console.log('using cache data');
        return this.cache[query].data ;
      }
      console.log('No catch found, will call whois api');
      const response = await axios.get(
        `https://api.whois.vu/?q=${query}`,
      );
      this.cache[query] = { data: response.data.whois, timestamp: Date.now() };
      return response.data.whois;
    } catch (error) {
      console.error('Error occurred while fetching data:', error);
      return { success: false, message: 'Error fetching data, please try again later.' };
    }
  }
  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_TTL;
  }
}
