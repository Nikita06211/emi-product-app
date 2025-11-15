# EMI Product App

This repository contains a small Node.js + TypeScript service that stores products, their variants, and EMI plans using TypeORM and PostgreSQL.

**Quick scripts**
- Start dev server: `npm run dev`
- Seed DB: `npm run seed`
- Build: `npm run build`

**Environment**
- Provide `DATABASE_URL` in `.env` (Postgres connection string). Example:

```
DATABASE_URL="postgresql://user:pass@host:port/dbname?sslmode=require"
PORT=3001
```

Project uses TypeORM with `synchronize: true` in development (`src/config/data-source.ts`), so the schema will be created/updated automatically on startup.

**Database Schema (entities)**

- **Product**
  - `id` (PK, integer)
  - `name` (string)
  - `mrp` (decimal)
  - `price` (decimal)
  - `images` (string[]) — stored as `simple-json` in the DB, contains one or more image URLs
  - `category` (string)
  - `emiPlans` (OneToMany -> `EMIPlan`) — relation
  - `variants` (OneToMany -> `Variant`, cascade: true)

- **Variant**
  - `id` (PK, integer)
  - `name` (string) — human-friendly label (e.g., "Phone X - 128GB")
  - `price` (decimal) — variant-specific price
  - `attributes` (JSON) — flexible map for attributes such as `{ storage: '128GB' }` or `{ size: '100ml' }`
  - `product` (ManyToOne -> `Product`) — owning product, onDelete: CASCADE

- **EMIPlan**
  - `id` (PK, integer)
  - `monthlyPayment` (decimal)
  - `tenureMonths` (number)
  - `interestRate` (decimal)
  - `cashback` (string | nullable)
  - `product` (ManyToOne -> `Product`) — owning product, onDelete: CASCADE


**Seeding behavior (`src/seed.ts`)**

- The seeder initializes TypeORM then fetches products from `https://dummyjson.com/products/category/<category>?limit=10` for each of the categories configured in the seeder.
- Categories seeded by default: `['smartphones', 'beauty', 'fragrances', 'furniture', 'groceries']` (10 items per category → 50 products).
- For each fetched product:
  - A `Product` record is created with `name`, `mrp` (price + 2000), `price`, `images` (uses `item.images` array if present, otherwise falls back to `[item.thumbnail]`), and `category`.
  - Two `EMIPlan` records are created per product:
    1. 3-month plan (monthlyPayment: price/3, interestRate: 0)
    2. 6-month plan (monthlyPayment: price/6, interestRate: 10.5, cashback: '₹500 cashback')
  - Two `Variant` records are created per product with category-specific logic:
    - `smartphones`: creates `128GB` (base price) and `256GB` (+₹8000) variants with `attributes: { storage: '...' }`.
    - `beauty` / `fragrances`: `50ml` and `100ml` variants (price scaling applied).
    - `furniture`: `Standard` and `Premium` (premium adds a fixed amount).
    - `groceries`: `500g` and `1kg` (price scaling applied).
    - other categories: two generic variants `Variant A` and `Variant B`.

After seeding, each product will include `variants` and `emiPlans` relations when fetched via the product endpoints.

**Accessing data (API)**
- Product endpoints return `variants` and `emiPlans` in the JSON payload (see `src/controllers/productController.ts`).

Example product JSON snippet:

```json
{
  "id": 1,
  "name": "Phone X",
  "mrp": "42999",
  "price": "34999",
  "images": ["https://.../img1.jpg", "https://.../img2.jpg"],
  "category": "smartphones",
  "variants": [
    { "id": 11, "name": "Phone X - 128GB", "price": "34999", "attributes": { "storage": "128GB" } },
    { "id": 12, "name": "Phone X - 256GB", "price": "42999", "attributes": { "storage": "256GB" } }
  ],
  "emiPlans": [ ... ]
}
```