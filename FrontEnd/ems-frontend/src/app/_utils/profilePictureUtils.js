import { saveUserData, getUserData, removeUserData, setUserIdentifier } from './localStorageUtils';

/**
 * Save profile picture to localStorage for specific user
 * @param {string} imageDataUrl - Base64 encoded image data
 * @param {string} userId - User identifier
 */
export const saveProfilePicture = (imageDataUrl, userId) => {
  try {
    // Ensure we have a user identifier set
    if (userId) {
      setUserIdentifier(userId);
    }
    
    saveUserData('profilePicture', imageDataUrl, userId);
    console.log('Profile picture saved successfully for user:', userId);
  } catch (error) {
    console.error('Error saving profile picture:', error);
  }
};

/**
 * Get profile picture from localStorage for specific user
 * @param {string} userId - User identifier
 * @returns {string|null} - Base64 encoded image data or null
 */
export const getProfilePicture = (userId) => {
  try {
    const profilePicture = getUserData('profilePicture', null, userId);
    return profilePicture;
  } catch (error) {
    console.error('Error getting profile picture:', error);
    return null;
  }
};

/**
 * Remove profile picture from localStorage for specific user
 * @param {string} userId - User identifier
 */
export const removeProfilePicture = (userId) => {
  try {
    // Ensure we have a user identifier set
    if (userId) {
      setUserIdentifier(userId);
    }
    
    removeUserData('profilePicture', userId);
    console.log('Profile picture removed successfully for user:', userId);
  } catch (error) {
    console.error('Error removing profile picture:', error);
  }
};

/**
 * Compress image before saving to localStorage
 * @param {File} file - Image file
 * @param {number} maxWidth - Maximum width
 * @param {number} maxHeight - Maximum height
 * @param {number} quality - Compression quality (0-1)
 * @returns {Promise<string>} - Compressed image as base64 data URL
 */
export const compressImage = (file, maxWidth = 400, maxHeight = 400, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      try {
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(file);
  });
};

/**
 * Validate image file
 * @param {File} file - Image file to validate
 * @returns {Object} - Validation result with isValid and error message
 */
export const validateImageFile = (file) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { 
      isValid: false, 
      error: 'Invalid file type. Please select a JPEG, PNG, GIF, or WebP image.' 
    };
  }

  if (file.size > maxSize) {
    return { 
      isValid: false, 
      error: 'File size too large. Please select an image smaller than 5MB.' 
    };
  }

  return { isValid: true, error: null };
};
