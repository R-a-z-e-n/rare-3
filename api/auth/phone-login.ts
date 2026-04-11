import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

const phoneLoginSchema = z.object({
  phone: z.string().min(10),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { phone } = phoneLoginSchema.parse(req.body);

    // Find or create user by phone number
    let user = await prisma.user.findUnique({ where: { phone_number: phone } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: 'Guest User',
          email: `${phone.replace(/\+/g, '')}@rare-wellness.com`,
          phone_number: phone,
          role: 'user',
        }
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
        membership: user.membership,
        points: user.points,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid data', errors: error.errors });
    }
    console.error('Phone login error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
