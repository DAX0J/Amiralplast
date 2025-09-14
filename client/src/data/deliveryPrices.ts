
export const DELIVERY_PRICES = {
  "أدرار": { deliveryOffice: 600, deliveryHome: 1100 },
  "الشلف": { deliveryOffice: 400, deliveryHome: 700 },
  "الأغواط": { deliveryOffice: 500, deliveryHome: 900 },
  "أم_البواقي": { deliveryOffice: 500, deliveryHome: 700 },
  "باتنة": { deliveryOffice: 400, deliveryHome: 600 },
  "بجاية": { deliveryOffice: 400, deliveryHome: 600 },
  "بسكرة": { deliveryOffice: 500, deliveryHome: 800 },
  "بشار": { deliveryOffice: 600, deliveryHome: 1100 },
  "البليدة": { deliveryOffice: 400, deliveryHome: 500 },
  "البويرة": { deliveryOffice: 400, deliveryHome: 700 },
  "تمنراست": { deliveryOffice: 800, deliveryHome: 1300 },
  "تبسة": { deliveryOffice: 400, deliveryHome: 800 },
  "تلمسان": { deliveryOffice: 400, deliveryHome: 800 },
  "تيارت": { deliveryOffice: 400, deliveryHome: 800 },
  "تيزي وزو": { deliveryOffice: 400, deliveryHome: 700 },
  "الجزائر": { deliveryOffice: 350, deliveryHome: 500 },
  "الجلفة": { deliveryOffice: 500, deliveryHome: 900 },
  "جيجل": { deliveryOffice: 400, deliveryHome: 600 },
  "سطيف": { deliveryOffice: 250, deliveryHome: 400 },
  "سعيدة": { deliveryOffice: 400, deliveryHome: 800 },
  "سكيكدة": { deliveryOffice: 400, deliveryHome: 650 },
  "سيدي_بلعباس": { deliveryOffice: 400, deliveryHome: 800 },
  "عنابة": { deliveryOffice: 400, deliveryHome: 700 },
  "قالمة": { deliveryOffice: 400, deliveryHome: 700 },
  "قسنطينة": { deliveryOffice: 400, deliveryHome: 600 },
  "المدية": { deliveryOffice: 400, deliveryHome: 700 },
  "مستغانم": { deliveryOffice: 400, deliveryHome: 700 },
  "المسيلة": { deliveryOffice: 400, deliveryHome: 700 },
  "معسكر": { deliveryOffice: 400, deliveryHome: 700 },
  "ورقلة": { deliveryOffice: 500, deliveryHome: 1000 },
  "وهران": { deliveryOffice: 400, deliveryHome: 700 },
  "البيض": { deliveryOffice: 500, deliveryHome: 1000 },
  "إليزي": { deliveryOffice: 600, deliveryHome: 1300 },
  "برج_بوعريريج": { deliveryOffice: 400, deliveryHome: 600 },
  "بومرداس": { deliveryOffice: 400, deliveryHome: 700 },
  "الطارف": { deliveryOffice: "No Office", deliveryHome: 700 },
  "تندوف": { deliveryOffice: "No Office", deliveryHome: 1300 },
  "تيسمسيلت": { deliveryOffice: 400, deliveryHome: 800 },
  "الوادي": { deliveryOffice: 500, deliveryHome: 900 },
  "خنشلة": { deliveryOffice: 500, deliveryHome: 700 },
  "سوق_أهراس": { deliveryOffice: 500, deliveryHome: 800 },
  "تيبازة": { deliveryOffice: 400, deliveryHome: 700 },
  "ميلة": { deliveryOffice: 400, deliveryHome: 600 },
  "عين_الدفلة": { deliveryOffice: 400, deliveryHome: 700 },
  "النعامة": { deliveryOffice: "No Office", deliveryHome: 1000 },
  "عين تيموشنت": { deliveryOffice: 400, deliveryHome: 800 },
  "غرداية": { deliveryOffice: 500, deliveryHome: 900 },
  "غليزان": { deliveryOffice: 400, deliveryHome: 700 },
  "تيميمون": { deliveryOffice: "No Office", deliveryHome: 1300 },
  "أولاد_جلال": { deliveryOffice: "No Office", deliveryHome: 900 },
  "بني_عباس": { deliveryOffice: "No Office", deliveryHome: 1300 },
  "عين_صالح": { deliveryOffice: 600, deliveryHome: 1300 },
  "تقرت": { deliveryOffice: "No Office", deliveryHome: 900 },
  "المغير": { deliveryOffice: "No Office", deliveryHome: 900 },
  "المنيعة": { deliveryOffice: "No Office", deliveryHome: 1000 },
  "عين_قزام": { deliveryOffice: "No Office", deliveryHome: 1300 },
  "جانت": { deliveryOffice: "No Office", deliveryHome: 1300 },
  "برج_باجي_مختار": { deliveryOffice: "No Office", deliveryHome: 1300 }
};

export type WilayaName = keyof typeof DELIVERY_PRICES;
export type DeliveryOfficeType = number | "No Office";

export const WILAYAS = Object.keys(DELIVERY_PRICES) as WilayaName[];

export const PRODUCT_PRICE = 2500;

// Helper function للتحقق من توفر التوصيل للمكتب
export const hasOfficeDelivery = (wilaya: WilayaName): boolean => {
  return DELIVERY_PRICES[wilaya]?.deliveryOffice !== "No Office";
};

// Helper function للحصول على النص المناسب للتوصيل للمكتب
export const getOfficeDeliveryText = (wilaya: WilayaName): string => {
  const price = DELIVERY_PRICES[wilaya]?.deliveryOffice;
  return price === "No Office" ? "لا يوجد مكتب" : `${price} دج`;
};
