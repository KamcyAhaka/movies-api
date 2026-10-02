const express = require('express');
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

// CORS configuration for cross-origin requests
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
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
  res.status(500).json({ error: 'An unexpected internal server error occurred' });
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
