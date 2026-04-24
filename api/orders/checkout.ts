import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const orderData = req.body;

    // In a real application, you would create an order in the database here
    // For now, we'll return a simulated success with a random order ID

    const orderId = `RARE-${Math.floor(1000 + Math.random() * 9000)}`;

    // Optional: Log the order or save to DB if schema exists
    console.log('Order received:', orderData);

    return res.status(200).json({
      success: true,
      orderId: orderId,
      message: 'Order processed successfully'
    });
  } catch (error) {
    console.error('Checkout Error:', error);
    return res.status(500).json({ message: 'Error processing order' });
  }
}
