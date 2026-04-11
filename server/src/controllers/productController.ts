import { Request, Response } from 'express';
import { productModel } from '../models/productModel';

export const productController = {
  getProducts: async (req: Request, res: Response) => {
    const { category } = req.query;
    try {
      const products = await productModel.list(category as string);
      res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Error fetching products' });
    }
  },

  getProductById: async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const product = await productModel.findById(Number(id));
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json(product);
    } catch (error) {
      console.error('Error fetching product by id:', error);
      res.status(500).json({ message: 'Error fetching product' });
    }
  },

  createProduct: async (req: Request, res: Response) => {
    try {
      const product = await productModel.create(req.body);
      res.status(201).json(product);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ message: 'Error creating product' });
    }
  }
};
