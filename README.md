# RugOS / ExportOS — Client Demo Prototype

Enterprise commerce, warehouse, shipping, export, finance and analytics platform.
**Frontend-only interactive demo** with static/mock data and localStorage persistence.

## Run

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
npm run preview
```

## Deploy on Netlify (free)

Config is already in the repo (`netlify.toml` + `public/_redirects`).

1. Push this project to GitHub
2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**
3. Connect the repo — Netlify will use:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy — you get a free URL like `https://your-site.netlify.app`

**No Git?** Run `npm run build`, then drag the `dist` folder to [app.netlify.com/drop](https://app.netlify.com/drop).

## Demo login

- Email: `admin@rugos.demo`
- Password: `demo123`

Or use the role quick-login buttons on the login screen.

## Key demo path

1. Sign in → Dashboard
2. Open **Order #1001** (Amazon · Hand Knotted Wool Rug · ₹20,000)
3. Use **Demo Workflow** tab / action buttons to advance the full lifecycle
4. **Reset Demo Workflow** on the order page, or **Reset Demo Data** in Settings

## Architecture (API-ready)

| Layer | Path |
|-------|------|
| Mock data | `src/data/` |
| Services (Promise adapters) | `src/services/` |
| API config | `src/config/api.js` |
| Demo state + localStorage | `src/context/DemoContext.jsx` |
| Auth / roles | `src/context/AuthContext.jsx` |

Components call services / context — not raw mock imports for list/detail data.

Later Node.js:

```js
// today
export async function getOrders() { return Promise.resolve(mockOrders); }

// later
export async function getOrders() { return api.get('/orders'); }
```

Set `VITE_API_BASE_URL` when the backend is ready.

## Future integrations (honest)

- Amazon / Etsy / Walmart — demo data only
- India Courier — manual reference mapping
- USA Courier API — pending
- EBRC / BRC / FIRA — depends on banking process
- SMS / WhatsApp — external provider required
- Claims — tentative workflow
