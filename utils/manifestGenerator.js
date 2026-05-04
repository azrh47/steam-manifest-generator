const { generateManifestId, generateBuildId } = require('./steamAPI');

/**
 * Generates educational Steam app manifest template based on app data
 * @param {Object} appData - Steam app data from the API
 * @returns {Object} - Educational template manifest object
 */
function generateSteamManifest(appData) {
  const currentTime = Math.floor(Date.now() / 1000);
  const manifestId = generateManifestId();
  const buildId = generateBuildId();
  
  const manifest = {
    "template_info": {
      "purpose": "Educational template for learning Steam manifest structure",
      "app_name": appData.name,
      "app_id": appData.appId,
      "generated_at": new Date().toISOString()
    },
    "appid": appData.appId,
    "name": appData.name,
    "state": "eStateAvailable",
    "installdir": appData.name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
    "size": appData.estimatedSize || 1000000000, // Use real size if available
    "bytes_downloaded": 0,
    "bytes_staged": 0,
    "bytes_to_download": 0,
    "bytes_to_stage": 0,
    "target_build_id": buildId,
    "user": {
      "gamestats": {
        "ingame": false,
        "seconds": 0
      }
    },
    "manifest": {
      "gid": manifestId,
      "size": 1000000, // Template manifest size
      "download_size": 1000000000,
      "time_updated": currentTime,
      "time_created": currentTime - 86400,
      "encrypted_gid": manifestId.toString(16),
      "decrypt_key": "",
      "filenames": [
        `${appData.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.exe`,
        "steam_api.dll",
        "game_data.bin"
      ],
      "filesha": [
        "a1b2c3d4e5f6789012345678901234567890abcd",
        "f1e2d3c4b5a6978012345678901234567890efgh",
        "9a8b7c6d5e4f321001234567890123456789ijkl"
      ]
    },
    "depot": {
      "228980": {
        "name": "Windows",
        "config": {
          "oslist": "windows",
          "language": "english",
          "osarch": "64"
        },
        "manifest": {
          "gid": manifestId,
          "size": Math.floor(Math.random() * 50000000000) + 1000000000,
          "download_size": Math.floor(Math.random() * 50000000000) + 1000000000,
          "time_updated": currentTime,
          "time_created": currentTime - 86400,
          "encrypted_gid": manifestId.toString(16),
          "decrypt_key": ""
        },
        "dlcappid": []
      },
      "228981": {
        "name": "Mac",
        "config": {
          "oslist": "macos",
          "language": "english",
          "osarch": "64"
        },
        "manifest": {
          "gid": generateManifestId(),
          "size": Math.floor(Math.random() * 50000000000) + 1000000000,
          "download_size": Math.floor(Math.random() * 50000000000) + 1000000000,
          "time_updated": currentTime,
          "time_created": currentTime - 86400,
          "encrypted_gid": generateManifestId().toString(16),
          "decrypt_key": ""
        },
        "dlcappid": []
      },
      "228982": {
        "name": "Linux",
        "config": {
          "oslist": "linux",
          "language": "english",
          "osarch": "64"
        },
        "manifest": {
          "gid": generateManifestId(),
          "size": Math.floor(Math.random() * 50000000000) + 1000000000,
          "download_size": Math.floor(Math.random() * 50000000000) + 1000000000,
          "time_updated": currentTime,
          "time_created": currentTime - 86400,
          "encrypted_gid": generateManifestId().toString(16),
          "decrypt_key": ""
        },
        "dlcappid": []
      }
    },
    "launch": [
      {
        type: "default",
        executable: appData.name.toLowerCase().replace(/[^a-z0-9]/g, '_') + ".exe",
        arguments: "",
        workingdir: "",
        description: "Launch Game"
      }
    ]
  };

  return manifest;
}

/**
 * Generates realistic depot configuration for a game
 * @param {Object} appData - Steam app data
 * @returns {Object} - Depot configuration
 */
