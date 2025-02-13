import { ProductsService } from './../products/products.service';
import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';

import { Product } from '../products/entities/product.entity';
import { Checkout } from '../checkout/entities/checkout.entity';
import { CheckoutService } from '../checkout/checkout.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Product,Checkout])],
  controllers: [OrderController],
  providers: [OrderService, ProductsService,CheckoutService],
})
export class OrderModule {}
