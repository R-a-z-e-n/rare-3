import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { z } from 'zod';

const verifySchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = verifySchema.parse(req.body);

    const key_secret = process.env.RAZORPAY_KEY_SECRET || '';
    
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    
    const expectedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Here you would typically update your database to mark the booking/order as paid
      return res.status(200).json({ status: 'ok', message: 'Payment verified successfully' });
    } else {
      return res.status(400).json({ status: 'failure', message: 'Invalid signature' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid data', errors: error.errors });
    }
    console.error('Razorpay Signature Verification Error:', error);
    return res.status(500).json({ message: 'Error verifying payment' });
  }
}
