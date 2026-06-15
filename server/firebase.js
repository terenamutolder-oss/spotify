import admin from "firebase-admin";

/**
 * Initializes Firebase Admin using Application Default Credentials (ADC).
 *
 * On Cloud Run the runtime service account provides credentials automatically.
 * Locally, set GOOGLE_APPLICATION_CREDENTIALS to a service-account key, or run
 * `gcloud auth application-default login`.
 */
let app = null;

export function getAdmin() {
    if (!app) {
        app = admin.initializeApp({
            projectId: process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT,
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
