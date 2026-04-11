import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from './prisma';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    // Test DB connection
    await prisma.$connect();
    
    return res.status(200).json({
      status: 'ok',
      message: 'API and Database are connected',
      env: {
        has_db_url: !!process.env.DATABASE_URL,
        has_direct_url: !!process.env.DIRECT_URL,
        has_jwt_secret: !!process.env.JWT_SECRET,
        node_env: process.env.NODE_ENV
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message
    });
  }
}
