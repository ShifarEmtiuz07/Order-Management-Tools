import { IsNumber, IsString } from 'class-validator';
import { Product } from 'src/Module/products/entities/product.entity';

export class CreateOrderItemsDto {
  productCode: Product;
  @IsString()
  productNameEn: string;
  @IsString()
  productNameBn: string;
  @IsNumber()
  productQuantity: number;
}
