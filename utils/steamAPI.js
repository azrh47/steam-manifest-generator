const axios = require('axios');

// Check for Steam API key at startup
console.log("Steam API key exists:", !!process.env.STEAM_API_KEY);

if (!process.env.STEAM_API_KEY) {
  console.error("STEAM_API_KEY is missing from environment variables.");
}

/**
 * Fetches comprehensive Steam app details like other servers
 * Uses multiple Steam API endpoints to get complete data
 * @param {number} appId - The Steam App ID
 * @returns {Promise<Object>} - Complete app details object
 */
async function getSteamAppDetails(appId) {
  try {
    // Get primary app data from Store API
    const storeResponse = await axios.get(
      `https://store.steampowered.com/api/appdetails?appids=${appId}`
    );
    
    const storeData = storeResponse.data;
    
    if (!storeData[appId] || !storeData[appId].success) {
      console.warn(`Steam Store API returned no data for App ID: ${appId}`);
      return getDefaultAppData(appId);
    }
    
    const appData = storeData[appId].data;
    
    // Get additional data from Steam Web API if key is available
    let webApiData = {};
    if (process.env.STEAM_API_KEY) {
      try {
        webApiData = await getWebApiData(appId);
      } catch (error) {
        console.warn(`Steam Web API failed for App ID ${appId}, using Store API only:`, error.message);
      }
    }
    
    // Generate realistic depot configuration based on app data
    const depotConfig = generateDepotConfiguration(appId, appData);
    
    return {
      appId: appId,
      name: appData.name || `Unknown App ${appId}`,
      type: appData.type || 'game',
      developer: appData.developer ? appData.developer[0] : 'Unknown Developer',
      publisher: appData.publisher ? appData.publisher[0] : 'Unknown Publisher',
      releaseDate: appData.release_date ? appData.release_date.date : 'Unknown Date',
      genres: appData.genres ? appData.genres.map(g => g.description) : [],
      platforms: appData.platforms || { windows: true, mac: false, linux: false },
      categories: appData.categories ? appData.categories.map(c => c.description) : [],
      headerImage: appData.header_image || '',
      background: appData.background || '',
      shortDescription: appData.short_description || '',
      supportedLanguages: appData.supported_languages || 'English',
      isFree: appData.is_free || false,
      priceOverview: appData.price_overview || null,
      requirements: appData.pc_requirements || { minimum: '', recommended: '' },
      // Additional data for realistic file generation
      estimatedSize: estimateGameSize(appData),
      depotConfig: depotConfig,
      buildId: generateRealisticBuildId(appId),
      manifestIds: generateManifestIds(depotConfig.depots, appId),
      dlcApps: generateDlcApps(appId, appData)
    };
    
  } catch (error) {
    console.error(`Error fetching Steam app details for App ID ${appId}:`, error.message);
    return getDefaultAppData(appId);
  }
}

/**
 * Generates realistic depot configuration based on app data
 * @param {number} appId - Steam App ID
 * @param {Object} appData - App data from Steam API
 * @returns {Object} - Depot configuration
 */
function generateDepotConfiguration(appId, appData) {
  const depots = {};
  
  // Generate base depot IDs for the game
  if (appData.platforms?.windows) {
    depots[appId] = {
      name: "Windows",
      depotId: appId,
      size: estimateGameSize(appData)
    };
  }
  
  if (appData.platforms?.mac) {
    depots[appId + 1] = {
      name: "Mac",
      depotId: appId + 1,
      size: Math.floor(estimateGameSize(appData) * 1.1)
    };
  }
  
  if (appData.platforms?.linux) {
    depots[appId + 2] = {
      name: "Linux", 
      depotId: appId + 2,
      size: Math.floor(estimateGameSize(appData) * 1.05)
    };
  }
  
  return {
    appId: appId,
    depots: depots
  };
}

/**
 * Estimates realistic game size based on app data (optimized for speed)
 * @param {Object} appData - App data from Steam API
 * @returns {number} - Estimated size in bytes
 */
function estimateGameSize(appData) {
  // Simplified size estimation for speed
  let baseSize = 10485760; // 10MB base (much smaller for speed)
  
  // Quick genre check (simplified)
  if (appData.genres && Array.isArray(appData.genres)) {
    const genreString = appData.genres.map(g => typeof g === 'string' ? g : g.description).join(' ').toLowerCase();
    if (genreString.includes('rpg')) baseSize *= 2;
    else if (genreString.includes('action') || genreString.includes('adventure')) baseSize *= 1.5;
    else if (genreString.includes('simulation')) baseSize *= 1.8;
    else if (genreString.includes('strategy')) baseSize *= 1.3;
  }
  
  // Adjust for free games
  if (appData.is_free) {
    baseSize *= 0.7;
  }
  
  return Math.floor(baseSize);
}

/**
 * Generates deterministic number based on seed
 * @param {number} seed - Seed value
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Deterministic number
 */
function generateDeterministicNumber(seed, min, max) {
  const hash = (x) => {
    x = ((x >> 16) ^ x) * 0x45d9f3b;
    x = ((x >> 16) ^ x) * 0x45d9f3b;
    x = (x >> 16) ^ x;
    return x;
  };
  
  const hashed = hash(seed);
  const range = max - min + 1;
  return Math.abs(hashed % range) + min;
}

/**
 * Generates realistic build ID
 * @param {number} appId - App ID for seed
 * @returns {number} - Build ID
 */
function generateRealisticBuildId(appId) {
  return generateDeterministicNumber(appId, 1000000000, 9000000000);
}

