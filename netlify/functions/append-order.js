const { google } = require('googleapis');

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
    console.log('Starting Google Sheets integration...');

    // Get credentials
    const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_JSON;
    const spreadsheetId = process.env.SPREADSHEET_ID;

    if (!serviceAccountKey || !spreadsheetId) {
      console.error('Missing credentials');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          success: false,
          error: 'Missing Google credentials' 
        })
      };
    }

    // Parse order data
    const orderData = JSON.parse(event.body);
    console.log('Order data received:', orderData);

    // Setup Google Sheets client
    const credentials = JSON.parse(serviceAccountKey);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Generate order ID
    const orderId = `ORDER-${Date.now()}`;
    const timestamp = new Date().toLocaleString('ar-DZ');

    // Prepare row data
    const rowData = [
      timestamp,
      orderId,
      orderData.fullName || '',
      orderData.phone || '',
      orderData.altPhone || '',
      orderData.wilaya || '',
      orderData.baladia || '',
      orderData.deliveryType === 'home' ? 'منزلي' : 'مكتبي',
      orderData.quantity || 0,
      orderData.totalPrice || 0,
      orderData.notes || ''
    ];

    // Append to sheet
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'الطلبات!A:K',
      valueInputOption: 'RAW',
      resource: {
        values: [rowData]
      }
    });

    console.log('Successfully added to Google Sheets');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        orderId,
        message: 'تم حفظ الطلب في Google Sheets بنجاح'
      })
    };

  } catch (error) {
    console.error('Google Sheets error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message || 'خطأ في حفظ البيانات'
      })
    };
  }
};