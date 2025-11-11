import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middlewares/auth';
import { config } from '../config/env';

// Detect pest from image
export const detectPest = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { cropAffected, imageUrl } = req.body;

    if (!cropAffected || !imageUrl) {
      return res.status(400).json({ error: 'Crop and image are required' });
    }

    // In production, call AI/ML service to detect pest
    // For now, return mock detection result
    if (config.nodeEnv === 'development' || !config.aiApiKey) {
      // Mock detection based on crop type
      const mockDetections: Record<string, any> = {
        olives: {
          pestName: 'Olive Fruit Fly',
          pestNameAr: 'ذبابة ثمار الزيتون',
          confidence: 0.87,
          severity: 'high',
          description: 'The olive fruit fly (Bactrocera oleae) is a serious pest of olives.',
          descriptionAr: 'ذبابة ثمار الزيتون هي آفة خطيرة للزيتون.',
          treatment: {
            organic: [
              'Use yellow sticky traps to monitor and reduce adult population',
              'Apply spinosad-based organic insecticides',
            ],
            chemical: [
              'Apply dimethoate or malathion according to label instructions',
            ],
            preventive: [
              'Maintain good orchard hygiene',
              'Remove fallen and damaged fruits',
            ],
          },
          estimatedLoss: '20-30% if untreated',
        },
        dates: {
          pestName: 'Red Palm Weevil',
          pestNameAr: 'سوسة النخيل الحمراء',
          confidence: 0.92,
          severity: 'critical',
          description: 'The red palm weevil is a devastating pest that can kill date palm trees.',
          descriptionAr: 'سوسة النخيل الحمراء هي آفة مدمرة يمكن أن تقتل أشجار النخيل.',
          treatment: {
            organic: ['Use pheromone traps', 'Apply entomopathogenic nematodes'],
            chemical: ['Apply systemic insecticides to trunk and crown'],
            preventive: ['Regular inspection of palms', 'Avoid mechanical damage to trunk'],
          },
          estimatedLoss: '50-100% if untreated (tree death)',
        },
        tomatoes: {
          pestName: 'Tomato Blight',
          pestNameAr: 'اللفحة المتأخرة للطماطم',
          confidence: 0.85,
          severity: 'high',
          description: 'Late blight is a fungal disease that causes dark spots on leaves and fruit.',
          descriptionAr: 'اللفحة المتأخرة هي مرض فطري يسبب بقع داكنة على الأوراق والثمار.',
          treatment: {
            organic: ['Apply copper-based fungicides', 'Improve air circulation'],
            chemical: ['Apply systemic fungicides preventively'],
            preventive: ['Use disease-resistant varieties', 'Practice crop rotation'],
          },
          estimatedLoss: '30-50% if untreated',
        },
      };

      const detection = mockDetections[cropAffected.toLowerCase()] || mockDetections.olives;

      // Save detection to database
      const pestDetection = await prisma.pestDetection.create({
        data: {
          farmerId: req.user.userId,
          cropAffected,
          imageUrl,
          pestName: detection.pestName,
          pestNameAr: detection.pestNameAr,
          confidence: detection.confidence,
          severity: detection.severity,
          description: detection.description,
          descriptionAr: detection.descriptionAr,
          treatment: detection.treatment,
          estimatedLoss: detection.estimatedLoss,
          expertVerified: false,
        },
      });

      return res.json({
        id: pestDetection.id,
        cropAffected: pestDetection.cropAffected,
        image: pestDetection.imageUrl,
        detectionResult: {
          pestName: pestDetection.pestName,
          pestNameAr: pestDetection.pestNameAr,
          confidence: pestDetection.confidence,
          severity: pestDetection.severity,
          description: pestDetection.description,
          descriptionAr: pestDetection.descriptionAr,
          treatment: pestDetection.treatment as any,
          estimatedLoss: pestDetection.estimatedLoss,
        },
        expertVerified: pestDetection.expertVerified,
        timestamp: pestDetection.createdAt,
      });
    }

    // Production: Call AI/ML API
    /*
    const aiResponse = await axios.post(`${config.aiApiUrl}/detect`, {
      image: imageUrl,
      crop: cropAffected,
      api_key: config.aiApiKey,
    });

    const detection = aiResponse.data;

    // Save to database
    const pestDetection = await prisma.pestDetection.create({
      data: {
        farmerId: req.user.userId,
        cropAffected,
        imageUrl,
        pestName: detection.pestName,
        pestNameAr: detection.pestNameAr,
        confidence: detection.confidence,
        severity: detection.severity,
        description: detection.description,
        descriptionAr: detection.descriptionAr,
        treatment: detection.treatment,
        estimatedLoss: detection.estimatedLoss,
        expertVerified: false,
      },
    });

    res.json(pestDetection);
    */
  } catch (error: any) {
    console.error('Detect pest error:', error);
    res.status(500).json({ error: 'Failed to detect pest' });
  }
};

// Get pest detection history
export const getPestDetections = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const detections = await prisma.pestDetection.findMany({
      where: { farmerId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.json(detections);
  } catch (error: any) {
    console.error('Get pest detections error:', error);
    res.status(500).json({ error: 'Failed to fetch pest detections' });
  }
};

