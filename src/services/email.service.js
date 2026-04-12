const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');

const transport = nodemailer.createTransport(config.email.smtp);
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text) => {
  const msg = { from: config.email.from, to, subject, text };
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password';
  const resetPasswordUrl = `http://link-to-app/reset-password?token=${token.resetPasswordToken}`;
  const text = `Dear user,
To reset your password, Here is your otp: ${token.otp}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
  console.log()
};

const sendAccountConfirmationEmail = async (to, email, password) => {
  const subject = 'Account Creation';
  const text = `Dear user,
Your account has been created by admin 
Here is your credentials,
Email :${email} , Password: ${password} `
  await sendEmail(to, subject, text);
};


/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token) => {
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

/**
 * Send registration verification OTP email
 * @param {string} to
 * @param {string} otp
 * @param {string} name
 * @returns {Promise}
 */
const sendRegistrationOtpEmail = async (to, otp, name) => {
  const subject = 'Verify Your Email - Registration OTP';
  const text = `Dear ${name || 'User'},

Welcome! Thank you for registering with us.

To complete your registration, please verify your email address using the OTP below:

Your OTP: ${otp}

This OTP is valid for 10 minutes. Please do not share this code with anyone.

If you did not create an account, please ignore this email.

Best regards,
The Team`;
  await sendEmail(to, subject, text);
};

/**
 * Resend registration verification OTP email
 * @param {string} to
 * @param {string} otp
 * @returns {Promise}
 */
const resendRegistrationOtpEmail = async (to, otp) => {
  const subject = 'Your New Verification OTP';
  const text = `Dear User,

Here is your new verification OTP:

Your OTP: ${otp}

This OTP is valid for 10 minutes. Please do not share this code with anyone.

If you did not request this, please ignore this email.

Best regards,
The Team`;
  await sendEmail(to, subject, text);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendAccountConfirmationEmail,
  sendRegistrationOtpEmail,
  resendRegistrationOtpEmail,
};
