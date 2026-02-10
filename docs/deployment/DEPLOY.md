# Deploy: Backend on Render, Frontend on Vercel

Follow this order so the frontend can point to the live backend URL.

---

## Step 1: Deploy backend to Render (with PostgreSQL)

1. Go to [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint**.
2. Connect your Git provider and select this repository.
3. Click **Apply**. Render will create **db** (PostgreSQL) and **backend** (Django). The Blueprint defines all env var **keys** from **backend/.env.example** in [render.yaml](../../render.yaml); you fill **values** in the Dashboard.
4. **Set DATABASE_URL on the backend** (avoids "id is empty" sync errors):
   - Open the **db** service → **Info** (or **Connect**) → copy **Internal Database URL**.
   - Open the **backend** service → **Environment** → **Add Environment Variable**:
     - Key: `DATABASE_URL`
     - Value: paste the Internal Database URL you copied.
   - Save. Render will redeploy the backend with the database connection.
5. In **backend** → **Environment**, add **CORS_ALLOWED_ORIGINS** = `https://your-app.vercel.app` (use your Vercel URL after Step 2; optional for first deploy since the backend allows all origins).
6. Copy the **backend** service URL (e.g. `https://backend-xxxx.onrender.com`) for the frontend.

**Optional:** Set `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, etc. in the backend Environment tab.

---

## Step 2: Deploy frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) → **Add New** → **Project**.
2. Import this repository. Set:
   - **Root Directory:** `frontend-react` (click Edit, set to `frontend-react`).
   - **Framework Preset:** Vite (auto-detected).
   - **Build Command:** `npm run build` (default).
   - **Output Directory:** `dist` (default).
3. In **Environment Variables**, add the variables from **frontend-react/.env.example** (Vercel does not read .env from the repo; set them in the dashboard). Minimum for production:

   | Name | Value | Environment |
   |------|--------|-------------|
   | **VITE_API_BASE_URL** | `https://YOUR-BACKEND-URL.onrender.com/api` | Production, Preview |
   | **VITE_WS_URL** | `wss://YOUR-BACKEND-URL.onrender.com/ws` (or leave default) | Production, Preview |
   | **VITE_STRIPE_PUBLIC_KEY** | Your Stripe publishable key | Production, Preview (optional) |
   | **VITE_APP_ENV** | `production` | Production, Preview |
   | **VITE_GA4_ID** | (optional) Google Analytics ID | Production, Preview |
   | **VITE_ADSENSE_CLIENT** | (optional) AdSense client ID | Production, Preview |

   Replace `YOUR-BACKEND-URL` with the backend host from Step 1 (e.g. `backend-xxxx.onrender.com`).
4. Click **Deploy**. Wait for the build to finish.
5. Copy your Vercel URL (e.g. `https://your-app.vercel.app`).

---

## Step 3: CORS (optional for first deploy)

The backend currently allows all origins (`CORS_ALLOW_ALL_ORIGINS = True`), so your Vercel frontend will work without this step. To restrict CORS later:

1. In **Render** → **backend** → **Environment**, set **CORS_ALLOWED_ORIGINS** to your Vercel URL(s), e.g. `https://your-app.vercel.app`.
2. In the codebase, set `CORS_ALLOW_ALL_ORIGINS = False` and use `CORS_ALLOWED_ORIGINS` from env; then redeploy.

---

## Summary

| What | Where | URL example |
|------|--------|-------------|
| Backend + DB | Render | `https://backend-xxxx.onrender.com` |
| Frontend | Vercel | `https://your-app.vercel.app` |

- **Backend env (Render):** All keys from **backend/.env.example** are in the Blueprint; set `DATABASE_URL`, `CORS_ALLOWED_ORIGINS`, and any secrets in the backend Environment tab. `SECRET_KEY` is auto-generated.
- **Frontend env (Vercel):** Set variables from **frontend-react/.env.example** in Project → Settings → Environment Variables (Vercel does not read .env from the repo).

If the frontend shows network errors when calling the API, check that `VITE_API_BASE_URL` is exactly `https://...onrender.com/api` (no trailing slash except `/api`).

**Note:** On Render’s free tier the backend may spin down after inactivity; the first request after that can take 30–60 seconds to respond.
