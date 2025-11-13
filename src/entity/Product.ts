import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { EMIPlan } from './EMIPlan';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  variant!: string;

  @Column('decimal')
  mrp!: number;

  @Column('decimal')
  price!: number;

  @Column()
  imageUrl!: string;

  @OneToMany(() => EMIPlan, (plan) => plan.product)
  emiPlans!: EMIPlan[];
}
