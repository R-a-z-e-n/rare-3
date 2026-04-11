import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { wishlistModel } from '../models/wishlistModel';
import { z } from 'zod';

export const wishlistSchema = z.object({
  body: z.object({
    productId: z.number(),
  }),
});

export const wishlistController = {
  addToWishlist: async (req: AuthRequest, res: Response) => {
    const { productId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const wishlistItem = await wishlistModel.add(userId, productId);
      res.status(201).json({
        message: wishlistItem.existing ? 'Item already in wishlist' : 'Item added to wishlist',
        wishlistItem,
      });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      res.status(500).json({ message: 'Error adding to wishlist' });
    }
  },

  removeFromWishlist: async (req: AuthRequest, res: Response) => {
    const { productId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      await wishlistModel.remove(userId, Number(productId));
      res.status(200).json({ message: 'Item removed from wishlist' });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      res.status(500).json({ message: 'Error removing from wishlist' });
    }
  },

  getWishlist: async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const wishlist = await wishlistModel.listByUserId(userId);
      res.status(200).json(wishlist);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      res.status(500).json({ message: 'Error fetching wishlist' });
    }
  }
};
