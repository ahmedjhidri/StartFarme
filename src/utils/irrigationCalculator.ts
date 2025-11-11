// Irrigation Calculator Utilities
// Based on: Water Needed = (ETo * Kc * Area) - Effective Rainfall

export interface IrrigationInputs {
  crop: string;
  fieldSize: number; // hectares
  soilType: 'sandy' | 'clay' | 'loam' | 'mixed';
  lastIrrigation: Date;
  recentRainfall: number; // mm in last 7 days
  temperature: number; // Celsius
  humidity: number; // percentage
}

export interface IrrigationResult {
  waterNeeded: number; // liters
  waterNeededCubicMeters: number;
  timing: 'morning' | 'evening';
  urgency: 'low' | 'medium' | 'high';
  reasoning: string;
  reasoningAr: string;
  evapotranspiration: number; // ETo in mm/day
  cropCoefficient: number; // Kc
  effectiveRainfall: number; // mm
}

// Crop coefficients (Kc) - varies by crop and growth stage
const CROP_COEFFICIENTS: Record<string, number> = {
  olives: 0.65,
  dates: 0.85,
  wheat: 1.0,
  barley: 1.0,
  tomatoes: 1.15,
  peppers: 1.1,
  potatoes: 1.1,
  onions: 1.0,
  citrus: 0.95,
  almonds: 0.75,
  grapes: 0.85,
  figs: 0.8,
};

// Calculate reference evapotranspiration (ETo) using simplified Hargreaves equation
function calculateETo(temperature: number, humidity: number): number {
  // Simplified calculation: ETo = 0.0023 * (T + 17.8) * sqrt(Tmax - Tmin) * Ra
  // For Tunisia, we use a simplified version based on temperature and humidity
  const baseETo = 4.5; // Base ETo for Tunisia (mm/day)
  const tempFactor = 1 + (temperature - 20) * 0.05; // Adjust for temperature
  const humidityFactor = 1 - (humidity - 50) * 0.01; // Lower humidity = higher ETo
  
  return baseETo * tempFactor * humidityFactor;
}

// Calculate effective rainfall (accounts for runoff and infiltration)
function calculateEffectiveRainfall(rainfall: number, soilType: string): number {
  // Efficiency factors based on soil type
  const efficiencyFactors: Record<string, number> = {
    sandy: 0.9, // Sandy soil absorbs water well
    loam: 0.8,  // Loam has good absorption
    clay: 0.6,  // Clay has more runoff
    mixed: 0.75,
  };
  
  const efficiency = efficiencyFactors[soilType] || 0.75;
  return rainfall * efficiency;
}

export function calculateIrrigation(inputs: IrrigationInputs): IrrigationResult {
  const { crop, fieldSize, soilType, temperature, humidity, recentRainfall } = inputs;
  
  // Get crop coefficient
  const cropCoefficient = CROP_COEFFICIENTS[crop.toLowerCase()] || 0.85;
  
  // Calculate ETo (reference evapotranspiration)
  const evapotranspiration = calculateETo(temperature, humidity);
  
  // Calculate effective rainfall
  const effectiveRainfall = calculateEffectiveRainfall(recentRainfall, soilType);
  
  // Calculate daily water need (mm/day)
  const dailyWaterNeed = (evapotranspiration * cropCoefficient) - (effectiveRainfall / 7);
  
  // Convert to liters per hectare
  // 1 mm = 10,000 liters per hectare
  const waterNeededPerHectare = Math.max(0, dailyWaterNeed * 10000);
  
  // Total water needed for the field
  const waterNeededLiters = waterNeededPerHectare * fieldSize;
  const waterNeededCubicMeters = waterNeededLiters / 1000;
  
  // Determine urgency based on soil moisture deficit
  const daysSinceIrrigation = Math.floor(
    (Date.now() - inputs.lastIrrigation.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  let urgency: 'low' | 'medium' | 'high' = 'low';
  if (daysSinceIrrigation > 7 || dailyWaterNeed > 5) {
    urgency = 'high';
  } else if (daysSinceIrrigation > 4 || dailyWaterNeed > 3) {
    urgency = 'medium';
  }
  
  // Determine timing (morning is better to reduce evaporation)
  const timing = temperature > 30 ? 'evening' : 'morning';
  
  // Generate reasoning
  const reasoning = `Based on ${crop} crop (Kc: ${cropCoefficient.toFixed(2)}), ` +
    `current weather (ETo: ${evapotranspiration.toFixed(2)} mm/day), ` +
    `and recent rainfall (${recentRainfall}mm, effective: ${effectiveRainfall.toFixed(1)}mm), ` +
    `your ${fieldSize} hectare field needs ${waterNeededCubicMeters.toFixed(1)} m³ of water. ` +
    `Irrigate in the ${timing} to minimize water loss.`;
  
  const reasoningAr = `بناءً على محصول ${crop} (معامل المحصول: ${cropCoefficient.toFixed(2)})، ` +
    `الطقس الحالي (التبخر: ${evapotranspiration.toFixed(2)} ملم/يوم)، ` +
    `والأمطار الأخيرة (${recentRainfall} ملم، الفعال: ${effectiveRainfall.toFixed(1)} ملم)، ` +
    `حقلك البالغ ${fieldSize} هكتار يحتاج إلى ${waterNeededCubicMeters.toFixed(1)} متر مكعب من الماء. ` +
    `قم بالري في ${timing === 'morning' ? 'الصباح' : 'المساء'} لتقليل فقدان المياه.`;
  
  return {
    waterNeeded: Math.round(waterNeededLiters),
    waterNeededCubicMeters: Math.round(waterNeededCubicMeters * 10) / 10,
    timing,
    urgency,
    reasoning,
    reasoningAr,
    evapotranspiration: Math.round(evapotranspiration * 100) / 100,
    cropCoefficient: Math.round(cropCoefficient * 100) / 100,
    effectiveRainfall: Math.round(effectiveRainfall * 10) / 10,
  };
}

