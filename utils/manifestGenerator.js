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
    "size": 1000000000, // Template size
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
  
  // Different content for depot 2 to show variety
  if (depotId === 228981) {
    return `"DepotBuildID"
{
	"m_nBuildID"\t\t"1234567890"
	"m_ulTimeUpdated"\t"${currentTime}"
}

"Manifest"
{
	"m_nManifestID"\t"${Math.random().toString(36).substring(2, 15)}"
	"m_nFileCount"\t"100"
	"m_nTotalSizeUncompressed"\t"1000000000"
	"m_nTotalSizeCompressed"\t"800000000"
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

"FileMapping"
{
	"game.exe"\t\t"1"\t	"2"\t	"0"\t	"1234567890abcdef1234567890abcdef12345678"
	"steam_api.dll"\t\t"3"\t	"1"\t	"0"\t	"abcdef1234567890abcdef1234567890abcdef12"
	"game_data.bin"\t\t"4"\t	"5"\t	"0"\t	"567890abcdef1234567890abcdef1234567890ab"
	"resources/textures.dat"\t"6"\t	"2"\t	"0"\t	"cdef1234567890abcdef1234567890abcdef1234"
	"audio/sounds.wem"\t\t"7"\t	"3"\t	"0"\t	"234567890abcdef1234567890abcdef12345678"
	"config/settings.ini"\t"8"\t	"1"\t	"0"\t	"34567890abcdef1234567890abcdef1234567890"
}

"FileChunks"
{
	"1"\t\t"a1b2c3d4e5f6789012345678901234567890abcd"
	"2"\t\t"f1e2d3c4b5a6978012345678901234567890efgh"
	"3"\t\t"9a8b7c6d5e4f321001234567890123456789ijkl"
	"4"\t\t"1234abcd5678efgh9012ijkl3456mnop7890qrst"
	"5"\t	"uvwx5678yzab9012cdef3456ghij7890klmn"
	"6"\t	"opqr1234stuv5678wxyz9012abcd3456efgh"
	"7"\t	"ijkl5678mnop9012qrst3456uvwx7890yzab"
	"8"\t	"cdef1234ghij5678klmn9012opqr3456stuv"
}

"ChunkData"
{
	"a1b2c3d4e5f6789012345678901234567890abcd"\t	"1048576"\t	"a1b2c3d4e5f6789012345678901234567890abcd1234567890abcdef"
	"f1e2d3c4b5a6978012345678901234567890efgh"\t	"524288"\t	"f1e2d3c4b5a6978012345678901234567890efgh1234567890abcdef"
	"9a8b7c6d5e4f321001234567890123456789ijkl"\t	"2097152"\t	"9a8b7c6d5e4f321001234567890123456789ijkl1234567890abcdef"
	"1234abcd5678efgh9012ijkl3456mnop7890qrst"\t	"4194304"\t	"1234abcd5678efgh9012ijkl3456mnop7890qrst1234567890abcdef"
	"uvwx5678yzab9012cdef3456ghij7890klmn"\t	"1048576"\t	"uvwx5678yzab9012cdef3456ghij7890klmn1234567890abcdef"
	"opqr1234stuv5678wxyz9012abcd3456efgh"\t	"2097152"\t	"opqr1234stuv5678wxyz9012abcd3456efgh1234567890abcdef"
	"ijkl5678mnop9012qrst3456uvwx7890yzab"\t	"524288"\t	"ijkl5678mnop9012qrst3456uvwx7890yzab1234567890abcdef"
	"cdef1234ghij5678klmn9012opqr3456stuv"\t	"262144"\t	"cdef1234ghij5678klmn9012opqr3456stuv1234567890abcdef"
}
`;
  }
  
  // Default depot template
  return `"DepotBuildID"
{
	"m_nBuildID"\t\t"1234567890"
	"m_ulTimeUpdated"\t"${currentTime}"
}

"Manifest"
{
	"m_nManifestID"\t"${Math.random().toString(36).substring(2, 15)}"
	"m_nFileCount"\t"80"
	"m_nTotalSizeUncompressed"\t"800000000"
	"m_nTotalSizeCompressed"\t"600000000"
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

"FileMapping"
{
	"engine.dll"\t\t"1"\t	"1"\t	"0"\t	"fedcba0987654321fedcba0987654321fedcba09"
	"renderer.dll"\t\t"2"\t	"2"\t	"0"\t	"0987654321fedcba0987654321fedcba09876543"
	"physics.dll"\t\t"3"\t	"1"\t	"0"\t	"321fedcba0987654321fedcba0987654321fedc"
	"ui_system.dat"\t"4"\t	"1"\t	"0"\t	"cba0987654321fedcba0987654321fedcba09876"
	"localization/en.txt"\t"5"\t	"1"\t	"0"\t	"654321fedcba0987654321fedcba0987654321fe"
}

"FileChunks"
{
	"1"\t	"fedcba0987654321fedcba0987654321fedcba09"
	"2"\t	"0987654321fedcba0987654321fedcba09876543"
	"3"\t	"321fedcba0987654321fedcba0987654321fedc"
	"4"\t	"cba0987654321fedcba0987654321fedcba09876"
	"5"\t	"654321fedcba0987654321fedcba0987654321fe"
}

"ChunkData"
{
	"fedcba0987654321fedcba0987654321fedcba09"\t	"2097152"\t	"fedcba0987654321fedcba0987654321fedcba0987654321"
	"0987654321fedcba0987654321fedcba09876543"\t	"1048576"\t	"0987654321fedcba0987654321fedcba0987654321fedc"
	"321fedcba0987654321fedcba0987654321fedc"\t	"524288"\t	"321fedcba0987654321fedcba0987654321fedcba0987"
	"cba0987654321fedcba0987654321fedcba09876"\t	"262144"\t	"cba0987654321fedcba0987654321fedcba0987654321f"
	"654321fedcba0987654321fedcba0987654321fe"\t	"131072"\t	"654321fedcba0987654321fedcba0987654321fedcba09"
}
`;
}

/**
 * Generates app manifest ACF template
 * @param {Object} appData - Steam app data
 * @returns {string} - ACF template content
 */
function generateAppManifestTemplate(appData) {
  const currentTime = Math.floor(Date.now() / 1000);
  
  return `"AppState"
{
	"appid"\t\t"${appData.appId}"
	"universe"\t"1"
	"name"\t\t"${appData.name}"
	"StateFlags"\t"4"
	"installdir"\t\t"${appData.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}"
	"SizeOnDisk"\t\t"1000000000"
	"StagingSize"\t\t"0"
	"buildid"\t\t"1234567890"
	"LastUpdated"\t"${currentTime}"
	"UpdateResult"\t"0"
	"TargetBuildID"\t"1234567890"
	"AutoUpdateBehavior"\t"0"
	"AllowOtherDownloadsWhileRunning"\t"0"
	"UserConfig"
	{
	}
	"MountedDepots"
	{
		"228980"\t\t"1234567890123456789"
		"228981"\t\t"1234567890123456790"
	}
	"InstallScripts"
	{
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