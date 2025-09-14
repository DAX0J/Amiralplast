exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    console.log('Starting Telegram Bot API integration...');

    // Get credentials
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error('Missing Telegram credentials');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          success: false,
          error: 'Missing Telegram credentials' 
        })
      };
    }

    // Parse order data
    const orderData = JSON.parse(event.body);
    console.log('Order data received:', orderData);

    // Generate order ID
    const orderId = `ORDER-${Date.now()}`;

    // Create message for cupping cups
    const message = `🥄 طلب جديد - كؤوس الحجامة أميرال بلاست

👤 الاسم: ${orderData.fullName || ''}
📱 الهاتف: ${orderData.phone || ''}
📱 هاتف بديل: ${orderData.altPhone || 'غير محدد'}
📍 الولاية: ${orderData.wilaya || ''}
🏘️ البلدية: ${orderData.baladia || ''}

🥄 نوع الكؤوس: ${orderData.cupTypeArabic || orderData.cupType || 'غير محدد'}
📦 الوحدة: ${orderData.unit === 'bag' ? 'كيس' : orderData.unit === 'carton' ? 'كرتون' : orderData.unit || 'غير محدد'}
🔢 الكمية المطلوبة: ${orderData.quantity || 0} ${orderData.unit === 'bag' ? 'كيس' : orderData.unit === 'carton' ? 'كرتون' : 'وحدة'}
📊 إجمالي الأكياس: ${orderData.effectiveBags || 0} كيس
🥄 إجمالي الكؤوس: ${orderData.totalCups || 0} كأس
📈 نوع السعر: ${orderData.pricingTier || 'غير محدد'}

💰 سعر المنتج: ${orderData.productPrice || orderData.totalPrice || 0} دج
🚚 رسوم التوصيل: ${orderData.deliveryPrice || 0} دج ${orderData.deliveryPrice === 0 ? '(مجاني ✅)' : ''}
💳 المجموع النهائي: ${orderData.totalPrice || 0} دج
📝 ملاحظات: ${orderData.notes || 'لا توجد'}

⏰ الوقت: ${new Date().toLocaleString('ar-DZ')}
🔍 معرف الطلب: ${orderId}`;

    // Send to Telegram
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        disable_web_page_preview: true
      })
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
      throw new Error(result.description || 'Telegram API error');
    }

    console.log('Successfully sent to Telegram');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        orderId,
        message: 'تم إرسال الطلب إلى Telegram بنجاح'
      })
    };

  } catch (error) {
    console.error('Telegram error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message || 'خطأ في إرسال الرسالة'
      })
    };
  }
};