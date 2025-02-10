import { IsString } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsString()
  phone: string;
  @IsString()
  address: string;
  @IsString()
  shippingAddress: string;
  @IsString()
  customerType: string;
}
