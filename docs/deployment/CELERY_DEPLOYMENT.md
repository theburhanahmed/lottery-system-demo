# Celery in Production

The lottery backend uses **Celery** for scheduled tasks (close lotteries, conduct draws, send reminders, referral bonus expiry). In production you must run:

1. **Celery worker** – executes tasks.
2. **Celery beat** – triggers scheduled tasks on the schedule defined in `backend/lottery/settings/base.py` (`CELERY_BEAT_SCHEDULE`).

Both require a **broker** (Redis recommended). Set `CELERY_BROKER_URL` and `REDIS_URL` in your environment.

## Environment variables

- `CELERY_BROKER_URL` – Redis URL for the broker (e.g. `redis://localhost:6379/0`). On Render/Railway you can use an external Redis or the same `REDIS_URL`.
- `CELERY_RESULT_BACKEND` – Optional; same Redis or omit.
- `REDIS_URL` – Used by Django cache and optionally by Celery; set for production cache.

## Render

- Add a **Redis** instance (or use an external Redis provider).
- Add a **Background Worker** service:
  - Build: same as backend (Docker or `pip install -r requirements.txt`).
  - Start: `celery -A lottery worker -l info`.
  - Set the same env vars as the web service (including `CELERY_BROKER_URL` and `REDIS_URL`).
- Add a **second Background Worker** for beat (only one beat process per environment):
  - Start: `celery -A lottery beat -l info`.
  - Same env; ensure `CELERY_BROKER_URL` is set.

## Railway

- Add Redis from the marketplace or use `REDIS_URL` from an external Redis.
- Create two services: one for `celery -A lottery worker -l info`, one for `celery -A lottery beat -l info`.
- Set `CELERY_BROKER_URL` and `REDIS_URL` in variables.

## Scheduled tasks (reference)

From `CELERY_BEAT_SCHEDULE`:

| Task | Schedule | Purpose |
|------|----------|---------|
| check-and-close-lotteries | 1 hour | Close lotteries past end_date |
| conduct-scheduled-draws | 15 min | Run draws for closed lotteries with auto_draw |
| send-draw-reminders | 1 hour | Remind users when lottery ends soon |
| update-lottery-statuses | 1 hour | Draft → Active, Active → Closed by date |
| check-referral-bonus-expiry | 24 hours | Expire referral bonuses |
| process-pending-referrals | 6 hours | Process pending referral bonuses |

## Health

- Ensure Redis is reachable from both worker and beat. If Redis is down, the worker will retry; beat will log connection errors.
- No HTTP health endpoint is required for worker/beat; your host may use process liveness instead.
