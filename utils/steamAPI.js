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
 * Generates realistic depot configuration based on real Steam data
 * @param {number} appId - Steam App ID
 * @param {Object} appData - Real app data from Steam API
 * @returns {Object} - Depot configuration
 */
function generateDepotConfiguration(appId, appData) {
  const depots = {};
  const baseSize = estimateRealGameSize(appData);
  
  // Generate base depot IDs for the game based on real platform support
  if (appData.platforms?.windows) {
    depots[appId] = {
      name: "Windows",
      depotId: appId,
      size: baseSize,
      platform: "windows"
    };
  }
  
  if (appData.platforms?.mac) {
    depots[appId + 1] = {
      name: "Mac",
      depotId: appId + 1,
      size: Math.floor(baseSize * 1.1), // Mac versions typically slightly larger
      platform: "mac"
    };
  }
  
  if (appData.platforms?.linux) {
    depots[appId + 2] = {
      name: "Linux", 
      depotId: appId + 2,
      size: Math.floor(baseSize * 1.05), // Linux versions typically slightly larger
      platform: "linux"
    };
  }
  
  return {
    appId: appId,
    depots: depots,
    hasRealPlatforms: !!(appData.platforms?.windows || appData.platforms?.mac || appData.platforms?.linux)
  };
}

/**
 * Estimates realistic game size based on real Steam data
 * @param {Object} appData - Real app data from Steam API
 * @returns {number} - Estimated size in bytes
 */
function estimateRealGameSize(appData) {
  // Base size estimation using real Steam game characteristics
  let baseSize = 10485760; // 10MB base
  
  // Adjust based on real genres from Steam
  if (appData.genres && Array.isArray(appData.genres)) {
    const genreString = appData.genres.join(' ').toLowerCase();
    if (genreString.includes('rpg')) baseSize *= 3;
    else if (genreString.includes('action') || genreString.includes('adventure')) baseSize *= 2;
    else if (genreString.includes('simulation')) baseSize *= 2.5;
    else if (genreString.includes('strategy')) baseSize *= 1.5;
    else if (genreString.includes('indie')) baseSize *= 0.8;
    else if (genreString.includes('sports') || genreString.includes('racing')) baseSize *= 1.8;
    else if (genreString.includes('mmorpg')) baseSize *= 4;
  }
  
  // Adjust for real game type
  if (appData.type === 'game') {
    baseSize *= 1.2;
  } else if (appData.type === 'software') {
    baseSize *= 0.5;
  }
  
  // Adjust for free games (usually smaller)
  if (appData.is_free) {
    baseSize *= 0.6;
  }
  
  // Adjust based on real DLC count (more DLC = larger base game)
  if (appData.dlcCount > 0) {
    baseSize *= (1 + appData.dlcCount * 0.1);
  }
  
  // Adjust based on real achievements (more achievements = larger game)
  if (appData.achievements && appData.achievements.total > 0) {
    baseSize *= (1 + appData.achievements.total * 0.001);
  }
  
  // Make it deterministic based on App ID
  const appId = appData.appId || 0;
  const sizeVariation = generateDeterministicNumber(appId, 1, 3);
  baseSize *= sizeVariation;
  
  return Math.floor(baseSize);
}

/**
 * Estimates realistic game size based on app data (completely deterministic)
 * @param {Object} appData - App data from Steam API
 * @returns {number} - Estimated size in bytes
 */
function estimateGameSize(appData) {
  // Use the real game size estimation
  return estimateRealGameSize(appData);
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
 * Generates DLC app IDs using real Steam DLC data
 * @param {number} baseAppId - Base app ID
 * @param {Object} appData - Real app data from Steam API
 * @returns {Array} - Array of DLC app IDs with real data
 */
function generateDlcApps(baseAppId, appData) {
  const dlcApps = [];
  
  // Use real DLC data from Steam if available
  if (appData.dlc && Array.isArray(appData.dlc) && appData.dlc.length > 0) {
    console.log(`Using real DLC data for ${appData.dlc.length} DLC items`);
    
    // Use real Steam DLC data
    appData.dlc.slice(0, 5).forEach((dlcId, index) => {
      const dlcSize = 10485760 * generateDeterministicNumber(baseAppId + dlcId, 1, 4); // 10MB to 40MB
      dlcApps.push({
        appId: dlcId,
        name: `${appData.name} - DLC ${index + 1}`,
        size: dlcSize,
        isRealDLC: true
      });
    });
  } else {
    // Fallback to generated DLC if no real data
    console.log(`No real DLC data found, generating ${generateDeterministicNumber(baseAppId, 1, 3)} DLC items`);
    
    const dlcCount = generateDeterministicNumber(baseAppId, 1, 3);
    for (let i = 0; i < dlcCount; i++) {
      dlcApps.push({
        appId: baseAppId + 1000 + i,
        name: `${appData.name} - DLC ${i + 1}`,
        size: 10485760 * generateDeterministicNumber(baseAppId + i, 1, 3), // 10MB to 30MB deterministic
        isRealDLC: false
      });
    }
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
 * Fetches real Steam data from multiple official Steam APIs
 * Uses official Steam endpoints for educational development purposes
 * @param {number} appId - The Steam App ID
 * @returns {Promise<Object>} - Complete real Steam data or null if failed
 */
async function getWebApiData(appId) {
  try {
    console.log(`Fetching real Steam data for App ID: ${appId}`);
    
    // Fetch from Steam Store API (official)
    const storeResponse = await axios.get(
      `https://store.steampowered.com/api/appdetails?appids=${appId}`
    );
    
    const storeData = storeResponse.data;
    
    if (!storeData[appId] || !storeData[appId].success) {
      console.warn(`Steam Store API returned no data for App ID: ${appId}`);
      return null;
    }
    
    const appData = storeData[appId].data;
    
    // Fetch additional real data using Steam Web API if key is available
    let webApiData = {};
    if (process.env.STEAM_API_KEY) {
      try {
        // Get real app info from Steam Web API
        const webApiResponse = await axios.get(
          `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${process.env.STEAM_API_KEY}&appid=${appId}`
        );
        
        // Get real player count
        const playerCountResponse = await axios.get(
          `https://api.steampowered.com/ISteamUserStatistics/GetNumberOfCurrentPlayers/v1/?key=${process.env.STEAM_API_KEY}&appid=${appId}`
        );
        
        webApiData = {
          hasRealApiData: true,
          schema: webApiResponse.data.game || null,
          playerCount: playerCountResponse.data.response?.player_count || 0
        };
        
        console.log(`Successfully fetched real Steam Web API data for App ID: ${appId}`);
        
      } catch (error) {
        console.warn(`Steam Web API failed for App ID ${appId}, using Store API only:`, error.message);
        webApiData = { hasRealApiData: false };
      }
    }
    
    // Return complete real Steam data
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
      requirements: {
        minimum: appData.pc_requirements?.minimum || '',
        recommended: appData.pc_requirements?.recommended || ''
      },
      // Real Steam data
      dlc: appData.dlc || [],
      dlcCount: appData.dlc ? appData.dlc.length : 0,
      metacritic: appData.metacritic || null,
      recommendations: appData.recommendations || null,
      achievements: appData.achievements || null,
      screenshots: appData.screenshots || [],
      movies: appData.movies || [],
      // Web API enhancements
      ...webApiData,
      // Real size estimation based on actual game data
      estimatedSize: estimateRealGameSize(appData)
    };
    
  } catch (error) {
    console.error(`Steam API error for App ID ${appId}:`, error.message);
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