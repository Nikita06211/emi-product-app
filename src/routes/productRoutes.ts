import { Router } from "express";
import {
    getAllProducts,
    getProductById,
    getProductsByCategory,
    getPaginatedProducts,
  } from "../controllers/productController";
  

const router = Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.get("/paginated", getPaginatedProducts);
router.get("/category/:category", getProductsByCategory);

export default router;
