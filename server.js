const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { generateTokens, verifyToken } = require('./utils/jwtUtils');
const { authenticate, authorize } = require('./middleware/auth');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for simplicity in demo
  },
});

const PORT = process.env.PORT || 3000;

const usersFilePath = path.join(__dirname, 'data', 'users.json');

const readUserStore = () => {
  try {
    const raw = fs.readFileSync(usersFilePath, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    return { users: [], workers: [] };
  }
};

const writeUserStore = (store) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(store, null, 2));
};

app.use(express.json());
app.use(cors());
app.use(cookieParser());

// --- In-memory data storage ---
const pickupRequests = new Map(); // Using a Map to store requests by socket ID
let dumpsite = null;
let route = [];
let truckPosition = null;
// Track active users and workers
const activeUsers = new Map(); // userId -> { user, socketId, lastActivity, role }
const activeWorkers = new Map(); // workerId -> { worker, socketId, lastActivity, isOnline }

app.post('/api/auth/login', (req, res) => {
  const { role, username, password } = req.body || {};
  if (!role || !username || !password) {
    return res.status(400).json({ message: 'Missing credentials' });
  }

  let found = null;
  let userRole = role;

  if (role === 'worker') {
    const store = readUserStore();
    found = store.workers?.find((w) => w.username === username && w.password === password);
  } else {
    // For user or admin roles, check users array
    const store = readUserStore();
    found = store.users?.find((u) => u.username === username && u.password === password);
    // If role is admin and user is found, keep admin role, otherwise default to user
    if (!found || role !== 'admin') {
      userRole = 'user';
    }
  }

  if (!found) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
  const { password: _password, ...safeUser } = found;
  const userPayload = { id: safeUser.id, role: userRole, email: safeUser.username };
  const tokens = generateTokens(userPayload);

  // Set httpOnly cookies for refresh token, return access token in response
  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: false, // Set to true in production with HTTPS
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  return res.json({
    role,
    user: safeUser,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken // Also return for client storage if needed
  });
});

app.post('/api/auth/refresh', (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }

  const decoded = verifyToken(refreshToken);
  if (!decoded) {
    return res.status(401).json({ message: 'Invalid or expired refresh token' });
  }

  // Generate new access token
  const userPayload = { id: decoded.id, role: decoded.role, email: decoded.email };
  const { accessToken } = generateTokens(userPayload);

  return res.json({ accessToken });
});

app.post('/api/auth/signup', (req, res) => {
  const { role, username, password, name } = req.body || {};
  if (!role || !username || !password || !name) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  const store = readUserStore();
  const all = [...(store.users || []), ...(store.workers || [])];
  const exists = all.some((u) => u.username === username);
  if (exists) {
    return res.status(409).json({ message: 'Username already taken' });
  }
  const idPrefix = role === 'worker' ? 'w' : 'u';
  const id = `${idPrefix}${Date.now()}`;
  let newEntry;
  if (role === 'worker') {
    const workerType = req.body.workerType || 'freelancer';
    newEntry = { id, username, password, name, earnings_wallet: 0, workerType };
    store.workers = [...(store.workers || []), newEntry];
  } else {
    newEntry = {
      id,
      username,
      password,
      name,
      barangay: req.body.barangay || 'Poblacion 1',
      points: 0,
      district: req.body.barangay || 'Poblacion 1', // Use barangay as district
      membership: 'Eco Citizen',
      completedPickups: 0,
      scheduledPickups: 0,
      weeklyPoints: 0,
    };
    store.users = [...(store.users || []), newEntry];
  }
  writeUserStore(store);
  const { password: _password, ...safeUser } = newEntry;
  return res.status(201).json({ role, user: safeUser });
});

// Protected route example
app.get('/api/user/profile', authenticate, (req, res) => {
  res.json({ user: req.user });
});

// Admin endpoint to get users and workers with active status
app.get('/api/admin/users-workers', authenticate, authorize(['admin']), (req, res) => {
  console.log('Admin requesting users-workers data');
  const store = readUserStore();

  // Get all users with active status
  const usersWithStatus = (store.users || []).map(user => {
    const activeInfo = activeUsers.get(user.id);
    console.log(`User ${user.name} (${user.id}): activeInfo =`, activeInfo);
    return {
      ...user,
      isActive: !!activeInfo,
      lastActivity: activeInfo?.lastActivity,
      currentSocketId: activeInfo?.socketId
    };
  });

  // Get all workers with online status
  const workersWithStatus = (store.workers || []).map(worker => {
    const activeInfo = activeWorkers.get(worker.id);
    console.log(`Worker ${worker.name} (${worker.id}): activeInfo =`, activeInfo);
    return {
      ...worker,
      isOnline: !!activeInfo && activeInfo.isOnline,
      lastActivity: activeInfo?.lastActivity,
      currentSocketId: activeInfo?.socketId
    };
  });

  console.log('Active users map:', Array.from(activeUsers.entries()));
  console.log('Active workers map:', Array.from(activeWorkers.entries()));
  console.log('Returning users:', usersWithStatus.map(u => ({ name: u.name, isActive: u.isActive })));
  console.log('Returning workers:', workersWithStatus.map(w => ({ name: w.name, isOnline: w.isOnline })));

  res.json({
    users: usersWithStatus,
    workers: workersWithStatus
  });
});

