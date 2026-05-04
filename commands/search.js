const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { searchSteamGames } = require('../utils/steamAPI');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('search')
    .setDescription('Search for games on Steam')
    .addStringOption(option =>
      option
        .setName('query')
        .setDescription('Search query for Steam games')
        .setRequired(true)
        .setMinLength(1)
        .setMaxLength(100)
    )
    .addIntegerOption(option =>
      option
        .setName('limit')
        .setDescription('Number of results to return (1-10)')
        .setMinValue(1)
        .setMaxValue(10)
    ),

  async execute(interaction) {
    const query = interaction.options.getString('query');
    const limit = interaction.options.getInteger('limit') || 5;

    // Defer the reply since this might take some time
    await interaction.deferReply();

    try {
      console.log(`Searching Steam for: ${query}`);
      const searchResults = await searchSteamGames(query, limit);

      if (!searchResults || searchResults.length === 0) {
        const noResultsEmbed = new EmbedBuilder()
          .setColor('#FF0000')
          .setTitle('❌ No Results Found')
          .setDescription(`No games found for search query: **${query}**`)
          .addFields(
            { name: '💡 Tips', value: '• Try different keywords\n• Use shorter search terms\n• Check game spelling\n• Try the full game title' },
            { name: '🔍 Example Searches', value: '`counter-strike`, `gta`, `minecraft`, `valorant`' }
          )
          .setTimestamp()
          .setFooter({ text: 'Steam Manifest Generator Bot' });

        return await interaction.editReply({ embeds: [noResultsEmbed] });
      }

      // Create results embed
      const resultsEmbed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle(`🔍 Steam Search Results: "${query}"`)
        .setDescription(`Found ${searchResults.length} game(s) matching your search`)
        .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg')
        .addFields(
          searchResults.map((game, index) => ({
            name: `${index + 1}. ${game.name}`,
            value: `**App ID:** \`${game.appid}\`\n**Platforms:** ${getPlatformEmojis(game.platforms)}\n**Release Date:** ${game.release_date || 'Unknown'}\n**Price:** ${game.price || 'Free'}\n**Use:** \`/manifest appid:${game.appid}\``,
            inline: false
          }))
        )
        .addFields(
          { 
            name: '🎮 How to Generate Files', 
            value: 'Copy the App ID from any result above and use:\n`/manifest appid:[APP_ID]`\n\nExample: `/manifest appid:730` for Counter-Strike 2', 
            inline: false 
          }
        )
        .setTimestamp()
        .setFooter({ 
          text: 'Steam Manifest Generator • Real Steam API Search', 
          iconURL: interaction.client.user.displayAvatarURL() 
        });

      await interaction.editReply({ embeds: [resultsEmbed] });

      console.log(`Successfully returned ${searchResults.length} search results for query: ${query}`);

    } catch (error) {
      console.error(`Error searching Steam for query "${query}":`, error);

      const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('❌ Search Failed')
        .setDescription(`Failed to search Steam for query: **${query}**`)
        .addFields(
          { name: 'Error Details', value: error.message || 'Unknown error occurred' },
          { name: 'Possible Causes', value: '• Steam API is temporarily unavailable\n• Network connectivity issues\n• Invalid search query' },
          { name: 'Troubleshooting', value: 'Try again in a few moments, or use a different search term.' }
        )
        .setTimestamp()
        .setFooter({ text: 'Steam Manifest Generator Bot' });

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  }
};

/**
 * Gets platform emojis for display
 * @param {Object} platforms - Platform object
 * @returns {string} - Platform emojis
 */
function getPlatformEmojis(platforms) {
  const emojis = [];
  if (platforms?.windows) emojis.push('🪟');
  if (platforms?.mac) emojis.push('🍎');
  if (platforms?.linux) emojis.push('🐧');
  return emojis.length > 0 ? emojis.join(' ') : '❌';
}
