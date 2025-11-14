import { Router } from "express";
import {
    getAllProducts,
    getProductById,
    getProductsByCategory,
    getPaginatedProducts,
  } from "../controllers/productController";
  

const router = Router();

router.get("/", getAllProducts);
router.get("/paginated", getPaginatedProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/:id", getProductById);

export default router;
