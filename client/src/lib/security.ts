import * as CryptoJS from 'crypto-js';

// Enhanced security with environment-based keys
const SECRET_KEY = import.meta.env.VITE_APP_SECRET_KEY || '';
const RATE_LIMIT_SECRET = import.meta.env.VITE_RATE_LIMIT_SECRET || '';
const WATERMARK_SECRET = import.meta.env.VITE_WATERMARK_SECRET || '';

export interface SecureData {
  orderAttempts?: any[];
  userPreferences?: any;
  sessionData?: any;
}

export function encryptData(data: any): string {
  try {
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
    return encrypted;
  } catch (error) {
    console.warn('Encryption failed:', error);
    return '';
  }
}

export function decryptData(encryptedData: string): any {
  try {
    if (!encryptedData) return null;
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedString);
  } catch (error) {
    console.warn('Decryption failed:', error);
    return null;
  }
}

export function setSecureLocalStorage(key: string, data: any): void {
  try {
    const encrypted = encryptData(data);
    localStorage.setItem(key, encrypted);
  } catch (error) {
    console.warn('Secure storage failed:', error);
  }
}

export function getSecureLocalStorage(key: string): any {
  try {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;
    return decryptData(encrypted);
  } catch (error) {
    console.warn('Secure retrieval failed:', error);
    return null;
  }
}

export function setSecureCookie(name: string, data: any, days: number = 7): void {
  try {
    const encrypted = encryptData(data);
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${encrypted};${expires};path=/;secure;samesite=strict`;
  } catch (error) {
    console.warn('Secure cookie failed:', error);
  }
}

export function getSecureCookie(name: string): any {
  try {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        const encrypted = c.substring(nameEQ.length, c.length);
        return decryptData(encrypted);
      }
    }
    return null;
  } catch (error) {
    console.warn('Secure cookie retrieval failed:', error);
    return null;
  }
}

// Enhanced fingerprinting with additional security
export function generateSecureFingerprint(): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Frankincense Oil Security Check', 2, 2);
  }
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    navigator.platform,
    screen.width + 'x' + screen.height + 'x' + screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 'unknown',
    (navigator as any).deviceMemory || 'unknown',
    canvas.toDataURL(),
    window.devicePixelRatio || 1
  ].join('|');
  
  // Use CryptoJS for better hashing
  const hash = CryptoJS.SHA256(fingerprint).toString();
  return hash.substring(0, 16);
}

// Generate CSRF Token
export function generateCSRFToken(): string {
  return CryptoJS.SHA256(Date.now() + Math.random().toString()).toString().substring(0, 32);
}

// Generate Session ID
export function generateSessionId(): string {
  return CryptoJS.SHA256(Date.now() + navigator.userAgent + Math.random().toString()).toString().substring(0, 24);
}

// Rate limiting with enhanced security
export function checkSecureRateLimit(): boolean {
  const fingerprint = generateSecureFingerprint();
  const attempts = getSecureLocalStorage('orderAttempts') || [];
  const now = Date.now();
  
  // Check for recent attempts (1 hour limit)
  const recentAttempt = attempts.find((attempt: any) => 
    attempt.fingerprint === fingerprint && 
    (now - attempt.timestamp) < 60 * 60 * 1000
  );
  
  if (recentAttempt) {
    return false; // Rate limited
  }
  
  return true; // OK to proceed
}

export async function recordSecureAttempt(): Promise<void> {
  const fingerprint = generateSecureFingerprint();
  const attempts = getSecureLocalStorage('orderAttempts') || [];
  
  // Add new attempt
  attempts.push({
    fingerprint: fingerprint,
    timestamp: Date.now(),
    userAgent: navigator.userAgent.substring(0, 50) // Limited data
  });
  
  // Clean old attempts (older than 24 hours)
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const cleanedAttempts = attempts.filter((attempt: any) => attempt.timestamp > oneDayAgo);
  
  setSecureLocalStorage('orderAttempts', cleanedAttempts);
}