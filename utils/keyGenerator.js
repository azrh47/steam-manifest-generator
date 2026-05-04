/**
 * Generates Steam keys
 * @param {Object} appData - Steam app data from the API
 * @returns {Object} - Generated key data
 */
function generateSteamKeys(appData) {
  const currentTime = Math.floor(Date.now() / 1000);
  
  // Generate Steam key format: XXXXX-XXXXX-XXXXX
  const generateKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
    let key = '';
    for (let i = 0; i < 15; i++) {
      if (i === 5 || i === 10) key += '-';
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  };

  // Generate multiple keys
  const keys = [];
  for (let i = 0; i < 5; i++) {
    keys.push({
      key: generateKey(),
      appId: appData.appId,
      packageName: `${appData.name} - Key ${i + 1}`,
      generatedAt: new Date().toISOString(),
      isActive: true
    });
  }

  return {
    key_info: {
      app_name: appData.name,
      app_id: appData.appId,
      generated_at: new Date().toISOString(),
      key_count: keys.length
    },
    keys: keys,
    vdf_content: generateVDFContent(keys, appData)
  };
}

/**
 * Generates VDF (Valve Data Format) content for Steam keys
 * @param {Array} keys - Array of key objects
 * @param {Object} appData - Steam app data
 * @returns {string} - VDF formatted content
 */
function generateVDFContent(keys, appData) {
  let vdf = `"keys"
{
	"appinfo"
	{
		"${appData.appId}"
		{
			"common"
			{
				"name"\t\t"${appData.name}"
				"type"\t\t"Game"
				"steam_appid"\t\t"${appData.appId}"
			}
		}
	}
	"keylist"
	{
`;

  keys.forEach((keyObj, index) => {
    vdf += `		"${index + 1}"
		{
			"key"\t\t"${keyObj.key}"
			"appid"\t\t"${keyObj.appId}"
			"packagename"\t\t"${keyObj.packageName}"
			"generated"\t\t"${keyObj.generatedAt}"
			"active"\t\t"${keyObj.isActive ? "1" : "0"}"
		}
`;
  });

  vdf += `	}
	"metadata"
	{
		"generator"\t\t"Nerai (https://nerai.xyz/)"
		"purpose"\t\t"Steam key generation"
		"generated_at"\t\t"${new Date().toISOString()}"
		"total_keys"\t\t"${keys.length}"
	}
}
`;

  return vdf;
}

/**
 * Generates a key.vdf file for Steam
 * @param {Object} appData - Steam app data
 * @returns {string} - VDF file content
 */
function generateKeyVDF(appData) {
  const keyData = generateSteamKeys(appData);
  return keyData.vdf_content;
}

/**
 * Formats the key data as a pretty-printed JSON string
 * @param {Object} keyData - The key data object
 * @returns {string} - Formatted JSON string
 */
function formatKeyData(keyData) {
  return JSON.stringify(keyData, null, 2);
}

/**
 * Generates a summary of the key data for Discord embed
 * @param {Object} keyData - The key data object
 * @returns {Object} - Summary object for embed
 */
function getKeySummary(keyData) {
  const activeKeys = keyData.keys.filter(key => key.isActive).length;
  const inactiveKeys = keyData.keys.length - activeKeys;
  
  return {
    appName: keyData.key_info.app_name,
    appId: keyData.key_info.app_id,
    totalKeys: keyData.keys.length,
    activeKeys: activeKeys,
    inactiveKeys: inactiveKeys,
    generatedAt: keyData.key_info.generated_at,
    keyFormat: 'XXXXX-XXXXX-XXXXX',
    features: [
      'Steam Key Generation',
      'VDF Format Support',
      'Steam Integration',
      'Multiple Keys',
      'Metadata Tracking'
    ]
  };
}

/**
 * Validates a Steam key format
 * @param {string} key - The Steam key to validate
 * @returns {boolean} - True if valid format
 */
function validateSteamKey(key) {
  const keyPattern = /^[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}$/;
  return keyPattern.test(key);
}

/**
 * Generates a single Steam key
 * @returns {string} - Generated Steam key
 */
function generateSingleKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
  let key = '';
  for (let i = 0; i < 15; i++) {
    if (i === 5 || i === 10) key += '-';
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

module.exports = {
  generateSteamKeys,
  generateKeyVDF,
  generateVDFContent,
  formatKeyData,
  getKeySummary,
  validateSteamKey,
  generateSingleKey
};
