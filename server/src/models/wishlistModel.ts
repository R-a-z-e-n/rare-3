import db from '../config/database';

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string | number;
  createdAt: string;
}

export const wishlistModel = {
  add: async (userId: string, productId: string | number) => {
    const id = `${userId}_${productId}`; // Stable ID to avoid duplicates
    
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO wishlist (id, userId, productId)
      VALUES (?, ?, ?)
    `);

    const result = stmt.run(id, userId, productId);
    
    if (result.changes === 0) {
      return { id, userId, productId, existing: true };
    }

    return { id, userId, productId, existing: false };
  },

  remove: async (userId: string, productId: string | number) => {
    const id = `${userId}_${productId}`;
    const stmt = db.prepare('DELETE FROM wishlist WHERE id = ?');
    stmt.run(id);
  },

  listByUserId: async (userId: string) => {
    const stmt = db.prepare(`
      SELECT w.*, p.name as productName, p.brand as productBrand, p.price as productPrice, p.image as productImage
      FROM wishlist w
      LEFT JOIN products p ON w.productId = p.id
      WHERE w.userId = ?
      ORDER BY w.createdAt DESC
    `);
    
    const items = stmt.all(userId);
    return items;
  }
};
