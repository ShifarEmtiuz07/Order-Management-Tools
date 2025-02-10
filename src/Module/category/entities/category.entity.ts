import { Product } from 'src/Module/products/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'category' })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  nameBn: string;
  @Column({ nullable: true })
  nameEn: string;
  @Column({ nullable: true })
  slug: string;
  @Column({ nullable: true })
  categoryImage: string;
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



  @OneToMany(() => Product, (product) => product.category, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({referencedColumnName: 'productCode'})
  productCode: Product[];
}
