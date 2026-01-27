import BASE_URL from "./constant";

/**
 * Get full image URL from photoUrl stored in database
 * Handles local uploaded files and external URLs
 * @param {string} photoUrl - The photo URL from database
 * @returns {string} - Full URL that can be used in img src
 */
export const getImageUrl = (photoUrl) => {
  if (!photoUrl) return "https://via.placeholder.com/300";

  // If it's already a full URL (http/https), return as is
  if (photoUrl.startsWith("http")) {
    return photoUrl;
  }

  // If it's a local path (/uploads/...), prepend BASE_URL
  if (photoUrl.startsWith("/uploads")) {
    return BASE_URL + photoUrl;
  }

  // Default fallback
  return photoUrl;
};

export default getImageUrl;
