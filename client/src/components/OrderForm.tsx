import { motion } from 'framer-motion';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Minus, Plus, Loader2, Sparkles, Heart, Star } from 'lucide-react';
import { useOrderForm } from '@/hooks/useOrderForm';
import { DELIVERY_PRICES, type WilayaName, PRODUCT_PRICE, WILAYAS, hasOfficeDelivery, getOfficeDeliveryText } from '@/data/deliveryPrices';

export default function OrderForm() {
  const { form, isSubmitting, showSuccess, rateLimited, onSubmit, calculateTotal } = useOrderForm();

  const watchedValues = form.watch();
  const { wilaya, deliveryType, quantity } = watchedValues;

  const wilayaData = wilaya ? DELIVERY_PRICES[wilaya as WilayaName] : null;
  const deliveryPrice = wilayaData 
    ? (deliveryType === 'office' 
        ? (typeof wilayaData.deliveryOffice === 'number' ? wilayaData.deliveryOffice : wilayaData.deliveryHome)
        : wilayaData.deliveryHome)
    : 600;

  // Calculate product price with "Buy 2 Get 1 Free" offer (only first free item)
  const calculateProductPrice = (qty: number) => {
    if (qty >= 3) {
      // Only one free item regardless of quantity
      return (qty - 1) * PRODUCT_PRICE;
    }
    return qty * PRODUCT_PRICE;
  };

  const productPrice = calculateProductPrice(quantity);
  const totalPrice = productPrice + deliveryPrice;
  const hasFreeItem = quantity >= 3;

  const increaseQuantity = () => {
    const currentValue = form.getValues('quantity');
    if (currentValue < 50) {
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
                            <SelectTrigger className="form-field text-lg h-14 rounded-2xl border-2 font-arabic bg-gradient-to-r from-white to-warm-beige/5 hover:from-warm-beige/10 hover:to-white transition-all duration-300 hover:shadow-lg">
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
                          />
                        </motion.div>
                      </FormControl>
                      <FormMessage className="text-primary-red font-arabic" />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Enhanced Delivery Type with Smooth Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <FormField
                  control={form.control}
                  name="deliveryType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-gray-800 font-arabic flex items-center gap-2">
                        🚚 نوع التوصيل *
                        <motion.span 
                          className="text-xs bg-primary-red text-white px-2 py-1 rounded-full"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          اختر الأنسب
                        </motion.span>
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                          {/* Office Delivery Option - Hide if not available */}
                          {(!wilaya || hasOfficeDelivery(wilaya as WilayaName)) ? (
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <RadioGroupItem value="office" id="office" className="peer sr-only" />
                              <Label 
                                htmlFor="office" 
                                className={`relative form-field border-2 rounded-2xl p-6 cursor-pointer block transition-all duration-300 hover:shadow-lg ${
                                  field.value === 'office' 
                                    ? 'border-primary-red bg-primary-red/10 shadow-lg' 
                                    : 'border-gray-200 bg-white hover:border-warm-beige hover:bg-warm-beige/5'
                                }`}
                              >
                                {/* Selection Indicator */}
                                {field.value === 'office' && (
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
                                    animate={{ rotate: field.value === 'office' ? [0, 10, 0] : 0 }}
                                    transition={{ duration: 0.5 }}
                                  >
                                    🏢
                                  </motion.div>
                                  <h3 className="font-semibold text-lg mb-2 font-arabic">التوصيل للمكتب</h3>
                                  <motion.p 
                                    className="text-2xl font-bold text-primary-red mb-2"
                                    animate={{ 
                                      scale: field.value === 'office' ? [1, 1.1, 1] : 1,
                                      color: field.value === 'office' ? '#DC2626' : '#374151'
                                    }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    {wilaya
                                      ? getOfficeDeliveryText(wilaya as WilayaName)
                                      : '400 دج'
                                    }
                                  </motion.p>
                                  <p className="text-sm text-gray-600 font-arabic">استلام من مكتب البريد</p>
                                  <motion.div
                                    className="mt-2 text-xs text-blue-600 font-arabic"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: field.value === 'office' ? 1 : 0.7 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    ⚡ أسرع وأرخص
                                  </motion.div>
                                </div>
                              </Label>
                            </motion.div>
                          ) : (
                            <motion.div
                              initial={{ opacity: 0.5 }}
                              animate={{ opacity: 0.5 }}
                              className="border-2 border-gray-300 rounded-2xl p-6 bg-gray-100"
                            >
                              <div className="text-center">
                                <div className="text-4xl mb-3 opacity-50">🏢</div>
                                <h3 className="font-semibold text-lg mb-2 font-arabic text-gray-500">التوصيل للمكتب</h3>
                                <p className="text-xl font-bold text-gray-500 mb-2">لا يوجد مكتب</p>
                                <p className="text-sm text-gray-500 font-arabic">غير متوفر في هذه الولاية</p>
                              </div>
                            </motion.div>
                          )}

                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <RadioGroupItem value="home" id="home" className="peer sr-only" />
                            <Label 
                              htmlFor="home" 
                              className={`relative form-field border-2 rounded-2xl p-6 cursor-pointer block transition-all duration-300 hover:shadow-lg ${
                                field.value === 'home' 
                                  ? 'border-primary-red bg-primary-red/10 shadow-lg' 
                                  : 'border-gray-200 bg-white hover:border-warm-beige hover:bg-warm-beige/5'
                              }`}
                            >
                              {/* Selection Indicator */}
                              {field.value === 'home' && (
                                <motion.div
                                  className="absolute top-3 right-3 w-6 h-6 bg-primary-red rounded-full flex items-center justify-center"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 400 }}
                                >
                                  <motion.span
                                    className="text-white text-sm"
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
                                  animate={{ rotate: field.value === 'home' ? [0, 10, 0] : 0 }}
                                  transition={{ duration: 0.5 }}
                                >
                                  🏠
                                </motion.div>
                                <h3 className="font-semibold text-lg mb-2 font-arabic">التوصيل للمنزل</h3>
                                <motion.p 
                                  className="text-2xl font-bold text-primary-red mb-2"
                                  animate={{ 
                                    scale: field.value === 'home' ? [1, 1.1, 1] : 1,
                                    color: field.value === 'home' ? '#DC2626' : '#374151'
                                  }}
                                  transition={{ duration: 0.3 }}
                                >
                                  {wilaya && DELIVERY_PRICES[wilaya as WilayaName] ? DELIVERY_PRICES[wilaya as WilayaName].deliveryHome : 600} دج
                                </motion.p>
                                <p className="text-sm text-gray-600 font-arabic">يصل لباب المنزل</p>
                                <motion.div
                                  className="mt-2 text-xs text-blue-600 font-arabic"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: field.value === 'home' ? 1 : 0 }}
                                >
                                  🏃‍♂️ راحة أكثر!
                                </motion.div>
                              </div>
                            </Label>
                          </motion.div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage className="text-primary-red font-arabic" />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Enhanced Quantity Selector */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-gray-800 font-arabic flex items-center gap-2">
                        📦 الكمية
                        {field.value > 1 && (
                          <motion.span 
                            className="text-xs bg-green-500 text-white px-2 py-1 rounded-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            خصم كمية!
                          </motion.span>
                        )}
                      </FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <div className="flex items-center justify-center space-x-4 space-x-reverse bg-gradient-to-r from-warm-beige/10 to-gold-accent/10 rounded-2xl p-4">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button 
                                type="button" 
                                variant="outline"
                                size="icon"
                                className="w-14 h-14 rounded-full border-2 border-primary-red text-primary-red hover:bg-primary-red hover:text-white transition-all duration-300"
                                onClick={decreaseQuantity}
                                disabled={field.value <= 1}
                              >
                                <Minus className="h-5 w-5" />
                              </Button>
                            </motion.div>

                            <motion.div
                              className="relative"
                              animate={{ scale: [1, 1.05, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <Input 
                                {...field}
                                type="number"
                                min="1"
                                max="50"
                                className="form-field w-20 text-center text-2xl font-bold h-14 rounded-xl border-2 border-primary-red bg-white shadow-lg"
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                              />
                              <motion.div
                                className="absolute -top-2 -right-2 w-6 h-6 bg-primary-red rounded-full flex items-center justify-center"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                              >
                                <span className="text-white text-xs">✨</span>
                              </motion.div>
                            </motion.div>

                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button 
                                type="button" 
                                variant="outline"
                                size="icon"
                                className="w-14 h-14 rounded-full border-2 border-primary-red text-primary-red hover:bg-primary-red hover:text-white transition-all duration-300"
                                onClick={increaseQuantity}
                                disabled={field.value >= 50}
                              >
                                <Plus className="h-5 w-5" />
                              </Button>
                            </motion.div>
                          </div>

                          {/* Quantity Benefits */}
                          <motion.div 
                            className="text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                          >
                            {field.value === 1 && (
                              <p className="text-sm text-gray-600 font-arabic">💡 اشتر فوق علبتين واحصل على الثالثة مجاناً!</p>
                            )}
                            {field.value === 2 && (
                              <motion.p 
                                className="text-sm text-green-600 font-arabic"
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                              >
                                🎉 علبة واحدة أخرى وستحصل على الثالثة مجاناً!
                              </motion.p>
                            )}
                            {field.value >= 3 && (
                              <motion.p 
                                className="text-sm text-primary-red font-arabic font-bold"
                                animate={{ 
                                  scale: [1, 1.1, 1],
                                  color: ['#DC2626', '#16A34A', '#DC2626']
                                }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              >
                                🎁 مبروك! + علبة مجانية
                              </motion.p>
                            )}
                          </motion.div>
                        </div>
                      </FormControl>
                      <FormMessage className="text-primary-red font-arabic" />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Enhanced Total Price Display */}
              <motion.div 
                className="relative bg-gradient-to-br from-warm-beige/20 to-gold-accent/10 rounded-2xl p-6 space-y-3 border border-warm-beige/30 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 10px 25px rgba(220, 38, 38, 0.1)",
                  transition: { duration: 0.3 }
                }}
              >
                {/* Animated Background Pattern */}
                <motion.div
                  className="absolute inset-0 opacity-5"
                  animate={{ 
                    backgroundPosition: ['0% 0%', '100% 100%'],
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  style={{
                    backgroundImage: 'radial-gradient(circle, #DC2626 2px, transparent 2px)',
                    backgroundSize: '20px 20px'
                  }}
                />

                <motion.div 
                  className="flex justify-between text-lg font-arabic relative z-10"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <span>سعر المنتج:</span>
                  <div className="text-right">
                    <motion.span 
                      className="font-semibold text-gray-700"
                      animate={{ color: ['#374151', '#DC2626', '#374151'] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {productPrice} دج
                    </motion.span>
                    {hasFreeItem && (
                      <motion.div 
                        className="text-sm text-green-600 font-bold"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        🎁 + علبة مجانية
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                <motion.div 
                  className="flex justify-between text-lg font-arabic relative z-10"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <span>التوصيل:</span>
                  <span className="font-semibold text-gray-700">{deliveryPrice} دج</span>
                </motion.div>

                <div className="border-t border-warm-beige/50 pt-3 relative z-10">
                  <motion.div 
                    className="flex justify-between text-2xl font-bold text-primary-red font-arabic"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
                  >
                    <span>المجموع:</span>
                    <motion.span
                      animate={{ 
                        scale: [1, 1.05, 1],
                        textShadow: [
                          '0 0 0px rgba(220, 38, 38, 0)',
                          '0 0 10px rgba(220, 38, 38, 0.3)',
                          '0 0 0px rgba(220, 38, 38, 0)'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {totalPrice} دج
                    </motion.span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold text-gray-800 font-arabic">ملاحظات إضافية</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="أي ملاحظات خاصة بطلبك..."
                        rows={4}
                        className="form-field rounded-2xl border-2 resize-none font-arabic"
                      />
                    </FormControl>
                    <FormMessage className="text-primary-red font-arabic" />
                  </FormItem>
                )}
              />

              {/* Rate Limiting Warning */}
              {rateLimited && (
                <motion.div 
                  className="bg-orange-50 border border-orange-200 rounded-2xl p-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-orange-800 text-sm font-arabic">تم إرسال طلب من جهازك خلال الساعة الماضية. يرجى الانتظار قبل إرسال طلب جديد.</p>
                </motion.div>
              )}

              {/* Enhanced Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                <motion.div
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 15px 35px rgba(220, 38, 38, 0.4)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="relative w-full bg-gradient-to-r from-primary-red via-red-600 to-primary-red text-white text-xl font-bold py-6 rounded-2xl hover:from-red-700 hover:via-red-600 hover:to-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 transition-all duration-500 pulse-glow font-arabic h-16 overflow-hidden group"
                  >
                    {/* Animated background effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{
                        x: isSubmitting ? ['-100%', '100%'] : '-100%',
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: isSubmitting ? Infinity : 0,
                        ease: "linear"
                      }}
                    />

                    <motion.span
                      className="relative z-10 flex items-center justify-center gap-3"
                      animate={isSubmitting ? {
                        y: [0, -2, 0],
                        transition: { duration: 1, repeat: Infinity }
                      } : {}}
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Loader2 className="w-6 h-6" />
                          </motion.div>
                          <span>جاري الإرسال...</span>
                        </>
                      ) : (
                        <>
                          <motion.span
                            animate={{ 
                              rotate: [0, 10, 0],
                              scale: [1, 1.1, 1]
                            }}
                            transition={{ 
                              duration: 2, 
                              repeat: Infinity,
                              repeatType: "reverse"
                            }}
                          >
                            🛒
                          </motion.span>
                          <span>إرسال الطلب</span>
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ 
                              duration: 2, 
                              repeat: Infinity,
                              repeatType: "reverse"
                            }}
                          >
                            ✨
                          </motion.div>
                        </>
                      )}
                    </motion.span>
                  </Button>
                </motion.div>
              </motion.div>
            </form>
          </Form>
        </motion.div>
      </div>
    </section>
  );
}