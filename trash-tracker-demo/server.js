const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

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
  });

  // Listen for a new pickup request from a user
  socket.on('requestPickup', (location) => {
    console.log(`Received pickup request from ${socket.id} at`, location);
    const request = { id: socket.id, ...location };
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
  socket.on('calculateRoute', (data) => {
    console.log('Calculating route...');
    if (!data.dumpsite || pickupRequests.size === 0) {
      console.log('Cannot calculate route: Dumpsite or pickup requests are missing.');
      return;
    }

    const locations = [data.dumpsite, ...Array.from(pickupRequests.values())];

    // Simple "nearest neighbor" algorithm
    let unvisited = [...pickupRequests.values()];
    let currentPoint = data.dumpsite;
    const calculatedRoute = [currentPoint];

    while(unvisited.length > 0) {
      let nearestIndex = -1;
      let minDistance = Infinity;

      unvisited.forEach((point, index) => {
        const distance = Math.sqrt(Math.pow(point.lat - currentPoint.lat, 2) + Math.pow(point.lng - currentPoint.lng, 2));
        if (distance < minDistance) {
          minDistance = distance;
          nearestIndex = index;
        }
      });

      currentPoint = unvisited[nearestIndex];
      calculatedRoute.push(currentPoint);
      unvisited.splice(nearestIndex, 1);
    }

    // Add the dumpsite again at the end to complete the loop
    calculatedRoute.push(data.dumpsite);

    route = calculatedRoute;
    console.log('Route calculated:', route);

    // Broadcast the calculated route to all clients
    io.emit('routeCalculated', route);
  });

  // Listen for truck's location updates from the collector
  socket.on('updateLocation', (location) => {
    truckPosition = location;
    // Broadcast the new location to all user clients
    socket.broadcast.emit('newTruckLocation', location);
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
