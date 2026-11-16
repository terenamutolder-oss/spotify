import { randomUUID } from "node:crypto";
import { getFirestore } from "./firebase.js";
import { getMediaBucket, publicMediaUrl } from "./mediaBucket.js";

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
 * Uploads an audio buffer to Firebase Storage as a public object.
 */
export async function uploadAudio(buffer, mimeType) {
    const ext = EXT_BY_MIME[mimeType] || "mp3";
    const objectName = `music/${randomUUID()}.${ext}`;
    const file = getMediaBucket().file(objectName);

    await file.save(buffer, {
        resumable: false,
        contentType: mimeType || "audio/mpeg",
        metadata: { cacheControl: "public, max-age=31536000, immutable" },
    });

    try {
        await file.makePublic();
    } catch (err) {
        throw new Error(
            "Could not make the uploaded file public. In Firebase Console → Storage, " +
                "ensure the bucket allows public reads (see DEPLOY.md). " +
                `(${err.message})`
        );
    }

    return { storagePath: objectName, audioUrl: publicMediaUrl(objectName) };
}

export async function deleteAudio(storagePath) {
    if (!storagePath) return;
    await getMediaBucket().file(storagePath).delete({ ignoreNotFound: true });
}

export async function createSong(meta) {
    const doc = {
        title: meta.title,
        artist: meta.artist,
        author: meta.author || meta.uploaderName || meta.artist,
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
            author: data.author || data.uploaderName || data.artist,
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
