import { Product } from "src/Module/products/entities/product.entity";

export class CreateInventoryDto {
    
    productQuantity:number;

    productCode:Product;
}
