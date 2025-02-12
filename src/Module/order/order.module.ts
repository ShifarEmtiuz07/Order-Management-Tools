import { ProductsService } from './../products/products.service';
import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/orderItems.entity';
import { Product } from '../products/entities/product.entity';
import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';

@Module({
  imports:[TypeOrmModule.forFeature([Order,OrderItem,Product])],
  controllers: [OrderController,CheckoutController],
  providers: [OrderService,ProductsService,CheckoutService],
})
export class OrderModule {}
