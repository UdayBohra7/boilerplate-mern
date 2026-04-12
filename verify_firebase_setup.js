const admin = require('firebase-admin');
const path = require('path');

try {
    // Attempt to require the service account file
    const serviceAccountPath = path.join(__dirname, 'firebase/firebase-adminsdk.json');
    console.log(`Loading service account from: ${serviceAccountPath}`);
    const serviceAccount = require(serviceAccountPath);

    // Attempt to initialize the app
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    }

    console.log('Verification Success: Firebase Admin initialized correctly with the provided JSON file.');
} catch (error) {
    console.error('Verification Failed:', error.message);
    if (error.stack) {
        console.error(error.stack);
    }
    process.exit(1);
}
