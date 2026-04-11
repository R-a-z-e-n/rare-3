import db from '../config/database';
import { randomUUID } from 'crypto';

export interface User {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  password?: string;
  role: string;
  membership: string;
  points: number;
  otp?: string;
  otp_expiry?: string;
  createdAt: string;
}

export const userModel = {
  create: async (user: Partial<User>): Promise<User> => {
    const id = user.id || randomUUID();
    const { name, email, phone_number, password, role = 'user', membership = 'Classic', points = 0 } = user;

    const stmt = db.prepare(`
      INSERT INTO users (id, name, email, phone_number, password, role, membership, points)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, name, email, phone_number || null, password || null, role, membership, points);

    return {
      id,
      name,
      email,
      phone_number,
      password,
      role,
      membership,
      points,
      createdAt: new Date().toISOString()
    } as User;
  },

  findByEmail: async (email: string): Promise<User | undefined> => {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = stmt.get(email) as User | undefined;
    return user;
  },

  findByPhoneNumber: async (phone_number: string): Promise<User | undefined> => {
    const stmt = db.prepare('SELECT * FROM users WHERE phone_number = ?');
    const user = stmt.get(phone_number) as User | undefined;
    return user;
  },

  findById: async (id: string): Promise<User | undefined> => {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    const user = stmt.get(id) as User | undefined;
    return user;
  },

  updatePoints: async (id: string, points: number) => {
    const stmt = db.prepare('UPDATE users SET points = points + ? WHERE id = ?');
    stmt.run(points, id);
  },

  updateOTP: async (id: string, otp: string, expiry: Date) => {
    const stmt = db.prepare('UPDATE users SET otp = ?, otp_expiry = ? WHERE id = ?');
    stmt.run(otp, expiry.toISOString(), id);
  }
};
