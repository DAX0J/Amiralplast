import { useEffect } from 'react';
import { motion } from 'framer-motion';
import HeroSection from '@/components/HeroSection';
import OrderForm from '@/components/OrderForm';
import FloatingCTA from '@/components/FloatingCTA';
import { enableImageProtection, disablePrintScreen, addAdvancedWatermark } from '@/lib/imageProtection';
import { initializeFacebookPixel, trackViewContent } from '@/lib/facebookPixelDirect';

export default function LandingPage() {
  useEffect(() => {
    let isInitialized = false;
    
    const initializeServices = async () => {
      if (isInitialized) return;
      isInitialized = true;
      
      // Enable safe image protection (no blur issues)
      enableImageProtection();
      disablePrintScreen();
      
      // Add advanced watermarking after a delay
      setTimeout(() => {
        addAdvancedWatermark();
      }, 2000);
      
      // Initialize Facebook Pixel only once
      try {
        const initialized = await initializeFacebookPixel();
        if (initialized) {
          trackViewContent({
            content_name: 'زيت لبان الذكر الطبيعي',
            content_category: 'Essential Oils',
            content_ids: ['frankincense-oil'],
            value: 3500,
            currency: 'DZD'
          });
        }
      } catch (error) {
        console.warn('Facebook Pixel initialization failed:', error);
      }
    };
    
    // Additional performance optimizations
    const preloadFonts = () => {
      if (document.querySelector('link[href*="fonts.googleapis.com"]')) return;
      
      const link1 = document.createElement('link');
      link1.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap';
      link1.rel = 'preload';
      link1.as = 'style';
      
      const link2 = document.createElement('link');
      link2.href = 'https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&display=swap';
      link2.rel = 'preload';
      link2.as = 'style';
      
      document.head.appendChild(link1);
      document.head.appendChild(link2);
    };
    
    preloadFonts();
    initializeServices();
    
    return () => {
      isInitialized = false;
    };
  }, []);

  const scrollToForm = () => {
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
      orderForm.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Order Form Section */}
      <OrderForm />
      
      

      {/* Floating CTA */}
      <FloatingCTA onScrollToForm={scrollToForm} />

      {/* NoScript fallback */}
      <noscript>
        <div className="fixed top-0 left-0 right-0 bg-primary-red text-white p-4 text-center z-50 font-arabic">
          يرجى تفعيل JavaScript لاستخدام هذا الموقع
        </div>
      </noscript>
    </div>
  );
}
