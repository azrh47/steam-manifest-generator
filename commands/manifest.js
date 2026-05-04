const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getSteamAppDetails, validateAppId } = require('../utils/steamAPI');
const { generateSteamManifest, formatManifest, generateDepotTemplate, generateAppManifestTemplate } = require('../utils/manifestGenerator');
const { generateLuaScript } = require('../utils/luaGenerator');
const archiver = require('archiver');
const { Buffer } = require('buffer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('manifest')
    .setDescription('Generate educational Steam manifest templates and Lua script')
    .addIntegerOption(option =>
      option
        .setName('appid')
        .setDescription('The Steam App ID to generate files for')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(9999999)
    ),

  async execute(interaction) {
    const appId = interaction.options.getInteger('appid');

    // Validate App ID format
    if (!validateAppId(appId)) {
      const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('❌ Invalid App ID')
        .setDescription('The provided App ID is not valid. Please enter a valid Steam App ID (1-9999999).')
        .addFields(
          { name: 'Example', value: '`/manifest appid:730` (Counter-Strike 2)' },
          { name: 'How to find App ID', value: 'You can find App IDs in Steam store URLs or on SteamDB' }
        )
        .setTimestamp()
        .setFooter({ text: 'Steam Manifest Generator Bot' });

      return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    // Defer the reply since this might take some time
    await interaction.deferReply();

    try {
      // Fetch Steam app data
      console.log(`Fetching Steam app details for App ID: ${appId}`);
      const appData = await getSteamAppDetails(appId);

      // Generate educational template files
      const manifest = generateSteamManifest(appData);
      const manifestJson = formatManifest(manifest);
      const luaScript = generateLuaScript(appData);
      const appManifestTemplate = generateAppManifestTemplate(appData);
      const depot1Template = generateDepotTemplate(228980, appData);
      const depot2Template = generateDepotTemplate(228981, appData);

      // Create ZIP file
      const zip = archiver('zip', { zlib: { level: 9 } });
      const zipBuffer = [];

      zip.on('data', (chunk) => zipBuffer.push(chunk));
      
      // Add educational template files
      zip.append(appManifestTemplate, { name: `appmanifest_${appData.appId}_template.acf` });
      zip.append(depot1Template, { name: `depot_1_template.manifest` });
      zip.append(depot2Template, { name: `depot_2_template.manifest` });
      zip.append(luaScript, { name: `${appData.appId}_script_template.lua` });
      
      await zip.finalize();
      
      const finalZipBuffer = Buffer.concat(zipBuffer);

      // Create main embed
      const mainEmbed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle(`✅ Download completed: ${appData.name}`)
        .setURL(`https://store.steampowered.com/app/${appId}`)
        .setDescription(`Generated educational templates using real Steam data.`)
        .setThumbnail(appData.headerImage || null)
        .addFields(
          { name: '📋 App Information', value: `**App ID:** ${appId}\n**Developer:** ${appData.developer}\n**Publisher:** ${appData.publisher}\n**Release Date:** ${appData.releaseDate}\n**Genres:** ${appData.genres.join(', ') || 'N/A'}`, inline: false },
          { name: '📁 Generated Templates', value: `✅ **appmanifest_${appId}.acf** - App manifest template\n✅ **depot_1_template.manifest** - Depot manifest template\n✅ **depot_2_template.manifest** - Second depot template\n✅ **${appId}_script_template.lua** - Lua script template\n\nEducational templates with real Steam data.`, inline: false }
        )
        .setTimestamp()
        .setFooter({
          text: 'Nerai Templates • Educational templates attached',
          iconURL: interaction.client.user.displayAvatarURL()
        });

      // Create action buttons
      const actionButtons = {
        type: 1,
        components: [{
          type: 2,
          style: 5,
          label: '🛒 View on Steam',
          url: `https://store.steampowered.com/app/${appId}`
        }]
      };

      // Send the embed with ZIP attachment
      await interaction.editReply({
        embeds: [mainEmbed],
        components: [actionButtons],
        files: [
          {
            attachment: finalZipBuffer,
            name: `${appData.appId}.zip`
          }
        ]
      });

      console.log(`Successfully generated files for App ID ${appId} (${appData.name})`);

    } catch (error) {
      console.error(`Error generating files for App ID ${appId}:`, error);

      const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('❌ Generation Failed')
        .setDescription(`Failed to generate files for App ID **${appId}**`)
        .addFields(
          { name: 'Error Details', value: error.message || 'Unknown error occurred' },
          { name: 'Possible Causes', value: '• Steam API is temporarily unavailable\n• App ID does not exist\n• Network connectivity issues' },
          { name: 'Troubleshooting', value: 'Try again in a few moments, or verify the App ID exists on Steam.' }
        )
        .setTimestamp()
        .setFooter({ text: 'Steam Manifest Generator Bot' });

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  }
};