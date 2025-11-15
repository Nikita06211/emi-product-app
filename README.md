# EMI Product App

This repository contains a small Node.js + TypeScript service that stores products, their variants, and EMI plans using TypeORM and PostgreSQL.

**Quick scripts**
- Start dev server: `npm run dev`

# EMI Product App

This project is a minimal Node.js + TypeScript service that stores a product catalog (products, variants, images) and EMI plans using TypeORM and PostgreSQL.

Below is a concise reference you can follow to get the app running and to understand the API, tech stack, and DB schema.

I. Setup and run instructions
-----------------------------

1. Create a `.env` in the project root and provide a Postgres connection string. Example:

```
DATABASE_URL="postgresql://user:pass@host:port/dbname?sslmode=require"
PORT=3001
```

2. Install dependencies and build (PowerShell):

```powershell
npm install
npm run build
```

3. Seed the database (this fetches sample products from dummyjson and creates variants + EMI plans):

```powershell
npm run seed
```

4. Start the dev server:

```powershell
npm run dev
```

Notes:
- TypeORM is configured with `synchronize: true` in `src/config/data-source.ts` so the schema is created/updated automatically in development. For production, use migrations and set `synchronize` to `false`.

II. API endpoints and example responses
-------------------------------------

Base path: depends on `src/server.ts` (commonly `/api` or root). The product routes expose the following endpoints:

- `GET /products` — returns all products with `variants` and `emiPlans` relations.

Example response (single product object):

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
  "emiPlans": [
    { "id": 101, "monthlyPayment": "11666.3333", "tenureMonths": 3, "interestRate": "0", "cashback": null },
    { "id": 102, "monthlyPayment": "5833.1666", "tenureMonths": 6, "interestRate": "10.5", "cashback": "₹500 cashback" }
  ]
}
```

- `GET /products/paginated?page=1&limit=10&search=phone&category=smartphones&sortBy=id&sortOrder=ASC`
  - Returns a paginated list with `data` array containing products and metadata (`page`, `limit`, `total`, `totalPages`).

- `GET /products/category/:category` — returns products filtered by category (e.g., `/products/category/smartphones`).

- `GET /products/:id` — returns a single product by id, with `variants` and `emiPlans`.

EMI endpoints:

- `GET /emi/:productId` — returns the EMI plans that belong to the product with id `productId`.

Notes about responses
- `images` is an array of image URLs (stored as JSON in DB). `variants` is an array of variant objects. `emiPlans` is an array of EMI plan objects.

III. Tech stack used
---------------------

- Node.js + TypeScript
- Express for the HTTP API
- TypeORM for ORM and database schema management
- PostgreSQL as the primary database (configure via `DATABASE_URL`)
- Axios (used by the seeder to fetch sample data)

IV. Schema used
----------------

Entities and relations (summary):

- Product
  - `id: number` (PrimaryGeneratedColumn)
  - `name: string`
  - `mrp: decimal`
  - `price: decimal`
  - `images: string[]` (stored as `simple-json`)
  - `category: string`
  - `emiPlans: EMIPlan[]` (OneToMany)
  - `variants: Variant[]` (OneToMany, cascade: true)

- Variant
  - `id: number` (PrimaryGeneratedColumn)
  - `name: string` — human-friendly label (e.g., "Phone X - 128GB")
  - `price: decimal` — variant price
  - `attributes: Record<string, any>` — flexible JSON map (storage, size, material, weight, etc.)
  - `product: Product` (ManyToOne, onDelete: 'CASCADE')

- EMIPlan
  - `id: number` (PrimaryGeneratedColumn)
  - `monthlyPayment: decimal`
  - `tenureMonths: number`
  - `interestRate: decimal`
  - `cashback?: string`
  - `product: Product` (ManyToOne, onDelete: 'CASCADE')

Seeding details (default logic in `src/seed.ts`):

- Categories fetched: `['smartphones', 'beauty', 'fragrances', 'furniture', 'groceries']`.
- For each category the seeder fetches up to 10 products from `dummyjson`.
- Product creation:
  - `mrp` is set to `item.price + 2000`.
  - `price` is set to `item.price`.
  - `images` is set from `item.images` if present, otherwise `[item.thumbnail]`.
  - Two EMI plans are added per product (3-month and 6-month as described above).
  - Two `Variant` records are added per product with category-specific attributes:
    - `smartphones`: `128GB` and `256GB` (256GB adds +8000 to price).
    - `beauty`/`fragrances`: `50ml` and `100ml` variants.
    - `furniture`: `Standard` and `Premium` (premium adds a fixed amount).
    - `groceries`: `500g` and `1kg` variants.
    - fallback: `Variant A` and `Variant B`.

