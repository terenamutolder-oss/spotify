import admin from "firebase-admin";

/**
 * Firebase Admin — shared backend for:
 *   • Firebase Auth  (accounts / login tokens)
 *   • Firestore      (user profiles, song/podcast metadata, playlists)
 *   • Firebase Storage (music + podcast audio files)
 *
 * Uses Application Default Credentials (ADC).
 * On Cloud Run the runtime service account provides credentials automatically.
 * Locally: `gcloud auth application-default login` or GOOGLE_APPLICATION_CREDENTIALS.
 */
let app = null;

function projectId() {
    return process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT;
}

export function getAdmin() {
    if (!app) {
        const pid = projectId();
        app = admin.initializeApp({
            projectId: pid,
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET || process.env.GCS_BUCKET || (pid ? `${pid}.appspot.com` : undefined),
        });
    }
    return admin;
}

export function getAuth() {
    return getAdmin().auth();
}

export function getFirestore() {
    return getAdmin().firestore();
}
