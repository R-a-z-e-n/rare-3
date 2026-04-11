import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { prisma } from '../prisma.js';
import { otpService } from '../utils/otp.js';

const otpSchema = z.object({
  phone: z.string().min(10),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { phone } = otpSchema.parse(req.body);

    let user = await prisma.user.findUnique({ where: { phone_number: phone } });
    
    // For this demo, we'll auto-create a user if they don't exist
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: 'Guest User',
          email: `${phone}@temp.rare.com`,
          phone_number: phone,
          role: 'user',
        }
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    await prisma.user.update({
      where: { id: user.id },
      data: {
        otp,
        otp_expiry: expiry
      }
    });

    // Send via dummy SMS service (no Twilio)
    await otpService.sendOTP(phone, otp);

    return res.status(200).json({ 
      message: 'OTP sent successfully (logged to console)',
      fallback: true
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid data', errors: error.errors });
    }
    console.error('Detailed Send OTP error:', error);
    return res.status(500).json({ message: 'Error sending OTP' });
  }
}
