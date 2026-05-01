const httpStatus = require('http-status').status;
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const { User } = require('../models/user.model');
const fs = require('fs');
const path = require('path');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  // Check if email is taken
  if (userBody.email && await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  return User.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id, model) => {
  return model.findById(id)
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email, model) => {
  return model.findOne({ email });
};
/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody, model) => {
  const user = await getUserById(userId, model);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await model.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Soft delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await User.findById(userId);
  console.log("userId checking==>,", user);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  // Soft delete
  user.isDeleted = true;
  user.deletedAt = new Date();
  await user.save();
  return { message: "User Deleted Successfully" };
};

/**
 * Hard delete user by id (permanent delete)
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const hardDeleteUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Delete user image if exists
  if (user.image) {
    const imagePath = path.join(__dirname, '../../uploads', path.basename(user.image));
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  await User.findByIdAndDelete(userId);
  return { message: "User Permanently Deleted" };
};

const getUserCountAndLastMonthRate = async () => {
  const now = new Date();
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  const twoMonthsAgoDate = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());

  const totalCount = await User.countDocuments({ role: 'user', isDeleted: { $ne: true } });

  const lastMonthCount = await User.countDocuments({
    role: 'user',
    isDeleted: { $ne: true },
    createdAt: { $gte: lastMonthDate, $lte: now }
  });

  const priorMonthCount = await User.countDocuments({
    role: 'user',
    isDeleted: { $ne: true },
    createdAt: { $gte: twoMonthsAgoDate, $lt: lastMonthDate }
  });

  let monthlyRate = 0;
  if (priorMonthCount > 0) {
    monthlyRate = ((lastMonthCount - priorMonthCount) / priorMonthCount) * 100;
  } else if (lastMonthCount > 0) {
    monthlyRate = 100; // If prior month was 0 and this month > 0, treat as 100% growth
  }

  return { totalCount, monthlyRate: monthlyRate.toFixed(2) };
}

const storeOtp = async (userId, otp, model) => {
  const user = await model.findByIdAndUpdate(userId, {
    $set: { otp: otp }
  })
  return user
}

const checkOtp = async (userId, otp, model) => {
  const user = await getUserById(userId, model);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const storedOtp = user.otp;
  if (!storedOtp) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No OTP found for this user");
  }

  // Check OTP expiration if otpExpiration field exists
  if (user.otpExpiration) {
    const currentTime = moment();
    if (currentTime.isAfter(user.otpExpiration)) {
      throw new ApiError(httpStatus.BAD_REQUEST, "OTP has expired");
    }
  }

  if (storedOtp !== otp) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid OTP");
  }

  // Clear OTP after successful verification
  await model.updateOne(
    { _id: userId },
    { $unset: { otp: "", otpExpiration: "" } }
  );

  return { success: true, message: "OTP verified successfully" };
};

function generateTicketNumber() {
  const ticketNumber = Math.floor(100000 + Math.random() * 900000);
  return ticketNumber;
}

const generateUniqueId = async (model, field) => {
  let id = generateTicketNumber();
  let existingRecord = await model.findOne({ [field]: id });
  while (existingRecord) {
    id = generateTicketNumber();
    existingRecord = await model.findOne({ [field]: id });
  }
  return id;
};


module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  hardDeleteUserById,
  getUserCountAndLastMonthRate,

  storeOtp,
  checkOtp,
  generateUniqueId,
};
