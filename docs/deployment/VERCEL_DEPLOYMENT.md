# Frontend on Vercel

The React frontend lives in **frontend-react/** and is configured for Vercel via [vercel.json](../../frontend-react/vercel.json) (build output `dist`, SPA rewrites).

## Deploy steps

1. [Vercel Dashboard](https://vercel.com/dashboard) → **Add New** → **Project** → import this repo.
2. Set **Root Directory** to **`frontend-react`** (required).
3. Add environment variables:
   - **VITE_API_BASE_URL** = `https://YOUR-RENDER-BACKEND-URL.onrender.com/api` (Production + Preview).
   - **VITE_STRIPE_PUBLIC_KEY** (optional).
4. Deploy. Vercel will run `npm run build` and serve the `dist` folder; all routes rewrite to `index.html` for the SPA.

Full flow (backend on Render first, then frontend on Vercel, then CORS): **[DEPLOY.md](./DEPLOY.md)**.
