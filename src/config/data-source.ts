import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { Product } from '../entity/Product';
import { EMIPlan } from '../entity/EMIPlan';
import { Variant } from '../entity/Variant';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: [Product, EMIPlan, Variant],
});
