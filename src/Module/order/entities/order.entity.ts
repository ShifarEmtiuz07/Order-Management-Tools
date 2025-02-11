import { Customer } from 'src/Module/customer/entities/customer.entity';
import { Employee } from 'src/Module/employee/entities/employee.entity';
import { Product } from 'src/Module/products/entities/product.entity';
import { OrderStatus } from 'src/utils/orderStatus.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'order' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  orderNumber: string;
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
  paymentStatus: string;
  @Column()
  orderCreatedBY: string;
  @Column()
  deliveryCharge: string;
  @Column({nullable:true})
  courier:string;
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

  @ManyToOne(()=>Employee,(employee)=>employee.order)
  @JoinColumn({name:'employeeId',referencedColumnName:'employeeId'})
  employee:Employee;

  @OneToMany(()=>Product,(product)=>product.order)
  @JoinColumn({name:'products',referencedColumnName:'productCode'})
  product:Product[]

  @ManyToOne(()=>Customer,(customer)=>customer.order)
  @JoinColumn({name:'customerId',referencedColumnName:'customerId'})
  customerId:Customer;



}
