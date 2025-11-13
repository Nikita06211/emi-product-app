import express from "express";
import "reflect-metadata";
import { AppDataSource } from "./config/data-source";
import productRoutes from "./routes/productRoutes";
import emiRoutes from "./routes/emiRoutes";

const app = express();
app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected!");

    app.use("/api/products", productRoutes);
    app.use("/api/emi", emiRoutes);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("DB connection error:", err));
