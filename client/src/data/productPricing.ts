// Product Configuration for Amiral Plast Cupping Cups
// كؤوس الحجامة أميرال بلاست

// TypeScript Interfaces
export interface ProductVariant {
  id: string;
  name: string;
  nameArabic: string;
  description?: string;
  pricePerCarton: number; // Price in DZD
  cupsPerCarton: number;
  available: boolean;
}

export interface Unit {
  id: string;
  name: string;
  nameArabic: string;
  factor: number; // Conversion factor for this unit
  minOrder: number; // Minimum order quantity in this unit
}

export interface PricingTier {
  id: string;
  name: string;
  nameArabic: string;
  minQuantityCartons: number;
  maxQuantityCartons?: number;
  description: string;
}

export interface DeliveryPolicy {
  freeDeliveryEnabled: boolean;
  freeDeliveryThreshold: number; // in cartons
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
    pricePerCarton: 17000,
    cupsPerCarton: 600,
    available: true
  },
  "medium_size_2": {
    id: "medium_size_2", 
    name: "Medium Size Cups No. 2",
    nameArabic: "كؤوس متوسطة الحجم رقم (2)",
    description: "Medium professional cupping cups",
    pricePerCarton: 17000,
    cupsPerCarton: 600,
    available: true
  },
  "medium_yellow_men_3": {
    id: "medium_yellow_men_3",
    name: "Medium Cups (Yellow Men) No. 3", 
    nameArabic: "كؤوس متوسطة (الأصفرين رجال) رقم (3)",
    description: "Medium yellow cupping cups for men",
    pricePerCarton: 16500,
    cupsPerCarton: 600,
    available: true
  },
  "medium_yellow_women_4": {
    id: "medium_yellow_women_4",
    name: "Medium Cups (Yellow Women) No. 4",
    nameArabic: "كؤوس متوسطة (الأصفرين نساء) رقم (4)", 
    description: "Medium yellow cupping cups for women",
    pricePerCarton: 16500,
    cupsPerCarton: 600,
    available: true
  },
  "small_tribal_6": {
    id: "small_tribal_6",
    name: "Small Cups (Tribal) No. 6",
    nameArabic: "كؤوس صغيرة (القبيلة) رقم (6)",
    description: "Small tribal cupping cups",
    pricePerCarton: 16000,
    cupsPerCarton: 600,
    available: true
  },
  "graduated_mixed": {
    id: "graduated_mixed",
    name: "Graduated Mixed Cups (2/2/2/2)",
    nameArabic: "كؤوس مدرجة (2/2/2/2)",
    description: "Mixed set of graduated cupping cups",
    pricePerCarton: 17000,
    cupsPerCarton: 600,
    available: true
  }
};

// Available Units
export const UNITS: Record<string, Unit> = {
  "carton": {
    id: "carton", 
    name: "Carton",
    nameArabic: "كرتون",
    factor: 1, // 1 carton = 1 unit
    minOrder: 1
  }
};

// Pricing Tiers
export const PRICING_TIERS: Record<string, PricingTier> = {
  "retail": {
    id: "retail",
    name: "Retail",
    nameArabic: "تجزئة",
    minQuantityCartons: 1,
    maxQuantityCartons: 49,
    description: "Individual or small quantity purchases"
  },
  "semi_wholesale": {
    id: "semi_wholesale", 
    name: "Semi-Wholesale",
    nameArabic: "نصف جملة",
    minQuantityCartons: 1,
    maxQuantityCartons: 49,
    description: "Medium quantity purchases under wholesale threshold"
  },
  "wholesale": {
    id: "wholesale",
    name: "Wholesale", 
    nameArabic: "جملة",
    minQuantityCartons: 50,
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
export const WHOLESALE_THRESHOLD_CARTONS = 50;
export const CUPS_PER_CARTON = 600;

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
export const getPricingTier = (quantityInCartons: number): PricingTier => {
  if (quantityInCartons >= WHOLESALE_THRESHOLD_CARTONS) {
    return PRICING_TIERS.wholesale;
  }
  return PRICING_TIERS.semi_wholesale;
};

/**
 * Check if quantity qualifies for wholesale pricing
 * التحقق من إمكانية الحصول على سعر الجملة
 */
export const isWholesaleQuantity = (quantityInCartons: number): boolean => {
  return quantityInCartons >= WHOLESALE_THRESHOLD_CARTONS;
};

/**
 * Convert quantity to base units (cartons)
 * تحويل الكمية إلى الوحدة الأساسية (كراتين)
 */
export const convertToCartons = (quantity: number, unitId: UnitId): number => {
  const unit = UNITS[unitId];
  return quantity * unit.factor;
};

/**
 * Convert quantity from cartons to any unit
 * تحويل الكمية من كراتين إلى أي وحدة
 */
export const convertFromCartons = (cartonsQuantity: number, targetUnitId: UnitId): number => {
  const unit = UNITS[targetUnitId];
  return cartonsQuantity / unit.factor;
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
  const quantityInCartons = convertToCartons(quantity, unitId);
  return variant.pricePerCarton * quantity;
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
  const quantityInCartons = convertToCartons(quantity, unitId);
  return quantity * variant.cupsPerCarton;
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
export const isFreeDeliveryEligible = (quantityInCartons: number): boolean => {
  return DELIVERY_POLICY.freeDeliveryEnabled && 
         quantityInCartons >= DELIVERY_POLICY.freeDeliveryThreshold;
};

/**
 * Get pricing tier message in Arabic
 * الحصول على رسالة نوع السعر بالعربية
 */
export const getPricingTierMessage = (quantityInCartons: number): string => {
  const tier = getPricingTier(quantityInCartons);
  if (tier.id === 'wholesale') {
    return `سعر الجملة - الكمية: ${quantityInCartons} كرتون`;
  }
  return `سعر نصف الجملة - الكمية: ${quantityInCartons} كرتون`;
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
  const quantityInCartons = unit ? convertToCartons(quantity, unitId as UnitId) : 0;
  if (quantityInCartons > 0 && quantityInCartons < WHOLESALE_THRESHOLD_CARTONS) {
    result.warnings.push(`Order ${WHOLESALE_THRESHOLD_CARTONS - quantityInCartons} more cartons to qualify for wholesale pricing`);
  }

  return result;
};