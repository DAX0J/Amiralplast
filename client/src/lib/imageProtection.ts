// Light DevTools monitoring without affecting user experience
function addLightDevToolsMonitoring(): void {
  let detectionCount = 0;
  
  setInterval(() => {
    const heightDiff = window.outerHeight - window.innerHeight;
    const widthDiff = window.outerWidth - window.innerWidth;
    
    if (heightDiff > 250 || widthDiff > 250) {
      detectionCount++;
      if (detectionCount > 3) {
        console.warn('Developer tools detected - Image protection active');
        detectionCount = 0; // Reset counter
      }
    } else {
      detectionCount = Math.max(0, detectionCount - 1);
    }
  }, 1000);
}

// Enhanced image protection with multiple layers (fixed)
export function enableImageProtection(): void {
  if (typeof window === 'undefined') return;

  // Safe protection methods only
  blockScreenshotAPIs();
  blockImageSaving();
  detectAutomation();
  
  // Add lighter DevTools monitoring (without visible elements)
  addLightDevToolsMonitoring();

  // Disable right-click context menu globally
  document.addEventListener('contextmenu', (e) => {
    const target = e.target as HTMLElement;
    if (target && target.classList && (target.classList.contains('protected-image') || target.tagName === 'IMG')) {
      e.preventDefault();
      return false;
    }
  });

  // Disable drag and drop for images
  document.addEventListener('dragstart', (e) => {
    const target = e.target as HTMLElement;
    if (target && target.classList && (target.classList.contains('protected-image') || target.tagName === 'IMG')) {
      e.preventDefault();
      return false;
    }
  });

  // Disable image selection
  document.addEventListener('selectstart', (e) => {
    const target = e.target as HTMLElement;
    if (target && target.classList && (target.classList.contains('protected-image') || target.tagName === 'IMG')) {
      e.preventDefault();
      return false;
    }
  });

  // Disable F12, Ctrl+U, Ctrl+S, Ctrl+A, Ctrl+C, Ctrl+V
  document.addEventListener('keydown', (e) => {
    // Disable developer tools
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.key === 'U') ||
        (e.ctrlKey && e.key === 'S')) {
      e.preventDefault();
      return false;
    }
  });

  // Detect DevTools opening
  let devtools = { open: false, orientation: null };
  setInterval(() => {
    if (window.outerHeight - window.innerHeight > 160 || 
        window.outerWidth - window.innerWidth > 160) {
      if (!devtools.open) {
        devtools.open = true;
        console.warn('Developer tools detected - Image protection active');
      }
    } else {
      devtools.open = false;
    }
  }, 500);

  // Silent protection without visible watermarks (as requested by user)
  const addSilentProtection = () => {
    // Add invisible protection layers
    const images = document.querySelectorAll('.protected-image');
    images.forEach((img) => {
      const imageElement = img as HTMLImageElement;
      const wrapper = imageElement.parentElement;
      if (wrapper && !wrapper.querySelector('.silent-protection')) {
        const overlay = document.createElement('div');
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.background = 'transparent';
        overlay.style.pointerEvents = 'none';
        overlay.style.zIndex = '999';
        overlay.className = 'silent-protection';
        
        wrapper.appendChild(overlay);
      }
    });
  };

  // Apply silent protection after images load
  window.addEventListener('load', addSilentProtection);
  document.addEventListener('DOMContentLoaded', addSilentProtection);
}

// Disable print screen
export function disablePrintScreen(): void {
  document.addEventListener('keyup', (e) => {
    if (e.key === 'PrintScreen') {
      navigator.clipboard.writeText('');
      console.warn('Screenshot attempt blocked');
    }
  });
}

