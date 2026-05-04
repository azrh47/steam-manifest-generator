const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Shows help information and available commands'),

  async execute(interaction) {
    const helpEmbed = new EmbedBuilder()
      .setColor('#0099FF')
      .setTitle('🤖 Steam Manifest Generator - Help')
      .setDescription('Professional Steam file generation bot with real Steam API integration')
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .addFields(
        { 
          name: '📋 Available Commands', 
          value: '`/manifest` - Generate Steam manifest files\n`/search` - Search Steam games\n`/version` - Bot version and features\n`/stats` - Bot statistics\n`/help` - Show this help message', 
          inline: false 
        },
        { 
          name: '🎮 Main Command - /manifest', 
          value: '**Usage:** `/manifest appid:730`\n**Description:** Generates complete Steam manifest files including app manifests, depot manifests, Lua scripts, and VDF keys\n**Features:** Real Steam API data, professional file naming, Steamtools compatible', 
          inline: false 
        },
        { 
          name: '🔍 Search Command - /search', 
          value: '**Usage:** `/search query:counter-strike`\n**Description:** Search for games on Steam\n**Returns:** Game information, App ID, platforms, release date', 
          inline: false 
        },
        { 
          name: '📊 Features', 
          value: '✅ Real Steam API integration\n✅ Professional file generation\n✅ Steamtools compatible\n✅ Project Lightning support\n✅ Dynamic depot configuration\n✅ Realistic file sizes\n✅ Multiple platform support', 
          inline: false 
        },
        { 
          name: '🎯 File Types Generated', 
          value: '• App manifest (ACF format)\n• Depot manifests (real Steam format)\n• Lua scripts with proper depot IDs\n• VDF key files\n• README documentation\n• Multiple DLC depots', 
          inline: false 
        },
        { 
          name: '⚙️ Technical Info', 
          value: '• Uses Steam Store API + Web API\n• Generates 1.5MB+ file packages\n• Realistic chunk data and file mapping\n• Platform-specific file lists\n• Genre-based size estimation', 
          inline: false 
        }
      )
      .setTimestamp()
      .setFooter({ 
        text: 'Steam Manifest Generator • Professional Steam File Generation', 
        iconURL: interaction.client.user.displayAvatarURL() 
      });

    await interaction.reply({ embeds: [helpEmbed] });
  }
};
