import { Checkout } from 'src/Module/checkout/entities/checkout.entity';
import { Customer } from 'src/Module/customer/entities/customer.entity';
import { Employee } from 'src/Module/employee/entities/employee.entity';
import { OrderLog } from 'src/Module/order-log/entities/order-log.entity';
import { Transaction } from 'src/Module/transaction/entities/transaction.entity';
import { ChallanList } from 'src/Module/warehouse/challan-list/entities/challan-list.entity';
import { Requisition } from 'src/Module/warehouse/requisition/entities/requisition.entity';
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
  // @Column()
  // paidAmount: number;
  // @Column()
  // dueAmount: number;
  // @Column()
  // paymentStatus: string;
  @Column({ nullable: true })
  checkoutNumber: string;

  @Column({ nullable: true })
  orderNumber: string;
  // @Column()
  // orderCreatedBY: string;

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
  @JoinColumn({ name: 'customer', referencedColumnName: 'customerId' })
  customer: Customer;

  @OneToMany(() => Checkout, (checkout) => checkout.order)
  @JoinColumn({ name: 'checkoutItems' })
  checkout: Checkout[];

  @OneToMany(()=>Transaction,(transaction)=>transaction.order)
  transaction:Transaction[]

  @ManyToOne(()=>Requisition,(requisition)=>requisition.order)
  requisition:Requisition;

  @ManyToOne(()=>ChallanList,(challanList)=>challanList.order)
  challan:ChallanList;

  @OneToMany(()=>OrderLog,(orderLog)=>orderLog.order)
  orderLog:OrderLog

}
