const path = require('path');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config({
  path: path.join(__dirname, '../.env')
});

const { connectDB } = require('./config/db');
const app = require('./app');
const User = require('./models/User');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true
  }
});

// Reuse the existing Express session and Passport authentication.
const sessionMiddleware = app.get('sessionMiddleware');
const passport = app.get('passport');

io.engine.use(sessionMiddleware);
io.engine.use(passport.initialize());
io.engine.use(passport.session());

// Temporary diagnostic logs for authentication.
io.engine.use((req, res, next) => {
  console.log('Socket handshake session:', !!req.session);
  console.log('Passport session data:', req.session?.passport);
  console.log('Passport user:', req.user?._id || 'MISSING');
  next();
});

// Allow controllers to emit Socket.IO events.
app.set('io', io);

// Authenticate connected sockets and authorize office-room subscriptions.
io.on('connection', async (socket) => {
  try {
    const sessionUser = socket.request.user;

    console.log('Socket connection received');
    console.log('Session ID:', socket.request.sessionID);
    console.log('Session exists:', !!socket.request.session);
    console.log('Authenticated user:', sessionUser?._id || 'MISSING');

    if (!sessionUser?._id) {
      console.log('Disconnecting: no authenticated session user');
      socket.disconnect(true);
      return;
    }

    // Load the current user from the database.
    const user = await User.findById(sessionUser._id).select(
      '_id role officeId counterId'
    );

    if (!user) {
      console.log('Disconnecting: user not found in database');
      socket.disconnect(true);
      return;
    }

    console.log(`Socket connected: ${user.role}`);
    console.log('Registering office:join handler');

    // Join an office room.
    socket.on('office:join', async (requestedOfficeId, callback) => {
      console.log('office:join received:', requestedOfficeId);

      const reply =
        typeof callback === 'function' ? callback : () => {};

      try {
        // Validate the office ID format.
        if (
          typeof requestedOfficeId !== 'string' ||
          !/^[a-f\d]{24}$/i.test(requestedOfficeId)
        ) {
          console.log('Room join rejected: invalid office ID');

          return reply({
            success: false,
            message: 'Invalid office ID'
          });
        }

        // Operators can only join their assigned office.
        // Citizens and admins can join offices to follow or monitor queues.
        if (
          user.role === 'operator' &&
          user.officeId?.toString() !== requestedOfficeId
        ) {
          console.log('Room join rejected: operator office mismatch');

          return reply({
            success: false,
            message: 'You cannot access this office room'
          });
        }

        if (!['citizen', 'operator', 'admin'].includes(user.role)) {
          console.log('Room join rejected: unauthorized role');

          return reply({
            success: false,
            message: 'Role is not allowed to join office rooms'
          });
        }

        const room = `office:${requestedOfficeId}`;

        console.log('Attempting to join room:', room);

        await socket.join(room);

        console.log('Rooms after join:', [...socket.rooms]);

        return reply({
          success: true,
          message: 'Joined office room',
          officeId: requestedOfficeId
        });
      } catch (error) {
        console.error('Office room subscription error:', error.message);

        return reply({
          success: false,
          message: 'Could not join office room'
        });
      }
    });

    // Leave an office room.
    socket.on('office:leave', async (requestedOfficeId, callback) => {
      const reply =
        typeof callback === 'function' ? callback : () => {};

      try {
        if (
          typeof requestedOfficeId !== 'string' ||
          !/^[a-f\d]{24}$/i.test(requestedOfficeId)
        ) {
          return reply({
            success: false,
            message: 'Invalid office ID'
          });
        }

        // Operators may leave their assigned office room.
        // Other roles may leave rooms they previously joined.
        if (
          user.role === 'operator' &&
          user.officeId?.toString() !== requestedOfficeId
        ) {
          return reply({
            success: false,
            message: 'You cannot access this office room'
          });
        }

        await socket.leave(`office:${requestedOfficeId}`);

        console.log('Left room:', `office:${requestedOfficeId}`);

        return reply({
          success: true,
          message: 'Left office room',
          officeId: requestedOfficeId
        });
      } catch (error) {
        console.error('Office room leave error:', error.message);

        return reply({
          success: false,
          message: 'Could not leave office room'
        });
      }
    });

    socket.on('disconnect', (reason) => {
      console.log(`Socket disconnected: ${user.role}`, reason);
    });
  } catch (error) {
    console.error('Socket connection error:', error.message);
    socket.disconnect(true);
  }
});

const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();