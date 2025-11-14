import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './Product';

@Entity()
export class Variant {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column('decimal')
  price!: number;

  @Column('simple-json', { nullable: true })
  attributes?: Record<string, any>;

  @ManyToOne(() => Product, (product) => product.variants, { onDelete: 'CASCADE' })
  product!: Product;
}
