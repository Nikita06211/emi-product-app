import 'reflect-metadata';
import axios from 'axios';
import { AppDataSource } from './config/data-source';
import { Product } from './entity/Product';
import { EMIPlan } from './entity/EMIPlan';
import { Variant } from './entity/Variant';

const CATEGORIES = ['smartphones', 'beauty', 'fragrances', 'furniture', 'groceries'];

const seedDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected!');

    const productRepo = AppDataSource.getRepository(Product);
    const emiRepo = AppDataSource.getRepository(EMIPlan);
    const variantRepo = AppDataSource.getRepository(Variant);


    for (const category of CATEGORIES) {
      console.log(`🌿 Fetching products for category: ${category}`);

      // DummyJSON supports filtering by category name
      const { data } = await axios.get(
        `https://dummyjson.com/products/category/${category}?limit=10`
      );

      for (const item of data.products) {
        const product = new Product();
        product.name = item.title;
        product.mrp = item.price + 2000;
        product.price = item.price;
        product.images = item.images && item.images.length ? item.images : [item.thumbnail];
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

        // Create 2 relevant variants per product (smartphones get storage variants)
        const variantsToCreate: Array<Partial<Variant>> = [];

        if (category === 'smartphones') {
          variantsToCreate.push(
            { name: `${item.title} - 128GB`, price: item.price, attributes: { storage: '128GB' } },
            { name: `${item.title} - 256GB`, price: Number(item.price) + 8000, attributes: { storage: '256GB' } }
          );
        } else if (category === 'beauty' || category === 'fragrances') {
          variantsToCreate.push(
            { name: `${item.title} - 50ml`, price: item.price, attributes: { size: '50ml' } },
            { name: `${item.title} - 100ml`, price: Number(item.price) * 1.8, attributes: { size: '100ml' } }
          );
        } else if (category === 'furniture') {
          variantsToCreate.push(
            { name: `${item.title} - Standard`, price: item.price, attributes: { material: 'Standard' } },
            { name: `${item.title} - Premium`, price: Number(item.price) + 15000, attributes: { material: 'Premium' } }
          );
        } else if (category === 'groceries') {
          variantsToCreate.push(
            { name: `${item.title} - 500g`, price: item.price, attributes: { weight: '500g' } },
            { name: `${item.title} - 1kg`, price: Number(item.price) * 1.9, attributes: { weight: '1kg' } }
          );
        } else {
          variantsToCreate.push(
            { name: `${item.title} - Variant A`, price: item.price, attributes: { variant: 'A' } },
            { name: `${item.title} - Variant B`, price: Number(item.price) + 100, attributes: { variant: 'B' } }
          );
        }

        for (const v of variantsToCreate) {
          const variant = new Variant();
          variant.name = v.name as string;
          variant.price = Number(v.price);
          variant.attributes = v.attributes as Record<string, any>;
          variant.product = savedProduct;
          await variantRepo.save(variant);
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
