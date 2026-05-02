const jwt = require('jsonwebtoken');
const { config } = require('dotenv');
const { User } = require('../models/user.model');

config();

const adminAuth = () => async (req, res, next) => {
  const { headers } = req;
  const accessToken = headers.authorization ? headers.authorization.split(' ')[1] : null;
  
  if (!accessToken) {
    return res.status(401).json({ message: 'Bearer Token is required.' });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.sub });
    
    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    if (user.role === 'admin') {
      req.user = user;
      req.userObj = user;
      return next();
    } else {
      return res.status(401).json({ message: 'Invalid permissions.' });
    }
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired.' });
    }
    return res.status(401).json({ message: err.message });
  }
};

module.exports = adminAuth;