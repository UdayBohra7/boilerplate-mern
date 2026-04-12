const httpStatus = require("http-status");
const escapeRegex = require("../../utils/escapeRegex");
const pick = require("../../utils/pick");
const ApiError = require("../../utils/ApiError");
const catchAsync = require("../../utils/catchAsync");
const {
  createUser,
  queryUsers,
  deleteUserById,
  hardDeleteUserById,
  getUserById,
  updateUserById,
} = require("../../services/user.service");
const { User } = require("../../models/user.model");
const fs = require('fs');
const path = require('path');

const { sendAccountConfirmationEmail } = require("../../services/email.service");

/**
 * Create a new user
 * POST /v1/admin/user/createUser
 */
const createUsers = catchAsync(async (req, res) => {
  const userData = { ...req.body };

  // Handle image upload
  if (req.file) {
    userData.image = `/uploads/${req.file.filename}`;
  }

  // Generate random 8-character password
  const password = Math.random().toString(36).slice(-8);
  userData.password = password;

  const user = await createUser(userData);

  // Send account confirmation email with credentials
  await sendAccountConfirmationEmail(user.email, user.email, password);

  res.status(httpStatus.CREATED).send({
    success: true,
    message: "User created successfully",
    data: user,
  });
});

/**
 * Get all users with pagination
 * GET /v1/admin/user/getAllUsers?page=1&limit=10&sortBy=createdAt:desc&name=search&subscription=Pro&status=Active&date=2024-06-15
 */
const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["name", "email", "phone"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);

  // Set default options
  options.limit = parseInt(options.limit) || 10;
  options.page = parseInt(options.page) || 1;
  options.sortBy = options.sortBy || 'createdAt:desc';

  // Exclude admin users from listing
  filter.role = { $ne: 'admin' };

  // Exclude soft-deleted users
  filter.isDeleted = { $ne: true };

  // Add search functionality
  if (req.query.search) {
    const searchRegex = escapeRegex(req.query.search);
    filter.$or = [
      { name: { $regex: searchRegex, $options: 'i' } },
      { email: { $regex: searchRegex, $options: 'i' } },
      { phone: { $regex: searchRegex, $options: 'i' } },
    ];
  }

  // Add subscription filter (case-insensitive)
  if (req.query.subscription) {
    filter.subscription = { $regex: new RegExp(`^${req.query.subscription}$`, 'i') };
  }

  // Add status filter (case-insensitive)
  if (req.query.status) {
    filter.status = { $regex: new RegExp(`^${req.query.status}$`, 'i') };
  }

  // Add date filter (filter by specific date)
  if (req.query.date) {
    const filterDate = new Date(req.query.date);
    const startOfDay = new Date(filterDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(filterDate.setHours(23, 59, 59, 999));
    filter.createdAt = {
      $gte: startOfDay,
      $lte: endOfDay,
    };
  }

  const result = await queryUsers(filter, options);

  res.send({
    success: true,
    message: "Users fetched successfully",
    data: result.results,
    page: result.page,
    limit: result.limit,
    totalPages: result.totalPages,
    totalResults: result.totalResults,
  });
});

/**
 * Get single user by ID
 * GET /v1/admin/user/getUserDetails/:userId
 */
const getUser = catchAsync(async (req, res) => {
  const user = await getUserById(req.params.userId, User);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  res.send({
    success: true,
    message: "User fetched successfully",
    data: user,
  });
});

/**
 * Update user by ID
 * PUT /v1/admin/user/updateUser/:userId
 */
const updateUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const updateData = { ...req.body };

  // Check if email is being updated and if it's already taken
  if (updateData.email) {
    const existingUser = await User.findOne({
      email: updateData.email,
      _id: { $ne: userId },
      isDeleted: false
    });

    if (existingUser) {
      return res.status(httpStatus.BAD_REQUEST).send({
        success: false,
        message: "Email is already taken."
      });
    }
  }

  // Handle image upload
  if (req.file) {
    // Delete old image if exists
    const existingUser = await getUserById(userId, User);
    if (existingUser && existingUser.image) {
      const oldImagePath = path.join(__dirname, '../..', existingUser.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    updateData.image = `/uploads/${req.file.filename}`;
  }

  // Don't allow updating password through this endpoint
  delete updateData.password;

  const user = await updateUserById(userId, updateData, User);

  res.send({
    success: true,
    message: "User updated successfully",
    data: user,
  });
});

/**
 * Soft delete user
 * DELETE /v1/admin/user/deleteUser/:userId
 */
const deleteUser = catchAsync(async (req, res) => {
  const result = await deleteUserById(req.params.userId);

  res.send({
    success: true,
    message: result.message,
  });
});

/**
 * Permanently delete user
 * DELETE /v1/admin/user/hardDeleteUser/:userId
 */
const hardDeleteUser = catchAsync(async (req, res) => {
  const result = await hardDeleteUserById(req.params.userId);

  res.send({
    success: true,
    message: result.message,
  });
});

/**
 * Restore soft deleted user
 * PUT /v1/admin/user/restoreUser/:userId
 */
const restoreUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  user.isDeleted = false;
  user.deletedAt = null;
  await user.save();

  res.send({
    success: true,
    message: "User restored successfully",
    data: user,
  });
});

/**
 * Upload user image
 * POST /v1/admin/user/uploadImage/:userId
 */
const uploadImage = catchAsync(async (req, res) => {
  const { userId } = req.params;

  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No file uploaded");
  }

  const user = await getUserById(userId, User);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.image) {
    const oldImagePath = path.join(__dirname, '../..', user.image);
    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }
  }

  user.image = `/uploads/${req.file.filename}`;
  await user.save();

  res.send({
    success: true,
    message: "Image uploaded successfully",
    data: {
      image: user.image,
    },
  });
});

/**
 * Get user statistics
 * GET /v1/admin/user/statistics
 */
const getUserStatistics = catchAsync(async (req, res) => {
  // Exclude admin users from statistics
  const baseFilter = { isDeleted: false, role: { $ne: 'admin' } };

  const totalUsers = await User.countDocuments(baseFilter);
  const activeUsers = await User.countDocuments({ ...baseFilter, status: 'Active' });
  const inactiveUsers = await User.countDocuments({ ...baseFilter, status: 'Inactive' });
  const premiumUsers = await User.countDocuments({ ...baseFilter, subscription: 'Premium' });
  const proUsers = await User.countDocuments({ ...baseFilter, subscription: 'Pro' });
  const freeUsers = await User.countDocuments({ ...baseFilter, subscription: 'Free' });

  res.send({
    success: true,
    data: {
      total: totalUsers,
      active: activeUsers,
      inactive: inactiveUsers,
      premium: premiumUsers,
      pro: proUsers,
      free: freeUsers,
    },
  });
});

module.exports = {
  createUsers,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  hardDeleteUser,
  restoreUser,
  uploadImage,
  getUserStatistics,
};
