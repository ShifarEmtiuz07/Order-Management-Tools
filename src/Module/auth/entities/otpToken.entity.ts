import { Employee } from 'src/Module/employee/entities/employee.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'otpToken' })
export class OtpToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  employeeId: string;

  @Column()
  otp: string;

  @Column()
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  // @ManyToOne(() => Employee, (employee) => employee.otpToken)
  // // @JoinColumn({ name: 'userId' }) // will be userId by default
  // employee: Employee;
}
