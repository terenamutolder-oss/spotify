import { getFirestore } from "./firebase.js";

function playlistsCollection() {
    return getFirestore().collection("playlists");
}

function serialize(doc) {
    const data = doc.data();
    return {
        id: doc.id,
        name: data.name,
        description: data.description || "",
        type: data.type || "playlist",
        ownerUid: data.ownerUid,
        ownerName: data.ownerName || "You",
        songIds: data.songIds || [],
        parentId: data.parentId || null,
        createdAt: data.createdAt?.toDate?.()?.toISOString?.() || null,
    };
}

export async function listPlaylistsForUser(uid) {
    const snap = await playlistsCollection().where("ownerUid", "==", uid).get();
    return snap.docs.map(serialize).sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}

export async function getPlaylist(id) {
    const doc = await playlistsCollection().doc(id).get();
    if (!doc.exists) return null;
    return serialize(doc);
}

export async function createPlaylist({ name, description, type, ownerUid, ownerName, parentId, songIds }) {
    const doc = {
        name: name.trim(),
        description: (description || "").trim(),
        type: type === "folder" ? "folder" : "playlist",
        ownerUid,
        ownerName,
        songIds: songIds || [],
        parentId: parentId || null,
        createdAt: new Date(),
    };
    const ref = await playlistsCollection().add(doc);
    return { id: ref.id, ...doc, createdAt: doc.createdAt.toISOString() };
}

export async function updatePlaylist(id, uid, updates) {
    const existing = await getPlaylist(id);
    if (!existing) return null;
    if (existing.ownerUid !== uid) {
        throw new Error("FORBIDDEN");
    }
    const patch = {};
    if (updates.name !== undefined) patch.name = String(updates.name).trim();
    if (updates.description !== undefined) patch.description = String(updates.description).trim();
    if (updates.songIds !== undefined) patch.songIds = updates.songIds;
    if (updates.parentId !== undefined) patch.parentId = updates.parentId || null;
    await playlistsCollection().doc(id).update(patch);
    return getPlaylist(id);
}

export async function deletePlaylist(id, uid) {
    const existing = await getPlaylist(id);
    if (!existing) return false;
    if (existing.ownerUid !== uid) {
        throw new Error("FORBIDDEN");
    }
    await playlistsCollection().doc(id).delete();
    return true;
}
