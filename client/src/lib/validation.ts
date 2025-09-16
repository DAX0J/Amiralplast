export function validatePhone(phone: string): string | null {
  if (!phone) return 'رقم الهاتف مطلوب';
  
  const phoneRegex = /^(07|05|06)\d{8}$/;
  if (!phoneRegex.test(phone)) {
    return 'رقم غير صالح — أدخل رقمًا صحيحًا من شبكات الجزائر (07/05/06)';
  }
  
  // Check for repeated digits
  const repeatedRegex = /^(\d)\1{9}$/;
  if (repeatedRegex.test(phone)) {
    return 'رقم غير صالح — تحقق من عدم تكرار الأرقام';
  }
  
  return null;
}

export function validateFullName(name: string): string | null {
  if (!name.trim()) return 'الاسم الكامل مطلوب';
  if (name.trim().length < 2) return 'الاسم يجب أن يكون أكثر من حرف واحد';
  return null;
}

export function validateWilaya(wilaya: string): string | null {
  if (!wilaya) return 'الولاية مطلوبة';
  return null;
}

export function validateBaladia(baladia: string): string | null {
  if (!baladia.trim()) return 'البلدية مطلوبة';
  return null;
}

export function validateQuantity(quantity: number): string | null {
  if (!quantity || quantity < 1) return 'الكمية يجب أن تكون 1 على الأقل';
  if (quantity > 50) return 'الكمية لا يمكن أن تكون أكثر من 50';
  return null;
}
