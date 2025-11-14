import { Request, Response } from "express";
import { ILike } from "typeorm";
import { productRepository } from "../repositories/productRepository";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await productRepository.find({ relations: ["emiPlans", "variants"] });
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
      relations: ["emiPlans", "variants"],
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
      relations: ["emiPlans", "variants"],
    });

    if (products.length === 0)
      return res.status(404).json({ message: "No products found in this category" });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching category products", error });
  }
};

export const getPaginatedProducts = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || "";
      const category = (req.query.category as string) || "";   // ⭐ category read here
      const sortBy = (req.query.sortBy as string) || "id";
      const sortOrder =
        (req.query.sortOrder as string)?.toUpperCase() === "DESC"
          ? "DESC"
          : "ASC";
  
      const skip = (page - 1) * limit;
  
      const where: any = {};
  
      if (search) {
        where.name = ILike(`%${search}%`);
      }
  
      if (category) {
        where.category = category; // ⭐ category filter applied
      }
  
      const [products, total] = await productRepository.findAndCount({
        where,
        relations: ["emiPlans", "variants"],
        take: limit,
        skip,
        order: { [sortBy]: sortOrder },
      });
  
      res.json({
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        sortBy,
        sortOrder,
        category,  // return category too
        data: products,
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching products", error });
    }
  };
  