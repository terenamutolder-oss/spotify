import express from "express";
import multer from "multer";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { requireAuth } from "./authMiddleware.js";
import { requireAge16 } from "./ageMiddleware.js";
import { getUser, ensureUser, setBirthDate } from "./users.js";
import {
    listPlaylistsForUser,
    getPlaylist,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
} from "./playlists.js";
import {
    listPodcasts,
    listPodcastsForUser,
    getPodcast,
    createPodcast,
    deletePodcast,
    listEpisodes,
    addEpisode,
} from "./podcasts.js";
import { getBucketName } from "./mediaBucket.js";
import {
    uploadAudio,
    deleteAudio,
    createSong,
    listSongs,
    getSong,
    deleteSong,
} from "./storage.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const app = express();
const PORT = process.env.PORT || 8080;

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 32 * 1024 * 1024 },
});

app.use(express.json());

app.get("/healthz", (_req, res) => res.json({ ok: true }));

app.get("/api/config", (_req, res) => {
    const bucket = getBucketName();
    res.json({
        backend: true,
        firebase: true,
        storage: "firebase",
        bucket: Boolean(bucket),
        bucketName: bucket || null,
    });
});

// ---- User profile ----
app.get("/api/me", requireAuth, async (req, res) => {
    try {
        let profile = await getUser(req.user.uid);
        if (!profile) {
            profile = await ensureUser(req.user.uid, {
                email: req.user.email,
                name: req.user.name,
            });
        }
        res.json({ user: profile });
    } catch (err) {
        console.error("get profile failed:", err);
        res.status(500).json({ error: "Could not load profile." });
    }
});

app.post("/api/me", requireAuth, async (req, res) => {
    try {
        const { birthDate } = req.body || {};
        if (!birthDate) {
            return res.status(400).json({ error: "birthDate is required (YYYY-MM-DD)." });
        }
        const user = await setBirthDate(req.user.uid, birthDate);
        res.json({ user });
    } catch (err) {
        res.status(400).json({ error: err.message || "Could not update profile." });
    }
});

// ---- Songs ----
// Public read — visitors can browse and listen without an account.
app.get("/api/songs", async (_req, res) => {
    try {
        const songs = await listSongs();
        res.json({ songs });
    } catch (err) {
        console.error("listSongs failed:", err);
        res.status(500).json({ error: "Could not load songs." });
    }
});

// Any signed-in user can upload music (age gate applies to podcasts/folders only).
app.post("/api/songs", requireAuth, upload.single("audio"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No audio file provided (field name 'audio')." });
        }
        const title = (req.body.title || "").trim();
        const artist = (req.body.artist || "").trim();
        const author = (req.body.author || req.user.name || artist).trim();
        const album = (req.body.album || "").trim();
        if (!title || !artist) {
            return res.status(400).json({ error: "Title and artist are required." });
        }

        const { storagePath, audioUrl } = await uploadAudio(req.file.buffer, req.file.mimetype);
        const song = await createSong({
            title,
            artist,
            author,
            album,
            storagePath,
            audioUrl,
            uploaderUid: req.user.uid,
            uploaderName: req.user.name,
        });
        res.status(201).json({ song });
    } catch (err) {
        console.error("upload failed:", err);
        res.status(500).json({ error: err.message || "Upload failed." });
    }
});

app.delete("/api/songs/:id", requireAuth, async (req, res) => {
    try {
        const song = await getSong(req.params.id);
        if (!song) return res.status(404).json({ error: "Song not found." });
        if (song.uploaderUid !== req.user.uid) {
            return res.status(403).json({ error: "You can only delete songs you uploaded." });
        }
        await deleteAudio(song.storagePath);
        await deleteSong(req.params.id);
        res.json({ ok: true });
    } catch (err) {
        console.error("delete failed:", err);
        res.status(500).json({ error: "Delete failed." });
    }
});

// ---- Playlists & folders ----
app.get("/api/playlists", requireAuth, async (req, res) => {
    try {
        const playlists = await listPlaylistsForUser(req.user.uid);
        res.json({ playlists });
    } catch (err) {
        console.error("listPlaylists failed:", err);
        res.status(500).json({ error: "Could not load playlists." });
    }
});

app.post("/api/playlists", requireAuth, requireAge16, async (req, res) => {
    try {
        const { name, description, type, parentId, songIds } = req.body || {};
        if (!name || !String(name).trim()) {
            return res.status(400).json({ error: "Name is required." });
        }
        const playlist = await createPlaylist({
            name: String(name).trim(),
            description,
            type: type === "folder" ? "folder" : "playlist",
            ownerUid: req.user.uid,
            ownerName: req.user.name,
            parentId: parentId || null,
            songIds: songIds || [],
        });
        res.status(201).json({ playlist });
    } catch (err) {
        console.error("createPlaylist failed:", err);
        res.status(500).json({ error: "Could not create playlist." });
    }
});

