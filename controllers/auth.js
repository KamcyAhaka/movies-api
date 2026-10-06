const bcrypt = require('bcryptjs');
const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

const USERS_COLLECTION = 'users';

// POST /auth/register - Register a new user account with hashed password
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const errors = [];

    if (!username || typeof username !== 'string' || username.trim().length < 3) {
      errors.push('username is required and must be at least 3 characters long');
    }
    if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      errors.push('email is required and must be a valid email address');
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      errors.push('password is required and must be at least 6 characters long');
    }

    if (errors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }

    const db = mongodb.getDb();
    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim();

    // Check if user already exists
    const existingUser = await db
      .collection(USERS_COLLECTION)
      .findOne({ $or: [{ email: cleanEmail }, { username: cleanUsername }] });

    if (existingUser) {
      return res.status(409).json({
        error: 'User conflict',
        message: 'A user with that email or username already exists',
      });
    }

    // Hash password with bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
      username: cleanUsername,
      email: cleanEmail,
      password: hashedPassword,
      provider: 'local',
      role: 'user',
      createdAt: new Date(),
    };

    const result = await db.collection(USERS_COLLECTION).insertOne(newUser);

    const sessionUser = {
      id: result.insertedId.toString(),
      username: newUser.username,
      email: newUser.email,
      provider: newUser.provider,
      role: newUser.role,
    };

    // Auto-login newly registered user
    if (req.session) {
      req.session.user = sessionUser;
    }

    return res.status(201).json({
      message: 'Account created successfully',
      user: sessionUser,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create user account', details: err.message });
  }
};

// POST /auth/login - Authenticate with email/username and password
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Both email/username and password are required',
      });
    }

    const db = mongodb.getDb();
    const identifier = email.trim();

    // Find user by either email or username
    const user = await db.collection(USERS_COLLECTION).findOne({
      $or: [{ email: identifier.toLowerCase() }, { username: identifier }],
    });

    if (!user || !user.password) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid credentials or account registered via OAuth only',
      });
    }

    // Verify password with bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid credentials',
      });
    }

    const sessionUser = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      provider: user.provider || 'local',
      role: user.role || 'user',
    };

    if (req.session) {
      req.session.user = sessionUser;
    }

    return res.status(200).json({
      message: 'Logged in successfully',
      user: sessionUser,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Login failed', details: err.message });
  }
};

// GET or POST /logout - Terminate user session
const logout = (req, res, next) => {
  try {
    if (req.logout) {
      req.logout((err) => {
        if (err) {
          return next(err);
        }
        destroyAndRespond(req, res);
      });
    } else {
      destroyAndRespond(req, res);
    }
  } catch (err) {
    return res.status(500).json({ error: 'Logout failed', details: err.message });
  }
};

const destroyAndRespond = (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      res.clearCookie('connect.sid');
      if (err) {
        return res.status(500).json({ error: 'Failed to destroy session' });
      }
      if (req.query && req.query.redirect) {
        return res.redirect('/');
      }
      return res.status(200).json({ message: 'Logged out successfully' });
    });
  } else {
    return res.status(200).json({ message: 'Logged out successfully' });
  }
};

// GET /auth/status - Check session status
const getStatus = (req, res) => {
  const user = (req.session && req.session.user) || (req.user || null);
  if (user) {
    return res.status(200).json({
      loggedIn: true,
      user: {
        id: user.id || user._id,
        username: user.username || user.displayName,
        email: user.email,
        provider: user.provider || 'oauth',
        role: user.role || 'user',
      },
    });
  }
  return res.status(200).json({
    loggedIn: false,
    user: null,
  });
};

// GET /auth/profile - Protected route visible only to logged-in users
const getProfile = async (req, res) => {
  try {
    const sessionUser = (req.session && req.session.user) || req.user;
    if (!sessionUser) {
      return res.status(401).json({ error: 'Unauthorized', message: 'You must be logged in to view your profile' });
    }

    const db = mongodb.getDb();
    let accountData = null;

    if (sessionUser.id && ObjectId.isValid(sessionUser.id)) {
      accountData = await db.collection(USERS_COLLECTION).findOne(
        { _id: new ObjectId(sessionUser.id) },
        { projection: { password: 0 } }
      );
    }

    return res.status(200).json({
      message: 'Access granted: Authenticated User Profile',
      profile: {
        id: sessionUser.id || (accountData && accountData._id),
        username: sessionUser.username || sessionUser.displayName,
        email: sessionUser.email || (accountData && accountData.email) || 'N/A',
        provider: sessionUser.provider || (accountData && accountData.provider) || 'github',
        role: sessionUser.role || (accountData && accountData.role) || 'member',
        createdAt: (accountData && accountData.createdAt) || 'Session established',
        secretAccessPrivileges: [
          'Can create, update, and delete movies',
          'Can create, update, and delete reviews',
          'Access to personal reviews dashboard',
        ],
      },
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve profile', details: err.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  getStatus,
  getProfile,
};
