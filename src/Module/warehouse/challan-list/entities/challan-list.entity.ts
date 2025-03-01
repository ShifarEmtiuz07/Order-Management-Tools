import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Requisition } from "../../requisition/entities/requisition.entity";
import { Order } from "src/Module/order/entities/order.entity";

@Entity()
export class ChallanList {
    @PrimaryGeneratedColumn()
    id:number;
    @Column()
    challanNo:string;
    @Column({nullable:true})
    employeeId: string;
    @Column()
    requisitionNumber:string;
    @Column({nullable:true})
    dispatchhub:string;

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

    @OneToMany(()=>Requisition,(requisition)=>requisition.challan)
    requisition:Requisition[];

    
    @OneToMany(()=>Order,(order)=>order.challan)
    order:Order[];


}
