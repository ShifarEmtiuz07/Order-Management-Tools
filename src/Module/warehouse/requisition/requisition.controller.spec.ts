import { Test, TestingModule } from '@nestjs/testing';
import { RequisitionController } from './requisition.controller';
import { RequisitionService } from './requisition.service';

describe('RequisitionController', () => {
  let controller: RequisitionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequisitionController],
      providers: [RequisitionService],
    }).compile();

    controller = module.get<RequisitionController>(RequisitionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
