import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middlewares/auth';

// Get all crops for a farmer
export const getCrops = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const crops = await prisma.crop.findMany({
      where: { farmerId: req.user.userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(crops);
  } catch (error: any) {
    console.error('Get crops error:', error);
    res.status(500).json({ error: 'Failed to fetch crops' });
  }
};

// Get single crop
export const getCrop = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    const crop = await prisma.crop.findFirst({
      where: {
        id,
        farmerId: req.user.userId,
      },
    });

    if (!crop) {
      return res.status(404).json({ error: 'Crop not found' });
    }

    res.json(crop);
  } catch (error: any) {
    console.error('Get crop error:', error);
    res.status(500).json({ error: 'Failed to fetch crop' });
  }
};

// Create crop
export const createCrop = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { cropName, cropNameAr, variety, plantingDate, harvestDate, fieldSize, status } = req.body;

    if (!cropName || !plantingDate || !harvestDate || !fieldSize) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const crop = await prisma.crop.create({
      data: {
        farmerId: req.user.userId,
        cropName,
        cropNameAr: cropNameAr || cropName,
        variety,
        plantingDate: new Date(plantingDate),
        harvestDate: new Date(harvestDate),
        fieldSize: parseFloat(fieldSize),
        status: status || 'PLANNING',
      },
    });

    res.status(201).json(crop);
  } catch (error: any) {
    console.error('Create crop error:', error);
    res.status(500).json({ error: 'Failed to create crop' });
  }
};

// Update crop
export const updateCrop = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const { cropName, cropNameAr, variety, plantingDate, harvestDate, fieldSize, status } = req.body;

    // Check if crop exists and belongs to user
    const existingCrop = await prisma.crop.findFirst({
      where: {
        id,
        farmerId: req.user.userId,
      },
    });

    if (!existingCrop) {
      return res.status(404).json({ error: 'Crop not found' });
    }

    const crop = await prisma.crop.update({
      where: { id },
      data: {
        ...(cropName && { cropName }),
        ...(cropNameAr && { cropNameAr }),
        ...(variety && { variety }),
        ...(plantingDate && { plantingDate: new Date(plantingDate) }),
        ...(harvestDate && { harvestDate: new Date(harvestDate) }),
        ...(fieldSize && { fieldSize: parseFloat(fieldSize) }),
        ...(status && { status }),
      },
    });

    res.json(crop);
  } catch (error: any) {
    console.error('Update crop error:', error);
    res.status(500).json({ error: 'Failed to update crop' });
  }
};

// Delete crop
export const deleteCrop = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    // Check if crop exists and belongs to user
    const existingCrop = await prisma.crop.findFirst({
      where: {
        id,
        farmerId: req.user.userId,
      },
    });

    if (!existingCrop) {
      return res.status(404).json({ error: 'Crop not found' });
    }

    await prisma.crop.delete({
      where: { id },
    });

    res.json({ success: true, message: 'Crop deleted successfully' });
  } catch (error: any) {
    console.error('Delete crop error:', error);
    res.status(500).json({ error: 'Failed to delete crop' });
  }
};

// Get crop calendar
export const getCropCalendar = async (req: Request, res: Response) => {
  try {
    const { crop, region } = req.query;

    // Return mock calendar data
    // In production, this would come from a database or agricultural data source
    const calendar = {
      crop: crop || 'olives',
      region: region || 'Tunis',
      tasks: [
        {
          month: 'January',
          tasks: ['Pruning', 'Fertilizer application'],
        },
        {
          month: 'February',
          tasks: ['Soil preparation', 'Planting'],
        },
      ],
    };

    res.json(calendar);
  } catch (error: any) {
    console.error('Get calendar error:', error);
    res.status(500).json({ error: 'Failed to fetch calendar' });
  }
};

