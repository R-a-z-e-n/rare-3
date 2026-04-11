import db from '../config/database';
import { randomUUID } from 'crypto';

export interface Booking {
  id: string;
  userId: string;
  serviceId: string | number;
  date: string;
  status: string;
  createdAt: string;
}

export const bookingModel = {
  create: async (booking: Partial<Booking>): Promise<Booking> => {
    const id = randomUUID();
    const { userId, serviceId, date, status = 'pending' } = booking;

    const stmt = db.prepare(`
      INSERT INTO bookings (id, userId, serviceId, date, status)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(id, userId, String(serviceId), date, status);

    return {
      id,
      userId,
      serviceId,
      date,
      status,
      createdAt: new Date().toISOString()
    } as Booking;
  },

  listByUserId: async (userId: string) => {
    const stmt = db.prepare(`
      SELECT b.*, s.name as serviceName, s.image as serviceImage, s.location as serviceLocation
      FROM bookings b
      LEFT JOIN services s ON b.serviceId = s.id
      WHERE b.userId = ?
      ORDER BY b.createdAt DESC
    `);
    
    const bookings = stmt.all(userId);
    return bookings;
  },

  updateStatus: async (id: string, status: string) => {
    const stmt = db.prepare('UPDATE bookings SET status = ? WHERE id = ?');
    stmt.run(status, id);
  }
};
