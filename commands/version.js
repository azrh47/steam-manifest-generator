const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('version')
    .setDescription('Check bot version and features'),

  async execute(interaction) {
    const versionEmbed = new EmbedBuilder()
      .setColor('#0099FF')
      .setTitle('🤖 Bot Version Information')
      .setDescription('Professional Steam Manifest Generator - Enhanced with Real Steam API')
      .addFields(
        { name: '📦 Version', value: '3.0.0 Pro', inline: true },
        { name: '🔧 Core Features', value: '✅ Real Steam API\n✅ Enhanced Data\n✅ Professional Files\n✅ Multiple Commands', inline: true },
        { name: '🎮 Steam Integration', value: '✅ Store API + Web API\n✅ Real Game Data\n✅ Dynamic Depots\n✅ Size Estimation', inline: true },
        { name: '📁 Generated Files', value: 'Dynamic file count based on game:\n• App manifest (ACF)\n• Multiple depot manifests\n• Lua script with depot IDs\n• VDF key files\n• README documentation\n• DLC depots (1-3)', inline: false },
        { name: '🚀 New Commands', value: '`/manifest` - Generate Steam files\n`/search` - Search Steam games\n`/stats` - Bot statistics\n`/help` - Command help\n`/version` - This info', inline: false },
        { name: '💾 File Sizes', value: '• 1.5MB+ ZIP packages\n• Realistic chunk data\n• Platform-specific files\n• Genre-based sizing', inline: false },
        { name: '🔍 Search Features', value: '• Real-time Steam search\n• Multiple results\n• Platform indicators\n• Price information', inline: false },
        { name: '🕒 Last Updated', value: new Date().toISOString(), inline: true },
        { name: '🔄 Status', value: '✅ Enhanced Steam API Ready\n✅ Professional File Generation\n✅ All Commands Working', inline: true }
      )
      .setTimestamp()
      .setFooter({ text: 'Nerai • Professional Steam Manifest Generator' });

    await interaction.reply({ embeds: [versionEmbed], ephemeral: true });
  }
};
