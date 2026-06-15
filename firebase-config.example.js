/*
 * Copy this file to `firebase-config.js` and paste in your Firebase web app config.
 * Find it in: Firebase console → Project settings → General → "Your apps" → Web app → SDK setup.
 *
 * These values are PUBLIC by design (safe to commit / ship to the browser).
 * If you leave the placeholders below, Musicfly runs in static demo mode (no login).
 */
window.FIREBASE_CONFIG = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
};

// Optional: set if your API is hosted on a different origin than the frontend.
// Leave empty when the Cloud Run service serves both the site and the API.
window.MUSICFLY_API_BASE = "";
