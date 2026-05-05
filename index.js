const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, ActivityType } = require('discord.js');

// Only load .env for local development, Railway provides env vars directly
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Load commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
    console.log(`Loaded command: ${command.data.name}`);
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}

// Ready event
client.once(Events.ClientReady, c => {
  console.log(`✅ Ready! Logged in as ${c.user.tag}`);
  console.log(`🤖 Bot is serving ${c.guilds.cache.size} servers`);
  console.log(`👥 Serving ${c.users.cache.size} users`);
  
  // Set bot activity
  client.user.setActivity('Generating Steam manifests', { type: ActivityType.Playing });
  
  console.log('📝 Bot activity set to: "Generating Steam manifests"');
});

// Interaction (slash command) event
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    console.log(`Executing command: ${interaction.commandName} by ${interaction.user.tag} in ${interaction.guild?.name || 'DM'}`);
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error executing ${interaction.commandName}:`, error);
    
    // Handle specific Discord API errors
    if (error.code === 10062) {
      // Unknown interaction - Discord timed out, nothing we can do
      console.log('Interaction expired (Discord timeout), skipping response');
      return;
    }
    
    if (error.code === 40060) {
      // Interaction already acknowledged - skip response
      console.log('Interaction already acknowledged, skipping response');
      return;
    }
    
    const errorMessage = {
      content: '❌ There was an error while executing this command!',
      flags: [4096] // Use flags instead of deprecated ephemeral
    };

    try {
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(errorMessage);
      } else {
        await interaction.reply(errorMessage);
      }
    } catch (followUpError) {
      // If we can't even send an error message, just log it
      console.error('Failed to send error message:', followUpError);
    }
  }
});

// Guild join event
client.on(Events.GuildCreate, async guild => {
  console.log(`🎉 Joined new server: ${guild.name} (ID: ${guild.id})`);
  console.log(`📊 Server has ${guild.memberCount} members`);
  
  // You can add welcome messages here if desired
  // const channel = guild.systemChannel;
  // if (channel) {
  //   await channel.send('Thanks for adding Steam Manifest Generator Bot! Use `/manifest <appid>` to get started.');
  // }
});

// Guild leave event
client.on(Events.GuildDelete, async guild => {
  console.log(`👋 Left server: ${guild.name} (ID: ${guild.id})`);
});

// Error handling
client.on('error', error => {
  console.error('Discord client error:', error);
});

process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', error => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully...');
  client.destroy();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully...');
  client.destroy();
  process.exit(0);
});

// Debug checks before login
console.log("All env vars starting with DISCORD:");
Object.keys(process.env).filter(key => key.startsWith('DISCORD')).forEach(key => {
  console.log(`${key}: ${process.env[key] ? 'EXISTS' : 'MISSING'}`);
});
console.log("Token exists:", !!process.env.DISCORD_TOKEN);
console.log("Token length:", process.env.DISCORD_TOKEN?.length);

// Trim and validate token
const token = process.env.DISCORD_TOKEN?.trim();

if (!token) {
  console.error("DISCORD_TOKEN is missing.");
  process.exit(1);
}

// Login to Discord with your client's token
client.login(token).catch(error => {
  console.error('Failed to login to Discord:', error);
  process.exit(1);
});