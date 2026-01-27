import BASE_URL from "./constant";

/**
 * Get full image URL from photoUrl stored in database
 * Handles local uploaded files and external URLs
 * @param {string} photoUrl - The photo URL from database
 * @returns {string} - Full URL that can be used in img src
 */
export const getImageUrl = (photoUrl) => {
  // If no photo URL, return placeholder
  if (!photoUrl) {
    return "https://via.placeholder.com/400x400?text=No+Photo";
  }

  // If it's already a full URL (http/https), return as is
  if (photoUrl.startsWith("http")) {
    return photoUrl;
  }

  // If it's a local path (/uploads/...), prepend BASE_URL
  if (photoUrl.startsWith("/uploads")) {
    return `${BASE_URL}${photoUrl}`;
  }

  // If it's just a filename, assume it's in /uploads/
  if (!photoUrl.startsWith("/")) {
    return `${BASE_URL}/uploads/${photoUrl}`;
  }

  // Default fallback
  return photoUrl;
};

export default getImageUrl;
