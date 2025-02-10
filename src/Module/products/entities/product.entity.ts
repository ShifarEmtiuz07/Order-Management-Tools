import { Category } from 'src/Module/category/entities/category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  nameEn: string;
  @Column()
  nameBn: string;
  @Column()
  slug: string;
  @Column()
  packSize: string;
  @Column({unique:true})
  productCode: string;
  @Column()
  price: number;
  @Column()
  discount: number;
  @Column()
  discountType: string;
  @Column()
  searchTag: string;
  @Column()
  productStatus: boolean;
  @Column({nullable:true})
  productImage: string;

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

  @ManyToOne(()=>Category,(category)=>category.productCode)
  @JoinColumn({name:'categoryId'})
  category:Category;

}
