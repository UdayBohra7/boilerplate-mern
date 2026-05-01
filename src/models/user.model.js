const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      private: true,
    },
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },
    image: {
      type: String,
      default: null
    },
    phone: {
      type: String,
    },
    countryCode: {
      type: String,
    },
    age: {
      type: Number,
    },
    height: {
      type: String,
    },
    // heightMeasurement: {
    //   type: String,
    //   enum: ['cm', 'ft'],
    //   default: 'cm',
    // },
    weight: {
      type: Number,
    },
    targetWeight: {
      type: Number,
    },
    weightMeasurement: {
      type: String,
      enum: ['KG', 'LBS'],
      default: 'KG',
    },
    targetSteps: {
      type: Number,
    },
    food_preference: {
      type: String,
    },
    fitness_goals: {
      type: String,
    },
    activity_level: {
      type: String,
    },
    workout_time: {
      type: String,
    },
    pref_completed: {
      type: Boolean,
      default: false,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Inactive"
    },
    subscription: {
      type: String,
      enum: ["Free", "Pro", "Premium"],
      default: "Free",
    },
    fcmToken: {
      type: String,
      default: null
    },
    isDeleted: {
      type: Boolean,
      default: false,
    }
  }, { timestamps: true }
);

// add plugin that converts mongoose to json
// userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
/**
* Check if email is taken (excluding empty emails)
* @param {string} email - The user's email
* @param {ObjectId} [excludeUserId] - The id of the user to be excluded
* @returns {Promise<boolean>}
*/
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  if (!email) {
    return false;
  }
  const user = await this.findOne({
    email: { $ne: null, $ne: '' },
    email,
    _id: { $ne: excludeUserId },
  });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});


/**
 * @typedef 
 */
const User = mongoose.model('User', userSchema); //admin


module.exports = { User };
