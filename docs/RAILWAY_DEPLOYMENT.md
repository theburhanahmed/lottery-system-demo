# Deploy Lottery System to Railway

This guide covers deploying the lottery system (Django backend + React frontend) to Railway.

## Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **Railway CLI** (optional): Install from [docs.railway.com/guides/cli](https://docs.railway.com/guides/cli)
3. **GitHub Repository**: Push your code to GitHub for Railway to deploy from

## Architecture on Railway

| Service | Root Directory | Description |
|---------|---------------|-------------|
| Backend | `backend/` | Django API (Gunicorn) |
| Frontend | `frontend-react/` | React SPA (Vite + serve) |
| PostgreSQL | Plugin | Database |
| Redis | Plugin (optional) | Celery broker & cache |

## Deployment Steps

### 1. Log in to Railway

```bash
railway login
```

### 2. Create Project & Add PostgreSQL

1. Go to [railway.app/new](https://railway.app/new)
2. Click **"New Project"**
3. Add **PostgreSQL** (click "+ New" → "Database" → "PostgreSQL")
4. Add **Redis** (optional, for Celery): "+ New" → "Database" → "Redis"
5. Note: Railway automatically sets `DATABASE_URL` for the project when PostgreSQL is added

### 3. Deploy Backend

1. Click **"+ New"** → **"GitHub Repo"**
2. Select your `lottery-system-demo` repository
3. Configure the backend service:
   - **Root Directory**: `backend`
   - **Build**: Uses `Dockerfile` in backend/
   - **Start Command** (in railway.toml): Migrations + Gunicorn
4. Add the PostgreSQL service as a **reference** (click backend service → Variables → "+ Variable" → Reference → `DATABASE_URL` from PostgreSQL)
5. Set environment variables:

   | Variable | Value |
   |----------|-------|
   | `SECRET_KEY` | Generate a secure random key |
   | `DEBUG` | `False` |
   | `ALLOWED_HOSTS` | `.railway.app,.up.railway.app` (or your custom domain) |
   | `CELERY_BROKER_URL` | Reference Redis `REDIS_URL` (if using Redis) |
   | `CELERY_RESULT_BACKEND` | Reference Redis `REDIS_URL` |
   | `REDIS_URL` | Reference Redis (optional) |
   | `CORS_ALLOWED_ORIGINS` | Your frontend URL (e.g. `https://your-frontend.up.railway.app`) |
   | `STRIPE_PUBLIC_KEY` | Your Stripe key |
   | `STRIPE_SECRET_KEY` | Your Stripe secret |
   | `STRIPE_WEBHOOK_SECRET` | Your Stripe webhook secret |
   | `FRONTEND_URL` | Your frontend URL |

6. Generate a **public domain**: Settings → Networking → Generate Domain
7. Copy the backend URL (e.g. `https://lottery-backend-production.up.railway.app`)

### 4. Deploy Frontend

1. Click **"+ New"** → **"GitHub Repo"** (same repo)
2. Configure the frontend service:
   - **Root Directory**: `frontend-react`
   - **Build**: Nixpacks (auto-detects Node.js)
   - **Start Command**: `npx serve -s dist -l $PORT`
3. Set environment variables:

   | Variable | Value |
   |----------|-------|
   | `VITE_API_BASE_URL` | `https://YOUR-BACKEND-URL/api` |
   | `VITE_WS_URL` | `wss://YOUR-BACKEND-URL/ws` |
   | `VITE_STRIPE_PUBLIC_KEY` | Your Stripe publishable key |

4. Generate a **public domain**: Settings → Networking → Generate Domain

### 5. Update CORS & Frontend URL

After both services have URLs:
- In **Backend** variables: Set `CORS_ALLOWED_ORIGINS` and `FRONTEND_URL` to your frontend domain
- Redeploy backend if needed

### 6. Run Migrations (if not auto-run)

The backend `railway.toml` runs migrations on start. If you need to run them manually:

```bash
railway link  # Link to backend service
railway run python manage.py migrate
railway run python manage.py createsuperuser  # Create admin user
```

### 7. Optional: Deploy Celery Worker & Beat

For scheduled tasks (draw execution, reminders, etc.):

1. Add two more services from the same repo
2. **Celery Worker**: Root = `backend`, Start = `celery -A lottery worker -l info`
3. **Celery Beat**: Root = `backend`, Start = `celery -A lottery beat -l info`
4. Both need same env vars as backend (DATABASE_URL, REDIS_URL, etc.)

Without Celery, the app runs but scheduled tasks won't execute.

## Environment Variables Reference

### Backend (Required)

- `DATABASE_URL` - Auto-injected by Railway when PostgreSQL is linked
- `SECRET_KEY` - Django secret (generate with `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`)
- `DEBUG` - `False` for production
- `ALLOWED_HOSTS` - Comma-separated, include `.railway.app`

### Backend (Optional)

- `STRIPE_*` - Payment processing
- `CELERY_BROKER_URL` / `CELERY_RESULT_BACKEND` - Redis URL for Celery
- `REDIS_URL` - Redis for caching
- `CORS_ALLOWED_ORIGINS` - Frontend origin
- `FRONTEND_URL` - For email links

### Frontend (Required at build time)

- `VITE_API_BASE_URL` - Backend API URL (e.g. `https://backend.railway.app/api`)
- `VITE_WS_URL` - WebSocket URL (if using)
- `VITE_STRIPE_PUBLIC_KEY` - Stripe publishable key

## CLI Deployment

From project root:

```bash
# Login first
railway login

# Create project and link
railway init

# Deploy backend (from backend directory)
cd backend && railway up

# Deploy frontend (from frontend directory)
cd ../frontend-react && railway up
```

Note: For monorepo, you typically create separate Railway services in the dashboard with different root directories, then connect GitHub for auto-deploys.

## Troubleshooting

- **Database connection fails**: Ensure PostgreSQL service is in the same project and `DATABASE_URL` is referenced
- **CORS errors**: Add frontend URL to `CORS_ALLOWED_ORIGINS`
- **502 Bad Gateway**: Check health endpoint `/api/health/` – ensure app binds to `$PORT`
- **Frontend can't reach API**: Set `VITE_API_BASE_URL` correctly and rebuild
- **Celery not working**: Add Redis plugin and set `CELERY_BROKER_URL`

## Files Added for Railway

- `backend/railway.toml` - Backend build & deploy config
- `frontend-react/railway.toml` - Frontend build & deploy config
- `backend/lottery/settings.py` - Updated for `DATABASE_URL` and Railway domains
