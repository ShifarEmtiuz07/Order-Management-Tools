import { Module } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';
import { Order } from '../order/entities/order.entity';

import { OrderService } from '../order/order.service';
import { ProductsService } from '../products/products.service';
import { Checkout } from './entities/checkout.entity';
import { Customer } from '../customer/entities/customer.entity';
import { Employee } from '../employee/entities/employee.entity';
import { OrderLog } from '../order-log/entities/order-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      Checkout,
      Product,
      Customer,
      Employee,
      OrderLog,
    ]),
  ],
  controllers: [CheckoutController],
  providers: [CheckoutService, OrderService, ProductsService],
})
export class CheckoutModule {}
