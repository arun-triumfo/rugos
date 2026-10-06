# RugOS / ExportOS

Full-stack commerce · warehouse · shipping · export · finance platform.

```
Rugos/
  Frontend/   React + Vite (UI)
  Backend/    Node.js + Express + MongoDB (API)
```

## Quick start

### 1. Backend

Requires MongoDB running locally (`mongodb://127.0.0.1:27017`).

```bash
cd Backend
npm install
cp .env.example .env   # if needed
npm run seed
npm run dev
```

API: http://localhost:5000

### 2. Frontend

```bash
cd Frontend
npm install
npm run dev
```

App: http://localhost:5173  
`Frontend/.env` points to `http://localhost:5000/api`.

### Demo logins

| Email | Password | Access |
|-------|----------|--------|
| `admin@rugos.demo` | `demo123` | Main app |
| `superadmin@rugos.demo` | `demo123` | SaaS: Plans · Buyers · Subscriptions |

## Backend phases

- **Phase 1:** Auth (JWT) + SaaS (plans, buyers, subscriptions, landing purchase)
- **Phase 2:** Orders + inventory + Order #1001 workflow (USA → India → MTO)
- **Phase 3:** Full tenant app state in MongoDB — catalog, warehouse, shipping, replenishment, export, returns, finance, analytics, system modules via `/api/app/bootstrap` + auto-sync
- **Phase 4:** Live dashboard aggregates from Orders/Inventory + JWT role users (quick-login / switch-role)
- **Phase 5:** Full CRUD (add / edit / delete / update) on major modules → MongoDB via `/api/app/mutate`

Data load: `GET /api/app/bootstrap`. Mutations persist immediately + debounced full sync.

## Netlify (frontend only)

- Base directory: `Frontend`
- Build: `npm run build`
- Publish: `dist`
- SPA: `public/_redirects` already present
