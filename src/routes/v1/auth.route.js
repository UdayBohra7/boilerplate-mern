const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/auth.controller');
const auth = require('../../middlewares/auth');
const upload = require('../../middlewares/multer');

const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/logout', authController.logout);
router.post('/refresh-tokens', authController.refreshTokens);
router.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword);
router.post('/reset-password/:token', validate(authValidation.resetPassword), authController.resetPassword);
router.post('/send-verification-email', auth(), authController.sendVerificationEmail);
router.post('/verify-email', validate(authValidation.verifyEmail), authController.verifyEmail);
router.get("/me", auth(), authController.authMe)
router.post("/verify-otp/:token", validate(authValidation.verifyotp), authController.verifyOtp)
router.post("/resend-otp", validate(authValidation.resendOtp), authController.resendOtp)

// Registration OTP verification routes
router.post('/verify-registration-otp/:token', validate(authValidation.verifyRegistrationOtp), authController.verifyRegistrationOtp);
router.post('/resend-registration-otp', validate(authValidation.resendRegistrationOtp), authController.resendRegistrationOtp);

// Profile management routes
router.put('/update-profile', auth(), upload.single('image'), validate(authValidation.editProfile), authController.updateProfile);
router.put('/change-password', auth(), validate(authValidation.changePassword), authController.changePassword);
router.post('/user-pref', auth(), validate(authValidation.userPref), authController.userPref)

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register as user
 *     description: Register a new user account. An OTP will be sent to the email for verification.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *               phone:
 *                 type: string
 *                 description: User's phone number
 *             example:
 *               name: Max
 *               email: max@example.com
 *               password: Test@123
 *               phone: "9876543210"
 *               countryCode: "+91"
 *     responses:
 *       "201":
 *         description: Registration successful. OTP sent to email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Registration successful. Please verify your email with the OTP sent to your email address.
 *                 data:
 *                   type: object
 *                   properties:
 *                     verificationToken:
 *                       type: string
 *                       description: Token to be used for OTP verification
 *                     email:
 *                       type: string
 *                       format: email
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login
 *     description: Login with email and password. Email must be verified before login is allowed.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *             example:
 *               email: max@example.com
 *               password: Test@123
 *     responses:
 *       "200":
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *                 message:
 *                   type: string
 *                   example: Logged in Successfully
 *       "401":
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: Invalid email or password
 *       "403":
 *         description: Email not verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Please verify your email before logging in. A new OTP has been sent to your email.
 *                 requiresVerification:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     verificationToken:
 *                       type: string
 *                     email:
 *                       type: string
 *                       format: email
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout
 *     tags: [Auth]
 *     responses:
 *       "204":
 *         description: No content
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /auth/refresh-tokens:
 *   post:
 *     summary: Refresh auth tokens
 *     tags: [Auth]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthTokens'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Forgot password
 *     description: An email will be sent to reset password.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *             example:
 *               email: fake@example.com
 *     responses:
 *       "204":
 *         description: No content
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The reset password token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *             example:
 *               password: Test@123
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         description: Password reset failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: Password reset failed
 */

