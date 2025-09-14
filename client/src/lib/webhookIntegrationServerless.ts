// Clean Netlify Functions integration for secure API processing
// Updated: 2025-08-26 - Complete migration to Netlify Functions with Bot API
// Google Sheets: Service Account API | Telegram: Bot API

export interface OrderData {
  fullName: string;
  phone: string;
  altPhone?: string;
  cupType: string;
  unit: 'bag' | 'carton';
  wilaya: string;
  baladia: string;
  deliveryType: 'office' | 'home';
  quantity: number;
  notes?: string;
  totalPrice: number;
  productPrice: number;
  deliveryPrice: number;
  effectiveBags: number;
  totalCups: number;
  pricingTier: string;
  cupTypeArabic: string;
  fingerprint?: string;
}

export interface WebhookResponse {
  success: boolean;
  orderId?: string;
  message: string;
  error?: string;
}

/**
 * Send order data to Google Sheets via Google Sheets API (Service Account)
 * This replaces the old webhook approach with direct Google Sheets API
 */
export async function sendToGoogleSheetsSecure(orderData: OrderData): Promise<WebhookResponse> {
  try {
    console.log('📊 Sending to Google Sheets via API...');
    
    const response = await fetch('/.netlify/functions/append-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'فشل في الاتصال بـ Google Sheets API');
    }

    console.log('✅ Google Sheets API response:', result);
    return {
      success: result.success,
      orderId: result.orderId,
      message: result.message || 'تم حفظ الطلب في Google Sheets بنجاح'
    };

  } catch (error: any) {
    console.error('❌ Google Sheets API error:', error);
    return {
      success: false,
      message: `خطأ في حفظ الطلب في Google Sheets: ${error.message}`
    };
  }
}

/**
 * Send order data to Telegram via Telegram Bot API (Netlify Function)
 * This uses the new clean implementation with Bot API
 */
export async function sendToTelegramSecure(orderData: OrderData): Promise<WebhookResponse> {
  try {
    console.log('📱 Sending to Telegram via Bot API...');
    
    // Clean production-ready approach
    
    const response = await fetch('/.netlify/functions/send-telegram', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'فشل في الاتصال بـ Telegram Bot API');
    }

    console.log('✅ Telegram Bot API response:', result);
    return {
      success: result.success,
      orderId: result.orderId,
      message: result.message || 'تم إرسال الطلب إلى Telegram بنجاح'
    };

  } catch (error: any) {
    console.error('❌ Telegram Bot API error:', error);
    return {
      success: false,
      message: `خطأ في إرسال الطلب إلى Telegram: ${error.message}`
    };
  }
}

/**
 * Main function to send order to both services using secure Netlify Functions
 * Enhanced security: webhooks are now handled server-side, not exposed in frontend
 */
export async function sendOrderToWebhooksSecure(orderData: OrderData): Promise<{
  telegram: WebhookResponse;
  googleSheets: WebhookResponse;
  overallSuccess: boolean;
}> {
  try {
    console.log('🚀 Starting secure webhook integration via Netlify Functions...');
    console.log('🔒 Security: Webhook URLs are now hidden on server-side');
    
    // Send to both services in parallel for better performance
    const [telegramResult, sheetsResult] = await Promise.allSettled([
      sendToTelegramSecure(orderData),
      sendToGoogleSheetsSecure(orderData)
    ]);

    const telegram: WebhookResponse = telegramResult.status === 'fulfilled' 
      ? telegramResult.value 
      : { success: false, message: 'فشل في الاتصال بـ Telegram' };

    const googleSheets: WebhookResponse = sheetsResult.status === 'fulfilled' 
      ? sheetsResult.value 
      : { success: false, message: 'فشل في الاتصال بـ Google Sheets' };

    // Consider it successful if at least one service worked
    const overallSuccess = telegram.success || googleSheets.success;

    console.log('📊 Secure webhook results:', {
      telegram: telegram.success,
      googleSheets: googleSheets.success,
      overallSuccess,
      securityLevel: 'MAXIMUM - Webhooks hidden server-side'
    });

    return {
      telegram,
      googleSheets,
      overallSuccess
    };

  } catch (error: any) {
    console.error('❌ Secure webhooks integration error:', error);
    
    return {
      telegram: { success: false, message: 'خطأ في خدمة Telegram' },
      googleSheets: { success: false, message: 'خطأ في خدمة Google Sheets' },
      overallSuccess: false
    };
  }
}