import { UserRole } from 'src/enum/role.enum';
import { OtpToken } from 'src/Module/auth/entities/otpToken.entity';
import { OrderLog } from 'src/Module/order-log/entities/order-log.entity';
import { Order } from 'src/Module/order/entities/order.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  employeeId: string;
  @Column()
  name: string;
  @Column()
  phone: string;
  @Column({ nullable: true })
  email: string;
  @Column({ nullable: true })
  PresentAddress: string;
  @Column({ nullable: true })
  PermanentAddress: string;
  @Column({ nullable: true })
  nationalId: string;
  @Column({ nullable: true })
  birthDate: Date;
  @Column({ nullable: true })
  gender: string;
  @Column({ nullable: true })
  bloodGroup: string;
  @Column({ nullable: true })
  dateOfJoining: Date;
  @Column({ nullable: true })
  department: string;
  @Column({ nullable: true })
  designation: string;
  @Column({ nullable: true })
  reportingManager: string;
  @Column({ nullable: true })
  employeeStatus: string;
  @Column({ nullable: true })
  employeeImage: string;
  @Column({ type: 'simple-array', nullable: true })
  employeeAvatar: string[];
  @Column()
  password: string;
  @Column()
  isActive: boolean;
  @Column({
    type: 'enum',
    enum: UserRole,
    //default: UserRole.Employee
  })
  role: UserRole;

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

  // @OneToMany(()=>OtpToken,(otpToken)=>otpToken.employee)
  // otpToken:OtpToken

  @OneToMany(() => Order, (order) => order.employee)
  order: Order[];

 
 @OneToMany(()=>OrderLog,(orderLog)=>orderLog.employee)
 orderLog:OrderLog



}