function generateDepotConfiguration(appData) {
  const currentTime = Math.floor(Date.now() / 1000);
  const depots = {};
  
  // Main game depots
  if (appData.platforms.windows) {
    depots["228980"] = {
      name: "Windows",
      manifest: {
        id: Math.floor(Math.random() * 9000000000000000000) + 1000000000000000000,
        size: 2147483648, // 2GB
        download_size: 1568280576, // ~1.46GB compressed
        chunks: []
      }
    };
  }
  
  if (appData.platforms.mac) {
    depots["228981"] = {
      name: "Mac", 
      manifest: {
        id: Math.floor(Math.random() * 9000000000000000000) + 1000000000000000000,
        size: 2281701376, // 2.12GB
        download_size: 1664299008, // ~1.55GB compressed
        chunks: []
      }
    };
  }
  
  if (appData.platforms.linux) {
    depots["228982"] = {
      name: "Linux",
      manifest: {
        id: Math.floor(Math.random() * 9000000000000000000) + 1000000000000000000,
        size: 2181038080, // 2.03GB
        download_size: 1593835520, // ~1.48GB compressed
        chunks: []
      }
    };
  }
  
  // Add DLC depots (randomly generate 1-3 DLCs)
  const dlcCount = Math.floor(Math.random() * 3) + 1;
  for (let i = 0; i < dlcCount; i++) {
    const dlcId = Math.floor(Math.random() * 1000000) + 2000000;
    depots[dlcId.toString()] = {
      name: `DLC ${i + 1}`,
      manifest: {
        id: Math.floor(Math.random() * 9000000000000000000) + 1000000000000000000,
        size: Math.floor(Math.random() * 1073741824) + 536870912, // 512MB - 1.5GB
        download_size: 0,
        chunks: []
      }
    };
  }
  
  return depots;
}

/**
 * Formats the manifest as a pretty-printed JSON string
 * @param {Object} manifest - The manifest object
 * @returns {string} - Formatted JSON string
 */
function formatManifest(manifest) {
  return JSON.stringify(manifest, null, 2);
}

/**
 * Generates a summary of the manifest for Discord embed
 * @param {Object} manifest - The manifest object
 * @returns {Object} - Summary object for embed
 */
function getManifestSummary(manifest) {
  const totalSize = Object.values(manifest.depot)
    .reduce((total, depot) => total + depot.manifest.size, 0);
  
  const totalDownloadSize = Object.values(manifest.depot)
    .reduce((total, depot) => total + depot.manifest.download_size, 0);

  return {
    appName: manifest.name,
    appId: manifest.appid,
    buildId: manifest.target_build_id,
    installDir: manifest.installdir,
    totalSize: formatBytes(totalSize),
    downloadSize: formatBytes(totalDownloadSize),
    platforms: Object.keys(manifest.platforms)
      .filter(platform => manifest.platforms[platform])
      .map(platform => platform.charAt(0).toUpperCase() + platform.slice(1))
      .join(', '),
    depotCount: Object.keys(manifest.depot).length
  };
}

/**
 * Formats bytes to human readable format
 * @param {number} bytes - Number of bytes
 * @returns {string} - Formatted string
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Generates real Steam depot manifest files
 * @param {Object} appData - Steam app data
 * @returns {Array} - Array of {filename, content} objects
 */
function generateRealDepotManifests(appData) {
  const currentTime = Math.floor(Date.now() / 1000);
  const manifests = [];
  
  // Generate main game depots
  if (appData.platforms.windows) {
    const manifestId = Math.floor(Math.random() * 9000000000000000000) + 1000000000000000000;
    const buildId = Math.floor(Math.random() * 9000000000) + 1000000000;
    
    manifests.push({
      filename: `228980_${manifestId}.manifest`,
      content: generateRealManifestContent(228980, appData, manifestId, buildId, 'windows')
    });
  }
  
  if (appData.platforms.mac) {
    const manifestId = Math.floor(Math.random() * 9000000000000000000) + 1000000000000000000;
    const buildId = Math.floor(Math.random() * 9000000000) + 1000000000;
    
    manifests.push({
      filename: `228981_${manifestId}.manifest`,
      content: generateRealManifestContent(228981, appData, manifestId, buildId, 'mac')
    });
  }
  
  if (appData.platforms.linux) {
    const manifestId = Math.floor(Math.random() * 9000000000000000000) + 1000000000000000000;
    const buildId = Math.floor(Math.random() * 9000000000) + 1000000000;
    
    manifests.push({
      filename: `228982_${manifestId}.manifest`,
      content: generateRealManifestContent(228982, appData, manifestId, buildId, 'linux')
    });
  }
  
  // Generate DLC depots
  const dlcCount = Math.floor(Math.random() * 3) + 1;
  for (let i = 0; i < dlcCount; i++) {
    const dlcId = Math.floor(Math.random() * 1000000) + 2000000;
    const manifestId = Math.floor(Math.random() * 9000000000000000000) + 1000000000000000000;
    const buildId = Math.floor(Math.random() * 9000000000) + 1000000000;
    
    manifests.push({
      filename: `${dlcId}_${manifestId}.manifest`,
      content: generateRealManifestContent(dlcId, appData, manifestId, buildId, 'dlc')
    });
  }
  
  return manifests;
}

