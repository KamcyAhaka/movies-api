// Middleware to check if the incoming request is authenticated
const isAuthenticated = (req, res, next) => {
  // Check if session has user object or if passport isAuthenticated returns true
  const user = (req.session && req.session.user) || (req.isAuthenticated && req.isAuthenticated() ? req.user : null);

  if (user) {
    // Ensure req.user is populated for downstream controllers
    req.user = user;
    return next();
  }

  return res.status(401).json({
    error: 'Unauthorized',
    message: 'You must be logged in to perform this action. Please log in via /login or /auth/login.',
  });
};

module.exports = { isAuthenticated };
