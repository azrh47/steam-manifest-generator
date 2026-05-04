// Type declarations for JavaScript utility modules
declare module '../../../../../utils/steamAPI.js' {
  export function getSteamAppDetails(appId: string): Promise<any>;
  export function validateAppId(appId: string): boolean;
}

declare module '../../../../../utils/manifestGenerator.js' {
  export function generateSteamManifest(appData: any): any;
  export function formatManifest(manifest: any): string;
}

declare module '../../../../../utils/luaGenerator.js' {
  export function generateLuaScript(appData: any): string;
}

declare module '../../../../../utils/keyGenerator.js' {
  export function generateSteamKeys(appData: any): any;
  export function generateKeyVDF(appData: any): string;
}
