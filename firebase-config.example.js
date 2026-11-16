/*
 * Copy this file to `firebase-config.js` and paste in your Firebase web app config.
 * Find it in: Firebase console → Project settings → General → "Your apps" → Web app → SDK setup.
 *
 * These values are PUBLIC by design (safe to commit / ship to the browser).
 *
 * With real values configured:
 *   • Firebase Auth  → accounts (email/password + Google login)
 *   • Firestore      → user profiles, playlists, song/podcast metadata (via API)
 *   • Firebase Storage → music & podcast audio files (via API uploads)
 *
 * With placeholders below, Musicfly runs in local demo mode (browser-only accounts).
 */
window.FIREBASE_CONFIG = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
};

// Leave empty when Cloud Run serves both the site and the API on the same origin.
window.MUSICFLY_API_BASE = "";
