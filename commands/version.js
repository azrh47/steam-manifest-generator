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
        { name: '🔧 Features', value: '✅ Key Generation\n✅ VDF Templates\n✅ README.txt\n✅ Educational Templates', inline: true },
        { name: '📁 Template Files', value: '6 files included:\n• appmanifest_{appid}.acf\n• depot_1_template.manifest\n• depot_2_template.manifest\n• {appid}_script_template.lua\n• key.vdf\n• README.txt', inline: false },
        { name: '🕒 Last Updated', value: new Date().toISOString(), inline: true },
        { name: '🔄 Status', value: 'Using latest code with key generation', inline: true }
      )
      .setTimestamp()
      .setFooter({ text: 'Nerai Templates • Steam Manifest Generator' });

    await interaction.reply({ embeds: [versionEmbed], ephemeral: true });
  }
};