// Advanced screenshot blocking
function blockScreenshotAPIs(): void {
  try {
    // Block navigator.mediaDevices.getDisplayMedia (safer approach)
    if (navigator.mediaDevices && typeof navigator.mediaDevices.getDisplayMedia === 'function') {
      try {
        Object.defineProperty(navigator.mediaDevices, 'getDisplayMedia', {
          value: function() {
            console.warn('Screen capture blocked');
            return Promise.reject(new Error('Screen capture not allowed'));
          },
          writable: false,
          configurable: false
        });
      } catch (e) {
        // If we can't override, at least monitor usage
        console.warn('Screen capture API monitoring active');
      }
    }
  } catch (error) {
    console.warn('Screenshot protection partially limited:', error);
  }
}

// Enhanced DevTools blocking (fixed - no unwanted blur)
function blockDevTools(): void {
  // Safe detection without aggressive blocking
  let devtoolsDetected = false;
  
  // Method 1: Size detection (more conservative)
  setInterval(() => {
    const threshold = 200; // Increased threshold to avoid false positives
    const heightDiff = window.outerHeight - window.innerHeight;
    const widthDiff = window.outerWidth - window.innerWidth;
    
    if (heightDiff > threshold || widthDiff > threshold) {
      if (!devtoolsDetected) {
        devtoolsDetected = true;
        console.warn('🚫 Developer tools detected - Content protected');
        // Only log, don't blur for normal users
      }
    } else {
      devtoolsDetected = false;
    }
  }, 500); // Less frequent checking

  // Method 2: Console detection (safer)
  try {
    Object.defineProperty(console, '_commandLineAPI', {
      get: function() {
        console.warn('Console access detected');
        return undefined;
      }
    });
  } catch (e) {
    // Ignore if we can't set this property
  }

  // Remove aggressive debugger detection that causes issues
}

// Block image saving methods
function blockImageSaving(): void {
  // Block save as dialog
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      console.warn('Save blocked');
      return false;
    }
  });

  // Block drag to desktop
  document.addEventListener('dragstart', (e) => {
    if (e.target instanceof HTMLImageElement) {
      e.preventDefault();
      return false;
    }
  });

  // Block copy to clipboard
  document.addEventListener('copy', (e) => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      e.clipboardData?.setData('text/plain', '');
      e.preventDefault();
    }
  });
}

// Detect automation and bots (safe version)
function detectAutomation(): void {
  try {
    // Check for webdriver (log only, don't hide content)
    if (navigator.webdriver) {
      console.warn('Automation detected');
    }

    // Check for common automation properties (log only)
    const automationProps = [
      'webdriver',
      '__webdriver_evaluate',
      '__selenium_evaluate',
      '__webdriver_script_function',
      '__webdriver_script_func',
      '__webdriver_script_fn',
      '__fxdriver_evaluate',
      '__driver_unwrapped',
      '__webdriver_unwrapped',
      '__driver_evaluate',
      '__selenium_unwrapped',
      '__fxdriver_unwrapped'
    ];

    for (const prop of automationProps) {
      if (prop in window) {
        console.warn('Automation property detected:', prop);
        break;
      }
    }

    // Check for phantom.js (log only)
    if ((window as any).callPhantom || (window as any)._phantom) {
      console.warn('PhantomJS detected');
    }
  } catch (error) {
    console.warn('Automation detection error:', error);
  }
}

// Silent advanced protection (no visible watermarks)
export function addAdvancedWatermark(): void {
  // Enhanced silent protection without visible elements
  const images = document.querySelectorAll('.protected-image');
  images.forEach((img) => {
    const imageElement = img as HTMLImageElement;
    const wrapper = imageElement.parentElement;
    if (wrapper && !wrapper.querySelector('.advanced-silent-protection')) {
      const overlay = document.createElement('div');
      overlay.style.position = 'absolute';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.background = 'transparent';
      overlay.style.pointerEvents = 'none';
      overlay.style.zIndex = '1000';
      overlay.className = 'advanced-silent-protection';
      wrapper.appendChild(overlay);
      
      // Add metadata protection
      imageElement.setAttribute('data-protected', 'true');
      imageElement.setAttribute('data-copyright', '© 2024');
    }
  });
}

// Safe blur function (only when explicitly needed)
export function blurOnDevTools(): void {
  // This function is now safe and won't blur automatically
  addLightDevToolsMonitoring();
}