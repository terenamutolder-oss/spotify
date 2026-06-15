import express from "express";
import multer from "multer";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { requireAuth } from "./authMiddleware.js";
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
    limits: { fileSize: 32 * 1024 * 1024 }, // 32 MB (Cloud Run request cap)
});

app.use(express.json());

// ---- Health check ----
app.get("/healthz", (_req, res) => res.json({ ok: true }));

// ---- Whether the backend is configured (frontend uses this to decide auth mode) ----
app.get("/api/config", (_req, res) => {
    res.json({ backend: true, bucket: Boolean(process.env.GCS_BUCKET) });
});

// ---- List songs ----
app.get("/api/songs", requireAuth, async (_req, res) => {
    try {
        const songs = await listSongs();
        res.json({ songs });
    } catch (err) {
        console.error("listSongs failed:", err);
        res.status(500).json({ error: "Could not load songs." });
    }
});

// ---- Publish (upload) a song ----
app.post("/api/songs", requireAuth, upload.single("audio"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No audio file provided (field name 'audio')." });
        }
        const title = (req.body.title || "").trim();
        const artist = (req.body.artist || "").trim();
        const album = (req.body.album || "").trim();
        if (!title || !artist) {
            return res.status(400).json({ error: "Title and artist are required." });
        }

        const { storagePath, audioUrl } = await uploadAudio(req.file.buffer, req.file.mimetype);
        const song = await createSong({
            title,
            artist,
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

// ---- Delete a song (uploader only) ----
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

// ---- Static frontend ----
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

// SPA-ish fallback: serve index.html for non-API GET routes.
app.get(/^\/(?!api\/|healthz).*/, (_req, res) => {
    res.sendFile(path.join(ROOT, "index.html"));
});

app.listen(PORT, () => {
    console.log(`Musicfly server listening on port ${PORT}`);
    if (!process.env.GCS_BUCKET) {
        console.warn("WARNING: GCS_BUCKET is not set — uploads and listing will fail until configured.");
    }
});
