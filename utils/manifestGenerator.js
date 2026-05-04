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
    "userconfig": {
      "gameid": appData.appId,
      "name": appData.name,
      "language": "english",
      "beta": "",
      "gamestats": {
        "ingame": false,
        "seconds": 0
      }
    },
    "platforms": {
      "windows": appData.platforms.windows,
      "mac": appData.platforms.mac,
      "linux": appData.platforms.linux
    },
    "required_appid": [],
    "launch": [
      {
        "type": "default",
        "config": {
          "oslist": "windows"
        },
        "executable": `${appData.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.exe`,
        "arguments": "",
        "workingdir": "",
        "description": "Launch Game"
      }
    ]
  };

  // Only include platforms that are supported
  if (!appData.platforms.mac) {
    delete manifest.depot["228981"];
  }
  if (!appData.platforms.linux) {
    delete manifest.depot["228982"];
  }

  return manifest;
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
 * Generates educational depot manifest template
 * @param {number} depotId - Depot ID
 * @param {Object} appData - Steam app data
 * @returns {string} - Depot manifest template content
 */
function generateDepotTemplate(depotId, appData) {
  const currentTime = Math.floor(Date.now() / 1000);
  const buildId = Math.floor(Math.random() * 9000000000) + 1000000000;
  const manifestId = Math.floor(Math.random() * 9000000000000000000) + 1000000000000000000;
  
  // Generate file list based on depot
  const gameFiles = depotId === 228980 ? [
    { name: `${appData.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.exe`, size: "52428800", chunks: "1" },
    { name: "steam_api.dll", size: "1048576", chunks: "2" },
    { name: "game_data.bin", size: "1073741824", chunks: "3,4,5" },
    { name: "resources/textures.dat", size: "268435456", chunks: "6,7" },
    { name: "audio/sounds.wem", size: "134217728", chunks: "8,9" },
    { name: "config/settings.ini", size: "4096", chunks: "10" }
  ] : depotId === 228981 ? [
    { name: "game.app", size: "52428800", chunks: "1" },
    { name: "steam_api.dylib", size: "1048576", chunks: "2" },
    { name: "game_data.bin", size: "1073741824", chunks: "3,4,5" },
    { name: "resources/textures.dat", size: "268435456", chunks: "6,7" }
  ] : [
    { name: "game.x86_64", size: "52428800", chunks: "1" },
    { name: "steam_api.so", size: "1048576", chunks: "2" },
    { name: "game_data.bin", size: "1073741824", chunks: "3,4,5" },
    { name: "resources/textures.dat", size: "268435456", chunks: "6,7" }
  ];

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
      const chunkSize = Math.floor(Math.random() * 1048576) + 262144; // Random size between 256KB and 1MB
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

module.exports = {
  generateSteamManifest,
  formatManifest,
  getManifestSummary,
  generateDepotTemplate,
  generateAppManifestTemplate
};