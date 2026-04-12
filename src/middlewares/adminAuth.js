const jwt = require('jsonwebtoken');
const { config } = require('dotenv');
const { User } = require('../models/user.model');

config();

const adminAuth = () => async (req, res, next) => {
  const { headers } = req;
  const accessToken = headers.authorization ? headers.authorization.split(' ')[1] : null; // if token not send it gives split of undef error
  if (accessToken === null) {
    return res.status(400).json({ status: 400, message: 'Bearer Token is required.' });
  }
  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.user = decoded?.sub;
    const user = await User.findOne({ _id: req.user });
    req.userObj = user;
    req.user = user;
    if (user?.role === 'admin') {
      return next();
    } else {
      return res.status(400).json({ status: 401, message: 'Invalid Token' });
    }
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Token has expired.' });
    }
    return res.status(401).json({ msg: err.message });
  }
};

module.exports = adminAuth;