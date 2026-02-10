# Lottery System Demo

A comprehensive lottery system prototype with user and admin features. Built with Django backend, PostgreSQL, and React (frontend-react) or vanilla HTML/CSS/JS (frontend).

## Quick Start

- **Backend:** See [docs/setup/SETUP.md](docs/setup/SETUP.md) and [backend/README.md](backend/README.md).
- **Frontend (React):** `cd frontend-react && npm install && npm run dev` — see [frontend-react/README.md](frontend-react/README.md).
- **Deploy:** Use [render.yaml](render.yaml) for Render.com (includes PostgreSQL). See [docs/deployment/](docs/deployment/).

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
- **frontend/** — Vanilla HTML/CSS/JS app (legacy).
- **docs/** — All documentation.
- **render.yaml** — Render Blueprint (web services + PostgreSQL).

## License

MIT. See LICENSE for details. This is a demo project; ensure regulatory compliance before any production use.
