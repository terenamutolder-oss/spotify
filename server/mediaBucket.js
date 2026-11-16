import { getAdmin } from "./firebase.js";

/** GCP / Firebase project id (shared by Auth, Firestore, and Storage). */
export function getProjectId() {
    return process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT || null;
}

/**
 * Firebase Storage bucket name.
 * Defaults to the Firebase default bucket: `<projectId>.appspot.com`
 * (same value as `storageBucket` in firebase-config.js).
 */
export function getBucketName() {
    return (
        process.env.FIREBASE_STORAGE_BUCKET ||
        process.env.GCS_BUCKET ||
        (getProjectId() ? `${getProjectId()}.appspot.com` : null)
    );
}

/** Firebase Admin Storage bucket — used for music + podcast audio files. */
export function getMediaBucket() {
    const name = getBucketName();
    if (!name) {
        throw new Error(
            "Firebase Storage bucket is not configured. Set GCLOUD_PROJECT, " +
                "FIREBASE_STORAGE_BUCKET, or GCS_BUCKET. See DEPLOY.md."
        );
    }
    return getAdmin().storage().bucket(name);
}

/** Public HTTPS URL for a stored object (works with Firebase Storage buckets). */
export function publicMediaUrl(objectName) {
    return `https://storage.googleapis.com/${getBucketName()}/${objectName}`;
}
