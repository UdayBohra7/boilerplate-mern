const Joi = require('joi');
const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    phone: Joi.string().required(),
    countryCode: Joi.string().required(),
    fcmToken: Joi.string().optional().allow(""),
  }),
};

const userPref = {
  body: Joi.object().keys({
    age: Joi.number().required(),
    height: Joi.string().required(),
    targetSteps: Joi.number().required(),
    weight: Joi.number().required(),
    targetWeight: Joi.number().required(),
    weightMeasurement: Joi.string().valid('KG', 'LBS').optional(),
    food_preference: Joi.string().required(),
    fitness_goals: Joi.string().required(),
    activity_level: Joi.string().required(),
    // workout_time: Joi.string().optional(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
    fcmToken: Joi.string().optional().allow(""),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  params: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
    resetPasswordToken: Joi.string().optional(),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};
const verifyotp = {
  params: Joi.object().keys({
    token: Joi.string().required(), // Token passed in URL
  }),
  body: Joi.object().keys({
    otp: Joi.string().required(), // OTP passed in body
  }),
}

const createAttendents = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    age: Joi.string().required(),
    phone: Joi.string().required(),
    tagId: Joi.string(),
    status: Joi.string()
  })
}

const resendOtp = {
  body: Joi.object().keys({
    emailToken: Joi.string().required()
  })
}

const editProfile = {
  body: Joi.object().keys({
    name: Joi.string(),
    firstName: Joi.string().allow('').optional(),
    lastName: Joi.string().allow('').optional(),
    email: Joi.string().email(),
    phone: Joi.string().allow('').optional(),
    countryCode: Joi.string().allow('').optional(),
    image: Joi.string().allow('').optional()
  })
}

const changePassword = {
  body: Joi.object().keys({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().required().custom(password),
    confirmPassword: Joi.string().required()
  })
}

const loginWithQr = {
  body: Joi.object().keys({
    tagId: Joi.string().required()
  })
}

const verifyRegistrationOtp = {
  params: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    otp: Joi.string().required().length(6),
  }),
};

const resendRegistrationOtp = {
  body: Joi.object().keys({
    verificationToken: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  verifyotp,
  createAttendents,
  resendOtp,
  editProfile,
  changePassword,
  loginWithQr,
  verifyRegistrationOtp,
  resendRegistrationOtp,
  userPref
};
