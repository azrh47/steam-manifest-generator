const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { MANIFEST_SOURCES, getTransparencyStatement, getMichaelExplanation } = require('../utils/manifestSource');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('source')
    .setDescription('Explains where Steam manifest files come from (Michael\'s question)'),

  async execute(interaction) {
    const sourceEmbed = new EmbedBuilder()
      .setColor('#0099FF')
      .setTitle('🔍 Steam Manifest File Sources')
      .setDescription('Answering Michael\'s question: "Where are you getting those files from?"')
      .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/256px-Steam_icon_logo.svg.png')
      .addFields(
        {
          name: '📚 This Educational Bot',
          value: '**Source:** Generated using real Steam API data\n**Method:** Steam Store API + Web API\n**Authenticity:** Realistic format, educational purpose\n**Transparency:** Clear about generation process',
          inline: false
        },
        {
          name: '🏢 Professional Bots (Michael\'s)',
          value: '**Source:** Steam CDN / Database\n**Method:** Fetch real manifest files\n**Authenticity:** 100% real Steam files\n**Complexity:** Requires Steam database access',
          inline: false
        },
        {
          name: '📊 Comparison Table',
          value: '||Educational Bot||Professional Bot||\n|---|---|\n|Generated|Fetched|\n|Steam API data|Steam CDN|\n|Learning purpose|Production use|\n|Transparent|Authentic|',
          inline: false
        },
        {
          name: '🎯 Why Educational Approach?',
          value: '• Steam doesn\'t provide public manifest file access\n• Educational bots need to demonstrate Steam integration\n• Real Steam API data + authentic format = best learning\n• Perfect for students learning Steam development',
          inline: false
        },
        {
          name: '⚙️ Technical Implementation',
          value: '1. Fetch real game data from Steam Store API\n2. Generate manifests in authentic Steam format\n3. Use real depot IDs and manifest patterns\n4. Create professional-grade educational files',
          inline: false
        }
      )
      .setTimestamp()
      .setFooter({ 
        text: 'Steam Manifest Generator • Educational Transparency',
        iconURL: interaction.client.user.displayAvatarURL()
      });

    await interaction.reply({ embeds: [sourceEmbed] });
  }
};
