const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/auth');
const { isAuthenticated } = require('../middleware/authenticate');

// GET /login - Trigger GitHub OAuth flow
router.get(
  '/login',
  // #swagger.tags = ['Authentication']
  // #swagger.description = 'Initiate GitHub OAuth 2.0 login flow'
  // #swagger.responses[302] = { description: 'Redirect to GitHub login' }
  (req, res, next) => {
    if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
      return res.status(503).json({
        error: 'OAuth configuration incomplete',
        message: 'GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET are not configured on this server.',
      });
    }
    passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
  }
);

// GET /github/callback - GitHub OAuth callback endpoint
router.get(
  '/github/callback',
  // #swagger.tags = ['Authentication']
  // #swagger.description = 'GitHub OAuth callback URL'
  // #swagger.responses[302] = { description: 'Redirect to homepage upon successful authentication' }
  (req, res, next) => {
    passport.authenticate('github', {
      failureRedirect: '/api-docs',
      session: true,
    })(req, res, (err) => {
      if (err) return next(err);
      if (req.user) {
        req.session.user = {
          id: req.user.id,
          username: req.user.username || req.user.displayName,
          email: (req.user.emails && req.user.emails[0] && req.user.emails[0].value) || 'github_user',
          provider: 'github',
          role: 'user',
        };
      }
      res.redirect('/');
    });
  }
);

// GET /logout - User logout (HTML & redirects)
router.get(
  '/logout',
  // #swagger.tags = ['Authentication']
  // #swagger.description = 'Log out current session and redirect home'
  // #swagger.responses[302] = { description: 'Redirected to home after session destroy' }
  (req, res, next) => {
    req.query.redirect = 'true';
    authController.logout(req, res, next);
  }
);

// POST /auth/register - Create account with bcrypt hashed password
router.post(
  '/auth/register',
  // #swagger.tags = ['Authentication']
  // #swagger.description = 'Register a new account (passwords hashed with bcrypt)'
  /* #swagger.parameters['body'] = {
      in: 'body',
      description: 'User registration credentials',
      required: true,
      schema: { $ref: '#/definitions/RegisterUser' }
  } */
  // #swagger.responses[201] = { description: 'Account registered successfully' }
  // #swagger.responses[400] = { description: 'Validation failed' }
  // #swagger.responses[409] = { description: 'User already exists' }
  authController.register
);

// POST /auth/login - Log in with email/username and password
router.post(
  '/auth/login',
  // #swagger.tags = ['Authentication']
  // #swagger.description = 'Log in with local credentials (bcrypt verification)'
  /* #swagger.parameters['body'] = {
      in: 'body',
      description: 'Login credentials',
      required: true,
      schema: { $ref: '#/definitions/LoginUser' }
  } */
  // #swagger.responses[200] = { description: 'Successfully authenticated' }
  // #swagger.responses[400] = { description: 'Missing credentials' }
  // #swagger.responses[401] = { description: 'Invalid credentials' }
  authController.login
);

// POST /auth/logout - JSON API logout
router.post(
  '/auth/logout',
  // #swagger.tags = ['Authentication']
  // #swagger.description = 'Log out current API session'
  // #swagger.responses[200] = { description: 'Successfully logged out' }
  authController.logout
);

// GET /auth/status - Check session status
router.get(
  '/auth/status',
  // #swagger.tags = ['Authentication']
  // #swagger.description = 'Check if a user is currently authenticated'
  // #swagger.responses[200] = { description: 'Current authentication status returned' }
  authController.getStatus
);

// GET /auth/profile - Protected route viewable only by authenticated users
router.get(
  '/auth/profile',
  // #swagger.tags = ['Authentication']
  // #swagger.description = 'View protected user profile (only accessible when logged in)'
  // #swagger.security = [{ "cookieAuth": [] }]
  // #swagger.responses[200] = { description: 'Profile details returned' }
  // #swagger.responses[401] = { description: 'Unauthorized - Login required' }
  isAuthenticated,
  authController.getProfile
);

module.exports = router;
