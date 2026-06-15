import { Storage } from "@google-cloud/storage";
import { randomUUID } from "node:crypto";
import { getFirestore } from "./firebase.js";

const BUCKET_NAME = process.env.GCS_BUCKET;
const storage = new Storage();

function bucket() {
    if (!BUCKET_NAME) {
        throw new Error("GCS_BUCKET environment variable is not set.");
    }
    return storage.bucket(BUCKET_NAME);
}

function songsCollection() {
    return getFirestore().collection("songs");
}

const EXT_BY_MIME = {
    "audio/mpeg": "mp3",
    "audio/mp3": "mp3",
    "audio/wav": "wav",
    "audio/x-wav": "wav",
    "audio/ogg": "ogg",
    "audio/flac": "flac",
    "audio/x-flac": "flac",
    "audio/mp4": "m4a",
    "audio/aac": "aac",
};

/**
 * Uploads an audio buffer to GCS as a public object and returns its public URL.
 */
export async function uploadAudio(buffer, mimeType) {
    const ext = EXT_BY_MIME[mimeType] || "mp3";
    const objectName = `audio/${randomUUID()}.${ext}`;
    const file = bucket().file(objectName);

    await file.save(buffer, {
        resumable: false,
        contentType: mimeType || "audio/mpeg",
        metadata: { cacheControl: "public, max-age=31536000, immutable" },
    });

    // Make the object publicly readable so the <audio> element can stream it
    // directly (GCS handles HTTP Range requests for seeking).
    try {
        await file.makePublic();
    } catch (err) {
        // Buckets with uniform bucket-level access reject per-object ACLs;
        // in that case grant allUsers objectViewer at the bucket level instead
        // (documented in DEPLOY.md). Surface a clear error either way.
        throw new Error(
            "Could not make the uploaded file public. If the bucket uses uniform " +
                "bucket-level access, grant 'roles/storage.objectViewer' to allUsers on the bucket. " +
                `(${err.message})`
        );
    }

    const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${objectName}`;
    return { storagePath: objectName, audioUrl: publicUrl };
}

export async function deleteAudio(storagePath) {
    if (!storagePath) return;
    await bucket()
        .file(storagePath)
        .delete({ ignoreNotFound: true });
}

export async function createSong(meta) {
    const doc = {
        title: meta.title,
        artist: meta.artist,
        album: meta.album || "Single",
        storagePath: meta.storagePath,
        audioUrl: meta.audioUrl,
        uploaderUid: meta.uploaderUid,
        uploaderName: meta.uploaderName,
        createdAt: new Date(),
    };
    const ref = await songsCollection().add(doc);
    return { id: ref.id, ...doc };
}

export async function listSongs() {
    const snap = await songsCollection().orderBy("createdAt", "desc").get();
    return snap.docs.map((d) => {
        const data = d.data();
        return {
            id: d.id,
            title: data.title,
            artist: data.artist,
            album: data.album,
            audioUrl: data.audioUrl,
            uploaderUid: data.uploaderUid,
            uploaderName: data.uploaderName,
            createdAt: data.createdAt?.toDate?.()?.toISOString?.() || null,
        };
    });
}

export async function getSong(id) {
    const doc = await songsCollection().doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
}

export async function deleteSong(id) {
    await songsCollection().doc(id).delete();
}
