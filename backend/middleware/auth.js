/**
 * JWT Authentication Middleware
 * 
 * This middleware verifies the JWT token from the request header,
 * decodes it, and attaches the user information to the request object.
 * It protects routes from unauthorized access.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to authenticate and authorize users
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token, access denied'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID from token payload
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found, token invalid'
      });
    }

    // Attach user to request object
    req.user = user;
    req.userId = decoded.userId;

    // Continue to next middleware/route handler
    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    // Generic error
    res.status(500).json({
      success: false,
      message: 'Server error during authentication',
      error: error.message
    });
  }
};

module.exports = auth;
