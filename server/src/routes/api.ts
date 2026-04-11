import { Router } from 'express';
import { authController, signupSchema, loginSchema, otpSchema, verifyOtpSchema } from '../controllers/authController';
import { productController } from '../controllers/productController';
import { serviceController } from '../controllers/serviceController';
import { bookingController, bookingSchema } from '../controllers/bookingController';
import { wishlistController, wishlistSchema } from '../controllers/wishlistController';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

// Auth Routes
router.post('/auth/signup', validate(signupSchema), authController.signup);
router.post('/auth/login', validate(loginSchema), authController.login);
router.post('/auth/send-otp', validate(otpSchema), authController.sendOtp);
router.post('/auth/verify-otp', validate(verifyOtpSchema), authController.verifyOtp);

// Product Routes
router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProductById);

// Service Routes
router.get('/services', serviceController.getServices);
router.get('/services/:id', serviceController.getServiceById);

// Booking Routes (Protected)
router.post('/bookings', authenticateToken, validate(bookingSchema), bookingController.createBooking);
router.get('/bookings', authenticateToken, bookingController.getBookings);

// Wishlist Routes (Protected)
router.post('/wishlist', authenticateToken, validate(wishlistSchema), wishlistController.addToWishlist);
router.delete('/wishlist/:productId', authenticateToken, wishlistController.removeFromWishlist);
router.get('/wishlist', authenticateToken, wishlistController.getWishlist);

export default router;
