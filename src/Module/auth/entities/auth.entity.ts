import { IsNotEmpty } from 'class-validator';
import { Role } from 'src/utils/role.enum';

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'auth' })
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  userName: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @Column({
    
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  role: Role;
}
