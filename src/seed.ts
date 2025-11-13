import 'reflect-metadata';
import axios from 'axios';
import { AppDataSource } from './config/data-source';
import { Product } from './entity/Product';
import { EMIPlan } from './entity/EMIPlan';

const CATEGORIES = ['smartphones', 'beauty', 'fragrances', 'furniture', 'groceries'];

const seedDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected!');

    const productRepo = AppDataSource.getRepository(Product);
    const emiRepo = AppDataSource.getRepository(EMIPlan);


    for (const category of CATEGORIES) {
      console.log(`🌿 Fetching products for category: ${category}`);

      // DummyJSON supports filtering by category name
      const { data } = await axios.get(
        `https://dummyjson.com/products/category/${category}?limit=10`
      );

      for (const item of data.products) {
        const product = new Product();
        product.name = item.title;
        product.variant = item.brand || 'Standard';
        product.mrp = item.price + 2000;
        product.price = item.price;
        product.imageUrl = item.thumbnail;
        product.category = category;

        const savedProduct = await productRepo.save(product);

        // Add EMI plans for each product
        const plans = [
          { monthlyPayment: item.price / 3, tenureMonths: 3, interestRate: 0 },
          { monthlyPayment: item.price / 6, tenureMonths: 6, interestRate: 10.5, cashback: '₹500 cashback' },
        ];

        for (const p of plans) {
          const emi = new EMIPlan();
          emi.monthlyPayment = p.monthlyPayment;
          emi.tenureMonths = p.tenureMonths;
          emi.interestRate = p.interestRate;
          emi.cashback = p.cashback;
          emi.product = savedProduct;
          await emiRepo.save(emi);
        }
      }
    }

    console.log('🌱 Seeded 50 products (10 in each of 5 categories) successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