app.patch("/api/playlists/:id", requireAuth, async (req, res) => {
    try {
        const playlist = await updatePlaylist(req.params.id, req.user.uid, req.body || {});
        if (!playlist) return res.status(404).json({ error: "Playlist not found." });
        res.json({ playlist });
    } catch (err) {
        if (err.message === "FORBIDDEN") {
            return res.status(403).json({ error: "You can only edit your own playlists." });
        }
        res.status(500).json({ error: "Could not update playlist." });
    }
});

app.delete("/api/playlists/:id", requireAuth, async (req, res) => {
    try {
        const ok = await deletePlaylist(req.params.id, req.user.uid);
        if (!ok) return res.status(404).json({ error: "Playlist not found." });
        res.json({ ok: true });
    } catch (err) {
        if (err.message === "FORBIDDEN") {
            return res.status(403).json({ error: "You can only delete your own playlists." });
        }
        res.status(500).json({ error: "Could not delete playlist." });
    }
});

// ---- Podcasts ----
app.get("/api/podcasts", async (_req, res) => {
    try {
        const podcasts = await listPodcasts();
        res.json({ podcasts });
    } catch (err) {
        console.error("listPodcasts failed:", err);
        res.status(500).json({ error: "Could not load podcasts." });
    }
});

app.post("/api/podcasts", requireAuth, requireAge16, async (req, res) => {
    try {
        const { title, description, author } = req.body || {};
        if (!title || !String(title).trim()) {
            return res.status(400).json({ error: "Title is required." });
        }
        const podcast = await createPodcast({
            title: String(title).trim(),
            description,
            author: author || req.user.name,
            ownerUid: req.user.uid,
            ownerName: req.user.name,
        });
        res.status(201).json({ podcast });
    } catch (err) {
        console.error("createPodcast failed:", err);
        res.status(500).json({ error: "Could not create podcast." });
    }
});

app.get("/api/podcasts/:id", async (req, res) => {
    try {
        const podcast = await getPodcast(req.params.id);
        if (!podcast) return res.status(404).json({ error: "Podcast not found." });
        const episodes = await listEpisodes(req.params.id);
        res.json({ podcast, episodes });
    } catch (err) {
        res.status(500).json({ error: "Could not load podcast." });
    }
});

app.post("/api/podcasts/:id/episodes", requireAuth, requireAge16, upload.single("audio"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No audio file provided." });
        }
        const title = (req.body.title || "").trim();
        if (!title) return res.status(400).json({ error: "Episode title is required." });
        const episode = await addEpisode(req.params.id, req.user.uid, {
            title,
            description: req.body.description,
            episodeNumber: req.body.episodeNumber || 1,
            buffer: req.file.buffer,
            mimeType: req.file.mimetype,
        });
        if (!episode) return res.status(404).json({ error: "Podcast not found." });
        res.status(201).json({ episode });
    } catch (err) {
        if (err.message === "FORBIDDEN") {
            return res.status(403).json({ error: "You can only add episodes to your own podcasts." });
        }
        console.error("addEpisode failed:", err);
        res.status(500).json({ error: err.message || "Could not upload episode." });
    }
});

app.delete("/api/podcasts/:id", requireAuth, async (req, res) => {
    try {
        const ok = await deletePodcast(req.params.id, req.user.uid);
        if (!ok) return res.status(404).json({ error: "Podcast not found." });
        res.json({ ok: true });
    } catch (err) {
        if (err.message === "FORBIDDEN") {
            return res.status(403).json({ error: "You can only delete your own podcasts." });
        }
        res.status(500).json({ error: "Could not delete podcast." });
    }
});

app.use(
    express.static(ROOT, {
        index: "index.html",
        setHeaders(res, filePath) {
            if (filePath.endsWith(".html")) {
                res.setHeader("Cache-Control", "no-store");
            }
        },
    })
);

app.get(/^\/(?!api\/|healthz).*/, (_req, res) => {
    res.sendFile(path.join(ROOT, "index.html"));
});

app.listen(PORT, () => {
    console.log(`Musicfly server listening on port ${PORT}`);
    const bucket = getBucketName();
    if (!bucket) {
        console.warn(
            "WARNING: Firebase Storage bucket is not configured. Set GCLOUD_PROJECT " +
                "(uses <project>.appspot.com) or FIREBASE_STORAGE_BUCKET. See DEPLOY.md."
        );
    } else {
        console.log(`Firebase Storage bucket: ${bucket}`);
    }
});
