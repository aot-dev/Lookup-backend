import { Module } from '@nestjs/common';
import { LookupService } from './lookup.service';
import { LookupController } from './lookup.controller';
import { HttpService } from '@nestjs/axios';


@Module({
  controllers: [LookupController],
  providers: [LookupService],
})
export class LookupModule {}
