import "reflect-metadata";
import { AppDataSource } from "./config/data-source";
import app from "./app"; 
import productRoutes from "./routes/productRoutes";
import emiRoutes from "./routes/emiRoutes";

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected!");

    app.use("/api/products", productRoutes);
    app.use("/api/emi", emiRoutes);

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("DB connection error:", err));
