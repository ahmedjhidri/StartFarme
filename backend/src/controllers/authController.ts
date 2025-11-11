import { Request, Response } from 'express';
import prisma from '../config/database';
import { sendOTP, verifyOTP, generateOTP } from '../services/sms';
import { generateToken, generateRefreshToken } from '../utils/jwt';
import { AuthRequest } from '../middlewares/auth';

// Send OTP
export const sendOTPHandler = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Validate phone number format (Tunisian format: +216XXXXXXXX)
    const phoneRegex = /^\+216[0-9]{8}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: 'Invalid phone number format. Use +216XXXXXXXX' });
    }

    // Generate OTP
    const code = generateOTP();

    // Send OTP via SMS
    const sent = await sendOTP(phone, code);

    if (!sent) {
      return res.status(500).json({ error: 'Failed to send OTP' });
    }

    res.json({
      success: true,
      message: 'OTP sent successfully',
    });
  } catch (error: any) {
    console.error('Send OTP error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Verify OTP and login/register
export const verifyOTPHandler = async (req: Request, res: Response) => {
  try {
    const { phone, code } = req.body;

    if (!phone || !code) {
      return res.status(400).json({ error: 'Phone number and code are required' });
    }

    // Verify OTP
    const isValid = await verifyOTP(phone, code);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid or expired OTP' });
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { phone },
      include: {
        farmer: true,
        buyer: true,
        expert: true,
      },
    });

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          phone,
          name: `User ${phone.substring(phone.length - 4)}`, // Default name
          role: 'FARMER',
          language: 'ar',
        },
        include: {
          farmer: true,
          buyer: true,
          expert: true,
        },
      });

      // Create farmer profile
      await prisma.farmer.create({
        data: {
          userId: user.id,
          subscriptionTier: 'FREE',
        },
      });
    } else {
      // Update last active
      await prisma.user.update({
        where: { id: user.id },
        data: { lastActive: new Date() },
      });
    }

    // Generate tokens
    const token = generateToken({
      userId: user.id,
      phone: user.phone,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      phone: user.phone,
      role: user.role,
    });

    // Return user data (without sensitive info)
    // Transform role from uppercase (FARMER) to lowercase (farmer) for frontend
    const userData = {
      id: user.id,
      role: user.role.toLowerCase() as 'farmer' | 'buyer' | 'expert' | 'admin',
      phone: user.phone,
      email: user.email,
      name: user.name,
      language: user.language as 'ar' | 'fr',
      farmLocation: user.farmer ? {
        governorate: user.farmer.governorate,
        delegation: user.farmer.delegation,
        coordinates: user.farmer.latitude && user.farmer.longitude ? {
          lat: user.farmer.latitude,
          lng: user.farmer.longitude,
        } : undefined,
      } : undefined,
      farmSize: user.farmer?.farmSize,
      crops: user.farmer?.crops || [],
      subscriptionTier: (user.farmer?.subscriptionTier || 'FREE').toLowerCase() as 'free' | 'premium',
    };

    res.json({
      success: true,
      token,
      refreshToken,
      user: userData,
    });
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get current user profile
export const getMeHandler = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: {
        farmer: true,
        buyer: true,
        expert: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = {
      id: user.id,
      role: user.role.toLowerCase() as 'farmer' | 'buyer' | 'expert' | 'admin',
      phone: user.phone,
      email: user.email,
      name: user.name,
      language: user.language as 'ar' | 'fr',
      farmLocation: user.farmer ? {
        governorate: user.farmer.governorate,
        delegation: user.farmer.delegation,
        coordinates: user.farmer.latitude && user.farmer.longitude ? {
          lat: user.farmer.latitude,
          lng: user.farmer.longitude,
        } : undefined,
      } : undefined,
      farmSize: user.farmer?.farmSize,
      crops: user.farmer?.crops || [],
      subscriptionTier: (user.farmer?.subscriptionTier || 'FREE').toLowerCase() as 'free' | 'premium',
      businessType: user.buyer?.businessType,
      purchaseCapacity: user.buyer?.purchaseCapacity,
    };

    res.json(userData);
  } catch (error: any) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update user profile
export const updateProfileHandler = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name, email, language, farmLocation, farmSize, crops } = req.body;

    // Update user
    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(language && { language }),
      },
      include: {
        farmer: true,
      },
    });

    // Update farmer profile if user is a farmer
    if (user.role === 'FARMER' && (farmLocation || farmSize || crops)) {
      await prisma.farmer.upsert({
        where: { userId: user.id },
        update: {
          ...(farmLocation?.governorate && { governorate: farmLocation.governorate }),
          ...(farmLocation?.delegation && { delegation: farmLocation.delegation }),
          ...(farmLocation?.coordinates?.lat && { latitude: farmLocation.coordinates.lat }),
          ...(farmLocation?.coordinates?.lng && { longitude: farmLocation.coordinates.lng }),
          ...(farmSize && { farmSize }),
          ...(crops && { crops }),
        },
        create: {
          userId: user.id,
          governorate: farmLocation?.governorate,
          delegation: farmLocation?.delegation,
          latitude: farmLocation?.coordinates?.lat,
          longitude: farmLocation?.coordinates?.lng,
          farmSize: farmSize || 0,
          crops: crops || [],
          subscriptionTier: 'FREE',
        },
      });
    }

    // Fetch updated user
    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        farmer: true,
        buyer: true,
        expert: true,
      },
    });

    const userData = {
      id: updatedUser!.id,
      role: updatedUser!.role.toLowerCase() as 'farmer' | 'buyer' | 'expert' | 'admin',
      phone: updatedUser!.phone,
      email: updatedUser!.email,
      name: updatedUser!.name,
      language: updatedUser!.language as 'ar' | 'fr',
      farmLocation: updatedUser!.farmer ? {
        governorate: updatedUser!.farmer.governorate,
        delegation: updatedUser!.farmer.delegation,
        coordinates: updatedUser!.farmer.latitude && updatedUser!.farmer.longitude ? {
          lat: updatedUser!.farmer.latitude,
          lng: updatedUser!.farmer.longitude,
        } : undefined,
      } : undefined,
      farmSize: updatedUser!.farmer?.farmSize,
      crops: updatedUser!.farmer?.crops || [],
      subscriptionTier: (updatedUser!.farmer?.subscriptionTier || 'FREE').toLowerCase() as 'free' | 'premium',
    };

    res.json(userData);
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

