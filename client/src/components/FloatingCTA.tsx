import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { trackInitiateCheckout } from '@/lib/facebookPixelDirect';

interface FloatingCTAProps {
  onScrollToForm: () => void;
}

export default function FloatingCTA({ onScrollToForm }: FloatingCTAProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const orderFormEntry = entries.find(entry => entry.target.id === 'orderForm');
        const footerEntry = entries.find(entry => entry.target.tagName === 'FOOTER');
        
        if (orderFormEntry || footerEntry) {
          const shouldHide = entries.some(entry => entry.isIntersecting && entry.intersectionRatio > 0.3);
          setIsVisible(!shouldHide);
        }
      },
      {
        threshold: 0.3,
        rootMargin: '0px'
      }
    );

    const orderForm = document.getElementById('orderForm');
    const footer = document.querySelector('footer');

    if (orderForm) observer.observe(orderForm);
    if (footer) observer.observe(footer);

    return () => {
      if (orderForm) observer.unobserve(orderForm);
      if (footer) observer.unobserve(footer);
    };
  }, []);

  const handleClick = () => {
    onScrollToForm();
    // Track CTA click with secure Facebook Pixel
    trackInitiateCheckout();
  };

  return (
    <motion.button
      className="floating-cta bg-primary-red text-white px-8 py-4 rounded-full text-lg font-bold shadow-2xl hover:bg-red-700 transition-all duration-300 pulse-glow font-arabic"
      onClick={handleClick}
      initial={{ y: 100, opacity: 0 }}
      animate={{ 
        y: isVisible ? 0 : 100, 
        opacity: isVisible ? 1 : 0 
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        whiteSpace: 'nowrap',
        fontSize: 'clamp(16px, 4vw, 18px)',
        padding: '12px 24px',
        minHeight: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      اطلب الآن
    </motion.button>
  );
}