/**
 * Generates manifest IDs for all depots
 * @param {Object} depots - Depot configuration
 * @param {number} appId - App ID for seed
 * @returns {Object} - Manifest ID mapping
 */
function generateManifestIds(depots, appId) {
  const manifestIds = {};
  Object.keys(depots).forEach(depotId => {
    manifestIds[depotId] = generateDeterministicNumber(appId + parseInt(depotId), 1000000000000000000, 9000000000000000000);
  });
  return manifestIds;
}

/**
 * Generates DLC app IDs
 * @param {number} baseAppId - Base app ID
 * @param {Object} appData - App data
 * @returns {Array} - Array of DLC app IDs
 */
function generateDlcApps(baseAppId, appData) {
  const dlcCount = generateDeterministicNumber(baseAppId, 1, 3);
  const dlcApps = [];
  
  for (let i = 0; i < dlcCount; i++) {
    dlcApps.push({
      appId: baseAppId + 1000 + i,
      name: `${appData.name} - DLC ${i + 1}`,
      size: generateDeterministicNumber(baseAppId + i, 536870912, 1073741824)
    });
  }
  
  return dlcApps;
}

/**
 * Returns default app data when API fails
 * @param {number} appId - The Steam App ID
 * @returns {Object} - Default app data structure
 */
function getDefaultAppData(appId) {
  return {
    appId: appId,
    name: `Unknown App ${appId}`,
    type: 'game',
    developer: 'Unknown Developer',
    publisher: 'Unknown Publisher',
    releaseDate: 'Unknown Date',
    genres: [],
    platforms: { windows: true, mac: false, linux: false },
    categories: [],
    headerImage: '',
    background: '',
    shortDescription: '',
    supportedLanguages: 'English',
    isFree: false,
    priceOverview: null,
    requirements: { minimum: '', recommended: '' }
  };
}

/**
 * Validates if a Steam App ID is in the correct format
 * @param {string|number} appId - The App ID to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateAppId(appId) {
  const id = parseInt(appId);
  return !isNaN(id) && id > 0 && id < 10000000;
}

/**
 * Generates a random manifest ID for Steam manifests
 * @returns {string} - Random manifest ID
 */
function generateManifestId() {
  return Math.floor(Math.random() * 9000000000000000000) + 1000000000000000000;
}

/**
 * Generates a random build ID for Steam manifests
 * @returns {string} - Random build ID
 */
function generateBuildId() {
  return Math.floor(Math.random() * 900000) + 100000;
}

/**
 * Fetches app data from Steam Web API
 * Note: Steam Web API provides enhanced app data but NOT depot manifests
 * @param {number} appId - The Steam App ID
 * @returns {Promise<Object>} - Enhanced app data or null if failed
 */
async function getWebApiData(appId) {
  try {
    const response = await axios.get(
      `https://store.steampowered.com/api/appdetails?appids=${appId}`
    );
    
    const data = response.data;
    
    if (!data[appId] || !data[appId].success) {
      return null;
    }
    
    const appData = data[appId].data;
    
    // Enhanced data with additional fields from Web API
    return {
      appId: appId,
      name: appData.name || `Unknown App ${appId}`,
      type: appData.type || 'game',
      developer: appData.developer ? appData.developer[0] : 'Unknown Developer',
      publisher: appData.publisher ? appData.publisher[0] : 'Unknown Publisher',
      releaseDate: appData.release_date ? appData.release_date.date : 'Unknown Date',
      genres: appData.genres ? appData.genres.map(g => g.description) : [],
      platforms: appData.platforms || { windows: true, mac: false, linux: false },
      categories: appData.categories ? appData.categories.map(c => c.description) : [],
      headerImage: appData.header_image || '',
      background: appData.background || '',
      shortDescription: appData.short_description || '',
      supportedLanguages: appData.supported_languages || 'English',
      isFree: appData.is_free || false,
      priceOverview: appData.price_overview || null,
      requirements: appData.pc_requirements || { minimum: '', recommended: '' },
      // Enhanced fields
      estimatedSize: appData.file_size ? appData.file_size : null,
      dlcCount: appData.dlc ? appData.dlc.length : 0,
      metacritic: appData.metacritic || null,
      recommendations: appData.recommendations || null,
      achievements: appData.achievements || null
    };
    
  } catch (error) {
    console.error(`Steam Web API error for App ID ${appId}:`, error.message);
    return null;
  }
}

/**
 * Searches for games on Steam using the Store API
 * @param {string} query - Search query
 * @param {number} limit - Number of results to return
 * @returns {Promise<Array>} - Array of search results
 */
async function searchSteamGames(query, limit = 5) {
  try {
    const response = await axios.get(
      `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(query)}&l=english&cc=US`
    );
    
    const data = response.data;
    
    if (!data.items || data.items.length === 0) {
      return [];
    }
    
    // Process and limit results
    const results = data.items
      .slice(0, limit)
      .map(item => ({
        appid: item.id,
        name: item.name,
        release_date: item.release_date ? item.release_date.split(',')[0] : null,
        platforms: item.platforms || { windows: false, mac: false, linux: false },
        price: item.price ? `$${(item.price / 100).toFixed(2)}` : 'Free',
        header_image: item.tiny_image || null
      }));
    
    return results;
    
  } catch (error) {
    console.error(`Error searching Steam for query "${query}":`, error);
    return [];
  }
}

module.exports = {
  getSteamAppDetails,
  validateAppId,
  generateManifestId,
  generateBuildId,
  getWebApiData,
  searchSteamGames
};