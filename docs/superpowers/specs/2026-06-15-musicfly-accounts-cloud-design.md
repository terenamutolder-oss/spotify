# Musicfly v2 — Accounts, Uploads & Google Cloud Deploy

**Date:** 2026-06-15
**Status:** Approved

## Goal

Turn the static Musicfly player into a full-stack app where users sign up / log in,
and any signed-in user can upload ("publish") music to a shared library. Deploy on
Google Cloud Run, store audio in Google Cloud Storage (GCS), and store song metadata
in Firestore. Authentication via Firebase Auth (email/password + Google sign-in).

There is **no viewer mode**: users must authenticate before browsing, playing, or uploading.

## Architecture

```
Browser (existing player UI + Firebase Auth SDK + auth/upload UI)
   │  email/password or Google sign-in → Firebase ID token
   ▼
Cloud Run service (Node.js + Express)
   ├── serves static frontend (index.html, app.js, styles.css, auth.js)
   ├── verifies Firebase ID tokens (Firebase Admin SDK)
   ├── GET  /api/songs           [auth] list published songs (Firestore)
   ├── POST /api/songs           [auth] multipart upload → GCS → Firestore doc
   ├── DELETE /api/songs/:id      [auth] uploader-only delete
   └── GET  /healthz             liveness probe
        ├── Google Cloud Storage (public-read audio objects)
        └── Firestore            (song docs)
```

## Components

### Backend (`server/`)
- `index.js` — Express app, routes, static serving, multipart handling (multer, memory).
- `firebase.js` — Firebase Admin init via Application Default Credentials (ADC).
- `storage.js` — GCS upload + public URL; Firestore CRUD for song docs.
- `auth.js` (middleware) — verifies `Authorization: Bearer <idToken>`.

### Frontend
- `firebase-config.js` — public Firebase web config + API base (user fills in; example committed).
- `auth.js` — initializes Firebase, renders login/signup overlay, gates the app, holds the ID token.
- `app.js` — on auth, fetches `/api/songs`, builds dynamic playlists, renders; adds upload modal.

## Data model (Firestore `songs` collection)
```
{
  title: string,
  artist: string,
  album: string,
  storagePath: string,        // gs object path
  audioUrl: string,           // public https URL
  uploaderUid: string,
  uploaderName: string,
  createdAt: Timestamp
}
```

## Key decisions / trade-offs
- **Public-read audio objects** (not signed URLs): simplest reliable playback with native
  GCS range/seek support, no IAM signing setup. Audio files are world-readable by URL;
  acceptable for a shared music app. App access + uploads still require auth.
- **Upload proxied through backend** (multer memory, ~32 MB cap): avoids GCS CORS/signed-URL
  complexity; fine for song-sized files.
- **Dynamic playlists**: "All Songs", "Recently Added", "Your Uploads", and auto per-artist
  playlists generated from the library (replaces hardcoded song-ID playlists, which break
  once songs are dynamic). Deterministic per-song gradient colors from a title hash.
- **No secrets in repo**: Cloud Run uses the service account's ADC for GCS/Firestore/Admin.
  Frontend Firebase config is public-safe.
- **Graceful degradation**: if `firebase-config.js` still has placeholders, the frontend runs
  in static/demo mode using the bundled songs (keeps Vercel/GitHub Pages working).

## Seeding
A `scripts/seed.js` uploads the existing repo MP3s into GCS + Firestore so the new library
isn't empty on first deploy.

## Deliverables
1. Express backend + Dockerfile + `.dockerignore`/`.gcloudignore`
2. Firebase Auth UI + upload UI; API-driven `app.js`
3. `firebase-config.example.js`, `.env.example`
4. `scripts/seed.js`
5. `DEPLOY.md` — step-by-step Google Cloud setup + deploy

## What requires the user's account
Creating the GCP project, enabling APIs, creating the GCS bucket + Firestore, enabling Firebase
Auth providers, and running the deploy (`gcloud run deploy`). The guide makes these copy-paste.
```
```
