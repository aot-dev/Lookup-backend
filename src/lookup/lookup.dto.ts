import { IsString, Matches } from 'class-validator';

export class LookupDto {
  @IsString()
  @Matches(/^(?:[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|(?:\d{1,3}\.){3}\d{1,3})$/, {
    message: 'Please provide a valid IP address or domain.',
  })
  query: string;
}