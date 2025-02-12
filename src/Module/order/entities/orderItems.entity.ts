import { Product } from 'src/Module/products/entities/product.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;
//   @Column()
//   productId: string;
  @Column()
  productNameEn: string;
  @Column()
  productNameBn: string;
  @Column()
  productQuantity: number;

  @Column()
  orderNumber:string

  @Column()
  subTotal:number;

  @Column({nullable:true})
  discount:number;

  @ManyToOne(()=>Product,(product)=>product.orderItem)
  @JoinColumn({name:'productId',referencedColumnName:'productCode'})
  productCode:Product;
}
