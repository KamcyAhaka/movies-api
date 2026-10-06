const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const mongodb = require('./db/connect');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');

let swaggerDocument;
try {
  swaggerDocument = require('./swagger-output.json');
} catch (e) {
  swaggerDocument = { swagger: '2.0', info: { title: 'Movies API', version: '1.0.0' } };
}

const app = express();
const port = process.env.PORT || 3000;

// Enable reverse proxy support for deployments (e.g. Render)
app.enable('trust proxy');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'cse341-movies-api-secret-key-change-in-prod',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      secure: false, // Set to true if running under pure HTTPS with trust proxy
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport serialization
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Configure GitHub OAuth Strategy
const getCallbackUrl = () => {
  if (process.env.CALLBACK_URL) {
    return process.env.CALLBACK_URL;
  }
  if (process.env.HOST) {
    return `https://${process.env.HOST}/github/callback`;
  }
  return 'http://localhost:3000/github/callback';
};

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: getCallbackUrl(),
      },
      (accessToken, refreshToken, profile, done) => {
        return done(null, profile);
      }
    )
  );
  console.log(`GitHub OAuth configured with callback: ${getCallbackUrl()}`);
} else {
  console.log('GitHub OAuth credentials not set. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in .env');
}

// CORS configuration for cross-origin requests
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Swagger Documentation route
app.use('/api-docs', swaggerUi.serve, (req, res, next) => {
  const host = req.get('host');
  const isLocal = host && host.includes('localhost');
  const dynamicDoc = {
    ...swaggerDocument,
    host: host || swaggerDocument.host,
    schemes: isLocal ? ['http', 'https'] : ['https', 'http'],
  };
  return swaggerUi.setup(dynamicDoc)(req, res, next);
});

// Mount application routes
app.use('/', routes);

// Global fallback error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'An unexpected internal server error occurred', details: err.message });
});

// Initialize database and start listening
mongodb.initDb((err) => {
  if (err) {
    console.error('Failed to initialize database connection:', err);
  } else {
    app.listen(port, () => {
      console.log(`Server running and listening on port ${port}`);
      console.log(`Swagger documentation available at http://localhost:${port}/api-docs`);
    });
  }
});
