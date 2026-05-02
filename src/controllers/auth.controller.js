const httpStatus = require('http-status').default || require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');
const { getUserById, checkOtp } = require('../services/user.service');
const { tokenTypes } = require('../config/tokens');
const { generateEmailToken } = require('../services/auth.service');
const jwt = require("jsonwebtoken");
const { User } = require('../models/user.model');
const ApiError = require('../utils/ApiError');

const register = catchAsync(async (req, res) => {
  // Create user with isEmailVerified = false (default)
  const user = await userService.createUser(req.body);

  // Generate verification token and OTP
  const { verificationToken, otp } = await tokenService.generateRegistrationVerificationToken(user, User);

  // Send verification OTP email
  await emailService.sendRegistrationOtpEmail(user.email, otp, user.name);


  res.status(httpStatus.CREATED).send({
    success: true,
    message: 'Registration successful. Please verify your email with the OTP sent to your email address.',
    data: {
      verificationToken,
      email: user.email,
    }
  });
});

const verifyRegistrationOtp = catchAsync(async (req, res) => {
  const { otp } = req.body;
  const { token } = req.params;

  // Verify the token
  const verificationTokenDoc = await tokenService.verifyToken(token, tokenTypes.VERIFY_EMAIL);

  // Get user
  const user = await userService.getUserById(verificationTokenDoc.user, User);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Check if already verified
  if (user.isEmailVerified) {
    return res.status(httpStatus.OK).send({
      success: true,
      message: 'Email is already verified. You can now login.',
    });
  }

  // Verify OTP
  const isValidOtp = await checkOtp(user._id, otp, User);
  if (!isValidOtp || !isValidOtp.success) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid or expired OTP');
  }

  // Update user's email verification status
  const updatedUser = await userService.updateUserById(user._id, { isEmailVerified: true, otp: null }, User);

  // Delete the verification token
  const Token = require('../models/token.model');
  await Token.deleteMany({ user: user._id, type: tokenTypes.VERIFY_EMAIL });

  // Generate auth tokens for the user so the client can be authenticated immediately
  const tokens = await tokenService.generateAuthTokens(updatedUser);
  res.cookie('refreshToken', tokens.refresh.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: tokens.refresh.expires
  });
  const { refresh, ...accessTokens } = tokens;

  res.status(httpStatus.OK).send({
    success: true,
    message: 'Email verified successfully.',
    user: updatedUser,
    tokens: accessTokens,
  });
});

const resendRegistrationOtp = catchAsync(async (req, res) => {
  const { verificationToken } = req.body;

  if (!verificationToken) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Verification token is required');
  }

  // Decode token to get user info (don't verify as it might be expired)
  let decoded;
  try {
    decoded = jwt.verify(verificationToken, process.env.JWT_SECRET);
  } catch (error) {
    // If token expired, try to decode without verification
    decoded = jwt.decode(verificationToken);
  }

  if (!decoded || !decoded.sub) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid verification token');
  }

  // Get user
  const user = await userService.getUserById(decoded.sub, User);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Check if already verified
  if (user.isEmailVerified) {
    return res.status(httpStatus.OK).send({
      success: true,
      message: 'Email is already verified. You can now login.',
    });
  }

  // Delete old verification tokens
  const Token = require('../models/token.model');
  await Token.deleteMany({ user: user._id, type: tokenTypes.VERIFY_EMAIL });

  // Generate new verification token and OTP
  const { verificationToken: newToken, otp } = await tokenService.generateRegistrationVerificationToken(user, User);

  // Send new OTP email
  await emailService.resendRegistrationOtpEmail(user.email, otp);

  res.status(httpStatus.OK).send({
    success: true,
    message: 'New OTP sent to your email address.',
    data: {
      verificationToken: newToken,
      email: user.email,
    }
  });
});

