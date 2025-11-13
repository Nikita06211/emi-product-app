import { Request, Response } from "express";
import { productRepository } from "../repositories/productRepository";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await productRepository.find({ relations: ["emiPlans"] });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await productRepository.findOne({
      where: { id: parseInt(id) },
      relations: ["emiPlans"],
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error });
  }
};

export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const products = await productRepository.find({
      where: { category },
      relations: ["emiPlans"],
    });

    if (products.length === 0)
      return res.status(404).json({ message: "No products found in this category" });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching category products", error });
  }
};
