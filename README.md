# Webix Reports Manager

Full-stack reference implementation of the Webix Reports widget. The project combines a React/Vite frontend that embeds the Reports Manager UI with an Express/MySQL backend that exposes the schema, CRUD endpoints, and secure SQL execution pipeline required by the widget.

## Repository layout

| Path | Description |
| --- | --- |
| `/backend` | Express 5 server, REST endpoints, MySQL access layer |
| `/webix-projects-manager` | React 19 + Vite SPA that initializes the Webix Reports widget |
| `/COMPREHENSIVE_DOCUMENTATION.md` | In-depth architecture, flows, and troubleshooting guide |

## Technology stack

- **Frontend:** React 19, Vite 7, Webix Reports (trial build bundled in `public/webix.trial.complete`)
- **Backend:** Node 22+, Express 5, MySQL 8, mysql2, CORS, dotenv, nodemon (dev)
- **Tooling:** ESLint 9, npm, Webix assets served via Vite dev proxy

## Prerequisites

1. Node.js 22+ and npm 10+
2. MySQL 8 with credentials for a schema (default `reports_db`)
3. Webix Reports trial bundle extracted to `webix-projects-manager/public/webix.trial.complete`
4. Git + SSH access to your fork/remote (see `.ssh/config` for multiple identities)

## Backend setup (`/backend`)

1. Copy `.env.example` (or create `.env`). Minimum variables:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=secret
   DB_NAME=reports_db
   PORT=3200
   ```
2. Install dependencies and seed the database:
   ```bash
   cd backend
   npm install
   mysql -u$DB_USER -p$DB_PASSWORD $DB_NAME < schema.sql
   ```
3. Start the API server (Nodemon for dev, Node for prod):
   ```bash
   npm run dev  # or npm start
   ```

The server exposes:
- `GET /api/modules`, `POST /api/modules`, `PUT/DELETE /api/modules/:id`
- `GET /api/queries`, `POST /api/queries`, `PUT/DELETE /api/queries/:id`
- `POST /api/objects/:source/data` for data retrieval (with joins, aggregations, facets)
- `GET /api/objects`, field option helpers, and `/health`

## Frontend setup (`/webix-projects-manager`)

1. Install dependencies:
   ```bash
   cd webix-projects-manager
   npm install
   ```
2. Ensure the Vite proxy (configured in `vite.config.js`) points to the backend port (`3200`).
3. Run the dev server:
   ```bash
   npm run dev
   ```
4. Open the URL from the Vite console (default `http://localhost:5173`). The Reports widget loads, fetches `/api/objects`, and is ready to build/execute reports.

## Recommended workflow

```bash
# Terminal 1 – backend
cd backend && npm run dev

# Terminal 2 – frontend
cd webix-projects-manager && npm run dev
```

Linting (frontend):

```bash
cd webix-projects-manager
npm run lint
```

## Additional resources

- **Comprehensive documentation:** [`COMPREHENSIVE_DOCUMENTATION.md`](./COMPREHENSIVE_DOCUMENTATION.md)
- **Backend reference:** [`backend/BACKEND_DOCUMENTATION.md`](./backend/BACKEND_DOCUMENTATION.md)
- **Webix Reports docs:** [https://docs.webix.com/desktop__report.html](https://docs.webix.com/desktop__report.html)

## Deployment notes

- Configure production database credentials via environment variables.
- Serve the frontend build (`npm run build`) via any static host (e.g., Nginx) and proxy `/api/*` to the Node server.
- Keep Webix assets licensed per their terms before shipping to production.