const login = catchAsync(async (req, res) => {
  const { email, password, ...rest } = req.body;
  let user = await authService.loginUserWithEmailAndPassword(email, password, User);
  if (Object.keys(rest).length > 0) {
    user = await userService.updateUserById(user.id, rest, User);
  }

  // Check if email is verified
  if (!user.isEmailVerified) {
    // Generate new verification token for unverified user
    const { verificationToken, otp } = await tokenService.generateRegistrationVerificationToken(user, User);

    // Send OTP email
    await emailService.resendRegistrationOtpEmail(user.email, otp);

    return res.status(httpStatus.OK).send({
      success: false,
      message: 'Please verify your email before logging in. A new OTP has been sent to your email.',
      requiresVerification: true,
      data: {
        verificationToken,
        email: user.email,
      }
    });
  }

  const tokens = await tokenService.generateAuthTokens(user);
  res.cookie('refreshToken', tokens.refresh.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: tokens.refresh.expires
  });
  const { refresh, ...accessTokens } = tokens;
  res.send({ user, tokens: accessTokens, message: "Logged in Successfully" });
});

const logout = catchAsync(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  res.clearCookie('refreshToken');
  if (refreshToken) {
    await authService.logout(refreshToken);
  }
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
  const tokens = await authService.refreshAuth(refreshToken);
  res.cookie('refreshToken', tokens.refresh.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: tokens.refresh.expires
  });
  const { refresh, ...accessTokens } = tokens;
  res.send({ ...accessTokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email, User);
  const emailToken = await generateEmailToken(req.body.email, User)
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(200).send({
    success: true, data: {
      resetToken: resetPasswordToken.resetPasswordToken,
      emailToken,
      message: "Otp Sent"
    }
  });
});

const resendOtp = catchAsync(async (req, res) => {
  const { emailToken } = req.body;
  if (!emailToken) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }
  const decoded = jwt.verify(emailToken, process.env.JWT_SECRET);
  const resetPasswordToken = await tokenService.generateResetPasswordToken(decoded.email, User);

  await emailService.sendResetPasswordEmail(decoded.email, resetPasswordToken);

  res.status(200).send({ success: true, data: resetPasswordToken.resetPasswordToken, message: "Otp Sent" });
})

const verifyOtp = catchAsync(async (req, res) => {
  const { otp } = req.body
  const resetPasswordTokenDoc = await tokenService.verifyToken(req.params.token, tokenTypes.RESET_PASSWORD);
  const user = await userService.getUserById(resetPasswordTokenDoc.user, User);
  if (!user) {
    throw new Error();
  }
  const validOtp = await checkOtp(user._id, otp, User)
  res.status(200).send(validOtp)
})

const resetPassword = catchAsync(async (req, res) => {
  // Use token from params, fallback to body if needed
  const token = req.params.token || req.body.resetPasswordToken;
  const data = await authService.resetPassword(token, req.body.password, User);
  if (data?.message) return res.status(httpStatus.BAD_REQUEST).send({ message: data.message });
  res.status(httpStatus.OK).send({ success: true, message: "Password Reset Successfully" });
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token, User);
  res.status(httpStatus.NO_CONTENT).send();
});
const authMe = catchAsync(async (req, res) => {
  const data = await getUserById(req.user.id, User)
  res.send({ data: data })
})

const updateProfile = catchAsync(async (req, res) => {
  const updateData = { ...req.body };

  if (req.file) {
    updateData.image = `/uploads/${req.file.filename}`;
  }

  const user = await userService.updateUserById(req.user.id, updateData, User);
  res.send({
    success: true,
    message: 'Profile updated successfully',
    data: user
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  // Validate confirm password
  if (newPassword !== confirmPassword) {
    return res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      message: 'New password and confirm password do not match'
    });
  }

  // Get user with password
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(httpStatus.NOT_FOUND).send({
      success: false,
      message: 'User not found'
    });
  }

  // Verify current password
  const isMatch = await user.isPasswordMatch(currentPassword);
  if (!isMatch) {
    return res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  // Check if new password is same as old
  const isSamePassword = await user.isPasswordMatch(newPassword);
  if (isSamePassword) {
    return res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      message: 'New password cannot be same as the current password'
    });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.send({
    success: true,
    message: 'Password changed successfully'
  });
});

const userPref = catchAsync(async (req, res) => {
  const pref = req.body;
  const updateData = { ...pref, pref_completed: true };
  const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true });
  res.send({
    success: true,
    message: 'User preferences updated successfully',
    data: user
  });
})

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  verifyOtp,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  authMe,
  resendOtp,
  updateProfile,
  changePassword,
  verifyRegistrationOtp,
  resendRegistrationOtp,
  userPref,
};
