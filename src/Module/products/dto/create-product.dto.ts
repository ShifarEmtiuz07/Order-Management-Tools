import { Category } from './../../category/entities/category.entity';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  productNameEn: string;
  @IsString()
  nameBn: string;
  @IsString()
  slug: string;
  @IsString()
  packSize: string;
  @IsString()
  productCode: string;
  @IsNumber()
  price: number;
  @IsNumber()
  discount: number;
  @IsString()
  discountType: string;
  @IsString()
  searchTag: string;
  @IsBoolean()
  productStatus: boolean;
  @IsString()
  productImage: string;

  category: Category;
}
