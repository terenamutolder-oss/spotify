/*
 * Seeds Firestore + Firebase Storage with the bundled MP3s in ../songs.
 *
 * Usage (after configuring Firebase — see DEPLOY.md):
 *   GCLOUD_PROJECT=your-project node scripts/seed.js
 *
 * Optional: FIREBASE_STORAGE_BUCKET=your-project.appspot.com
 */
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import admin from "firebase-admin";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SONGS_DIR = path.join(__dirname, "..", "songs");

const PROJECT_ID = process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT;
const BUCKET =
    process.env.FIREBASE_STORAGE_BUCKET ||
    process.env.GCS_BUCKET ||
    (PROJECT_ID ? `${PROJECT_ID}.appspot.com` : null);

if (!PROJECT_ID || !BUCKET) {
    console.error("Set GCLOUD_PROJECT (and optionally FIREBASE_STORAGE_BUCKET). See DEPLOY.md.");
    process.exit(1);
}

// filename (in songs/) → metadata
const MANIFEST = {
    "thriller.mp3": { title: "Thriller", artist: "Michael Jackson", album: "Thriller" },
    "beat-it.mp3": { title: "Beat It", artist: "Michael Jackson", album: "Thriller" },
    "billie-jean.mp3": { title: "Billie Jean", artist: "Michael Jackson", album: "Thriller" },
    "smooth-criminal.mp3": { title: "Smooth Criminal", artist: "Michael Jackson", album: "Bad" },
    "dont-stop.mp3": { title: "Don't Stop 'Til You Get Enough", artist: "Michael Jackson", album: "Off the Wall" },
    "shape-of-you.mp3": { title: "Shape of You", artist: "Ed Sheeran", album: "÷ (Divide)" },
    "azizam.mp3": { title: "Azizam", artist: "Ed Sheeran", album: "Azizam" },
    "nochentera.mp3": { title: "Nochentera (Larry DJ Private Mix)", artist: "Vicco & Larry DJ", album: "Private Mix" },
    "speed.mp3": { title: "Speed", artist: "Unknown Artist", album: "Singles" },
    "ocean-waves.mp3": { title: "Soothing Ocean Waves", artist: "Dragon Studio", album: "Nature Sounds" },
    "minecraft-calm-1.mp3": { title: "Minecraft — Calm 1", artist: "C418", album: "Minecraft Volume Alpha" },
    "minecraft-calm-2.mp3": { title: "Minecraft — Calm 2", artist: "C418", album: "Minecraft Volume Alpha" },
    "minecraft-calm-3.mp3": { title: "Minecraft — Calm 3", artist: "C418", album: "Minecraft Volume Alpha" },
    "minecraft-cat.mp3": { title: "Minecraft — Cat", artist: "C418", album: "Minecraft Volume Alpha" },
    "stereo-madness.mp3": { title: "Stereo Madness", artist: "DJVI", album: "Geometry Dash Vol. 1" },
    "years.mp3": { title: "Years", artist: "DJVI", album: "Geometry Dash Vol. 1" },
    "geometrical-dominator.mp3": { title: "Geometrical Dominator", artist: "F-777", album: "Geometry Dash Vol. 1" },
    "dash.mp3": { title: "Dash", artist: "Zomboy", album: "Geometry Dash Vol. 1" },
    "gd-main-menu.mp3": { title: "Main Menu", artist: "RobTop Games", album: "Geometry Dash Vol. 1" },
    "power-trip.mp3": { title: "Power Trip", artist: "Boom Kitty", album: "Geometry Dash Vol. 2" },
    "deadlocked.mp3": { title: "Deadlocked", artist: "F-777", album: "Geometry Dash Vol. 2" },
    "geometry-dash.mp3": { title: "Geometry Dash", artist: "RobTop Games", album: "Geometry Dash Vol. 3" },
    "payload.mp3": { title: "Payload", artist: "Waterflame", album: "Geometry Dash Vol. 3" },
    "press-start.mp3": { title: "Press Start", artist: "MDK", album: "Geometry Dash Vol. 4" },
    "knock-me-out.mp3": { title: "Knock Me Out", artist: "Raw Power", album: "Geometry Dash" },
    "gd-death-sound.mp3": { title: "Death Sound Effect", artist: "RobTop Games", album: "Geometry Dash" },
};

admin.initializeApp({ projectId: PROJECT_ID, storageBucket: BUCKET });
const db = admin.firestore();
const bucket = admin.storage().bucket(BUCKET);

async function alreadySeeded(title) {
    const snap = await db.collection("songs").where("title", "==", title).limit(1).get();
    return !snap.empty;
}

async function run() {
    let files;
    try {
        files = await fs.readdir(SONGS_DIR);
    } catch {
        console.error(`No songs directory at ${SONGS_DIR}`);
        process.exit(1);
    }

    let added = 0;
    for (const file of files) {
        if (!file.endsWith(".mp3")) continue;
        const meta = MANIFEST[file];
        if (!meta) {
            console.log(`Skipping ${file} (no metadata in manifest).`);
            continue;
        }
        if (await alreadySeeded(meta.title)) {
            console.log(`Already seeded: ${meta.title}`);
            continue;
        }

        const objectName = `music/seed-${file}`;
        const localPath = path.join(SONGS_DIR, file);
        await bucket.upload(localPath, {
            destination: objectName,
            resumable: false,
            metadata: { contentType: "audio/mpeg", cacheControl: "public, max-age=31536000, immutable" },
        });
        await bucket.file(objectName).makePublic().catch(() => {});

        const audioUrl = `https://storage.googleapis.com/${BUCKET}/${objectName}`;
        await db.collection("songs").add({
            ...meta,
            author: meta.artist,
            storagePath: objectName,
            audioUrl,
            uploaderUid: "seed",
            uploaderName: "Musicfly",
            createdAt: new Date(),
        });
        console.log(`Seeded: ${meta.title}`);
        added++;
    }
    console.log(`\nDone. Added ${added} song(s) to Firebase Storage (${BUCKET}).`);
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
