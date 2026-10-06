# RugOS → MongoDB Atlas Deploy Pack

Is zip mein local `rugos` database ka JSON export hai + Atlas setup steps.

## 1) Atlas cluster banao

1. [https://cloud.mongodb.com](https://cloud.mongodb.com) par login / signup
2. **Build a Database** → Free **M0** (Shared) choose karo
3. Cloud provider / region select (India ke liye nearest, e.g. Mumbai/`ap-south-1` if available)
4. Cluster create hone do

## 2) Database User

1. **Database Access** → **Add New Database User**
2. Authentication: Password
3. Username / password note karo (special chars avoid karo ya URL-encode karo)
4. Role: **Atlas admin** ya **Read and write to any database**

## 3) Network Access (server IP allow)

1. **Network Access** → **Add IP Address**
2. Development / quick test: **Allow Access from Anywhere** → `0.0.0.0/0`
3. Production: sirf apne VPS / hosting server ka public IP add karo

## 4) Connection string

1. Cluster par **Connect** → **Drivers** → Node.js
2. URI copy karo, jaise:

```
mongodb+srv://USERNAME:PASSWORD@CLUSTER.xxxxx.mongodb.net/rugos?retryWrites=true&w=majority
```

- `USERNAME` / `PASSWORD` replace karo
- Database name end mein `/rugos` rakho

## 5) Backend `.env` (server par)

```env
PORT=5000
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.xxxxx.mongodb.net/rugos?retryWrites=true&w=majority
JWT_SECRET=strong-random-secret-change-me
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-frontend-domain.com
```

`Backend/.env.example` se copy karke values update karo.

## 6) Data Atlas mein daalo (2 options)

### Option A — Recommended (seed script)

Server / local machine se (jahan Backend code hai):

```bash
cd Backend
# .env mein Atlas MONGODB_URI set karo
npm install
npm run seed
```

Yeh plans, users, orders, inventory, app state sab seed kar dega.

Demo logins (password `demo123`):

| Email | Access |
|-------|--------|
| `admin@rugos.demo` | Main app |
| `superadmin@rugos.demo` | SaaS admin |

### Option B — JSON import (is zip se)

`json-export/` folder mein collections hain.

**MongoDB Compass** (sabse easy):

1. Compass install → Atlas URI se connect
2. Database `rugos` create (auto on first import)
3. Har `.json` file ko us naam ki collection mein **Add Data → Import JSON**

Ya **mongoimport** (Database Tools installed ho):

```bash
# Windows PowerShell example — apni URI set karo
$uri = "mongodb+srv://USER:PASS@CLUSTER.mongodb.net/rugos"

mongoimport --uri $uri --collection users --file .\json-export\users.json --jsonArray
mongoimport --uri $uri --collection plans --file .\json-export\plans.json --jsonArray
mongoimport --uri $uri --collection tenants --file .\json-export\tenants.json --jsonArray
mongoimport --uri $uri --collection subscriptions --file .\json-export\subscriptions.json --jsonArray
mongoimport --uri $uri --collection orders --file .\json-export\orders.json --jsonArray
mongoimport --uri $uri --collection inventoryitems --file .\json-export\inventoryitems.json --jsonArray
mongoimport --uri $uri --collection tenantappstates --file .\json-export\tenantappstates.json --jsonArray
mongoimport --uri $uri --collection stockledgers --file .\json-export\stockledgers.json --jsonArray
mongoimport --uri $uri --collection auditlogs --file .\json-export\auditlogs.json --jsonArray
```

Windows: pehle [MongoDB Database Tools](https://www.mongodb.com/try/download/database-tools) install karo.

## 7) Verify

Atlas → **Browse Collections** → `rugos` database → collections dikhne chahiye.

Backend start:

```bash
cd Backend
npm start
```

Health: `GET /api/health`

---

## Zip contents

| Path | Purpose |
|------|---------|
| `README.md` | Yeh guide |
| `.env.atlas.example` | Atlas env template |
| `json-export/*.json` | Local DB snapshot (import Option B) |
| `json-export/_manifest.json` | Collection counts |
| `import-atlas.ps1` | Windows mongoimport helper |

**Note:** Password zip mein nahi hai. Atlas user password alag se set karo. JWT_SECRET production mein strong rakho.