/**
 * @swagger
 * /auth/send-verification-email:
 *   post:
 *     summary: Send verification email
 *     description: An email will be sent to verify email.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     summary: Verify email
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The verify email token
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         description: Verify email failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: verify email failed
 */

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user profile
 *     description: Get the authenticated user's profile information
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /auth/verify-otp/{token}:
 *   post:
 *     summary: Verify OTP for password reset
 *     description: Verify the OTP sent for password reset
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The reset password token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *             properties:
 *               otp:
 *                 type: string
 *                 description: 6-digit OTP
 *             example:
 *               otp: "123456"
 *     responses:
 *       "200":
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       "400":
 *         description: Invalid or expired OTP
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /auth/resend-otp:
 *   post:
 *     summary: Resend OTP for password reset
 *     description: Resend a new OTP for password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emailToken
 *             properties:
 *               emailToken:
 *                 type: string
 *                 description: Email token received during forgot password
 *             example:
 *               emailToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       "200":
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: string
 *                   description: Reset password token
 *                 message:
 *                   type: string
 *                   example: Otp Sent
 *       "400":
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /auth/verify-registration-otp/{token}:
 *   post:
 *     summary: Verify registration OTP
 *     description: Verify the OTP sent during registration to activate the account
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The verification token received during registration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *             properties:
 *               otp:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 6
 *                 description: 6-digit OTP sent to email
 *             example:
 *               otp: "123456"
 *     responses:
 *       "200":
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Email verified successfully. You can now login.
 *       "400":
 *         description: Invalid or expired OTP
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 400
 *               message: Invalid or expired OTP
 *       "404":
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /auth/resend-registration-otp:
 *   post:
 *     summary: Resend registration OTP
 *     description: Resend a new OTP for email verification during registration
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - verificationToken
 *             properties:
 *               verificationToken:
 *                 type: string
 *                 description: The verification token received during registration
 *             example:
 *               verificationToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       "200":
 *         description: New OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: New OTP sent to your email address.
 *                 data:
 *                   type: object
 *                   properties:
 *                     verificationToken:
 *                       type: string
 *                       description: New verification token
 *                     email:
 *                       type: string
 *                       format: email
 *       "400":
 *         description: Invalid verification token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       "404":
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /auth/update-profile:
 *   put:
 *     summary: Update user profile
 *     description: Update the authenticated user's profile information
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email
 *               phone:
 *                 type: string
 *                 description: User's phone number
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: User's profile picture
 *     responses:
 *       "200":
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "400":
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /auth/change-password:
 *   put:
 *     summary: Change password
 *     description: Change the authenticated user's password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 description: Current password
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: New password (at least one number and one letter)
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 description: Confirm new password (must match newPassword)
 *             example:
 *               currentPassword: oldPassword1
 *               newPassword: newPassword1
 *               confirmPassword: newPassword1
 *     responses:
 *       "200":
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password changed successfully
 *       "400":
 *         description: Bad request (passwords don't match, same as old password, etc.)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Current password is incorrect
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /auth/user-pref:
 *   post:
 *     summary: Update user preferences
 *     description: Update user fitness and health preferences including height, weight, dietary preferences, and workout settings
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - age
 *               - height
 *               - weight
 *               - food_preference
 *               - fitness_goals
 *               - activity_level
 *               - workout_time
 *             properties:
 *               age:
 *                 type: number
 *                 description: User's age in years
 *                 example: 25
 *               height:
 *                 type: number
 *                 description: User's height (in cm or feet based on heightMeasurement)
 *                 example: 175
 *               heightMeasurement:
 *                 type: string
 *                 description: Unit of height measurement
 *                 enum: [cm, ft]
 *                 default: cm
 *                 example: cm
 *               weight:
 *                 type: number
 *                 description: User's weight (in kg or lbs based on weightMeasurement)
 *                 example: 70
 *               weightMeasurement:
 *                 type: string
 *                 description: Unit of weight measurement
 *                 enum: [kg, lbs]
 *                 default: kg
 *                 example: kg
 *               food_preference:
 *                 type: string
 *                 description: User's dietary preference
 *                 enum: [vegetarian, non_vegetarian, vegan, gluten_free, dairy_free, keto]
 *                 example: vegetarian
 *               fitness_goals:
 *                 type: string
 *                 description: User's primary fitness goal
 *                 enum: [weight_loss, maintenance, muscle_gain]
 *                 example: weight_loss
 *               activity_level:
 *                 type: string
 *                 description: User's daily activity level
 *                 enum: [sedentary, moderate, active, very_active]
 *                 example: moderate
 *               workout_time:
 *                 type: string
 *                 description: Preferred time for workouts
 *                 enum: [morning, afternoon, evening, flexible]
 *                 example: morning
 *           examples:
 *             metric:
 *               summary: Metric units example
 *               value:
 *                 age: 25
 *                 height: 175
 *                 heightMeasurement: cm
 *                 weight: 70
 *                 weightMeasurement: kg
 *                 food_preference: vegetarian
 *                 fitness_goals: weight_loss
 *                 activity_level: moderate
 *                 workout_time: morning
 *             imperial:
 *               summary: Imperial units example
 *               value:
 *                 age: 25
 *                 height: 5.9
 *                 heightMeasurement: ft
 *                 weight: 154
 *                 weightMeasurement: lbs
 *                 food_preference: non_vegetarian
 *                 fitness_goals: muscle_gain
 *                 activity_level: very_active
 *                 workout_time: evening
 *     responses:
 *       "200":
 *         description: User preferences updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User preferences updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     age:
 *                       type: number
 *                       example: 25
 *                     height:
 *                       type: number
 *                       example: 175
 *                     heightMeasurement:
 *                       type: string
 *                       example: cm
 *                     weight:
 *                       type: number
 *                       example: 70
 *                     weightMeasurement:
 *                       type: string
 *                       example: kg
 *                     food_preference:
 *                       type: string
 *                       example: vegetarian
 *                     fitness_goals:
 *                       type: string
 *                       example: weight_loss
 *                     activity_level:
 *                       type: string
 *                       example: moderate
 *                     workout_time:
 *                       type: string
 *                       example: morning
 *       "400":
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 400
 *               message: "\"age\" is required"
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
