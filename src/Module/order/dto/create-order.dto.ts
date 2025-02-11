import { IsString } from 'class-validator';
import { Customer } from 'src/Module/customer/entities/customer.entity';
import { Employee } from 'src/Module/employee/entities/employee.entity';
import { Product } from 'src/Module/products/entities/product.entity';
import { OrderStatus } from 'src/utils/orderStatus.enum';

export class CreateOrderDto {
  // @IsString()
  // orderNumber: string;
  @IsString()
  customerId: Customer;
  @IsString()
  customerName: string;
  @IsString()
  customerPhone: string;
  @IsString()
  receiverName: string;
  @IsString()
  receiverPhone: string;
  @IsString()
  shippingArea: string;
  @IsString()
  shippingDistrict: string;
  @IsString()
  shippingThana: string;
  @IsString()
  orderStatus: OrderStatus;
  // @IsString()
  // deliveryDate: Date;
  @IsString()
  paymentStatus: string;
  @IsString()
  employee: Employee;
  @IsString()
  deliveryCharge: number;
  @IsString()
  product: Product[];
}
