import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './Product';

@Entity()
export class EMIPlan {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('decimal')
  monthlyPayment!: number;

  @Column()
  tenureMonths!: number;

  @Column('decimal')
  interestRate!: number;

  @Column({ nullable: true })
  cashback?: string;

  @ManyToOne(() => Product, (product) => product.emiPlans, { onDelete: 'CASCADE' })
  product!: Product;
}
