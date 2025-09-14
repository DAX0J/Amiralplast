import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import landingImage from '@assets/landing-page_1755744926298.webp';

export default function HeroSection() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    // Immediate loading for better performance
    const timer = setTimeout(() => {
      setShowImage(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleDragStart = (e: React.DragEvent | DragEvent) => {
    e.preventDefault();
  };

  return (
    <section id="hero" className="relative w-full">
      <div className="image-container relative overflow-hidden">
        {/* Loading overlay with enhanced animation */}
        {!imageLoaded && (
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-warm-beige/30 to-primary-red/10 flex items-center justify-center z-10"
            initial={{ opacity: 1 }}
            animate={{ opacity: showImage ? 0 : 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <motion.div 
                className="w-16 h-16 border-4 border-primary-red border-t-transparent rounded-full mx-auto mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <motion.p 
                className="text-gray-700 text-xl font-bold font-arabic"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                جاري تحميل الصورة...
              </motion.p>
            </div>
          </motion.div>
        )}
        
        {/* Priority preloaded image with enhanced protection */}
        <motion.img 
          src={landingImage}
          alt="كؤوس الحجامة الطبية من أميرال بلاست"
          className={`w-full h-auto protected-image ${showImage ? 'block' : 'hidden'}`}
          onLoad={handleImageLoad}
          onContextMenu={handleContextMenu}
          onDragStart={(e) => e.preventDefault()}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: imageLoaded ? 1 : 0, scale: imageLoaded ? 1 : 1.05 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none',
            userSelect: 'none'
          }}
        />
        
        {/* Invisible protection overlay */}
        <div className="absolute inset-0 watermark-overlay z-5"></div>
        <div 
          className="absolute inset-0 z-10" 
          style={{ 
            background: 'transparent',
            pointerEvents: 'none' 
          }}
        ></div>
        
        
      </div>
    </section>
  );
}
