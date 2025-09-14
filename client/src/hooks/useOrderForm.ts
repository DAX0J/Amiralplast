import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { type WilayaName } from '@/data/deliveryPrices';
import { 
  PRODUCT_VARIANTS, 
  UNITS, 
  type ProductVariantId, 
  type UnitId, 
  getProductVariant, 
  getUnit, 
  convertToBags, 
  getPricingTier, 
  formatPrice,
  getAvailableVariants 
} from '@/data/productPricing';
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
  cupType: z.string().min(1, 'نوع الكأس مطلوب'),
  unit: z.enum(['bag', 'carton'], { 
    errorMap: () => ({ message: 'الوحدة يجب أن تكون كيس أو كرتون' })
  }),
  wilaya: z.string().min(1, 'الولاية مطلوبة'),
  baladia: z.string().min(1, 'البلدية مطلوبة'),
  quantity: z.number().min(1, 'الكمية يجب أن تكون 1 على الأقل').max(1000, 'الكمية لا يمكن أن تكون أكثر من 1000'),
  notes: z.string().optional()
});

type FormData = z.infer<typeof formSchema>;

export function useOrderForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const { toast } = useToast();

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
      cupType: 'large_size_1', // Default to first available variant
      unit: 'bag',
      wilaya: '',
      baladia: '',
      quantity: 1,
      notes: ''
    }
  });

  const calculateTotal = (cupType: string, unit: string, quantity: number) => {
    const variant = getProductVariant(cupType);
    const unitData = getUnit(unit);
    
    if (!variant || !unitData) {
      return 0;
    }

    // Calculate total bags: quantity × unit factor
    const totalBags = convertToBags(quantity, unit as UnitId);
    
    // Calculate total price: pricePerBag × totalBags
    const totalPrice = variant.pricePerBag * totalBags;
    
    // Delivery is always free for cupping cups
    return totalPrice;
  };

  // Helper function to get effective bags count
  const getEffectiveBagsCount = (cupType: string, unit: string, quantity: number) => {
    const unitData = getUnit(unit);
    if (!unitData) return 0;
    return convertToBags(quantity, unit as UnitId);
  };

  // Helper function to get current pricing tier
  const getCurrentPricingTier = (cupType: string, unit: string, quantity: number) => {
    const effectiveBags = getEffectiveBagsCount(cupType, unit, quantity);
    return getPricingTier(effectiveBags);
  };

  // Helper function to get total cups in order
  const getTotalCups = (cupType: string, unit: string, quantity: number) => {
    const variant = getProductVariant(cupType);
    const effectiveBags = getEffectiveBagsCount(cupType, unit, quantity);
    
    if (!variant) return 0;
    return effectiveBags * variant.cupsPerBag;
  };

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
      const totalPrice = calculateTotal(data.cupType, data.unit, data.quantity);
      const variant = getProductVariant(data.cupType);
      const effectiveBags = getEffectiveBagsCount(data.cupType, data.unit, data.quantity);
      const totalCups = getTotalCups(data.cupType, data.unit, data.quantity);
      const pricingTier = getCurrentPricingTier(data.cupType, data.unit, data.quantity);
      
      // Delivery is always free for cupping cups
      const deliveryPrice = 0;
      const productPrice = totalPrice;

      // Track initiate checkout
      trackInitiateCheckout();

      // Prepare order data for webhooks
      const orderData: OrderData = {
        fullName: data.fullName,
        phone: data.phone,
        altPhone: data.altPhone,
        cupType: data.cupType,
        unit: data.unit,
        wilaya: data.wilaya,
        baladia: data.baladia,
        quantity: data.quantity,
        notes: data.notes,
        totalPrice: totalPrice,
        productPrice: productPrice,
        deliveryPrice: deliveryPrice,
        effectiveBags: effectiveBags,
        totalCups: totalCups,
        pricingTier: pricingTier.nameArabic,
        cupTypeArabic: variant?.nameArabic || data.cupType
      };

      console.log('Starting order submission to webhook services...', orderData);

      // Track Facebook Pixel Purchase event (non-blocking)
      try {
        trackPurchase({
          value: totalPrice,
          currency: 'DZD',
          content_name: variant?.nameArabic || 'كؤوس حجامة أميرال بلاست',
          content_category: 'Medical Equipment'
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
    calculateTotal,
    getEffectiveBagsCount,
    getCurrentPricingTier,
    getTotalCups
  };
}