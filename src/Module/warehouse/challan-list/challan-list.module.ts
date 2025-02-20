import { Module } from '@nestjs/common';
import { ChallanListService } from './challan-list.service';
import { ChallanListController } from './challan-list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChallanList } from './entities/challan-list.entity';
import { Requisition } from '../requisition/entities/requisition.entity';
import { Order } from 'src/Module/order/entities/order.entity';
import { Checkout } from 'src/Module/checkout/entities/checkout.entity';
import { Inventory } from 'src/Module/inventory/entities/inventory.entity';

@Module({
  imports:[TypeOrmModule.forFeature([ChallanList,Requisition,Order,Checkout,Inventory])],
  controllers: [ChallanListController],
  providers: [ChallanListService],
})
export class ChallanListModule {}
