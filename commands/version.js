const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('version')
    .setDescription('Check bot version and features'),

  async execute(interaction) {
    const versionEmbed = new EmbedBuilder()
      .setColor('#0099FF')
      .setTitle('🤖 Bot Version Information')
      .setDescription('Steam Manifest Generator Bot Status')
      .addFields(
        { name: '📦 Version', value: '2.0.0', inline: true },
        { name: '🔧 Features', value: '✅ Key Generation\n✅ VDF Files\n✅ README.txt\n✅ Steam Files', inline: true },
        { name: '📁 Generated Files', value: '6 files included:\n• appmanifest_{appid}.acf\n• depot_1.manifest\n• depot_2.manifest\n• {appid}_script.lua\n• key.vdf\n• README.txt', inline: false },
        { name: '🕒 Last Updated', value: new Date().toISOString(), inline: true },
        { name: '🔄 Status', value: 'Using latest code with key generation', inline: true }
      )
      .setTimestamp()
      .setFooter({ text: 'Nerai • Steam Manifest Generator' });

    await interaction.reply({ embeds: [versionEmbed], ephemeral: true });
  }
};
