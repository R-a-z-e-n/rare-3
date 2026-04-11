import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userModel } from '../models/userModel';
import { z } from 'zod';
import { smsService } from '../services/smsService';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

export const signupSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    phone_number: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

export const otpSchema = z.object({
  body: z.object({
    phone: z.string().min(10),
  }),
});

export const verifyOtpSchema = z.object({
  body: z.object({
    phone: z.string().min(10),
    otp: z.string().length(6),
  }),
});

export const authController = {
  signup: async (req: Request, res: Response) => {
    const { name, email, password, phone_number } = req.body;

    try {
      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await userModel.create({
        name,
        email,
        password: hashedPassword,
        phone_number,
      });

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'User created successfully',
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
      console.error('Signup error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const user = await userModel.findByEmail(email);
      if (!user || !user.password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(200).json({
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
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  sendOtp: async (req: Request, res: Response) => {
    const { phone } = req.body;

    try {
      let user = await userModel.findByPhoneNumber(phone);
      
      // For this demo, we'll auto-create a user if they don't exist
      if (!user) {
        user = await userModel.create({
          name: 'Guest User',
          email: `${phone}@temp.rare.com`,
          phone_number: phone,
          role: 'user',
        });
      }

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

      await userModel.updateOTP(user.id, otp, expiry);

      // Send via real SMS
      const sent = await smsService.sendOTP(phone, otp);

      res.status(200).json({ 
        message: 'OTP sent successfully',
        fallback: !sent // Tell frontend if it was logged to console
      });
    } catch (error) {
      console.error('Detailed Send OTP error:', error);
      res.status(500).json({ message: 'Error sending OTP' });
    }
  },

  verifyOtp: async (req: Request, res: Response) => {
    const { phone, otp } = req.body;

    try {
      const user = await userModel.findByPhoneNumber(phone);
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
      await userModel.updateOTP(user.id, '', new Date(0));

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(200).json({
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
      console.error('Detailed Verify OTP error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
};
