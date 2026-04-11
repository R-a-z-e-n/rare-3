import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

const verifyOtpSchema = z.object({
  phone: z.string().min(10),
  otp: z.string().length(6),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { phone, otp } = verifyOtpSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { phone_number: phone } });
    if (!user || !user.otp || !user.otp_expiry) {
      return res.status(401).json({ message: 'No OTP requested for this number' });
    }

    // Check expiry
    if (new Date() > new Date(user.otp_expiry)) {
      return res.status(401).json({ message: 'OTP has expired' });
    }

    // Check OTP
    if (user.otp !== otp) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }

    // Clear OTP after successful login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        otp: null,
        otp_expiry: null
      }
    });

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
    console.error('Detailed Verify OTP error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
