import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../prisma';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const services = await prisma.service.findMany();
      return res.status(200).json(services);
    } catch (error) {
      console.error('Error fetching services:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
