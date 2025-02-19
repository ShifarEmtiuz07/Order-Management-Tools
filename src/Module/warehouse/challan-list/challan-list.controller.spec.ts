import { Test, TestingModule } from '@nestjs/testing';
import { ChallanListController } from './challan-list.controller';
import { ChallanListService } from './challan-list.service';

describe('ChallanListController', () => {
  let controller: ChallanListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChallanListController],
      providers: [ChallanListService],
    }).compile();

    controller = module.get<ChallanListController>(ChallanListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
