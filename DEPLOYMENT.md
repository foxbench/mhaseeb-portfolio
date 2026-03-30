# Deployment Guide

Complete setup guide for deploying the portfolio from scratch.

## Prerequisites

| Tool | Purpose | Get it |
|------|---------|--------|
| Node.js 18+ | Build & run locally | https://nodejs.org |
| Cloudflare account | Hosting (free tier) | https://dash.cloudflare.com/sign-up |
| Groq API key | LLM for chat | https://console.groq.com |
| Git | Version control | https://git-scm.com |
| Wrangler CLI | Cloudflare deploys | Installed via `npm install` in worker/ |

## Environment Variables

### Frontend (.env.local)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_CHAT_API_URL` | Chat worker endpoint | `https://mhaseeb-chat.xyz.workers.dev/api/chat` |

> If not set, defaults to `http://localhost:8787/api/chat` (local dev).

### Worker (.dev.vars for local, Wrangler secrets for production)

| Variable | Type | Description |
|----------|------|-------------|
| `GROQ_API_KEY` | **Secret** | Groq API key — never commit this |
| `GROQ_MODEL` | Config (wrangler.toml) | Primary LLM model |
| `GROQ_FALLBACK_MODEL` | Config (wrangler.toml) | Fallback if primary fails/rate-limited |

## Local Development

```bash
# 1. Clone and install frontend
git clone https://github.com/foxbench/mhaseeb-portfolio.git
cd mhaseeb-portfolio
npm install

# 2. Set up frontend env
cp .env.example .env.local
# Edit .env.local if needed (defaults work for local dev)

# 3. Install and configure worker
cd worker
npm install
cp .dev.vars.example .dev.vars
# Edit .dev.vars — paste your Groq API key

# 4. Start both (two terminals)
# Terminal 1 — Frontend:
cd mhaseeb-portfolio
npm run dev
# → http://localhost:5173

# Terminal 2 — Chat Worker:
cd mhaseeb-portfolio/worker
npx wrangler dev
# → http://localhost:8787
```

Chat widget works without the worker (falls back to keyword matching), but streaming AI responses need the worker running.

## Production Deployment

### Step 1: Deploy the Chat Worker

```bash
cd worker

# Login to Cloudflare (one-time)
npx wrangler login

# Set the API key as a secret (NOT in wrangler.toml)
npx wrangler secret put GROQ_API_KEY
# Paste your key when prompted

# Deploy
npm run deploy
```

Note your worker URL from the output:
```
https://mhaseeb-chat.<your-subdomain>.workers.dev
```

### Step 2: Configure Frontend for Production

Set the chat API URL. Two options:

**Option A: Environment variable (recommended for CI/CD)**
```bash
VITE_CHAT_API_URL=https://mhaseeb-chat.<your-subdomain>.workers.dev/api/chat npm run build
```

**Option B: Edit config.js directly**
```js
// src/config.js
chatApiUrl:
  import.meta.env.VITE_CHAT_API_URL ||
  "https://mhaseeb-chat.<your-subdomain>.workers.dev/api/chat",
```

### Step 3: Deploy Frontend to Cloudflare Pages

```bash
# Build
npm run build

# Create Pages project (first time only)
npx wrangler pages project create mhaseeb-portfolio

# Deploy
npx wrangler pages deploy dist
```

### Step 4: Custom Domain (Optional)

1. Go to **Cloudflare Dashboard → Pages → mhaseeb-portfolio → Custom Domains**
2. Add your domain (e.g., `mhaseeb.com` and `www.mhaseeb.com`)
3. If Cloudflare manages your DNS, records are auto-configured

### Step 5: Lock Down CORS (Recommended)

In `worker/src/index.js`, change:

```js
// Before (allows all origins)
"Access-Control-Allow-Origin": "*"

// After (production only)
"Access-Control-Allow-Origin": "https://mhaseeb.com"
```

Then redeploy: `cd worker && npm run deploy`

## Updating the Site

### Content changes (data files, components)

```bash
npm run build
npx wrangler pages deploy dist
```

### Chat prompt changes (worker/src/index.js)

```bash
cd worker
npm run deploy
```

### Both

```bash
npm run build && npx wrangler pages deploy dist && cd worker && npm run deploy && cd ..
```

## Rotating the Groq API Key

If your key is compromised:

1. Go to https://console.groq.com → API Keys
2. Delete the old key
3. Create a new key
4. Update production:
   ```bash
   cd worker
   npx wrangler secret put GROQ_API_KEY
   # Paste new key
   ```
5. Update local: edit `worker/.dev.vars`

## File Reference

```
mhaseeb-portfolio/
├── .env.example              # Frontend env template
├── .env.local                # Your local frontend env (gitignored)
├── src/
│   ├── config.js             # Chat API URL, theme defaults
│   ├── data/
│   │   ├── profile.js        # Name, bio, links, stats
│   │   ├── experience.js     # Work history
│   │   ├── skills.js         # Skills + proficiency
│   │   ├── projects.js       # Featured projects
│   │   ├── education.js      # Degrees, publications
│   │   ├── chatResponses.js  # Fallback chat (offline mode)
│   │   └── webmcp.js         # MCP tools for AI agents
│   └── components/           # React components
├── worker/
│   ├── .dev.vars.example     # Worker env template
│   ├── .dev.vars             # Your local worker env (gitignored)
│   ├── wrangler.toml         # Worker config (model names, non-secret vars)
│   └── src/index.js          # System prompt + API proxy
└── public/
    └── .well-known/mcp.json  # WebMCP discovery manifest
```

## Free Tier Limits

| Service | Limit | Notes |
|---------|-------|-------|
| Cloudflare Pages | Unlimited bandwidth, 500 builds/month | More than enough |
| Cloudflare Workers | 100,000 requests/day | ~4,166/hour |
| Groq API | 14,400 requests/day, 30/min | Rate limiter in worker handles this |

## Troubleshooting

**Chat shows "Offline mode"**
- Worker not running or not deployed. Check `npx wrangler dev` (local) or worker dashboard (prod).

**Chat returns errors**
- Check Groq API key: `npx wrangler secret list` should show `GROQ_API_KEY`
- Check Groq dashboard for rate limits
- Worker auto-falls back to smaller model if primary is rate-limited

**CORS errors in browser console**
- Make sure `Access-Control-Allow-Origin` in worker matches your domain
- For dev, it should be `*`; for prod, set your domain

**Build fails**
- Run `npm install` in both root and `worker/` directories
- Check Node.js version: `node --version` (need 18+)
