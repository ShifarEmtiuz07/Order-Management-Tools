import { Module } from '@nestjs/common';
import { OrderLogService } from './order-log.service';
import { OrderLogController } from './order-log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderLog } from './entities/order-log.entity';

@Module({
  imports:[TypeOrmModule.forFeature([OrderLog])],
  controllers: [OrderLogController],
  providers: [OrderLogService],
})
export class OrderLogModule {}
