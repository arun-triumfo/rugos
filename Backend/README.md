# RugOS Backend (Node.js + MongoDB)

## Setup

1. Install [MongoDB](https://www.mongodb.com/try/download/community) locally (or use Atlas URI).
2. Copy env and install:

```bash
cd Backend
cp .env.example .env
npm install
npm run seed
npm run dev
```

API: `http://localhost:5000`  
Health: `http://localhost:5000/api/health`

## Demo logins (after seed)

| Email | Password | Access |
|-------|----------|--------|
| `admin@rugos.demo` | `demo123` | Tenant app |
| `superadmin@rugos.demo` | `demo123` | SaaS (plans / buyers / subscriptions) |

## APIs

### Auth & SaaS (Phase 1)
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/saas/plans` (public)
- `POST /api/saas/buyers/purchase` (public landing)
- `PATCH /api/saas/plans/:id` (superadmin)
- `GET /api/saas/buyers`
- `POST /api/saas/buyers/:id/approve`
- `POST /api/saas/buyers/:id/suspend`
- `GET /api/saas/subscriptions`
- `PATCH /api/saas/subscriptions/:id`

### Orders & Inventory (Phase 2)
- `GET /api/orders`
- `GET /api/orders/:id`
- `POST /api/orders/:id/workflow` `{ action, payload }`
- `POST /api/orders/1001/reset-workflow`
- `GET /api/inventory`

Workflow actions: `resolveSku`, `allocateInventory`, `completeMto`, `startPicking`, `markPicked`, `recordWeighing`, `enterCourier`, `generateLabel`, `printLabel`, `uploadProof`, `markPacked`, `dispatchIndia`, `markInTransit`, `confirmUsaReceipt`, `createShipment`, `markDelivered`

### Full app state (Phase 3)
- `GET /api/app/bootstrap` — all modules for the logged-in tenant
- `POST /api/app/mutate` — `{ op, collection, id, patch, item, data }`
- `POST /api/app/reset` — reseed tenant operational data

### Analytics & roles (Phase 4)
- `GET /api/analytics/dashboard` — live KPIs/charts from Mongo orders + inventory
- `POST /api/auth/quick-login` — `{ role }` demo role JWT
- `POST /api/auth/switch-role` — `{ role }` switch seeded tenant role user

Role demo emails (password `demo123`): `admin@`, `management@`, `india.wh@`, `usa.wh@`, `accounts@`, `sales@`, `logistics@`, `auditor@` + `rugos.demo`
