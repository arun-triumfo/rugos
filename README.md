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

SPA routing uses `public/_redirects` only (no `netlify.toml` — avoids Netlify config/extension parse failures).

### Build settings (Netlify UI)

- **Build command:** `npm run build`
- **Publish directory:** `dist`

### If you see “Failed retrieving extensions”

1. Site → **Integrations / Plugins** — remove any extensions/plugins  
2. **Deploys → Trigger deploy → Clear cache and deploy site**  
3. If it still fails, it is usually a Netlify platform issue — retry later or contact Support with your site ID  

### Deploy

1. Push to GitHub → import site on [app.netlify.com](https://app.netlify.com)  
2. Set build settings above → Deploy  

**No Git?** `npm run build`, then drag `dist` to [app.netlify.com/drop](https://app.netlify.com/drop).

## SaaS demo

- Marketing site: `/` (product + monthly/yearly pricing)
- Superadmin: `/superadmin` (plans, subscriptions, Import/Export activation)
- Tenant app: `/dashboard` (same modules; mode badge shows Export or Import)

### Demo login (password: `demo123`)

| Account | Email | Lands on |
|---------|-------|----------|
| Platform Superadmin | `admin@rugos.demo` | Superadmin |
| Export tenant | `tenant@rugos.demo` | App (Export mode) |
| Import tenant | `import@rugos.demo` | App (Import mode) |

Purchase on landing creates **Pending Approval**. Superadmin must choose **Export** or **Import** to activate.

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
