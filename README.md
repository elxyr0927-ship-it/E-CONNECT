# Trash Tracker Demo

Real-time trash collection tracking demo built with:
- Node.js + Express backend
- React (Vite) frontend
- Socket.IO for real-time updates
- Leaflet map with road routing via local OSRM (optional)

## 1. Requirements

- Node.js and npm
- Docker Desktop (for OSRM road routing)
- Miniconda (only needed for the `osmium` step you already did)

## 2. One-time setup

From the project root (`trash-tracker-demo`):

```bash
# 1) Install backend dependencies
npm install

# 2) Install frontend dependencies
cd frontend
npm install

# 3) Build frontend for production
npm run build
```

If you only need the app to work (without true road routing), you can skip the OSRM steps below and jump to **Run the app**.

## 3. OSRM (Optional: true road-following routes)

You already prepared the Dumaguete dataset (`dumaguete.osm.pbf`) and ran `osrm-extract`, `osrm-partition`, and `osrm-customize`.

To start the OSRM routing server (from the project root):

```bash
# Start OSRM server on port 5000 (keep this terminal open)
docker run -t -i -p 5000:5000 -v ${pwd}:/data osrm/osrm-backend osrm-routed --algorithm mld /data/dumaguete.osrm
```

When this is running, the backend will call OSRM for real road routes. If OSRM is not running, the backend automatically falls back to a simpler route.

## 4. Run the app (production build)

In a new terminal, from the project root:

```bash
# Start the backend server (serves the built React app)
node server.js
```

Then open:

- User view: http://localhost:3000/
- Collector view: http://localhost:3000/collector

## 5. Development mode (optional)

Instead of using the built frontend, you can run backend and frontend separately.

From the project root (backend):

```bash
node server.js
```

From the `frontend` directory (frontend dev server):

```bash
cd frontend
npm run dev
```

This typically runs the frontend on http://localhost:5173 while the backend remains on http://localhost:3000.

## 6. Typical demo flow

1. Start OSRM server (optional but recommended for road-following routes).
2. Start backend: `node server.js`.
3. Open two browser windows:
   - User: `http://localhost:3000/`
   - Collector: `http://localhost:3000/collector`
4. In Collector, click on the map to set the dumpsite.
5. In User, center the map on your location and click **Request Pickup Here**.
6. In Collector, click **Calculate Route and Start Driving**.
7. Watch the truck icon follow the route and move in real time on both views.
