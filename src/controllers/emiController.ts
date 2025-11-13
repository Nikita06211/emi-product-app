import { Request, Response } from "express";
import { emiRepository } from "../repositories/emiRepository";

export const getEmiPlansByProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const emiPlans = await emiRepository.find({
      where: { product: { id: parseInt(productId) } },
    });
    res.json(emiPlans);
  } catch (error) {
    res.status(500).json({ message: "Error fetching EMI plans", error });
  }
};
