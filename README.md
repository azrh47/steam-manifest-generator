# Nerai Templates - Steam Manifest Generator Bot

A Discord bot that generates educational Steam manifest templates and Lua scripts with real Steam API data.

## Features

- `/manifest appid:<id>` - Generate educational templates for any Steam app
- Fetches real data from Steam Web API and Store API
- Sends templates as ZIP file attachments
- Educational templates only (not working Steam files)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a `.env` file

Copy `.env.example` and fill in your environment variables:

```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=1498423752160182552
GUILD_ID=1407119291559579759
STEAM_API_KEY=your_steam_api_key_here
```

### 3. Deploy slash commands

Run this once (or whenever you add/change commands):

```bash
npm run deploy
```

### 4. Start the bot

```bash
npm start
```

## Deploy to Render (24/7 Hosting)

1. Push your code to GitHub
2. Go to [render.com](https://render.com) and sign up
3. Click **New** → **Background Worker**
4. Connect your GitHub repository
5. Set configuration:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add environment variables:
   - `DISCORD_TOKEN` = your bot token
   - `CLIENT_ID` = `1498423752160182552`
   - `GUILD_ID` = `1407119291559579759`
   - `STEAM_API_KEY` = your Steam Web API key
   - `NODE_VERSION` = `20`
7. Click **Create** and your bot starts!

## Environment Variables

### Required
```env
DISCORD_TOKEN=your_discord_bot_token
CLIENT_ID=1498423752160182552
GUILD_ID=1407119291559579759
STEAM_API_KEY=your_steam_web_api_key
NODE_VERSION=20
```

### Getting a Steam Web API Key
1. Go to [Steam Community](https://steamcommunity.com/dev/apikey)
2. Log in with your Steam account
3. Enter any domain name (e.g., `localhost`)
4. Copy your API key

## Generated Templates

The bot generates a ZIP file containing:
- `appmanifest_{appid}.acf` - App manifest template
- `depot_1_template.manifest` - Depot manifest template
- `depot_2_template.manifest` - Second depot template
- `{appid}_script_template.lua` - Lua script template

All templates use real Steam data but are clearly marked as educational examples.

## Project Structure

```
├── index.js                  # Bot entry point
├── commands/
│   └── manifest.js           # /manifest slash command
├── config/
│   └── deploy-commands.js    # Slash command deployer
├── utils/
│   ├── steamAPI.js           # Steam Store API wrapper
│   ├── manifestGenerator.js  # Manifest file generator
│   └── luaGenerator.js       # Lua script generator
├── .env.example              # Environment variable template
└── package.json              # Bot dependencies
```

## Important Notes

- **Do NOT use Vercel** - this is a long-running bot, not a website
- **Do NOT run `npm run build`** - there is no build step
- Run `npm run deploy` only when slash commands are added or changed
- Keep your `DISCORD_TOKEN` secret - never commit it to GitHub