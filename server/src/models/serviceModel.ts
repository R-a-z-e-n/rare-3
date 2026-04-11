import db from '../config/database';

export interface Service {
  id: string | number;
  name: string;
  location?: string;
  address?: string;
  image?: string;
  tags?: string;
  price?: string;
  rating?: number;
  category?: string;
}

export const serviceModel = {
  list: async (category?: string): Promise<Service[]> => {
    let stmt;
    if (category) {
      stmt = db.prepare('SELECT * FROM services WHERE category = ?');
      return stmt.all(category) as Service[];
    } else {
      stmt = db.prepare('SELECT * FROM services');
      return stmt.all() as Service[];
    }
  },

  findById: async (id: string | number): Promise<Service | undefined> => {
    const stmt = db.prepare('SELECT * FROM services WHERE id = ?');
    const service = stmt.get(id) as Service | undefined;
    return service;
  },

  create: async (service: Partial<Service>): Promise<Service> => {
    const { name, location, address, image, tags, price, rating, category } = service;

    const stmt = db.prepare(`
      INSERT INTO services (name, location, address, image, tags, price, rating, category)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(name, location, address, image, tags, price, rating, category);

    return { ...service, id: result.lastInsertRowid } as Service;
  }
};
