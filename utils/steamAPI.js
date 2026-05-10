const axios = require('axios');

/**
 * Fetches Steam app details from the Steam Store API
 * @param {number} appId - Steam App ID
 * @returns {Object} - App data
 */
async function getSteamAppDetails(appId) {
  try {
    const response = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${appId}`);
    
    if (!response.data[appId] || !response.data[appId].success) {
      throw new Error(`App ID ${appId} not found`);
    }
    
    return response.data[appId].data;
  } catch (error) {
    console.error(`Error fetching app details for ${appId}:`, error);
    throw error;
  }
}

/**
 * Validates Steam App ID format
 * @param {number} appId - App ID to validate
 * @returns {boolean} - Valid or not
 */
function validateAppId(appId) {
  return typeof appId === 'number' && appId > 0 && appId < 10000000;
}

/**
 * Searches for games on Steam
 * @param {string} query - Search query
 * @param {number} limit - Number of results
 * @returns {Array} - Search results
 */
async function searchSteamGames(query, limit = 5) {
  try {
    const response = await axios.get(`https://store.steampowered.com/api/storesearch`, {
      params: {
        term: query,
        l: 'english',
        cc: 'US',
        n: limit
      }
    });
    
    if (!response.data || !response.data.items) {
      return [];
    }
    
    return response.data.items.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price ? `$${(item.price / 100).toFixed(2)}` : 'Free',
      header_image: item.tiny_image || null
    }));
    
  } catch (error) {
    console.error(`Error searching Steam for query "${query}":`, error);
    return [];
  }
}

module.exports = {
  getSteamAppDetails,
  validateAppId,
  searchSteamGames
};