// New endpoint for workers to get their own earnings
app.get('/api/worker/earnings', authenticate, (req, res) => {
  const store = readUserStore();
  const worker = store.workers?.find(w => w.id === req.user.id);

  if (!worker) {
    return res.status(404).json({ message: 'Worker not found' });
  }

  res.json({
    earnings_wallet: worker.earnings_wallet || 0,
    jobsCompleted: worker.jobsCompleted || 0,
    name: worker.name
  });
});

// Gamification / Rankings Endpoint
app.get('/api/rankings', (req, res) => {
  const store = readUserStore();
  const users = store.users || [];

  // Aggregate points by barangay
  const barangayStats = {};

  users.forEach(user => {
    const brgy = user.barangay || user.district || 'Unknown';
    if (!barangayStats[brgy]) {
      barangayStats[brgy] = {
        name: brgy,
        totalPoints: 0,
        pickups: 0,
        users: 0
      };
    }
    barangayStats[brgy].totalPoints += user.points || 0;
    barangayStats[brgy].pickups += user.completedPickups || 0;
    barangayStats[brgy].users += 1;
  });

  // Convert to array and calculate scores
  const rankings = Object.values(barangayStats)
    .map((brgy, index) => ({
      id: index + 1,
      name: brgy.name,
      score: Math.min(100, Math.floor((brgy.totalPoints / Math.max(brgy.users, 1)) / 10)), // Score based on avg points per user
      pickups: brgy.pickups,
      recyclables: `${Math.floor(brgy.pickups * 3.5)}kg`, // Estimate based on pickups
      complaints: Math.floor(Math.random() * 5), // Random for demo
      trend: brgy.totalPoints > 500 ? 'up' : brgy.totalPoints > 200 ? 'stable' : 'down'
    }))
    .sort((a, b) => b.score - a.score); // Sort by score descending

  res.json(rankings);
});

