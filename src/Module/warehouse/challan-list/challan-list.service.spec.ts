import { Test, TestingModule } from '@nestjs/testing';
import { ChallanListService } from './challan-list.service';

describe('ChallanListService', () => {
  let service: ChallanListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChallanListService],
    }).compile();

    service = module.get<ChallanListService>(ChallanListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
