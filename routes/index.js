const express = require('express');
const router = express.Router();

const moviesRoutes = require('./movies');
const reviewsRoutes = require('./reviews');
const authRoutes = require('./auth');

// Root endpoint - Shows authentication status and navigation
router.get('/', (req, res) => {
  // #swagger.tags = ['Home']
  // #swagger.description = 'API root endpoint displaying login status and quick links'
  const user = (req.session && req.session.user) || (req.user || null);

  if (user) {
    const displayName = user.username || user.displayName || user.email || 'User';
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Movies & Reviews API</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.6; }
          .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; background: #e6ffed; color: #22863a; font-weight: bold; }
          .btn { display: inline-block; padding: 8px 16px; margin: 5px 0; background: #0366d6; color: white; text-decoration: none; border-radius: 6px; }
          .btn-logout { background: #d73a49; }
          .card { border: 1px solid #e1e4e8; border-radius: 6px; padding: 20px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <h1>Movies & Reviews REST API</h1>
        <div class="card">
          <p><span class="badge">Logged In</span></p>
          <p>Welcome back, <strong>${displayName}</strong>! You have access to protected CRUD operations and profile data.</p>
          <p>
            <a class="btn" href="/api-docs">Explore API Documentation</a>
            <a class="btn" href="/auth/profile">View Protected Profile</a>
            <a class="btn" href="/reviews/user/my-reviews">My Reviews</a>
            <a class="btn btn-logout" href="/logout">Logout</a>
          </p>
        </div>
      </body>
      </html>
    `);
  } else {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Movies & Reviews API</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.6; }
          .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; background: #ffeef0; color: #cb2431; font-weight: bold; }
          .btn { display: inline-block; padding: 8px 16px; margin: 5px 0; background: #24292e; color: white; text-decoration: none; border-radius: 6px; }
          .card { border: 1px solid #e1e4e8; border-radius: 6px; padding: 20px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <h1>Movies & Reviews REST API</h1>
        <div class="card">
          <p><span class="badge">Logged Out</span></p>
          <p>You are currently browsing as a guest. Public read endpoints (GET /movies, GET /reviews) are accessible. To perform POST, PUT, or DELETE operations, please log in.</p>
          <p>
            <a class="btn" href="/login">Login with GitHub</a>
            <a class="btn" style="background: #0366d6;" href="/api-docs">API Documentation</a>
          </p>
        </div>
      </body>
      </html>
    `);
  }
});

// Authentication routes (/login, /logout, /github/callback, /auth/...)
router.use('/', authRoutes);

// Resource routes
router.use('/movies', moviesRoutes);
router.use('/reviews', reviewsRoutes);

module.exports = router;
