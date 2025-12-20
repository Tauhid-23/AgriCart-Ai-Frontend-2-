// Image optimization service for AgriCart Ai
// This service provides utilities for optimizing images in the application

/**
 * Compress an image file to reduce its size
 * @param {File} file - The image file to compress
 * @param {number} quality - Quality factor (0-1)
 * @returns {Promise<Blob>} - Compressed image blob
 */
export const compressImage = (file, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    // If file is not an image or is already small, return as is
    if (!file.type.startsWith('image/') || file.size < 100000) { // Less than 100KB
      resolve(file);
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions (max 1200px on longest side)
      let { width, height } = img;
      const maxDimension = 1200;
      
      if (width > height && width > maxDimension) {
        height = (height * maxDimension) / width;
        width = maxDimension;
      } else if (height > maxDimension) {
        width = (width * maxDimension) / height;
        height = maxDimension;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw image on canvas
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to blob with compression
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        'image/webp', // Use WebP for better compression
        quality
      );
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(file);
  });
};

/**
 * Convert image to WebP format for better compression
 * @param {File} file - The image file to convert
 * @param {number} quality - Quality factor (0-1)
 * @returns {Promise<Blob>} - WebP image blob
 */
export const convertToWebP = async (file, quality = 0.8) => {
  // If already WebP, return as is
  if (file.type === 'image/webp') {
    return file;
  }

  return compressImage(file, quality);
};

/**
 * Resize image to specific dimensions
 * @param {File} file - The image file to resize
 * @param {number} maxWidth - Maximum width
 * @param {number} maxHeight - Maximum height
 * @returns {Promise<Blob>} - Resized image blob
 */
export const resizeImage = (file, maxWidth, maxHeight) => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      resolve(file);
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      let { width, height } = img;
      
      // Calculate new dimensions
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw image on canvas
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to resize image'));
          }
        },
        'image/webp',
        0.8
      );
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(file);
  });
};

/**
 * Create optimized image variants for different use cases
 * @param {File} file - The original image file
 * @returns {Promise<Object>} - Object containing different image variants
 */
export const createImageVariants = async (file) => {
  try {
    // Original (compressed)
    const original = await compressImage(file, 0.8);
    
    // Thumbnail (150x150)
    const thumbnail = await resizeImage(file, 150, 150);
    
    // Preview (400x400)
    const preview = await resizeImage(file, 400, 400);
    
    // Full size (1200x1200 max)
    const full = await resizeImage(file, 1200, 1200);
    
    return {
      original,
      thumbnail,
      preview,
      full
    };
  } catch (error) {
    console.error('Failed to create image variants:', error);
    throw error;
  }
};

/**
 * Get optimized image URL for display
 * @param {string} base64Data - Base64 image data
 * @param {number} maxWidth - Maximum width for display
 * @returns {string} - Optimized image URL
 */
export const getOptimizedImageUrl = (base64Data, maxWidth = 400) => {
  // For base64 data, we can't optimize without client-side processing
  // In a real implementation, this would call a backend service
  return base64Data;
};

/**
 * Lazy load images using Intersection Observer
 * @param {Element} imgElement - Image element to lazy load
 * @param {string} src - Image source URL
 */
export const lazyLoadImage = (imgElement, src) => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    imageObserver.observe(imgElement);
  } else {
    // Fallback for browsers that don't support Intersection Observer
    imgElement.src = src;
  }
};

/**
 * Preload important images
 * @param {string[]} imageUrls - Array of image URLs to preload
 */
export const preloadImages = (imageUrls) => {
  imageUrls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
};

/**
 * Cleanup object URLs to prevent memory leaks
 * @param {string} url - Object URL to revoke
 */
export const cleanupObjectUrl = (url) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};

/**
 * Detect optimal image quality based on network conditions
 * @returns {number} - Quality factor (0-1)
 */
export const getOptimalQuality = () => {
  // Check for Save-Data header (data saver mode)
  if (navigator.connection && navigator.connection.saveData) {
    return 0.6; // Lower quality for data saver mode
  }
  
  // Check network type
  if (navigator.connection && navigator.connection.effectiveType) {
    switch (navigator.connection.effectiveType) {
      case 'slow-2g':
      case '2g':
        return 0.5; // Lower quality for slow connections
      case '3g':
        return 0.7; // Medium quality for 3G
      default:
        return 0.8; // Higher quality for fast connections
    }
  }
  
  return 0.8; // Default quality
};

/**
 * Optimize image for specific use case
 * @param {File} file - Image file to optimize
 * @param {string} useCase - 'thumbnail', 'preview', 'full', or 'original'
 * @returns {Promise<Blob>} - Optimized image blob
 */
export const optimizeForUseCase = async (file, useCase = 'preview') => {
  const quality = getOptimalQuality();
  
  switch (useCase) {
    case 'thumbnail':
      return resizeImage(file, 150, 150);
    case 'preview':
      return resizeImage(file, 400, 400);
    case 'full':
      return resizeImage(file, 1200, 1200);
    case 'original':
    default:
      return compressImage(file, quality);
  }
};

export default {
  compressImage,
  convertToWebP,
  resizeImage,
  createImageVariants,
  getOptimizedImageUrl,
  lazyLoadImage,
  preloadImages,
  cleanupObjectUrl,
  getOptimalQuality,
  optimizeForUseCase
};