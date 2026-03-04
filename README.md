# Lottery System Demo

A comprehensive lottery system prototype with user and admin features. Built with a Django backend, PostgreSQL, and a React frontend in `frontend-react/`.

## Quick Start

- **Backend:** See [docs/setup/SETUP.md](docs/setup/SETUP.md) and [backend/README.md](backend/README.md).
- **Frontend (React):** `cd frontend-react && npm install && npm run dev` — see [frontend-react/README.md](frontend-react/README.md).
- **Deploy:** Backend on [Render](https://render.com) (see [docs/deployment/DEPLOY.md](docs/deployment/DEPLOY.md)), frontend on [Vercel](https://vercel.com). One guide: [docs/deployment/DEPLOY.md](docs/deployment/DEPLOY.md).

## Source of truth (current runtime)

- **Supported backend entrypoint:** `backend/` Django app (local start and setup are documented in [backend/README.md](backend/README.md) and [docs/setup/SETUP.md](docs/setup/SETUP.md)).
- **Supported frontend entrypoint:** `frontend-react/` (run locally from [frontend-react/README.md](frontend-react/README.md)).
- **Legacy frontend status:** the old `frontend/` vanilla app has been removed from the active runtime. Historical redesign notes are archived under [docs/frontend-legacy/](docs/frontend-legacy/).

## Documentation

All project documentation lives in **[docs/](docs/)**:

| Section | Description |
|--------|-------------|
| [docs/setup/](docs/setup/) | Setup, environment variables, quick reference |
| [docs/deployment/](docs/deployment/) | Deployment guides (Render, Railway, checklist) |
| [docs/api/](docs/api/) | API documentation and examples |
| [docs/guides/](docs/guides/) | Integration guide, referral system |
| [docs/archive/](docs/archive/) | Historical completion and verification reports |
| [docs/product/](docs/product/) | Product requirements (PRD) |
| [docs/frontend-legacy/](docs/frontend-legacy/) | Vanilla frontend (HTML) guides |

## Repo layout

- **backend/** — Django REST API (JWT, lotteries, transactions, referrals, payments).
- **frontend-react/** — React + TypeScript + Vite app (primary UI).
- **frontend/** — Removed from active codebase (legacy docs retained in `docs/frontend-legacy/`).
- **docs/** — All documentation.
- **render.yaml** — Render Blueprint (web services + PostgreSQL).

## License

MIT. See LICENSE for details. This is a demo project; ensure regulatory compliance before any production use.
