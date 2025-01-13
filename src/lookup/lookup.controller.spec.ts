import { Test, TestingModule } from '@nestjs/testing';
import { LookupController } from './lookup.controller';
import { LookupService } from './lookup.service';
import { LookupDto } from './lookup.dto';

describe('LookupController', () => {
  let controller: LookupController;
  let service: LookupService;
  const mockServiceData = {
    name:'Dev',
    country: 'India',
    role:'developer'
    
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LookupController],
      providers: [
        {
          provide: LookupService,
          useValue: {
            lookup: jest.fn().mockResolvedValue(mockServiceData),
          },
        },
      ],
    }).compile();

    controller = module.get<LookupController>(LookupController);
    service = module.get<LookupService>(LookupService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call lookupService.lookup and return the mocked response', async () => {
    const lookupDto: LookupDto = { query: 'dev.profile.com' }; 
    const result = await controller.lookup(lookupDto);

    expect(service.lookup).toHaveBeenCalledWith(lookupDto.query); 
    expect(result).toBe(mockServiceData); 
  });
});
