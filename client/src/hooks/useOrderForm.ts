import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DELIVERY_PRICES, type WilayaName, PRODUCT_PRICE, hasOfficeDelivery } from '@/data/deliveryPrices';
import { validatePhone } from '@/lib/validation';
import { checkSecureRateLimit, recordSecureAttempt } from '@/lib/security';
import { sendOrderToWebhooksSecure, type OrderData } from '@/lib/webhookIntegrationServerless';
import { initializeFacebookPixel, trackInitiateCheckout, trackLead, trackPurchase } from '@/lib/facebookPixelDirect';
import { getSecureEnvironmentConfig } from '@/lib/environmentConfig';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  fullName: z.string().min(2, 'الاسم يجب أن يكون أكثر من حرف واحد'),
  phone: z.string().refine(phone => validatePhone(phone) === null, {
    message: 'رقم غير صالح — أدخل رقمًا صحيحًا من شبكات الجزائر (077/055/066)'
  }),
  altPhone: z.string().optional().refine(phone => !phone || validatePhone(phone) === null, {
    message: 'رقم غير صالح — أدخل رقمًا صحيحًا من شبكات الجزائر (077/055/066)'
  }),
  wilaya: z.string().min(1, 'الولاية مطلوبة'),
  baladia: z.string().min(1, 'البلدية مطلوبة'),
  deliveryType: z.enum(['office', 'home']),
  quantity: z.number().min(1, 'الكمية يجب أن تكون 1 على الأقل').max(50, 'الكمية لا يمكن أن تكون أكثر من 50'),
  notes: z.string().optional()
});

type FormData = z.infer<typeof formSchema>;

export function useOrderForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const { toast } = useToast();
  const [wilaya, setWilaya] = useState(''); // State to hold the current wilaya

  // Initialize services securely on component mount
  useEffect(() => {
    const config = getSecureEnvironmentConfig();

    if (config.facebookPixelId) {
      initializeFacebookPixel();
    }

    console.log('Services initialized:', {
      facebook: !!config.facebookPixelId,
      telegram: config.telegramConfigured,
      sheets: config.googleSheetsConfigured,
      security: config.securityLevel
    });
  }, []);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      altPhone: '',
      wilaya: '',
      baladia: '',
      deliveryType: 'home',
      quantity: 1,
      notes: ''
    }
  });

  const calculateTotal = useCallback((wilaya: string, deliveryType: 'office' | 'home', quantity: number) => {
    // Calculate with "Buy 2 Get 1 Free" offer (only first free item)
    const calculateProductPrice = (qty: number) => {
      if (qty >= 3) {
        // Only one free item regardless of quantity
        return (qty - 1) * PRODUCT_PRICE;
      }
      return qty * PRODUCT_PRICE;
    };

    const productPrice = calculateProductPrice(quantity);
    const wilayaData = DELIVERY_PRICES[wilaya as WilayaName];
    const deliveryPrice = wilayaData 
      ? (deliveryType === 'office' 
          ? (typeof wilayaData.deliveryOffice === 'number' ? wilayaData.deliveryOffice : wilayaData.deliveryHome)
          : wilayaData.deliveryHome)
      : 600;
    return productPrice + deliveryPrice;
  }, []);

  const onSubmit = async (data: FormData) => {
    if (isSubmitting) return;

    // Enhanced security check
    if (!checkSecureRateLimit()) {
      setRateLimited(true);
      toast({
        title: "تم تجاوز الحد المسموح",
        description: "لقد تم إرسال طلب من جهازك خلال الساعة الماضية. يرجى الانتظار قبل إرسال طلب جديد.",
        variant: "destructive"
      });
      return;
    }

    setRateLimited(false);
    setIsSubmitting(true);

    try {
      const totalPrice = calculateTotal(data.wilaya, data.deliveryType, data.quantity);
      const wilayaData = DELIVERY_PRICES[data.wilaya as WilayaName];
      const deliveryPrice = wilayaData 
        ? (data.deliveryType === 'office' 
            ? (typeof wilayaData.deliveryOffice === 'number' ? wilayaData.deliveryOffice : wilayaData.deliveryHome)
            : wilayaData.deliveryHome)
        : 600;
      const productPrice = totalPrice - deliveryPrice;

      // Track initiate checkout
      trackInitiateCheckout();

      // Prepare order data for webhooks
      const orderData: OrderData = {
        fullName: data.fullName,
        phone: data.phone,
        altPhone: data.altPhone,
        wilaya: data.wilaya,
        baladia: data.baladia,
        deliveryType: data.deliveryType,
        quantity: data.quantity,
        notes: data.notes,
        totalPrice: totalPrice,
        productPrice: productPrice,
        deliveryPrice: deliveryPrice
      };

      console.log('Starting order submission to webhook services...', orderData);

      // Track Facebook Pixel Purchase event (non-blocking)
      try {
        trackPurchase({
          value: totalPrice,
          currency: 'DZD',
          content_name: 'زيت لبان الذكر',
          content_category: 'Essential Oils'
        });
      } catch (error) {
        console.warn('Facebook Pixel tracking failed:', error);
      }

      // Send to both webhook services with secure serverless functions
      console.log('🔒 Using secure serverless webhook integration (Netlify Functions)...');
      const webhookResults = await sendOrderToWebhooksSecure(orderData);

      console.log('Webhook results:', webhookResults);

      // Success if at least one webhook worked
      if (webhookResults.overallSuccess) {
        // Record the attempt to prevent spam
        await recordSecureAttempt();

        // Show success message
        setShowSuccess(true);

        const services = [];
        if (webhookResults.telegram.success) services.push('Telegram ✓');
        if (webhookResults.googleSheets.success) services.push('Google Sheets ✓');

        toast({
          title: "تم إرسال طلبك بنجاح! ✨",
          description: `الخدمات العاملة: ${services.join(', ')}\nسيتم التواصل معك خلال 24 ساعة.`
        });
      } else {
        console.error('All webhook services failed:', webhookResults);
        throw new Error(`فشل في إرسال الطلب إلى جميع الخدمات. ${webhookResults.telegram.message} | ${webhookResults.googleSheets.message}`);
      }
    } catch (error) {
      console.error('Order submission error:', error);
      toast({
        title: "خطأ في إرسال الطلب",
        description: "حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    showSuccess,
    rateLimited,
    onSubmit,
    calculateTotal
  };
}