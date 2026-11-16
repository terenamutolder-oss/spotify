import { randomUUID } from "node:crypto";
import { getFirestore } from "./firebase.js";
import { getMediaBucket, publicMediaUrl } from "./mediaBucket.js";

function podcastsCollection() {
    return getFirestore().collection("podcasts");
}

const EXT_BY_MIME = {
    "audio/mpeg": "mp3",
    "audio/mp3": "mp3",
    "audio/wav": "wav",
    "audio/x-wav": "wav",
    "audio/ogg": "ogg",
    "audio/mp4": "m4a",
    "audio/aac": "aac",
};

function serializePodcast(doc) {
    const data = doc.data();
    return {
        id: doc.id,
        title: data.title,
        description: data.description || "",
        author: data.author || data.ownerName || "Podcaster",
        ownerUid: data.ownerUid,
        ownerName: data.ownerName || "You",
        createdAt: data.createdAt?.toDate?.()?.toISOString?.() || null,
        episodeCount: data.episodeCount || 0,
    };
}

function serializeEpisode(doc, podcastId) {
    const data = doc.data();
    return {
        id: doc.id,
        podcastId,
        title: data.title,
        description: data.description || "",
        episodeNumber: data.episodeNumber || 1,
        audioUrl: data.audioUrl,
        duration: data.duration || null,
        createdAt: data.createdAt?.toDate?.()?.toISOString?.() || null,
    };
}

export async function listPodcasts() {
    const snap = await podcastsCollection().orderBy("createdAt", "desc").get();
    return snap.docs.map(serializePodcast);
}

export async function listPodcastsForUser(uid) {
    const snap = await podcastsCollection().where("ownerUid", "==", uid).get();
    return snap.docs.map(serializePodcast);
}

export async function getPodcast(id) {
    const doc = await podcastsCollection().doc(id).get();
    if (!doc.exists) return null;
    return serializePodcast(doc);
}

export async function createPodcast({ title, description, author, ownerUid, ownerName }) {
    const doc = {
        title: title.trim(),
        description: (description || "").trim(),
        author: (author || ownerName || "Podcaster").trim(),
        ownerUid,
        ownerName,
        episodeCount: 0,
        createdAt: new Date(),
    };
    const ref = await podcastsCollection().add(doc);
    return { id: ref.id, ...doc, createdAt: doc.createdAt.toISOString() };
}

export async function deletePodcast(id, uid) {
    const podcast = await getPodcast(id);
    if (!podcast) return false;
    if (podcast.ownerUid !== uid) throw new Error("FORBIDDEN");

    const episodes = await podcastsCollection().doc(id).collection("episodes").get();
    for (const ep of episodes.docs) {
        const data = ep.data();
        if (data.storagePath) {
            await getMediaBucket().file(data.storagePath).delete({ ignoreNotFound: true });
        }
    }
    await podcastsCollection().doc(id).delete();
    return true;
}

export async function listEpisodes(podcastId) {
    const snap = await podcastsCollection()
        .doc(podcastId)
        .collection("episodes")
        .orderBy("episodeNumber", "asc")
        .get();
    return snap.docs.map((d) => serializeEpisode(d, podcastId));
}

async function uploadEpisodeAudio(buffer, mimeType) {
    const ext = EXT_BY_MIME[mimeType] || "mp3";
    const objectName = `podcasts/${randomUUID()}.${ext}`;
    const file = getMediaBucket().file(objectName);
    await file.save(buffer, {
        resumable: false,
        contentType: mimeType || "audio/mpeg",
        metadata: { cacheControl: "public, max-age=31536000, immutable" },
    });
    try {
        await file.makePublic();
    } catch (err) {
        throw new Error(`Could not make podcast episode public. (${err.message})`);
    }
    return {
        storagePath: objectName,
        audioUrl: publicMediaUrl(objectName),
    };
}

export async function addEpisode(podcastId, uid, { title, description, episodeNumber, buffer, mimeType }) {
    const podcast = await getPodcast(podcastId);
    if (!podcast) return null;
    if (podcast.ownerUid !== uid) throw new Error("FORBIDDEN");

    const { storagePath, audioUrl } = await uploadEpisodeAudio(buffer, mimeType);
    const doc = {
        title: title.trim(),
        description: (description || "").trim(),
        episodeNumber: Number(episodeNumber) || 1,
        storagePath,
        audioUrl,
        createdAt: new Date(),
    };
    const ref = await podcastsCollection().doc(podcastId).collection("episodes").add(doc);
    await podcastsCollection().doc(podcastId).update({
        episodeCount: (podcast.episodeCount || 0) + 1,
    });
    return { id: ref.id, podcastId, ...doc, createdAt: doc.createdAt.toISOString() };
}
