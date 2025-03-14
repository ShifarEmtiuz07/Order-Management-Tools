import { Order } from "src/Module/order/entities/order.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ChallanList } from "../../challan-list/entities/challan-list.entity";

@Entity({name:'requisitions'})
export class Requisition {

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    requisitionNumber:string;

    @Column({ nullable: true })
    orderNumber: string;


    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
      })
      public created_at: Date;
    
      @UpdateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
      })
      public updated_at: Date;


      @OneToMany(()=>Order,(order)=>order.requisition)
      order:Order[];

      @ManyToOne(()=>ChallanList,(challanList)=>challanList.requisition)
      challan:ChallanList;
      
  



}
