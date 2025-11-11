// Mock pest detection data - returns different results based on crop type
// In production, this would call an actual AI/ML model API

import type { PestDetection } from '../types';

interface MockPestData {
  pestName: string;
  pestNameAr: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  descriptionAr: string;
  treatment: {
    organic: string[];
    chemical: string[];
    preventive: string[];
  };
  estimatedLoss: string;
}

const PEST_DATABASE: Record<string, MockPestData[]> = {
  olives: [
    {
      pestName: 'Olive Fruit Fly',
      pestNameAr: 'ذبابة ثمار الزيتون',
      confidence: 0.87,
      severity: 'high',
      description: 'The olive fruit fly (Bactrocera oleae) is a serious pest of olives. It lays eggs in the fruit, and the larvae feed on the pulp.',
      descriptionAr: 'ذبابة ثمار الزيتون هي آفة خطيرة للزيتون. تضع البيض في الثمار، وتتغذى اليرقات على اللب.',
      treatment: {
        organic: [
          'Use yellow sticky traps to monitor and reduce adult population',
          'Apply spinosad-based organic insecticides',
          'Harvest early to reduce damage',
        ],
        chemical: [
          'Apply dimethoate or malathion according to label instructions',
          'Time applications to target adult flies before egg laying',
          'Rotate insecticides to prevent resistance',
        ],
        preventive: [
          'Maintain good orchard hygiene',
          'Remove fallen and damaged fruits',
          'Use fine mesh netting for small trees',
        ],
      },
      estimatedLoss: '20-30% if untreated',
    },
    {
      pestName: 'Olive Scale',
      pestNameAr: 'حشرة القشرة الزيتونية',
      confidence: 0.75,
      severity: 'medium',
      description: 'Olive scale insects suck sap from leaves and branches, causing yellowing and reduced growth.',
      descriptionAr: 'حشرات القشرة تمتص العصارة من الأوراق والفروع، مما يسبب الاصفرار وتقليل النمو.',
      treatment: {
        organic: [
          'Introduce natural predators like ladybugs',
          'Apply horticultural oil in dormant season',
          'Prune heavily infested branches',
        ],
        chemical: [
          'Apply systemic insecticides in early spring',
          'Use contact insecticides for severe infestations',
        ],
        preventive: [
          'Regular monitoring of trees',
          'Maintain tree health through proper fertilization',
          'Avoid over-fertilization with nitrogen',
        ],
      },
      estimatedLoss: '10-15% if untreated',
    },
  ],
  dates: [
    {
      pestName: 'Red Palm Weevil',
      pestNameAr: 'سوسة النخيل الحمراء',
      confidence: 0.92,
      severity: 'critical',
      description: 'The red palm weevil is a devastating pest that can kill date palm trees. Larvae bore into the trunk.',
      descriptionAr: 'سوسة النخيل الحمراء هي آفة مدمرة يمكن أن تقتل أشجار النخيل. تحفر اليرقات في الجذع.',
      treatment: {
        organic: [
          'Use pheromone traps to monitor and reduce population',
          'Apply entomopathogenic nematodes',
          'Remove and destroy infected trees immediately',
        ],
        chemical: [
          'Apply systemic insecticides to trunk and crown',
          'Inject insecticides directly into trunk',
          'Use contact insecticides for adult weevils',
        ],
        preventive: [
          'Regular inspection of palms',
          'Avoid mechanical damage to trunk',
          'Maintain good sanitation',
        ],
      },
      estimatedLoss: '50-100% if untreated (tree death)',
    },
    {
      pestName: 'Date Moth',
      pestNameAr: 'عثة التمر',
      confidence: 0.80,
      severity: 'high',
      description: 'Date moth larvae feed on date fruits, causing direct damage and facilitating fungal infections.',
      descriptionAr: 'تتغذى يرقات عثة التمر على ثمار التمر، مما يسبب أضراراً مباشرة ويسهل الإصابة بالفطريات.',
      treatment: {
        organic: [
          'Use light traps to catch adult moths',
          'Apply Bacillus thuringiensis (Bt)',
          'Bag individual fruit bunches',
        ],
        chemical: [
          'Apply insecticides during flowering',
          'Use pheromone-based mating disruption',
        ],
        preventive: [
          'Harvest dates promptly when ripe',
          'Remove fallen and damaged fruits',
          'Maintain orchard cleanliness',
        ],
      },
      estimatedLoss: '15-25% if untreated',
    },
  ],
  tomatoes: [
    {
      pestName: 'Tomato Blight',
      pestNameAr: 'اللفحة المتأخرة للطماطم',
      confidence: 0.85,
      severity: 'high',
      description: 'Late blight is a fungal disease that causes dark spots on leaves and fruit, leading to rapid plant death.',
      descriptionAr: 'اللفحة المتأخرة هي مرض فطري يسبب بقع داكنة على الأوراق والثمار، مما يؤدي إلى موت النبات بسرعة.',
      treatment: {
        organic: [
          'Apply copper-based fungicides',
          'Improve air circulation by spacing plants',
          'Water at base of plants, not on leaves',
        ],
        chemical: [
          'Apply systemic fungicides preventively',
          'Use fungicides with different modes of action',
          'Rotate fungicides to prevent resistance',
        ],
        preventive: [
          'Use disease-resistant varieties',
          'Avoid overhead watering',
          'Remove and destroy infected plants',
          'Practice crop rotation',
        ],
      },
      estimatedLoss: '30-50% if untreated',
    },
    {
      pestName: 'Tomato Hornworm',
      pestNameAr: 'دودة قرن الطماطم',
      confidence: 0.78,
      severity: 'medium',
      description: 'Large green caterpillars that feed on tomato leaves and fruits, causing significant defoliation.',
      descriptionAr: 'يرقات خضراء كبيرة تتغذى على أوراق وثمار الطماطم، مما يسبب تساقطاً كبيراً للأوراق.',
      treatment: {
        organic: [
          'Hand-pick caterpillars from plants',
          'Introduce beneficial insects like parasitic wasps',
          'Apply Bacillus thuringiensis (Bt)',
        ],
        chemical: [
          'Apply spinosad-based insecticides',
          'Use pyrethrin-based products',
        ],
        preventive: [
          'Regular inspection of plants',
          'Remove weeds that host the pest',
          'Use floating row covers',
        ],
      },
      estimatedLoss: '10-20% if untreated',
    },
  ],
  wheat: [
    {
      pestName: 'Wheat Rust',
      pestNameAr: 'صدأ القمح',
      confidence: 0.90,
      severity: 'high',
      description: 'Wheat rust is a fungal disease that appears as reddish-brown pustules on leaves and stems, reducing yield significantly.',
      descriptionAr: 'صدأ القمح هو مرض فطري يظهر على شكل بثور بنية محمرة على الأوراق والسيقان، مما يقلل الإنتاج بشكل كبير.',
      treatment: {
        organic: [
          'Use rust-resistant wheat varieties',
          'Apply sulfur-based fungicides',
          'Practice crop rotation',
        ],
        chemical: [
          'Apply systemic fungicides at first sign of rust',
          'Use triazole or strobilurin fungicides',
          'Apply preventively in high-risk areas',
        ],
        preventive: [
          'Plant resistant varieties',
          'Avoid late planting',
          'Remove volunteer wheat plants',
          'Monitor fields regularly',
        ],
      },
      estimatedLoss: '20-40% if untreated',
    },
  ],
  citrus: [
    {
      pestName: 'Citrus Psyllid',
      pestNameAr: 'نطاط الحمضيات',
      confidence: 0.82,
      severity: 'high',
      description: 'The Asian citrus psyllid vectors the deadly huanglongbing (HLB) disease, also known as citrus greening.',
      descriptionAr: 'نطاط الحمضيات الآسيوي ينقل مرض الهوانغلونغبينغ القاتل، المعروف أيضاً باسم التخضير.',
      treatment: {
        organic: [
          'Introduce natural predators',
          'Apply horticultural oils',
          'Use sticky traps',
        ],
        chemical: [
          'Apply systemic insecticides',
          'Use contact insecticides during flush periods',
        ],
        preventive: [
          'Monitor trees regularly',
          'Remove infected trees immediately',
          'Use certified disease-free nursery stock',
        ],
      },
      estimatedLoss: '40-60% if untreated (tree decline)',
    },
  ],
};

export function getMockPestDetection(
  crop: string,
  imageFile: File
): Omit<PestDetection, 'id' | 'farmerId' | 'image' | 'timestamp' | 'expertVerified'> {
  // Get pests for this crop
  const pests = PEST_DATABASE[crop.toLowerCase()] || PEST_DATABASE.olives;
  
  // Simulate random selection (in real app, AI would analyze the image)
  // For demo, we'll use file size as a simple "randomizer"
  const index = imageFile.size % pests.length;
  const selectedPest = pests[index];
  
  // Adjust confidence slightly based on image (mock)
  const confidenceVariation = (imageFile.size % 20) / 100; // ±0-0.19
  const confidence = Math.min(0.95, Math.max(0.70, selectedPest.confidence + confidenceVariation - 0.1));
  
  return {
    cropAffected: crop,
    detectionResult: {
      ...selectedPest,
      confidence: Math.round(confidence * 100) / 100,
    },
  };
}

