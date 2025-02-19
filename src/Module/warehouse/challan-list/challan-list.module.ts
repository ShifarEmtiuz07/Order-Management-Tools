import { Module } from '@nestjs/common';
import { ChallanListService } from './challan-list.service';
import { ChallanListController } from './challan-list.controller';

@Module({
  controllers: [ChallanListController],
  providers: [ChallanListService],
})
export class ChallanListModule {}
