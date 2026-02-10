# Deploying to Render.com

The repo includes a **Render Blueprint** ([render.yaml](../../render.yaml)) that defines the PostgreSQL database and both backend and frontend services. Use it for one-click or sync-based deployment.

## What’s in the Blueprint

- **Database:** One Postgres instance (`db`) with `plan: free`, PostgreSQL 15, and predictable `databaseName` / `user`. Render injects `DATABASE_URL` into the backend.
- **Backend:** Docker web service (Django), health check at `/api/health/`, and a pre-deploy step that runs migrations.
- **Frontend:** Static site (Vite build), SPA rewrite so all routes serve `index.html`.

## One-time setup

1. **Connect the repo** in [Render Dashboard](https://dashboard.render.com): New → Blueprint, connect your Git provider, select this repo.
2. **Sync the Blueprint** so Render creates/updates the `db` database and `backend` / `frontend` services from `render.yaml`.
3. **Secrets and env vars** (set in Dashboard for each service):
   - **Backend:**  
     - `SECRET_KEY` is set to “Generate” in the Blueprint; you can leave it or replace with your own.  
     - `CORS_ALLOWED_ORIGINS`: set to your frontend URL (e.g. `https://frontend-xxx.onrender.com`).  
     - Add Stripe and (optionally) S3/Spaces vars as needed: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, etc.
   - **Frontend:**  
     - `VITE_API_BASE_URL`: backend URL + `/api` (e.g. `https://backend-xxx.onrender.com/api`).  
     - `VITE_STRIPE_PUBLIC_KEY`: your Stripe publishable key.

After the first deploy, copy the backend and frontend URLs from the Dashboard and set the env vars above so CORS and API base URL are correct.

## Database

The DB is defined in `render.yaml` under `databases`. Render creates it and passes `DATABASE_URL` to the backend via `fromDatabase`; no manual DB env vars are required for the backend. For more on connection strings and pooling, see [Render Postgres](https://docs.render.com/databases).

## Useful links

- [Render Blueprint spec](https://docs.render.com/blueprint-spec)
- [Render Postgres](https://docs.render.com/databases)
- [Environment variables](https://docs.render.com/docs/configure-environment-variables)
