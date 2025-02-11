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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    EmployeeModule,
    CategoryModule,
    ProductsModule,
    InventoryModule,
    CustomerModule,
    OrderModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