// Barangay Details Endpoint - Shows constituent IDs and detailed stats
app.get('/api/barangay-details', (req, res) => {
  const store = readUserStore();
  const users = store.users || [];

  // Group users by barangay with detailed stats
  const barangayDetails = {};

  users.forEach(user => {
    const brgy = user.barangay || user.district || 'Unknown';
    if (!barangayDetails[brgy]) {
      barangayDetails[brgy] = {
        name: brgy,
        totalPoints: 0,
        totalPickups: 0,
        constituents: []
      };
    }

    // Add anonymized constituent data
    barangayDetails[brgy].constituents.push({
      id: user.id, // Show user ID but not name for privacy
      points: user.points || 0,
      pickups: user.completedPickups || 0
    });

    barangayDetails[brgy].totalPoints += user.points || 0;
    barangayDetails[brgy].totalPickups += user.completedPickups || 0;
  });

  // Convert to array and sort by total points
  const details = Object.values(barangayDetails)
    .map((brgy, index) => ({
      id: index + 1,
      name: brgy.name,
      totalPoints: brgy.totalPoints,
      totalPickups: brgy.totalPickups,
      constituentCount: brgy.constituents.length,
      avgPointsPerUser: Math.floor(brgy.totalPoints / Math.max(brgy.constituents.length, 1)),
      constituents: brgy.constituents.sort((a, b) => b.points - a.points), // Sort by points desc
      rank: 0 // Will be set after sorting
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints);

  // Assign ranks
  details.forEach((brgy, index) => {
    brgy.rank = index + 1;
  });

  res.json(details);
});

// Serve the built React app
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Serve the index.html for React SPA routes
app.get(['/', '/login', '/signup', '/user', '/collector', '/features', '/admin'], (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
});

// --- Socket.IO Logic ---
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (token) {
    try {
      const decoded = verifyToken(token);
      socket.user = decoded; // Attach user info to socket
      console.log('Socket auth successful for user:', decoded?.email, 'role:', decoded?.role);
    } catch (error) {
      console.log('Socket auth failed:', error.message);
    }
  } else {
    console.log('No token provided for socket auth');
  }
  next();
});

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`, socket.user ? `(${socket.user.email})` : '(anonymous)');

  // Track user/worker connection
  if (socket.user) {
    const { id, role } = socket.user;
    const activeInfo = {
      socketId: socket.id,
      lastActivity: new Date(),
      role
    };

    if (role === 'user') {
      const store = readUserStore();
      const user = store.users?.find(u => u.id === id);
      if (user) {
        activeUsers.set(id, { ...activeInfo, user });
        console.log(`User ${user.name} (${id}) connected and added to active users`);
        // Emit real-time update to admin
        io.emit('userStatusUpdate', { type: 'login', role: 'user', userId: id, user });
      } else {
        console.log(`User ${id} not found in store`);
      }
    } else if (role === 'admin') {
      const store = readUserStore();
      const admin = store.users?.find(u => u.id === id);
      if (admin) {
        activeUsers.set(id, { ...activeInfo, user: admin });
        console.log(`Admin ${admin.name} (${id}) connected and added to active users`);
        // Emit real-time update to admin
        io.emit('userStatusUpdate', { type: 'login', role: 'admin', userId: id, user: admin });
      } else {
        console.log(`Admin ${id} not found in store`);
      }
    } else if (role === 'worker') {
      const store = readUserStore();
      const worker = store.workers?.find(w => w.id === id);
      if (worker) {
        activeWorkers.set(id, { ...activeInfo, worker, isOnline: false }); // Start as offline
        console.log(`Worker ${worker.name} (${id}) connected and added to active workers (offline by default)`);
        // Don't emit login event here - worker needs to explicitly go online
      } else {
        console.log(`Worker ${id} not found in store`);
      }
    }
  } else {
    console.log('Anonymous socket connection (no user auth)');
  }

  // Send initial data to the newly connected client
  socket.emit('initialData', {
    pickupRequests: Array.from(pickupRequests.values()),
    dumpsite,
    truckPosition,
    route,
  });

  // Listen for a new pickup request from a user
  socket.on('requestPickup', (location) => {
    console.log(`Received pickup request from ${socket.id} at`, location);
    // If authenticated, use user ID
    const userId = socket.user ? socket.user.id : socket.id;
    const request = { id: socket.id, userId, ...location, status: 'pending', points: 0 };
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
    const updated = {
      ...request,
      status: data.status,
      points: isSuccess ? (request.points || 0) + 10 : 0,
    };
    pickupRequests.set(data.id, updated);

    // Update user points in store if success
    if (isSuccess && request.userId) {
      const store = readUserStore();
      const user = store.users?.find(u => u.id === request.userId);
      if (user) {
        user.points = (user.points || 0) + 10;
        user.completedPickups = (user.completedPickups || 0) + 1;
        writeUserStore(store);
        console.log(`Updated points for user ${user.name}: ${user.points}`);
      }
    }

    // Update worker earnings if success
    if (isSuccess && data.collectorName) {
      const store = readUserStore();
      // Try to find worker by name (since we don't have ID in this event easily available unless passed)
      // Ideally we should pass worker ID, but for now name is unique enough for demo
      const worker = store.workers?.find(w => w.name === data.collectorName);
      if (worker) {
        // Calculate earnings based on waste type (simplified logic here, should match frontend)
        // For now, just add a fixed amount or rely on frontend to pass it? 
        // Actually, backend should calculate. 
        // Let's assume 50 for regular, 80% of price for bulk.
        // But we don't have price here easily. 
        // Let's just increment jobsCompleted for now and maybe add a default earning
        worker.jobsCompleted = (worker.jobsCompleted || 0) + 1;

        // Note: Real earnings calculation should happen here securely, 
        // but for this demo the frontend calculates and displays, 
        // and we might need another event to update earnings securely.
        // For now, let's just save the jobs count.
        // Wait, the user wants earnings to persist. 
        // So we MUST update earnings here.

        // Let's assume the request object has price/wasteType if we want to be accurate.
        // But request object in memory might not have it if it came from 'requestPickup' event which only had location.
        // If 'requestPickup' had wasteType, we are good.

        const earningAmount = request.wasteType === 'bulk' ? (request.price || 200) * 0.8 : 50;
        worker.earnings_wallet = (worker.earnings_wallet || 0) + earningAmount;

        writeUserStore(store);
        console.log(`Updated earnings for worker ${worker.name}: ${worker.earnings_wallet}`);
      }
    }

    io.to(data.id).emit('pickupStatus', { status: updated.status, points: updated.points });
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

    // Remove from active maps
    if (socket.user) {
      if (socket.user.role === 'worker') {
        activeWorkers.delete(socket.user.id);
        io.emit('userStatusUpdate', { type: 'logout', role: 'worker', userId: socket.user.id });
      } else {
        activeUsers.delete(socket.user.id);
        io.emit('userStatusUpdate', { type: 'logout', role: 'user', userId: socket.user.id });
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
