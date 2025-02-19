import { Module } from '@nestjs/common';
import { RequisitionService } from './requisition.service';
import { RequisitionController } from './requisition.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Requisition } from './entities/requisition.entity';
import { Employee } from 'src/Module/employee/entities/employee.entity';
import { Order } from 'src/Module/order/entities/order.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Requisition,Employee,Order])],
  controllers: [RequisitionController],
  providers: [RequisitionService],
})
export class RequisitionModule {}
