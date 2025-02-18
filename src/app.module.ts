import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './DB-Connection/database.module';
import { EmployeeModule } from './Module/employee/employee.module';
import { CategoryModule } from './Module/category/category.module';
import { ProductsModule } from './Module/products/products.module';
import { InventoryModule } from './Module/inventory/inventory.module';
import { CustomerModule } from './Module/customer/customer.module';
import { OrderModule } from './Module/order/order.module';
import { CheckoutModule } from './Module/checkout/checkout.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as  redisStore  from 'cache-manager-redis-store';
import { TransactionModule } from './Module/transaction/transaction.module';

@Module({
  imports: [
    CacheModule.register({
      max:1000,
      ttl:60000,
      isGlobal:true,
      store:redisStore,
      host:'localhost',
      port:6379

    }),

    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    EmployeeModule,
    CategoryModule,
    ProductsModule,
    InventoryModule,
    CustomerModule,
    OrderModule,
    CheckoutModule,
    TransactionModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
