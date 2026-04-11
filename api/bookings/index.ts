import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Simple auth middleware simulation for bookings
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });

  const token = authHeader.split(' ')[1];
  let userId = '';
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    userId = decoded.id;
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  if (req.method === 'GET') {
    try {
      const bookings = await prisma.booking.findMany({
        where: { userId },
        include: { service: true }
      });
      return res.status(200).json(bookings);
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { serviceId, date, notes } = req.body;
      const booking = await prisma.booking.create({
        data: {
          userId,
          serviceId,
          date: new Date(date),
          notes
        }
      });
      return res.status(201).json(booking);
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
