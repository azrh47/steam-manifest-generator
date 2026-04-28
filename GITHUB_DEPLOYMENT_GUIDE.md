# 🚀 GitHub Deployment Guide for Steam Manifest Generator

## 📋 Prerequisites

Before starting, ensure you have:

- ✅ GitHub Account: Already created (`azrh47/steam-manifest-generator`)
- ✅ Discord Developer Account: Bot application created
- ✅ Steam API Key (optional): Get from [Steam Community](https://steamcommunity.com/dev/apikey)
- 🔄 Vercel Account: Sign up at [vercel.com](https://vercel.com)

## 🔧 Current Setup Status

Your project is **already configured** with:

- ✅ GitHub repository: `https://github.com/azrh47/steam-manifest-generator`
- ✅ GitHub Actions workflows in `.github/workflows/`
- ✅ Vercel configuration (`vercel.json`)
- ✅ Package.json with correct repository URL
- ✅ All dependencies and scripts ready

## 🌐 Step 1: Deploy Website to Vercel

### Method A: Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"

2. **Import Git Repository**
   - Select "Import Git Repository"
   - Choose your `azrh47/steam-manifest-generator` repository
   - Click "Import"

3. **Configure Settings**
   ```
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

4. **Add Environment Variables**
   - `DATABASE_URL`: Your database connection string
   - `DISCORD_TOKEN`: Your Discord bot token
   - `STEAM_API_KEY`: Your Steam API key
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy your Vercel URL (e.g., `https://your-app.vercel.app`)

### Method B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

## 🔐 Step 2: Add GitHub Secrets

1. **Go to your repository**: https://github.com/azrh47/steam-manifest-generator
2. **Settings** → **Secrets and variables** → **Actions**
3. **Add these secrets**:

| Secret Name | Value | Where to Get |
|-------------|-------|--------------|
| `DISCORD_TOKEN` | Your Discord bot token | Discord Developer Portal → Bot → Reset Token |
| `CLIENT_ID` | Your Discord application ID | Discord Developer Portal → General Information |
| `WEBSITE_URL` | Your Vercel URL | From Vercel deployment (e.g., `https://your-app.vercel.app`) |
| `VERCEL_TOKEN` | Your Vercel API token | Vercel Dashboard → Account Settings → Tokens |
| `VERCEL_ORG_ID` | Your Vercel org ID | Vercel Dashboard URL or settings |
| `VERCEL_PROJECT_ID` | Your Vercel project ID | From Vercel project settings |
| `DATABASE_URL` | Your database URL | Database provider (Supabase, Neon, etc.) |
| `STEAM_API_KEY` | Your Steam API key | Steam Community → Dev API Key |

## 🔗 Step 3: Connect Vercel to GitHub (Optional but Recommended)

1. **Go to your Vercel project** → **Settings** → **Git Integration**
2. **Click "Connect to Git"**
3. **Select your GitHub repository**
4. **Enable Automatic Deployments** from main branch

## 🤖 Step 4: Deploy Discord Bot

Your GitHub Actions will automatically deploy both the website and bot:

### Automatic Deployment (GitHub Actions)

1. **Push your code**:
   ```bash
   git add .
   git commit -m "Configure GitHub deployment"
   git push origin main
   ```

2. **Monitor deployment**:
   - Go to the **Actions** tab in your repository
   - The workflows will automatically run:
     - `Deploy Website`: Deploys to Vercel
     - `Deploy Discord Bot`: Deploys bot commands and prepares for server deployment

### Manual Bot Deployment Options

Choose one of these hosting services for your Discord bot:

#### Option A: Replit (Free)
1. Go to [replit.com](https://replit.com)
2. Click "Import from GitHub"
3. Enter your repository URL
4. Add environment variables in Replit secrets
5. Run the bot

#### Option B: Railway (Free tier)
1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add environment variables
5. Deploy

#### Option C: Render (Free tier)
1. Go to [render.com](https://render.com)
2. Click "New" → "Web Service"
3. Connect GitHub repository
4. Configure build and start commands
5. Deploy

## ✅ Step 5: Verify Deployment

### Website Verification
```bash
# Test health endpoint
curl https://your-app.vercel.app/api/health

# Expected response
{"status":"ok","timestamp":"..."}
```

### Bot Verification
1. **Invite bot to Discord**:
   ```
   https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands
   ```

2. **Test bot command**:
   ```
   /manifest appid:730
   ```

3. **Expected behavior**:
   - Bot responds with download button
   - Files generate correctly
   - Integration with website works

## 🚨 Troubleshooting

### GitHub Actions Issues
- **Check secret names**: Ensure they match exactly
- **Verify secret values**: No extra spaces or characters
- **Check repository permissions**: Ensure Actions are enabled

### Vercel Deployment Issues
- **Build command**: Ensure `npm run build` works locally
- **Environment variables**: Check all required vars are set
- **Function logs**: Review Vercel function logs

### Bot Issues
- **WEBSITE_URL**: Ensure it's correct and accessible
- **Discord permissions**: Verify bot has proper permissions
- **Token validity**: Check Discord token hasn't expired

### Database Issues
- **DATABASE_URL format**: Verify connection string format
- **Prisma schema**: Run `npx prisma db push`
- **Database provider**: Check service status

## 🎯 Success Metrics

Your deployment is successful when:

- ✅ **Website**: Responds to `/api/health`
- ✅ **Bot**: Online and responds to commands
- ✅ **Integration**: Bot calls website API
- ✅ **Files**: Generate and download correctly
- ✅ **Security**: Access control working
- ✅ **Steamtools**: Compatible formats available

## 🔄 CI/CD Pipeline

Your setup includes automatic CI/CD:

- **Push to main** → Triggers both workflows
- **Website** → Auto-deploys to Vercel
- **Bot** → Auto-deploys commands and prepares for server deployment
- **Rollbacks** → Available through GitHub and Vercel

## 📞 Getting Help

If you encounter issues:

1. **Check this guide** for missed steps
2. **Review GitHub Actions logs** for specific errors
3. **Check Vercel dashboard** for deployment issues
4. **Test locally first**:
   ```bash
   npm run server  # Test website
   npm run bot     # Test bot
   ```
5. **Create GitHub Issue** for technical problems

## 🎉 Congratulations!

Once completed, you'll have:

- 🌐 **Globally hosted website** via Vercel
- 🤖 **Deployed Discord bot** with automatic updates
- 🔗 **Full integration** between bot and website
- 🛠️ **Steamtools compatibility** for your users
- 🔄 **CI/CD pipeline** for automatic updates

Your Steam Manifest Generator is now production-ready! 🚀
