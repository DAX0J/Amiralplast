// Direct Facebook Pixel Implementation (No Backend Required)

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

export interface PixelEventData {
  content_type?: string;
  content_ids?: string[];
  content_name?: string;
  content_category?: string;
  value?: number;
  currency?: string;
  num_items?: number;
  contents?: Array<{
    id: string;
    quantity: number;
    item_price: number;
  }>;
}

class FacebookPixelManager {
  private pixelId: string | null = null;
  private initialized = false;

  async initialize(): Promise<boolean> {
    this.pixelId = import.meta.env.VITE_FB_PIXEL_ID;
    
    if (!this.pixelId) {
      console.warn('Facebook Pixel ID not configured');
      return false;
    }

    if (this.initialized) {
      return true;
    }

    // Check if pixel is already initialized globally
    if (window.fbq && window._fbq && window._fbq.loaded) {
      this.initialized = true;
      console.log('Facebook Pixel already loaded, skipping initialization');
      return true;
    }

    // Initialize Facebook Pixel
    if (!window.fbq) {
      const script = document.createElement('script');
      script.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
      `;
      document.head.appendChild(script);

      // Add noscript fallback
      const noscript = document.createElement('noscript');
      const img = document.createElement('img');
      img.height = 1;
      img.width = 1;
      img.style.display = 'none';
      img.src = `https://www.facebook.com/tr?id=${this.pixelId}&ev=PageView&noscript=1`;
      noscript.appendChild(img);
      document.head.appendChild(noscript);
    }

    // Wait for fbq to be available
    await this.waitForFbq();

    // Initialize pixel only if not already initialized for this ID
    try {
      if (!(window as any)._fbInitialized?.[this.pixelId]) {
        window.fbq('init', this.pixelId);
        window.fbq('track', 'PageView');
        
        // Mark as initialized
        if (!(window as any)._fbInitialized) {
          (window as any)._fbInitialized = {};
        }
        (window as any)._fbInitialized[this.pixelId] = true;
        
        console.log('Facebook Pixel initialized:', this.pixelId);
      } else {
        console.log('Facebook Pixel already initialized for this ID');
      }
    } catch (error) {
      console.warn('Facebook Pixel initialization error:', error);
    }

    this.initialized = true;
    return true;
  }

  private waitForFbq(): Promise<void> {
    return new Promise((resolve) => {
      const checkFbq = () => {
        if (window.fbq) {
          resolve();
        } else {
          setTimeout(checkFbq, 100);
        }
      };
      checkFbq();
    });
  }

  trackEvent(eventName: string, data?: PixelEventData): void {
    if (!this.initialized || !window.fbq) {
      console.warn('Facebook Pixel not initialized');
      return;
    }

    try {
      if (data) {
        window.fbq('track', eventName, data);
      } else {
        window.fbq('track', eventName);
      }
      console.log(`Facebook Pixel event tracked: ${eventName}`, data);
    } catch (error) {
      console.error('Facebook Pixel tracking error:', error);
    }
  }

  trackViewContent(data: PixelEventData): void {
    this.trackEvent('ViewContent', {
      content_type: 'product',
      content_ids: ['frankincense-oil'],
      content_name: 'زيت لبان الذكر الطبيعي',
      content_category: 'Essential Oils',
      ...data
    });
  }

  trackAddToCart(data: PixelEventData): void {
    this.trackEvent('AddToCart', {
      content_type: 'product',
      content_ids: ['frankincense-oil'],
      content_name: 'زيت لبان الذكر الطبيعي',
      ...data
    });
  }

  trackInitiateCheckout(data: PixelEventData): void {
    this.trackEvent('InitiateCheckout', {
      content_type: 'product',
      content_ids: ['frankincense-oil'],
      num_items: data.num_items || 1,
      ...data
    });
  }

  trackPurchase(data: PixelEventData): void {
    this.trackEvent('Purchase', {
      content_type: 'product',
      content_ids: ['frankincense-oil'],
      ...data
    });
  }

  trackLead(data: PixelEventData): void {
    this.trackEvent('Lead', {
      content_name: 'زيت لبان الذكر الطبيعي',
      content_category: 'Essential Oils',
      ...data
    });
  }

  trackCustomEvent(eventName: string, data?: PixelEventData): void {
    this.trackEvent(eventName, data);
  }
}

// Singleton instance
const pixelManager = new FacebookPixelManager();

// Export functions
export const initializeFacebookPixel = () => pixelManager.initialize();
export const trackViewContent = (data?: PixelEventData) => pixelManager.trackViewContent(data || {});
export const trackAddToCart = (data: PixelEventData) => pixelManager.trackAddToCart(data);
export const trackInitiateCheckout = (data?: PixelEventData) => pixelManager.trackInitiateCheckout(data || {});
export const trackPurchase = (data: PixelEventData) => pixelManager.trackPurchase(data);
export const trackLead = (data: PixelEventData) => pixelManager.trackLead(data);
export const trackCustomEvent = (eventName: string, data?: PixelEventData) => pixelManager.trackCustomEvent(eventName, data);

export default pixelManager;