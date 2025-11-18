const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for simplicity in demo
  },
});

const PORT = process.env.PORT || 3000;

// --- In-memory data storage ---
const pickupRequests = new Map(); // Using a Map to store requests by socket ID
let dumpsite = null;
let route = [];
let truckPosition = null;

// Serve the built React app
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Serve the index.html for the main and collector routes
app.get(['/', '/collector'], (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
});

// --- Socket.IO Logic ---
io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  // Send initial data to the newly connected client
  socket.emit('initialData', {
    pickupRequests: Array.from(pickupRequests.values()),
    dumpsite,
    truckPosition,
    route,
  });

  const emitLatestData = () => {
    socket.emit('latestData', {
      pickupRequests: Array.from(pickupRequests.values()),
      dumpsite,
      truckPosition,
      route,
    });
  };

  socket.on('collectorConnect', () => {
    emitLatestData();
  });

  socket.on('requestLatestData', () => {
    emitLatestData();
  });

  // Listen for a new pickup request from a user
  socket.on('requestPickup', (location) => {
    console.log(`Received pickup request from ${socket.id} at`, location);
    const request = { id: socket.id, ...location, status: 'pending', points: 0, collectorName: null };
    pickupRequests.set(socket.id, request);
    // Broadcast the new request to the collector page
    io.emit('newPickupRequest', request);
  });

  // Listen for the collector to set the dumpsite
  socket.on('setDumpsite', (location) => {
    console.log('Dumpsite set at:', location);
    dumpsite = location;
    io.emit('dumpsiteUpdated', dumpsite);
  });


  // Listen for the collector to start the route calculation
  socket.on('calculateRoute', async (data) => {
    console.log('Calculating route...');
    if (!data.dumpsite || pickupRequests.size === 0) {
      console.log('Cannot calculate route: Dumpsite or pickup requests are missing.');
      return;
    }

    // First, build an ordered list of points using nearest neighbor (dumpsite + pickups)
    let unvisited = [...pickupRequests.values()];
    let currentPoint = data.dumpsite;
    const orderedPoints = [currentPoint];

    while (unvisited.length > 0) {
      let nearestIndex = -1;
      let minDistance = Infinity;

      unvisited.forEach((point, index) => {
        const distance = Math.sqrt(
          Math.pow(point.lat - currentPoint.lat, 2) +
          Math.pow(point.lng - currentPoint.lng, 2)
        );
        if (distance < minDistance) {
          minDistance = distance;
          nearestIndex = index;
        }
      });

      currentPoint = unvisited[nearestIndex];
      orderedPoints.push(currentPoint);
      unvisited.splice(nearestIndex, 1);
    }

    // Return to dumpsite at the end
    orderedPoints.push(data.dumpsite);

    let routePoints = orderedPoints;

    // Try to use local OSRM (if running) for real road routing
    try {
      const coordinates = orderedPoints.map(p => `${p.lng},${p.lat}`).join(';');
      const osrmUrl = `http://localhost:5000/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;
      const response = await axios.get(osrmUrl, { timeout: 5000 });

      if (
        response.data &&
        response.data.routes &&
        response.data.routes[0] &&
        response.data.routes[0].geometry &&
        response.data.routes[0].geometry.coordinates
      ) {
        const geometry = response.data.routes[0].geometry.coordinates;
        routePoints = geometry.map(([lng, lat]) => ({ lat, lng }));
        console.log('Route calculated with OSRM roads:', routePoints.length, 'points');
      } else {
        console.log('OSRM response missing geometry, falling back to simple route');
      }
    } catch (error) {
      console.log('OSRM not available or error occurred, using simple nearest-neighbor route');
    }

    route = routePoints;
    console.log('Route calculated:', route.length, 'points');

    // Broadcast the calculated route to all clients
    io.emit('routeCalculated', route);
  });

  // Listen for truck's location updates from the collector
  socket.on('updateLocation', (location) => {
    truckPosition = location;
    // Broadcast the new location to all user clients
    socket.broadcast.emit('newTruckLocation', location);

    const threshold = 0.0005;
    pickupRequests.forEach((request) => {
      if (request.status && request.status !== 'pending') {
        return;
      }
      const distance = Math.sqrt(
        Math.pow(request.lat - location.lat, 2) +
        Math.pow(request.lng - location.lng, 2)
      );
      if (distance <= threshold) {
        io.emit('pickupReached', request);
      }
    });
  });

  socket.on('pickupResult', (data) => {
    if (!data || !data.id || !data.status) {
      return;
    }
    const request = pickupRequests.get(data.id);
    if (!request) {
      return;
    }
    const isSuccess = data.status === 'success';
    const assignedCollector = data.collectorName || request.collectorName || 'Collector';
    const updated = {
      ...request,
      status: data.status,
      points: isSuccess ? (request.points || 0) + 10 : 0,
      collectorName: assignedCollector,
    };
    pickupRequests.set(data.id, updated);
    io.to(data.id).emit('pickupStatus', {
      status: updated.status,
      points: updated.points,
      collectorName: assignedCollector,
    });
    io.emit('pickupStatusUpdated', updated);
  });

  socket.on('routeCompleted', () => {
    pickupRequests.forEach((request, id) => {
      if (!request.status || request.status === 'pending') {
        const updated = { ...request, status: 'failed', points: 0 };
        pickupRequests.set(id, updated);
        io.to(id).emit('pickupStatus', { status: 'failed', points: 0 });
        io.emit('pickupStatusUpdated', updated);
      }
    });
  });


  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    // If the disconnected user had a pickup request, remove it
    if (pickupRequests.has(socket.id)) {
      pickupRequests.delete(socket.id);
      // Notify the collector that a request was removed
      io.emit('requestCancelled', socket.id);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
