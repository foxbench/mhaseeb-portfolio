# AI-Powered Developer Portfolio

A modern, AI-integrated developer portfolio built with React, Tailwind CSS, and Cloudflare. Features an AI chat assistant, WebMCP integration for AI agent discovery, multiple themes, and a static blog.

**[Live Demo](https://www.mhaseeb.com)**

## Features

- **AI Chat Widget** — Conversational assistant powered by Groq (Llama), with streaming responses and keyword-based fallback when offline
- **WebMCP Integration** — 6 structured MCP tools exposed via `.well-known/mcp.json`, making the portfolio discoverable and queryable by AI agents
- **4 Color Schemes** — Ocean, Emerald, Ember, Violet — each with dark/light modes (8 combinations)
- **Static Blog** — Markdown-based blog posts with syntax highlighting
- **Fully Free Hosting** — Cloudflare Pages + Workers (free tier)
- **Responsive** — Mobile-first design with Framer Motion animations
- **JSON-LD** — Structured data for SEO

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, Vite, Tailwind CSS v4, Framer Motion |
| Chat API | Cloudflare Worker, Groq API (Llama) |
| Hosting | Cloudflare Pages (free tier) |
| AI Integration | WebMCP, MCP tools, JSON-LD |

## Quick Start

```bash
# Clone and install
git clone https://github.com/foxbench/mhaseeb-portfolio.git
cd mhaseeb-portfolio
npm install

# Start the frontend
npm run dev
# → http://localhost:5173

# Start the chat worker (separate terminal)
cd worker
npm install
cp .dev.vars.example .dev.vars
# Edit .dev.vars and add your Groq API key
npx wrangler dev
# → http://localhost:8787
```

The chat widget falls back to keyword-matching if the worker isn't running.

## Configuration

All settings in `src/config.js`:

| Setting | Options | Default |
|---------|---------|---------|
| `showThemeSwitcher` | `true` / `false` | `true` |
| `defaultTheme` | `ocean` / `emerald` / `ember` / `violet` | `ocean` |
| `defaultMode` | `dark` / `light` / `system` | `dark` |
| `chatApiUrl` | Any URL | `http://localhost:8787/api/chat` |

## Customizing for Your Own Portfolio

1. **Profile & Content** — Edit files in `src/data/`:
   - `profile.js` — Name, bio, links, stats
   - `experience.js` — Work history
   - `skills.js` — Technical skills with proficiency levels
   - `projects.js` — Featured projects
   - `education.js` — Degrees, publications
   - `chatResponses.js` — Fallback chat responses (keyword-based)

2. **Chat AI Prompt** — Edit `worker/src/index.js` and update the `SYSTEM_PROMPT` with your own professional data

3. **WebMCP Manifest** — Update `public/.well-known/mcp.json` to match your data structure

4. **Theming** — Colors are defined as CSS custom properties in `src/index.css`

## Deployment

### Prerequisites

- [Cloudflare account](https://dash.cloudflare.com/sign-up) (free tier)
- [Groq API key](https://console.groq.com) (free tier)
- Node.js 18+

### Deploy Chat Worker

```bash
cd worker
npm install
npx wrangler login
npx wrangler secret put GROQ_API_KEY
npm run deploy
```

Note the worker URL from output: `https://<name>.<subdomain>.workers.dev`

### Update Chat API URL

Edit `src/config.js` — replace the localhost URL with your worker URL:

```js
chatApiUrl:
  import.meta.env.VITE_CHAT_API_URL ||
  "https://<your-worker>.<subdomain>.workers.dev/api/chat",
```

### Deploy Frontend

```bash
npm run build
npx wrangler pages project create my-portfolio
npx wrangler pages deploy dist
```

### Custom Domain (Optional)

1. Cloudflare Dashboard → Pages → your project → Custom Domains
2. Add your domain
3. DNS records auto-configure if Cloudflare manages the domain

### Lock CORS (Recommended for Production)

In `worker/src/index.js`, change:

```js
"Access-Control-Allow-Origin": "https://yourdomain.com"
```

## Project Structure

```
├── public/
│   ├── .well-known/mcp.json    # WebMCP manifest for AI agents
│   ├── _redirects              # Cloudflare Pages SPA routing
│   └── favicon.svg
├── src/
│   ├── components/             # React components (13 files)
│   ├── context/ThemeContext.jsx # Theme system (4 schemes x 2 modes)
│   ├── data/                   # Portfolio content & blog posts
│   ├── hooks/useInView.js      # Intersection observer hook
│   ├── config.js               # App configuration
│   ├── App.jsx                 # Routes & layout
│   └── index.css               # Design system & theme variables
├── worker/
│   ├── src/index.js            # Cloudflare Worker (Groq proxy + system prompt)
│   ├── .dev.vars.example       # Environment template
│   └── wrangler.toml           # Worker configuration
├── index.html                  # Entry HTML with JSON-LD structured data
└── vite.config.js
```

## Adding Blog Posts

Create a new file in `src/data/blog/`:

```js
export default {
  slug: "my-post-slug",
  title: "Post Title",
  date: "2026-04-01",
  tags: ["Tag1", "Tag2"],
  summary: "One-line summary for the blog list.",
  content: `
## Heading

Markdown content here...
`,
};
```

Then add it to `src/data/blog/index.js`.

## Free Tier Limits

| Service | Limit |
|---------|-------|
| Cloudflare Pages | Unlimited bandwidth, 500 builds/month |
| Cloudflare Workers | 100,000 requests/day |
| Groq API | 14,400 requests/day, 30 requests/min |

## License

MIT
