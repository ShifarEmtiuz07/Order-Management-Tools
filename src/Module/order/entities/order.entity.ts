import { Checkout } from 'src/Module/checkout/entities/checkout.entity';
import { Customer } from 'src/Module/customer/entities/customer.entity';
import { Employee } from 'src/Module/employee/entities/employee.entity';
import { OrderStatus } from 'src/utils/orderStatus.enum';
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

@Entity({ name: 'order' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  customerName: string;
  @Column()
  customerPhone: string;
  @Column()
  receiverName: string;
  @Column()
  receiverPhone: string;
  @Column()
  shippingArea: string;
  @Column()
  shippingDistrict: string;
  @Column()
  shippingThana: string;
  @Column()
  orderStatus: OrderStatus;
  @Column()
  deliveryDate: Date;
  @Column()
  totalOrderPrice: number;
  @Column()
  totalPurchesAmount: number;
  @Column()
  paidAmount:number;
  @Column()
  dueAmount:number;
  @Column()
  paymentStatus: string;

  @Column({nullable:true})
  orderNumber:string;
  // @Column()
  // orderCreatedBY: string;
  @Column({type:'simple-array', nullable:true})
  allProducts:string[];
  @Column()
  deliveryCharge: number;
  @Column({ nullable: true })
  courier: string;
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

  @ManyToOne(() => Employee, (employee) => employee.order)
  @JoinColumn({ name: 'employeeId', referencedColumnName: 'employeeId' })
  employee: Employee;

  // @OneToMany(()=>Product,(product)=>product.order)
  // @JoinColumn({name:'products',referencedColumnName:'productCode'})
  // product:Product[]

  @ManyToOne(() => Customer, (customer) => customer.order)
  @JoinColumn({ name: 'customerId', referencedColumnName: 'customerId' })
  customerId: Customer;

  @OneToOne(() => Checkout, (checkout) => checkout.order)
  @JoinColumn({ name: 'orderitems'})
  checkout: Checkout[];
}
