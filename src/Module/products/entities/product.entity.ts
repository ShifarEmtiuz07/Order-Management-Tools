import { Category } from 'src/Module/category/entities/category.entity';
import { Checkout } from 'src/Module/checkout/entities/checkout.entity';
import { Inventory } from 'src/Module/inventory/entities/inventory.entity';
import { Order } from 'src/Module/order/entities/order.entity';



import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({nullable:true})
  productNameEn: string;
  @Column({nullable:true})
  productNameBn: string;
  @Column({nullable:true})
  productSlug: string;
  @Column()
  packSize: string;
  @Column({ unique: true })
  productCode: string;
  @Column()
  price: number;
  @Column({nullable:true})
  discount: number;
  @Column({nullable:true})
  discountType: string;
  @Column()
  searchTag: string;
  @Column()
  productStatus: boolean;
  @Column({ nullable: true })
  productImage: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updateAt: Date;

  @ManyToOne(() => Category, (category) => category.productCode)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @OneToOne(() => Inventory, (inventory) => inventory.productItemCode)
  inventory: Inventory;
  
  // @ManyToOne(()=>Order,(order)=>order.product)
  // order:Order

  @OneToMany(()=>Checkout,(checkout)=>checkout.product)
  orderItem:Checkout[];

}
