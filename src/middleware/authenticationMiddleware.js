require('dotenv').config();

const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');


//Previouse approach - in use
exports.authenticateUser = (req, res, next) => {
  try {
    const token = req.cookies.refreshtoken|| req.header('Authorization')?.split(' ')[1]; // Extract token from cookies

// console.log("🧾 Raw token received:", token);

    if (!token) {
      return res.status(401).json({ message: 'No token provided.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Attach user details (ID & role) to request object
    req.user = {
      id: decoded.id,       // Extract user ID
      role: decoded.role,        // Token issued time
    };


    next(); // Proceed to the next middleware
  } catch (error) {
  console.error("Token verification failed:", error);

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token has expired. Please log in again.' });
  }
  if (error.name === 'JsonWebTokenError') {
    return res.status(400).json({ message: 'Invalid token. Please log in again.' });
  }
  if (error.name === 'NotBeforeError') {
    return res.status(401).json({ message: 'Token is not active yet. Please try again later.' });
  }

  return res.status(500).json({ message: 'Internal server error' });
}
}


exports.authorizeRoles = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Unauthorized role.' });
    }
    next();
  };
};


exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshtoken;

    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token provided.' });
    }

    jwt.verify(refreshToken, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid refresh token.' });
      }

      const newAccessToken = jwt.sign(
        { id: decoded.id, role: decoded.role },
        process.env.SECRET_KEY,
        { expiresIn: '1h' }
      );

      return res.status(200).json({ accessToken: newAccessToken });
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};


exports.verifyToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshtoken || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided.' });
    }

    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid or expired token.' });
      }

      const { id, role } = decoded;

      // Map roles to corresponding models
      const roleModels = {
        'admin': Admin,
      };

      const UserModel = roleModels[role];
      if (!UserModel) {
        return res.status(400).json({ message: 'Invalid role.' });
      }

      // Fetch user
      const user = await UserModel.findById(id).select('-password');
      if (!user) {
        return res.status(404).json({ message: `${role} not found.` });
      }

      // Check if token matches the user's current active token
      if (user.currentToken !== token) {
        return res.status(401).json({ message: 'Session expired. Please login again.' });
      }


      // **Generic Response for Other Roles**
      return res.status(200).json({
        message: 'Token is valid.',
        userId: id,
        role: role
      });

    });

  } catch (error) {
    console.error('Verify token error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
