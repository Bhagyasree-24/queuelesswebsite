const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const passport = require('passport');

const User = require('./models/User');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const officeRoutes = require('./routes/office.routes');
const serviceAdminRoutes = require('./routes/service.routes');
const tokenRoutes = require('./routes/token.route');
const operatorRoutes = require("./routes/operator.route");
const adminRoutes = require("./routes/admin.route");
const analyticsRoutes = require("./routes/analytics.route");


const app = express();

// CORS

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true
    })
);

// BODY PARSER-

app.use(express.json());

// SESSION STORE

const store = MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    crypto: {
        secret: process.env.SESSION_SECRET
    }
});

store.on('error', (err) => {
    console.log('Session store error:', err);
});

// SESSION

const sessionOptions = {
    store,

    secret: process.env.SESSION_SECRET,

    resave: false,

    saveUninitialized: false,

    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};
const sessionMiddleware = session(sessionOptions);

app.use(sessionMiddleware);

// PASSPORT

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// ROUTES

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/offices', officeRoutes);
app.use('/api/admin', serviceAdminRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api', tokenRoutes);
app.use("/api/operator", operatorRoutes);
app.use("/api", analyticsRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// EXPORT
app.set('sessionMiddleware', sessionMiddleware);
app.set('passport', passport);

module.exports = app;