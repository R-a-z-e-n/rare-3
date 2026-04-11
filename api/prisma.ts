import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
} else {
  // In production, we still want to reuse the client instance if the warm lambda is reused
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = prisma;
  }
}
