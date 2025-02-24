import { Employee } from "src/Module/employee/entities/employee.entity";
import { Order } from "src/Module/order/entities/order.entity";
import { OrderStatus } from "src/utils/orderStatus.enum";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name:'orderLog'})
export class OrderLog {

    @PrimaryGeneratedColumn()
    id:number;
    @Column()
    orderNumber:string;
    @Column({nullable:true})
    log:string;
    @Column({nullable:true})
    orderStatus:OrderStatus

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

    @ManyToOne(()=>Employee,(employee)=>employee.orderLog)
    employee:Employee;

    @ManyToOne(()=>Order,(order)=>order.orderLog)
    order:Order;






}
