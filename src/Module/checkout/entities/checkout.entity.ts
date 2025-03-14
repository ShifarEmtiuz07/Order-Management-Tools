import { Order } from 'src/Module/order/entities/order.entity';
import { Product } from 'src/Module/products/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Checkout {
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

  @Column({nullable:true})
  productCode: string;

  @Column({nullable:true})
  checkoutNumber: string;

  @Column()
  subTotal: number;

  @Column({ nullable: true })
  discount: number;

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
  updatedAt: Date;

  @ManyToOne(() => Product, (product) => product.orderItem)
  @JoinColumn({ name: 'product' })
  product: Product;

  @ManyToOne(() => Order, (order) => order.checkout)
  order: Order;
}