/**
 * Generates real Steam manifest content
 * @param {number} depotId - Depot ID
 * @param {Object} appData - Steam app data
 * @param {number} manifestId - Manifest ID
 * @param {number} buildId - Build ID
 * @param {string} platform - Platform type
 * @returns {string} - Real manifest content
 */
function generateRealManifestContent(depotId, appData, manifestId, buildId, platform) {
  const currentTime = Math.floor(Date.now() / 1000);
  
  // Generate realistic file list based on platform
  const gameFiles = generateRealisticFileList(appData, platform);
  
  // Generate file mapping
  let fileMapping = '"FileMapping"\n{\n';
  let fileChunks = '"FileChunks"\n{\n';
  let chunkData = '"ChunkData"\n{\n';
  
  gameFiles.forEach((file, index) => {
    const fileNum = index + 1;
    const hash = Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('');
    fileMapping += `\t"${file.name}"\t\t"${fileNum}"\t\t"${file.chunks}"\t\t"0"\t\t"${hash}"\n`;
    
    file.chunks.split(',').forEach(chunk => {
      const chunkHash = Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('');
      const chunkSize = Math.floor(Math.random() * 1048576) + 262144;
      fileChunks += `\t\t"${chunk}"\t\t"${chunkHash}"\n`;
      chunkData += `\t\t"${chunkHash}"\t\t"${chunkSize}"\t\t"${chunkHash}${Array.from({length: 32}, () => Math.floor(Math.random() * 16).toString(16)).join('')}"\n`;
    });
  });
  
  fileMapping += '}\n\n';
  fileChunks += '}\n\n';
  chunkData += '}\n';

  return `"DepotBuildID"
{
	"m_nBuildID"\t\t"${buildId}"
	"m_ulTimeUpdated"\t"${currentTime}"
}

"Manifest"
{
	"m_nManifestID"\t"${manifestId}"
	"m_nFileCount"\t"${gameFiles.length}"
	"m_nTotalSizeUncompressed"\t"${gameFiles.reduce((sum, file) => sum + parseInt(file.size), 0)}"
	"m_nTotalSizeCompressed"\t"${Math.floor(gameFiles.reduce((sum, file) => sum + parseInt(file.size), 0) * 0.7)}"
	"m_nEncryptedSize"\t"0"
	"m_bFileDataHashIncluded"\t"1"
	"m_nAppID"\t"${appData.appId}"
	"m_nDepotID"\t"${depotId}"
	"m_nLastContentManifest"\t"0"
	"m_nChunkManifest"\t"0"
	"m_nDownloadSizeManifest"\t"0"
	"m_nSignatureSize"\t"256"
	"m_bRequiresDownloadSubdirectory"\t"0"
	"m_bUserSpecific"\t"0"
	"m_bLegacyMapping"\t"0"
	"m_nFileMappingInfoSize"\t"0"
	"m_nFileMappingInfoCompressedSize"\t"0"
	"m_bAppManifest"\t"0"
	"m_bPatchFile"\t"0"
}

${fileMapping}${fileChunks}${chunkData}`;
}

/**
 * Generates realistic file list for a platform
 * @param {Object} appData - Steam app data
 * @param {string} platform - Platform type
 * @returns {Array} - Array of file objects
 */
