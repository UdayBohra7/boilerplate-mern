const admin = require('firebase-admin');
const logger = require('../config/logger');

// Initialize Firebase Admin
// Ensure GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_CONFIG is set in environment
if (!admin.apps.length) {
    try {
        const serviceAccount = require('../../firebase/firebase-adminsdk.json');
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        logger.info('Firebase Admin Initialized');
    } catch (error) {
        logger.warn('Firebase Admin Initialization Failed. Make sure firebase-adminsdk.json exists and is valid.', error);
    }
}

/**
 * Send Push Notification
 * @param {string} token - FCM Token
 * @param {string} title
 * @param {string} body
 * @param {object} data - Optional data payload
 */
const sendPushNotification = async (token, title, body, data = {}) => {
    if (!token) return { success: false, error: 'No token provided' };

    try {
        const message = {
            notification: { title, body },
            data: data || {},
            token,
        };
        const response = await admin.messaging().send(message);
        return { success: true, messageId: response };
    } catch (error) {
        logger.error(`Push Notification Failed for token ${token}: ${error.message}`);
        return { success: false, error: error.message };
    }
};

/**
 * Send Multicast Push Notification (Batch)
 * @param {string[]} tokens - Array of FCM Tokens
 * @param {string} title
 * @param {string} body
 * @param {object} data
 */
const sendMulticastPushNotification = async (tokens, title, body, data = {}) => {
    if (!tokens || tokens.length === 0) return { success: false, error: 'No tokens provided' };

    try {
        const message = {
            notification: { title, body },
            data: data || {},
            tokens,
        };
        const response = await admin.messaging().sendEachForMulticast(message);
        return {
            success: true,
            successCount: response.successCount,
            failureCount: response.failureCount,
            responses: response.responses
        };
    } catch (error) {
        logger.error(`Multicast Push Notification Failed: ${error.message}`);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendPushNotification,
    sendMulticastPushNotification
};
