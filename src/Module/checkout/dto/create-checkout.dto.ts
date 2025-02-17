import { IsNumber, IsString } from 'class-validator';
import { Product } from 'src/Module/products/entities/product.entity';
export class CreateCheckoutDto {
  product: Product;
  @IsString()
  productNameEn: string;
  @IsString()
  productNameBn: string;
  @IsNumber()
  productQuantity: number;
  @IsString()
  productCode: string;
}
