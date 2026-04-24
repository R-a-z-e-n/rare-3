import type { VercelRequest, VercelResponse } from '@vercel/node';
import Razorpay from 'razorpay';
import { z } from 'zod';

const orderSchema = z.object({
  amount: z.number().min(1),
  currency: z.string().default('INR'),
});

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { amount, currency } = orderSchema.parse(req.body);

    const options = {
      amount: Math.round(amount * 100), // convert to paise
      currency: currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json(order);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid data', errors: error.errors });
    }
    console.error('Razorpay Order Creation Error:', error);
    return res.status(500).json({ message: 'Error creating Razorpay order' });
  }
}
