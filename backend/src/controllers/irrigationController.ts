import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middlewares/auth';

// Calculate irrigation needs
export const calculateIrrigation = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { cropType, fieldSize, soilType, lastIrrigationDate } = req.body;

    if (!cropType || !fieldSize || !soilType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Mock ETo (Reference Evapotranspiration) - in production, get from weather API
    const ETo = 5.0; // mm/day (average for Tunisia)

    // Crop coefficient (Kc) values
    const KcValues: Record<string, number> = {
      olives: 0.65,
      dates: 0.95,
      tomatoes: 1.15,
      wheat: 1.0,
      citrus: 1.05,
    };

    const Kc = KcValues[cropType.toLowerCase()] || 0.8;

    // Effective rainfall (mock - in production, get from weather data)
    const effectiveRainfall = 0; // mm

    // Calculate water needed (mm)
    const waterNeededMM = (ETo * Kc * parseFloat(fieldSize)) - effectiveRainfall;

    // Convert to liters (1 mm = 1 liter per square meter)
    const areaSquareMeters = parseFloat(fieldSize) * 10000; // hectares to square meters
    const waterNeededLiters = Math.max(0, waterNeededMM * areaSquareMeters);

    // Calculate timing
    const lastIrrigation = lastIrrigationDate ? new Date(lastIrrigationDate) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const daysSinceIrrigation = Math.floor((Date.now() - lastIrrigation.getTime()) / (24 * 60 * 60 * 1000));
    const recommendedTiming = daysSinceIrrigation > 7 ? 'immediate' : daysSinceIrrigation > 5 ? 'soon' : 'scheduled';
    const urgency = daysSinceIrrigation > 10 ? 'high' : daysSinceIrrigation > 7 ? 'medium' : 'low';

    // Best time of day for irrigation
    const bestTime = 'morning'; // or 'evening' based on crop and season

    // Save to irrigation history
    await prisma.irrigationHistory.create({
      data: {
        farmerId: req.user.userId,
        fieldSize: parseFloat(fieldSize),
        soilType,
        waterAmount: waterNeededLiters,
        timing: bestTime,
      },
    });

    res.json({
      waterNeeded: {
        liters: Math.round(waterNeededLiters),
        mm: Math.round(waterNeededMM * 100) / 100,
      },
      timing: {
        recommended: recommendedTiming,
        urgency,
        bestTime,
        daysSinceLastIrrigation: daysSinceIrrigation,
      },
      recommendations: [
        'Water in the morning to reduce evaporation',
        'Use drip irrigation for better efficiency',
        'Monitor soil moisture regularly',
      ],
    });
  } catch (error: any) {
    console.error('Calculate irrigation error:', error);
    res.status(500).json({ error: 'Failed to calculate irrigation' });
  }
};

// Get irrigation history
export const getIrrigationHistory = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const history = await prisma.irrigationHistory.findMany({
      where: { farmerId: req.user.userId },
      orderBy: { date: 'desc' },
      take: 50,
    });

    res.json(history);
  } catch (error: any) {
    console.error('Get irrigation history error:', error);
    res.status(500).json({ error: 'Failed to fetch irrigation history' });
  }
};

