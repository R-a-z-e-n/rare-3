import db from '../config/database';

export interface Product {
  id: string | number;
  brand: string;
  name: string;
  image: string;
  price: number;
  category: string;
  rating: number;
  description: string;
  ingredients: string;
  usage: string;
  stock: number;
}

export const productModel = {
  list: async (category?: string): Promise<Product[]> => {
    let stmt;
    if (category) {
      stmt = db.prepare('SELECT * FROM products WHERE category = ?');
      return stmt.all(category) as Product[];
    } else {
      stmt = db.prepare('SELECT * FROM products');
      return stmt.all() as Product[];
    }
  },

  findById: async (id: string | number): Promise<Product | undefined> => {
    const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
    const product = stmt.get(id) as Product | undefined;
    return product;
  },

  create: async (product: Partial<Product>): Promise<Product> => {
    const { brand, name, image, price, category, rating = 0, description, ingredients, usage, stock = 100 } = product;

    const stmt = db.prepare(`
      INSERT INTO products (brand, name, image, price, category, rating, description, ingredients, usage, stock)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(brand, name, image, price, category, rating, description, ingredients, usage, stock);

    return { ...product, id: result.lastInsertRowid } as Product;
  },

  updateStock: async (id: string | number, quantity: number) => {
    const stmt = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');
    stmt.run(quantity, id);
  }
};