function generateRealisticFileList(appData, platform) {
  const gameName = appData.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
  
  if (platform === 'windows') {
    return [
      { name: `${gameName}.exe`, size: "52428800", chunks: "1,2,3,4,5" },
      { name: "steam_api.dll", size: "1048576", chunks: "6" },
      { name: "steam_api64.dll", size: "2097152", chunks: "7" },
      { name: "game_data.bin", size: "1073741824", chunks: "8,9,10,11,12,13,14,15" },
      { name: "resources/textures.dat", size: "268435456", chunks: "16,17,18,19" },
      { name: "audio/sounds.wem", size: "134217728", chunks: "20,21,22" },
      { name: "config/settings.ini", size: "4096", chunks: "23" },
      { name: "binaries/launcher.exe", size: "1048576", chunks: "24" }
    ];
  } else if (platform === 'mac') {
    return [
      { name: `${gameName}.app`, size: "52428800", chunks: "1,2,3,4,5" },
      { name: "steam_api.dylib", size: "1048576", chunks: "6" },
      { name: "game_data.bin", size: "1073741824", chunks: "7,8,9,10,11,12,13,14" },
      { name: "resources/textures.dat", size: "268435456", chunks: "15,16,17,18" },
      { name: "audio/sounds.wem", size: "134217728", chunks: "19,20,21" }
    ];
  } else if (platform === 'linux') {
    return [
      { name: `${gameName}.x86_64`, size: "52428800", chunks: "1,2,3,4,5" },
      { name: "steam_api.so", size: "1048576", chunks: "6" },
      { name: "game_data.bin", size: "1073741824", chunks: "7,8,9,10,11,12,13,14" },
      { name: "resources/textures.dat", size: "268435456", chunks: "15,16,17,18" }
    ];
  } else {
    // DLC
    return [
      { name: `dlc_content.bin`, size: "536870912", chunks: "1,2,3,4,5" },
      { name: "dlc_textures.dat", size: "268435456", chunks: "6,7,8" },
      { name: "dlc_audio.wem", size: "134217728", chunks: "9,10" }
    ];
  }
}

/**
 * Generates app manifest ACF template
 * @param {Object} appData - Steam app data
 * @returns {string} - ACF template content
 */
function generateAppManifestTemplate(appData) {
  const currentTime = Math.floor(Date.now() / 1000);
  const buildId = Math.floor(Math.random() * 9000000000) + 1000000000;
  
  return `"AppState"
{
	"appid"		"${appData.appId}"
	"universe"	"1"
	"name"		"${appData.name}"
	"StateFlags"	"4"
	"installdir"		"${appData.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}"
	"SizeOnDisk"		"2147483648"
	"StagingSize"		"0"
	"buildid"		"${buildId}"
	"LastUpdated"	"${currentTime}"
	"UpdateResult"	"0"
	"TargetBuildID"	"${buildId}"
	"AutoUpdateBehavior"	"0"
	"AllowOtherDownloadsWhileRunning"	"0"
	"UserConfig"
	{
		"language"		"english"
		"beta"		""
	}
	"MountedDepots"
	{
		"228980"		"${Math.floor(Math.random() * 9000000000000000000) + 1000000000000000000}"
		"228981"		"${Math.floor(Math.random() * 9000000000000000000) + 1000000000000000000}"
		"228982"		"${Math.floor(Math.random() * 9000000000000000000) + 1000000000000000000}"
	}
	"InstallScripts"
	{
	}
	"SharedInstallScripts"
	{
	}
	"UserStats"
	{
		"gameid"		"${appData.appId}"
	}
}
`;
}

/**
 * Legacy depot template function for compatibility
 * @param {number} depotId - Depot ID
 * @param {Object} appData - Steam app data
 * @returns {string} - Depot manifest content
 */
function generateDepotTemplate(depotId, appData) {
  const manifests = generateRealDepotManifests(appData);
  const manifest = manifests.find(m => m.filename.startsWith(depotId.toString()));
  return manifest ? manifest.content : generateRealManifestContent(depotId, appData, Math.floor(Math.random() * 9000000000000000000) + 1000000000000000000, Math.floor(Math.random() * 9000000000) + 1000000000, 'windows');
}

module.exports = {
  generateSteamManifest,
  formatManifest,
  getManifestSummary,
  generateDepotTemplate,
  generateAppManifestTemplate,
  generateRealDepotManifests,
  generateRealManifestContent,
  generateRealisticFileList
};