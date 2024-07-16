import { Request, Response } from 'express';
import Product from '../models/Product.model';

export const createProduct = async (req: Request, res: Response) => {
  const product = new Product(req.body);
  const saveProduct = await product.save();

  res.status(201).json({ data: saveProduct });
};
export const getProducts = async (req: Request, res: Response) => {
  const products = await Product.findAll({
    order: [['price', 'DESC']],
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
  res.json({ data: products });
};
export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findByPk(id, {
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });

  if (!product) {
    return res.status(404).json({
      error: 'Producto no encontrado',
    });
  }
  res.json({ data: product });
};
export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findByPk(id);

  if (!product) {
    return res.status(404).json({
      error: 'Producto no encontrado',
    });
  }

  await product.update(req.body);
  await product.save();

  res.json({ data: product });
};
export const updateAvailability = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findByPk(id);

  if (!product) {
    return res.status(404).json({
      error: 'Producto no encontrado',
    });
  }

  product.availability = !product.dataValues.availability;
  await product.save();

  res.json({ data: product });
};
export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findByPk(id);

  if (!product) {
    return res.status(404).json({
      error: 'Producto no encontrado',
    });
  }

  await product.destroy();
  res.json({ data: 'Producto eliminado' });
};
