// Product Configuration for Amiral Plast Cupping Cups
// كؤوس الحجامة أميرال بلاست

// TypeScript Interfaces
export interface ProductVariant {
  id: string;
  name: string;
  nameArabic: string;
  description?: string;
  pricePerBag: number; // Price in DZD
  cupsPerBag: number;
  available: boolean;
}

export interface Unit {
  id: string;
  name: string;
  nameArabic: string;
  factor: number; // How many bags this unit contains
  minOrder: number; // Minimum order quantity in this unit
}

export interface PricingTier {
  id: string;
  name: string;
  nameArabic: string;
  minQuantityBags: number;
  maxQuantityBags?: number;
  description: string;
}

export interface DeliveryPolicy {
  freeDeliveryEnabled: boolean;
  freeDeliveryThreshold: number; // in bags
  freeDeliveryMessage: string;
  freeDeliveryMessageArabic: string;
}

// Product Variants - 6 Cup Types
export const PRODUCT_VARIANTS: Record<string, ProductVariant> = {
  "large_size_1": {
    id: "large_size_1",
    name: "Large Size Cups No. 1",
    nameArabic: "كؤوس كبيرة الحجم رقم (1)",
    description: "Large professional cupping cups",
    pricePerBag: 17000,
    cupsPerBag: 6,
    available: true
  },
  "medium_size_2": {
    id: "medium_size_2", 
    name: "Medium Size Cups No. 2",
    nameArabic: "كؤوس متوسطة الحجم رقم (2)",
    description: "Medium professional cupping cups",
    pricePerBag: 17000,
    cupsPerBag: 6,
    available: true
  },
  "medium_yellow_men_3": {
    id: "medium_yellow_men_3",
    name: "Medium Cups (Yellow Men) No. 3", 
    nameArabic: "كؤوس متوسطة (الأصفرين رجال) رقم (3)",
    description: "Medium yellow cupping cups for men",
    pricePerBag: 16500,
    cupsPerBag: 6,
    available: true
  },
  "medium_yellow_women_4": {
    id: "medium_yellow_women_4",
    name: "Medium Cups (Yellow Women) No. 4",
    nameArabic: "كؤوس متوسطة (الأصفرين نساء) رقم (4)", 
    description: "Medium yellow cupping cups for women",
    pricePerBag: 16500,
    cupsPerBag: 6,
    available: true
  },
  "small_tribal_6": {
    id: "small_tribal_6",
    name: "Small Cups (Tribal) No. 6",
    nameArabic: "كؤوس صغيرة (القبيلة) رقم (6)",
    description: "Small tribal cupping cups",
    pricePerBag: 16000,
    cupsPerBag: 6,
    available: true
  },
  "graduated_mixed": {
    id: "graduated_mixed",
    name: "Graduated Mixed Cups (2/2/2/2)",
    nameArabic: "كؤوس مدرجة (2/2/2/2)",
    description: "Mixed set of graduated cupping cups",
    pricePerBag: 17000,
    cupsPerBag: 6,
    available: true
  }
};

// Available Units
export const UNITS: Record<string, Unit> = {
  "bag": {
    id: "bag",
    name: "Bag",
    nameArabic: "كيس",
    factor: 1, // 1 bag = 1 bag
    minOrder: 1
  },
  "carton": {
    id: "carton", 
    name: "Carton",
    nameArabic: "كرتون",
    factor: 100, // 1 carton = 100 bags
    minOrder: 1
  }
};

// Pricing Tiers
export const PRICING_TIERS: Record<string, PricingTier> = {
  "retail": {
    id: "retail",
    name: "Retail",
    nameArabic: "تجزئة",
    minQuantityBags: 1,
    maxQuantityBags: 49,
    description: "Individual or small quantity purchases"
  },
  "semi_wholesale": {
    id: "semi_wholesale", 
    name: "Semi-Wholesale",
    nameArabic: "نصف جملة",
    minQuantityBags: 1,
    maxQuantityBags: 49,
    description: "Medium quantity purchases under wholesale threshold"
  },
  "wholesale": {
    id: "wholesale",
    name: "Wholesale", 
    nameArabic: "جملة",
    minQuantityBags: 50,
    description: "Bulk purchases of 50 bags or more"
  }
};

// Delivery Policy
export const DELIVERY_POLICY: DeliveryPolicy = {
  freeDeliveryEnabled: true,
  freeDeliveryThreshold: 1, // Free delivery for any order
  freeDeliveryMessage: "Free delivery on all orders",
  freeDeliveryMessageArabic: "توصيل مجاني على جميع الطلبات"
};

// Constants
export const WHOLESALE_THRESHOLD_BAGS = 50;
export const CUPS_PER_BAG = 6;
export const BAGS_PER_CARTON = 100;

// Type exports for arrays
export type ProductVariantId = keyof typeof PRODUCT_VARIANTS;
export type UnitId = keyof typeof UNITS;
export type PricingTierId = keyof typeof PRICING_TIERS;

// Array exports for easy iteration
export const PRODUCT_VARIANT_IDS = Object.keys(PRODUCT_VARIANTS) as ProductVariantId[];
export const UNIT_IDS = Object.keys(UNITS) as UnitId[];
export const PRICING_TIER_IDS = Object.keys(PRICING_TIERS) as PricingTierId[];

// Helper Functions

