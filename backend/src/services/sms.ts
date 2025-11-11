import axios from 'axios';
import { config } from '../config/env';
import { otpStorage } from '../config/redis';

// Generate random 6-digit OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via SMS
export const sendOTP = async (phone: string, code: string): Promise<boolean> => {
  try {
    // In production, integrate with actual SMS provider
    // For now, we'll simulate it and store in Redis
    
    // Mock SMS sending (replace with actual SMS API call)
    if (config.nodeEnv === 'development') {
      console.log(`[SMS Mock] Sending OTP ${code} to ${phone}`);
      // Store OTP in Redis with 5 minute TTL
      await otpStorage.set(phone, code, 300);
      return true;
    }

    // Production: Use actual SMS API
    // Example with Twilio or Tunisian SMS provider:
    /*
    const response = await axios.post(config.smsApiUrl, {
      api_key: config.smsApiKey,
      to: phone,
      message: `Votre code de vérification StartFarme: ${code}`,
      sender: config.smsSender,
    });
    */

    // For now, store in Redis
    await otpStorage.set(phone, code, 300);
    return true;
  } catch (error) {
    console.error('Failed to send OTP:', error);
    return false;
  }
};

// Verify OTP
export const verifyOTP = async (phone: string, code: string): Promise<boolean> => {
  try {
    const storedCode = await otpStorage.get(phone);
    
    if (!storedCode) {
      return false;
    }

    if (storedCode !== code) {
      return false;
    }

    // Delete OTP after verification
    await otpStorage.delete(phone);
    return true;
  } catch (error) {
    console.error('Failed to verify OTP:', error);
    return false;
  }
};

// Send weather alert via SMS
export const sendWeatherAlert = async (phone: string, message: string, messageAr: string): Promise<boolean> => {
  try {
    // In production, send actual SMS
    if (config.nodeEnv === 'development') {
      console.log(`[SMS Mock] Weather alert to ${phone}: ${message}`);
      return true;
    }

    // Production SMS sending
    // await axios.post(config.smsApiUrl, { ... });
    return true;
  } catch (error) {
    console.error('Failed to send weather alert:', error);
    return false;
  }
};

