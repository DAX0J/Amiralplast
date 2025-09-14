import { motion } from 'framer-motion';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Minus, Plus, Loader2, Sparkles, Heart, Star, ShoppingCart } from 'lucide-react';
import { useOrderForm } from '@/hooks/useOrderForm';
import { type WilayaName, WILAYAS } from '@/data/deliveryPrices';
import { getAvailableVariants, UNITS, formatPrice, type UnitId } from '@/data/productPricing';

export default function OrderForm() {
  const { form, isSubmitting, showSuccess, rateLimited, onSubmit, calculateTotal, getEffectiveBagsCount, getCurrentPricingTier, getTotalCups } = useOrderForm();

  const watchedValues = form.watch();
  const { cupType, unit, wilaya, quantity } = watchedValues;

  // Calculate prices using the new pricing structure
  const productPrice = calculateTotal(cupType, unit, quantity);
  const deliveryPrice = 0; // Delivery is always free for cupping cups
  const totalPrice = productPrice + deliveryPrice;
  
  // Get additional pricing information
  const effectiveBags = getEffectiveBagsCount(cupType, unit, quantity);
  const totalCups = getTotalCups(cupType, unit, quantity);
  const pricingTier = getCurrentPricingTier(cupType, unit, quantity);

  // Get available cup variants
  const availableVariants = getAvailableVariants();

  const increaseQuantity = () => {
    const currentValue = form.getValues('quantity');
    if (currentValue < 1000) {
      form.setValue('quantity', currentValue + 1);
    }
  };

  const decreaseQuantity = () => {
    const currentValue = form.getValues('quantity');
    if (currentValue > 1) {
      form.setValue('quantity', currentValue - 1);
    }
  };

  if (showSuccess) {
    return (
      <section id="orderForm" className="relative bg-gradient-to-b from-white to-warm-beige/20 py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div 
            className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-green-600 text-2xl font-semibold mb-4 font-arabic">تم إرسال طلبك بنجاح!</div>
            <p className="text-green-700 text-lg font-arabic">سيتم مراجعة طلبك والتواصل معك خلال 24 ساعة.</p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="orderForm" className="relative from-white to-warm-beige/20 py-8 sm:py-16 px-6 bg-[#faf0e6]">
      <div className="max-w-2xl mx-auto">
        {/* Enhanced Order Form with Premium Styling */}
        <motion.div
          className="relative bg-gradient-to-br from-white to-warm-beige/5 rounded-3xl shadow-2xl border border-warm-beige/20 p-8 overflow-hidden"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          whileHover={{ 
            boxShadow: "0 25px 50px -12px rgba(220, 38, 38, 0.15)",
            transition: { duration: 0.3 }
          }}
        >
          {/* Decorative Elements */}
          <motion.div 
            className="absolute top-4 right-4"
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-6 h-6 text-gold-accent opacity-60" />
          </motion.div>
          <motion.div 
            className="absolute bottom-4 left-4"
            animate={{ y: [-2, 2, -2] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Heart className="w-5 h-5 text-primary-red opacity-40" />
          </motion.div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Full Name with Enhanced Animation */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-gray-800 font-arabic flex items-center gap-2">
                        <Star className="w-4 h-4 text-gold-accent" />
                        الاسم الكامل *
                      </FormLabel>
                      <FormControl>
                        <motion.div
                          whileFocus={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Input 
                            {...field} 
                            placeholder="أدخل اسمك الكامل"
                            className="form-field text-lg h-14 rounded-2xl border-2 font-arabic bg-gradient-to-r from-white to-warm-beige/5 focus:from-warm-beige/10 focus:to-white transition-all duration-300 hover:shadow-md"
                            data-testid="input-fullName"
                          />
                        </motion.div>
                      </FormControl>
                      <FormMessage className="text-primary-red font-arabic" />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Phone Number with Enhanced Styling */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-gray-800 font-arabic flex items-center gap-2">
                        📱 رقم الهاتف *
                      </FormLabel>
                      <FormControl>
                        <motion.div
                          whileFocus={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Input 
                            {...field} 
                            placeholder="0771234567"
                            className="form-field text-lg h-14 rounded-2xl border-2 bg-gradient-to-r from-white to-warm-beige/5 focus:from-warm-beige/10 focus:to-white transition-all duration-300 hover:shadow-md"
                            dir="ltr"
                            data-testid="input-phone"
                          />
                        </motion.div>
                      </FormControl>
                      <FormMessage className="text-primary-red font-arabic" />
                      <motion.p 
                        className="text-sm text-gray-500 font-arabic"
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        يجب أن يبدأ برقم 077 أو 055 أو 066
                      </motion.p>
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Alternative Phone with Enhanced Animation */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <FormField
                  control={form.control}
                  name="altPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-gray-800 font-arabic flex items-center gap-2">
                        📞 رقم هاتف ثانوي
                        <motion.span 
                          className="text-xs bg-green-500 text-white px-2 py-1 rounded-full"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          اختياري
                        </motion.span>
                      </FormLabel>
                      <FormControl>
                        <motion.div
                          whileFocus={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Input 
                            {...field} 
                            placeholder="0771234567 (للتأكد من التوصيل)"
                            className="form-field text-lg h-14 rounded-2xl border-2 bg-gradient-to-r from-white to-warm-beige/5 focus:from-warm-beige/10 focus:to-white transition-all duration-300 hover:shadow-md"
                            dir="ltr"
                            data-testid="input-altPhone"
                          />
                        </motion.div>
                      </FormControl>
                      <FormMessage className="text-primary-red font-arabic" />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Enhanced Wilaya Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                whileHover={{ scale: 1.01 }}
              >
                <FormField
                  control={form.control}
                  name="wilaya"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-gray-800 font-arabic flex items-center gap-2">
                        🌍 الولاية *
                        <motion.span 
                          className="text-xs bg-primary-red text-white px-2 py-1 rounded-full"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          مطلوب
                        </motion.span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <motion.div
                            whileFocus={{ scale: 1.02, boxShadow: "0 8px 25px rgba(220, 38, 38, 0.15)" }}
                            transition={{ duration: 0.2 }}
                          >
                            <SelectTrigger 
                              className="form-field text-lg h-14 rounded-2xl border-2 font-arabic bg-gradient-to-r from-white to-warm-beige/5 hover:from-warm-beige/10 hover:to-white transition-all duration-300 hover:shadow-lg"
                              data-testid="select-wilaya"
                            >
                              <SelectValue placeholder="اختر ولايتك للتوصيل السريع 🚚" />
                            </SelectTrigger>
                          </motion.div>
                        </FormControl>
                        <SelectContent className="font-arabic max-h-60">
                          {WILAYAS.map((wilaya, index) => (
                            <motion.div
                              key={wilaya}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.02 }}
                            >
                              <SelectItem value={wilaya} className="font-arabic hover:bg-warm-beige/20 transition-colors">
                                {wilaya}
                              </SelectItem>
                            </motion.div>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-primary-red font-arabic" />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Enhanced Baladia */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <FormField
                  control={form.control}
                  name="baladia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-gray-800 font-arabic flex items-center gap-2">
                        🏘️ البلدية *
                      </FormLabel>
                      <FormControl>
                        <motion.div
                          whileFocus={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Input 
                            {...field} 
                            placeholder="أدخل اسم البلدية الخاصة بك"
                            className="form-field text-lg h-14 rounded-2xl border-2 font-arabic bg-gradient-to-r from-white to-warm-beige/5 focus:from-warm-beige/10 focus:to-white transition-all duration-300 hover:shadow-md"
                            data-testid="input-baladia"
                          />
                        </motion.div>
                      </FormControl>
                      <FormMessage className="text-primary-red font-arabic" />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Cup Type Selection - NEW FIELD */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                whileHover={{ scale: 1.01 }}
              >
                <FormField
                  control={form.control}
                  name="cupType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-gray-800 font-arabic flex items-center gap-2">
                        🥤 نوع كؤوس الحجامة *
                        <motion.span 
                          className="text-xs bg-primary-red text-white px-2 py-1 rounded-full"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          اختر النوع
                        </motion.span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <motion.div
                            whileFocus={{ scale: 1.02, boxShadow: "0 8px 25px rgba(220, 38, 38, 0.15)" }}
                            transition={{ duration: 0.2 }}
                          >
                            <SelectTrigger 
                              className="form-field text-lg h-14 rounded-2xl border-2 font-arabic bg-gradient-to-r from-white to-warm-beige/5 hover:from-warm-beige/10 hover:to-white transition-all duration-300 hover:shadow-lg"
                              data-testid="select-cupType"
                            >
                              <SelectValue placeholder="اختر نوع كؤوس الحجامة المناسب لك" />
                            </SelectTrigger>
                          </motion.div>
                        </FormControl>
                        <SelectContent className="font-arabic max-h-60">
                          {availableVariants.map((variant, index) => (
                            <motion.div
                              key={variant.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.02 }}
                            >
                              <SelectItem value={variant.id} className="font-arabic hover:bg-warm-beige/20 transition-colors">
                                {variant.nameArabic} - {formatPrice(variant.pricePerBag)}
                              </SelectItem>
                            </motion.div>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-primary-red font-arabic" />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Unit Selection - NEW FIELD */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-gray-800 font-arabic flex items-center gap-2">
                        📦 وحدة الشراء *
                        <motion.span 
                          className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          اختر الوحدة
                        </motion.span>
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="grid grid-cols-1 md:grid-cols-2 gap-4"
                          data-testid="radio-unit"
                        >
                          {Object.values(UNITS).map((unitOption) => (
                            <motion.div
                              key={unitOption.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <RadioGroupItem value={unitOption.id} id={unitOption.id} className="peer sr-only" />
                              <Label 
                                htmlFor={unitOption.id} 
                                className={`relative form-field border-2 rounded-2xl p-6 cursor-pointer block transition-all duration-300 hover:shadow-lg ${
                                  field.value === unitOption.id 
                                    ? 'border-primary-red bg-primary-red/10 shadow-lg' 
                                    : 'border-gray-200 bg-white hover:border-warm-beige hover:bg-warm-beige/5'
                                }`}
                              >
                                {/* Selection Indicator */}
                                {field.value === unitOption.id && (
                                  <motion.div
                                    className="absolute top-3 right-3 w-6 h-6 bg-primary-red rounded-full flex items-center justify-center"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                  >
                                    <motion.span
                                      className="text-white text-sm font-bold"
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ delay: 0.1 }}
                                    >
                                      ✓
                                    </motion.span>
                                  </motion.div>
                                )}

                                <div className="text-center">
                                  <motion.div
                                    className="text-4xl mb-3"
                                    animate={{ rotate: field.value === unitOption.id ? [0, 10, 0] : 0 }}
                                    transition={{ duration: 0.5 }}
                                  >
                                    {unitOption.id === 'bag' ? '🛍️' : '📦'}
                                  </motion.div>
                                  <h3 className="font-semibold text-lg mb-2 font-arabic">{unitOption.nameArabic}</h3>
                                  <p className="text-sm text-gray-600 font-arabic">
                                    {unitOption.id === 'bag' ? '6 كؤوس في الكيس الواحد' : '100 كيس في الكرتون الواحد'}
                                  </p>
                                  <motion.div
                                    className="mt-2 text-xs text-blue-600 font-arabic"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: field.value === unitOption.id ? 1 : 0.7 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    {unitOption.id === 'bag' ? '🏪 تجزئة' : '🏭 جملة'}
                                  </motion.div>
                                </div>
                              </Label>
                            </motion.div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage className="text-primary-red font-arabic" />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Quantity Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-gray-800 font-arabic flex items-center gap-2">
                        🔢 الكمية *
                        <motion.span 
                          className="text-xs bg-green-500 text-white px-2 py-1 rounded-full"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          {unit === 'bag' ? 'أكياس' : 'كراتين'}
                        </motion.span>
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                          <motion.button
                            type="button"
                            onClick={decreaseQuantity}
                            className="w-12 h-12 rounded-full border-2 border-primary-red bg-white hover:bg-primary-red hover:text-white transition-all duration-300 flex items-center justify-center"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            data-testid="button-decrease-quantity"
                          >
                            <Minus className="w-5 h-5" />
                          </motion.button>
                          <motion.div
                            className="flex-1"
                            whileFocus={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                              min="1"
                              max="1000"
                              className="form-field text-lg h-14 rounded-2xl border-2 text-center font-bold bg-gradient-to-r from-white to-warm-beige/5 focus:from-warm-beige/10 focus:to-white transition-all duration-300 hover:shadow-md"
                              data-testid="input-quantity"
                            />
                          </motion.div>
                          <motion.button
                            type="button"
                            onClick={increaseQuantity}
                            className="w-12 h-12 rounded-full border-2 border-primary-red bg-white hover:bg-primary-red hover:text-white transition-all duration-300 flex items-center justify-center"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            data-testid="button-increase-quantity"
                          >
                            <Plus className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-primary-red font-arabic" />
                      
                      {/* Quantity Info */}
                      {effectiveBags > 0 && (
                        <motion.div 
                          className="mt-2 p-3 bg-blue-50 rounded-lg"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p className="text-sm text-blue-800 font-arabic" data-testid="text-quantity-info">
                            📊 إجمالي: {effectiveBags} كيس ({totalCups} كأس) - نوع السعر: {pricingTier.nameArabic}
                          </p>
                        </motion.div>
                      )}
                    </FormItem>
                  )}
                />
              </motion.div>


              {/* Notes Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-gray-800 font-arabic flex items-center gap-2">
                        📝 ملاحظات إضافية
                        <motion.span 
                          className="text-xs bg-gray-500 text-white px-2 py-1 rounded-full"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          اختياري
                        </motion.span>
                      </FormLabel>
                      <FormControl>
                        <motion.div
                          whileFocus={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Textarea
                            {...field}
                            placeholder="أي ملاحظات أو تفاصيل إضافية تريد إخبارنا بها..."
                            className="form-field text-lg rounded-2xl border-2 font-arabic bg-gradient-to-r from-white to-warm-beige/5 focus:from-warm-beige/10 focus:to-white transition-all duration-300 hover:shadow-md resize-none"
                            rows={3}
                            data-testid="input-notes"
                          />
                        </motion.div>
                      </FormControl>
                      <FormMessage className="text-primary-red font-arabic" />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Order Summary */}
              {totalPrice > 0 && (
                <motion.div
                  className="bg-gradient-to-r from-warm-beige/10 to-primary-red/10 rounded-2xl p-6 border-2 border-warm-beige/30"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.3 }}
                  data-testid="order-summary"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4 font-arabic flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-primary-red" />
                    ملخص الطلب
                  </h3>
                  <div className="space-y-3 font-arabic">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">سعر المنتج:</span>
                      <span className="font-bold text-primary-red" data-testid="text-product-price">{formatPrice(productPrice)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">التوصيل:</span>
                      <span className="font-bold text-green-600" data-testid="text-delivery-price">مجاني</span>
                    </div>
                    <div className="border-t pt-3 border-gray-300">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-800">المجموع الكلي:</span>
                        <motion.span 
                          className="text-2xl font-bold text-primary-red"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          data-testid="text-total-price"
                        >
                          {formatPrice(totalPrice)}
                        </motion.span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.4 }}
              >
                <Button
                  type="submit"
                  disabled={isSubmitting || rateLimited}
                  className="w-full h-16 text-xl font-bold rounded-2xl bg-gradient-to-r from-primary-red to-red-600 hover:from-red-600 hover:to-primary-red transform transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl font-arabic disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="button-submit"
                >
                  {isSubmitting ? (
                    <motion.div 
                      className="flex items-center gap-3"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Loader2 className="w-6 h-6 animate-spin" />
                      جاري إرسال الطلب...
                    </motion.div>
                  ) : rateLimited ? (
                    <span className="flex items-center gap-3">
                      ⏳ تم تجاوز الحد المسموح
                    </span>
                  ) : (
                    <motion.span 
                      className="flex items-center gap-3"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <ShoppingCart className="w-6 h-6" />
                      إرسال الطلب الآن
                    </motion.span>
                  )}
                </Button>
              </motion.div>
            </form>
          </Form>
        </motion.div>
      </div>
    </section>
  );
}