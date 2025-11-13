import { Router } from "express";
import { getEmiPlansByProduct } from "../controllers/emiController";

const router = Router();

router.get("/:productId", getEmiPlansByProduct);

export default router;