/**
 * Get pricing tier based on quantity in bags
 * تحديد نوع السعر حسب الكمية
 */
export const getPricingTier = (quantityInBags: number): PricingTier => {
  if (quantityInBags >= WHOLESALE_THRESHOLD_BAGS) {
    return PRICING_TIERS.wholesale;
  }
  return PRICING_TIERS.semi_wholesale;
};

/**
 * Check if quantity qualifies for wholesale pricing
 * التحقق من إمكانية الحصول على سعر الجملة
 */
export const isWholesaleQuantity = (quantityInBags: number): boolean => {
  return quantityInBags >= WHOLESALE_THRESHOLD_BAGS;
};

/**
 * Convert quantity from any unit to bags
 * تحويل الكمية من أي وحدة إلى أكياس
 */
export const convertToBags = (quantity: number, unitId: UnitId): number => {
  const unit = UNITS[unitId];
  return quantity * unit.factor;
};

/**
 * Convert quantity from bags to any unit
 * تحويل الكمية من أكياس إلى أي وحدة
 */
export const convertFromBags = (bagsQuantity: number, targetUnitId: UnitId): number => {
  const unit = UNITS[targetUnitId];
  return bagsQuantity / unit.factor;
};

/**
 * Calculate total price for a product variant and quantity
 * حساب السعر الإجمالي لنوع المنتج والكمية
 */
export const calculateTotalPrice = (
  variantId: ProductVariantId, 
  quantity: number, 
  unitId: UnitId
): number => {
  const variant = PRODUCT_VARIANTS[variantId];
  const quantityInBags = convertToBags(quantity, unitId);
  return variant.pricePerBag * quantityInBags;
};

/**
 * Calculate total cups in an order
 * حساب العدد الإجمالي للكؤوس في الطلب
 */
export const calculateTotalCups = (
  variantId: ProductVariantId,
  quantity: number,
  unitId: UnitId
): number => {
  const variant = PRODUCT_VARIANTS[variantId];
  const quantityInBags = convertToBags(quantity, unitId);
  return quantityInBags * variant.cupsPerBag;
};

/**
 * Get product variant by ID with error handling
 * الحصول على نوع المنتج بالمعرف مع معالجة الأخطاء
 */
export const getProductVariant = (variantId: string): ProductVariant | null => {
  return PRODUCT_VARIANTS[variantId as ProductVariantId] || null;
};

/**
 * Get unit by ID with error handling
 * الحصول على الوحدة بالمعرف مع معالجة الأخطاء
 */
export const getUnit = (unitId: string): Unit | null => {
  return UNITS[unitId as UnitId] || null;
};

/**
 * Format price in DZD with proper localization
 * تنسيق السعر بالدينار الجزائري
 */
export const formatPrice = (price: number): string => {
  return `${price.toLocaleString()} دج`;
};

/**
 * Check if free delivery applies to the order
 * التحقق من إمكانية التوصيل المجاني للطلب
 */
export const isFreeDeliveryEligible = (quantityInBags: number): boolean => {
  return DELIVERY_POLICY.freeDeliveryEnabled && 
         quantityInBags >= DELIVERY_POLICY.freeDeliveryThreshold;
};

/**
 * Get pricing tier message in Arabic
 * الحصول على رسالة نوع السعر بالعربية
 */
export const getPricingTierMessage = (quantityInBags: number): string => {
  const tier = getPricingTier(quantityInBags);
  if (tier.id === 'wholesale') {
    return `سعر الجملة - الكمية: ${quantityInBags} كيس`;
  }
  return `سعر نصف الجملة - الكمية: ${quantityInBags} كيس`;
};

/**
 * Get available variants list for select components
 * الحصول على قائمة الأنواع المتاحة لمكونات الاختيار
 */
export const getAvailableVariants = (): ProductVariant[] => {
  return Object.values(PRODUCT_VARIANTS).filter(variant => variant.available);
};

/**
 * Validate order configuration
 * التحقق من صحة إعدادات الطلب
 */
export interface OrderValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export const validateOrder = (
  variantId: string,
  quantity: number,
  unitId: string
): OrderValidationResult => {
  const result: OrderValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  // Check if variant exists
  const variant = getProductVariant(variantId);
  if (!variant) {
    result.isValid = false;
    result.errors.push("Product variant not found");
  }

  // Check if variant is available
  if (variant && !variant.available) {
    result.isValid = false;
    result.errors.push("Product variant is not available");
  }

  // Check if unit exists
  const unit = getUnit(unitId);
  if (!unit) {
    result.isValid = false;
    result.errors.push("Unit not found");
  }

  // Check minimum order quantity
  if (unit && quantity < unit.minOrder) {
    result.isValid = false;
    result.errors.push(`Minimum order quantity is ${unit.minOrder} ${unit.name}`);
  }

  // Check if quantity is positive
  if (quantity <= 0) {
    result.isValid = false;
    result.errors.push("Quantity must be greater than 0");
  }

  // Add wholesale warning
  const quantityInBags = unit ? convertToBags(quantity, unitId as UnitId) : 0;
  if (quantityInBags > 0 && quantityInBags < WHOLESALE_THRESHOLD_BAGS) {
    result.warnings.push(`Order ${WHOLESALE_THRESHOLD_BAGS - quantityInBags} more bags to qualify for wholesale pricing`);
  }

  return result;
};