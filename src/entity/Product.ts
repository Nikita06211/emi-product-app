import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { EMIPlan } from './EMIPlan';
import { Variant } from './Variant';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;
  
  @Column('decimal')
  mrp!: number;

  @Column('decimal')
  price!: number;

  @Column()
  imageUrl!: string;

  @Column()
  category!: string; 

  @OneToMany(() => EMIPlan, (plan) => plan.product)
  emiPlans!: EMIPlan[];

  @OneToMany(() => Variant, (variant) => variant.product, { cascade: true })
  variants!: Variant[];
}
