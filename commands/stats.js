const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Shows bot statistics and information'),

  async execute(interaction) {
    const startTime = interaction.client.readyAt || new Date();
    const uptime = Date.now() - startTime.getTime();
    const uptimeDays = Math.floor(uptime / (1000 * 60 * 60 * 24));
    const uptimeHours = Math.floor((uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const uptimeMinutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));

    const statsEmbed = new EmbedBuilder()
      .setColor('#0099FF')
      .setTitle('📊 Bot Statistics & Information')
      .setDescription('Steam Manifest Generator Bot - Professional Steam File Generation')
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .addFields(
        { 
          name: '🤖 Bot Information', 
          value: `**Name:** ${interaction.client.user.tag}\n**ID:** ${interaction.client.user.id}\n**Servers:** ${interaction.client.guilds.cache.size}\n**Users:** ${interaction.client.users.cache.size}\n**Uptime:** ${uptimeDays}d ${uptimeHours}h ${uptimeMinutes}m`, 
          inline: false 
        },
        { 
          name: '🔧 Technical Features', 
          value: '✅ Real Steam API Integration\n✅ Enhanced App Data Fetching\n✅ Dynamic Depot Configuration\n✅ Realistic File Generation\n✅ Multiple Platform Support\n✅ Steamtools Compatibility\n✅ Project Lightning Support', 
          inline: false 
        },
        { 
          name: '📁 File Generation Capabilities', 
          value: '• App Manifests (ACF format)\n• Depot Manifests (real Steam format)\n• Lua Scripts with depot IDs\n• VDF Key Files\n• README Documentation\n• Multiple DLC Depots\n• 1.5MB+ File Packages', 
          inline: false 
        },
        { 
          name: '🎮 Steam API Features', 
          value: '• Store API Integration\n• Web API Support (with key)\n• Game Search Functionality\n• Real-time App Data\n• Genre-based Size Estimation\n• Platform Detection\n• Release Date Information', 
          inline: false 
        },
        { 
          name: '📋 Available Commands', 
          value: '`/manifest` - Generate Steam files\n`/search` - Search Steam games\n`/version` - Bot version info\n`/stats` - Show this statistics\n`/help` - Help and commands', 
          inline: false 
        },
        { 
          name: '🔍 Search Capabilities', 
          value: '• Real-time Steam search\n• Multiple result support\n• Platform indicators\n• Price information\n• Release dates\n• Direct manifest generation', 
          inline: false 
        },
        { 
          name: '⚡ Performance', 
          value: '• Fast API responses\n• Efficient file generation\n• Large file handling\n• ZIP compression\n• Error handling\n• Fallback mechanisms', 
          inline: false 
        }
      )
      .setTimestamp()
      .setFooter({ 
        text: 'Steam Manifest Generator • Professional Steam File Generation', 
        iconURL: interaction.client.user.displayAvatarURL() 
      });

    await interaction.reply({ embeds: [statsEmbed] });
  }
};
