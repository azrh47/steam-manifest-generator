# Steam Manifest Generator Bot

A Discord bot that generates Steam app manifests and Lua scripts with real Steam API data. Compatible with Steamtools.

## Features

- `/manifest appid:<id>` - Generate a Steam manifest and Lua script for any Steam app
- Fetches real data from the Steam Store API
- Sends files as Discord attachments (no website needed)
- Steamtools compatible output

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a `.env` file

Copy `.env.example` and fill in your bot token:

```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=1498423752160182552
GUILD_ID=1407119291559579759
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

## Deploy to Railway (24/7 Hosting)

1. Push your code to GitHub
2. Go to [railway.app](https://railway.app) and sign up
3. Click **New Project** → **Deploy from GitHub repo**
4. Select your repository
5. Add environment variables in the **Variables** tab:
   - `DISCORD_TOKEN` = your bot token
   - `CLIENT_ID` = `1498423752160182552`
   - `GUILD_ID` = `1407119291559579759`
6. Railway auto-detects Node.js and runs:
   - **Build:** `npm install`
   - **Start:** `npm start`
7. Your bot goes online automatically!

## Deploy to Render (Alternative)

1. Push your code to GitHub
2. Go to [render.com](https://render.com) and sign up
3. Click **New** → **Background Worker**
4. Connect your GitHub repo
5. Set:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Add environment variables:
   - `DISCORD_TOKEN` = your bot token
   - `CLIENT_ID` = `1498423752160182552`
   - `GUILD_ID` = `1407119291559579759`
7. Click **Create** and your bot starts!

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