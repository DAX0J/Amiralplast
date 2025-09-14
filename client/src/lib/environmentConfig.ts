// Client-side environment configuration for webhook-based architecture
export interface EnvironmentConfig {
  facebookPixelId: string | null;
  telegramConfigured: boolean;
  googleSheetsConfigured: boolean;
  securityLevel: 'basic' | 'enhanced' | 'maximum';
}

export function getSecureEnvironmentConfig(): EnvironmentConfig {
  return {
    facebookPixelId: import.meta.env.VITE_FB_PIXEL_ID || null,
    // Updated to use Netlify Functions instead of direct webhook URLs
    telegramConfigured: true, // Always true as we use Netlify Functions
    googleSheetsConfigured: true, // Always true as we use Netlify Functions
    securityLevel: (import.meta.env.VITE_PROTECTION_LEVEL as 'basic' | 'enhanced' | 'maximum') || 'maximum'
  };
}

// Validate webhook environment setup
export function validateEnvironmentSetup(): {
  isValid: boolean;
  services: {
    facebook: boolean;
    telegram: boolean;
    googleSheets: boolean;
  };
  securityStatus: string;
} {
  const config = getSecureEnvironmentConfig();
  
  return {
    isValid: config.telegramConfigured || config.googleSheetsConfigured, // At least one webhook should be configured
    services: {
      facebook: !!config.facebookPixelId,
      telegram: config.telegramConfigured,
      googleSheets: config.googleSheetsConfigured
    },
    securityStatus: config.securityLevel
  };
}

// Environment secrets validation (without exposing actual values)
export function validateSecrets(): {
  hasAppSecret: boolean;
  hasRateLimitSecret: boolean;
  hasWatermarkSecret: boolean;
  hasWebhooks: boolean;
} {
  return {
    hasAppSecret: !!(import.meta.env.VITE_APP_SECRET_KEY),
    hasRateLimitSecret: !!(import.meta.env.VITE_RATE_LIMIT_SECRET),
    hasWatermarkSecret: !!(import.meta.env.VITE_WATERMARK_SECRET),
    hasWebhooks: true // Always true as we use Netlify Functions
  };
}