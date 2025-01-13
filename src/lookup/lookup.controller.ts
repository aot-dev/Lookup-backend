import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { LookupService } from './lookup.service';
import { LookupDto } from './lookup.dto';


@Controller('lookup')
export class LookupController {
  constructor(private readonly lookupService: LookupService) {}

  @Post()
  async lookup(@Body(ValidationPipe) lookupDto: LookupDto) {
    return this.lookupService.lookup(lookupDto.query);
  }
}


