# Deploying Musicfly to Google Cloud + Firebase

This guide takes you from nothing to a live music app with accounts, uploads, podcasts,
and playlists — all on **one Firebase / Google Cloud project**.

## Architecture

| What | Service |
|------|---------|
| **Accounts & login** | **Firebase Auth** (email/password + Google) |
| **User profiles, song metadata, playlists, podcasts** | **Firestore** |
| **Music & podcast audio files** | **Firebase Storage** (`<projectId>.appspot.com`) |
| **API + website** | **Cloud Run** (Node.js Express) |

Replace `YOUR_PROJECT_ID` with your own value everywhere below.

---

## 0. Install the tools (one time)

- **Google Cloud CLI (`gcloud`)** — https://cloud.google.com/sdk/docs/install
- **Node.js 18+** — https://nodejs.org/

Then log in:

```bash
gcloud auth login
gcloud auth application-default login
```

---

## 1. Create a project + enable billing

```bash
gcloud projects create YOUR_PROJECT_ID
gcloud config set project YOUR_PROJECT_ID
```

Enable billing in the console (required for Cloud Run / Storage):
https://console.cloud.google.com/billing → link the project.

Enable the APIs:

```bash
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  storage.googleapis.com \
  firestore.googleapis.com \
  firebase.googleapis.com \
  identitytoolkit.googleapis.com
```

---

## 2. Firebase — accounts (Auth)

1. Go to https://console.firebase.google.com/ → **Add project** → choose your existing
   `YOUR_PROJECT_ID` (Firebase and Google Cloud share projects).
2. **Build → Authentication → Get started.**
3. Enable **Email/Password** and **Google** sign-in providers.
4. **Project settings → General → Your apps → Web app (`</>`)**. Register an app and copy
   the `firebaseConfig` values.
5. In this repo, copy `firebase-config.example.js` to `firebase-config.js` and paste your values:

   ```js
   window.FIREBASE_CONFIG = {
     apiKey: "…",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.appspot.com",
     messagingSenderId: "…",
     appId: "…",
   };
   window.MUSICFLY_API_BASE = "";
   ```

   The `storageBucket` value is your **Firebase Storage** bucket for music and podcasts.

6. After you know your Cloud Run URL (step 6), add it under
   **Authentication → Settings → Authorized domains**.

---

## 3. Firestore — metadata database

```bash
gcloud firestore databases create --location=us-central1
```

Collections used automatically:

- `users` — birth date, upload eligibility
- `songs` — track metadata + Firebase Storage URL
- `playlists` — user playlists and folders
- `podcasts` + `episodes` — podcast shows and episodes

---

## 4. Firebase Storage — music & podcast files

1. In Firebase Console → **Build → Storage → Get started.**
2. Choose **production mode** (we set rules below) and the same region as Firestore.
3. This creates the default bucket: `YOUR_PROJECT_ID.appspot.com`

Deploy storage rules from this repo (public read for streaming, server-only writes):

```bash
firebase deploy --only storage
```

If you don't have the Firebase CLI yet:

```bash
npm install -g firebase-tools
firebase login
firebase use YOUR_PROJECT_ID
```

Or make the bucket publicly readable via IAM (alternative to rules for streaming):

```bash
gcloud storage buckets add-iam-policy-binding gs://YOUR_PROJECT_ID.appspot.com \
  --member=allUsers --role=roles/storage.objectViewer
```

> Audio files are world-readable by URL so the browser can stream them.
> Uploading still requires login + age 16+ via the API.

(Optional) CORS for range requests / seeking:

```bash
echo '[{"origin":["*"],"method":["GET","HEAD"],"responseHeader":["Content-Type","Range"],"maxAgeSeconds":3600}]' > cors.json
gcloud storage buckets update gs://YOUR_PROJECT_ID.appspot.com --cors-file=cors.json
```

File layout in the bucket:

```text
music/       ← uploaded songs
podcasts/    ← podcast episodes
```

---

## 5. Give Cloud Run access to Firebase

Cloud Run uses the project's compute service account:

```bash
PROJECT_NUMBER=$(gcloud projects describe YOUR_PROJECT_ID --format='value(projectNumber)')
SA="$PROJECT_NUMBER-compute@developer.gserviceaccount.com"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:$SA" --role=roles/storage.admin
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:$SA" --role=roles/datastore.user
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:$SA" --role=roles/firebaseauth.admin
```

---

## 6. Deploy to Cloud Run

From the repo root:

```bash
gcloud run deploy musicfly \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --no-invoker-iam-check \
  --set-env-vars GCLOUD_PROJECT=YOUR_PROJECT_ID
```

The server auto-uses Firebase Storage at `YOUR_PROJECT_ID.appspot.com`.
Override with `FIREBASE_STORAGE_BUCKET` if needed.

When it finishes, it prints a **Service URL** like
`https://musicfly-xxxxx-uc.a.run.app`. Open it — you should see the login screen.

> **"Error: Forbidden" on Cloud Run?** Your Google org may block public IAM.
> Run `scripts\fix-public-access.cmd`, or redeploy with `--no-invoker-iam-check` as above.

Add the Cloud Run hostname to **Firebase → Authentication → Authorized domains** so Google sign-in works.

---

## 7. (Optional) Seed the starter songs

Uploads the bundled MP3s in `songs/` to Firebase Storage + Firestore:

```bash
GCLOUD_PROJECT=YOUR_PROJECT_ID npm install
GCLOUD_PROJECT=YOUR_PROJECT_ID node scripts/seed.js
```

---

## Running locally against Firebase

```bash
npm install
GCLOUD_PROJECT=YOUR_PROJECT_ID npm start
# open http://localhost:8080
```

Uses your `gcloud auth application-default login` credentials and the same Firebase project.

---

## Updating the app

```bash
gcloud run deploy musicfly --source . --region us-central1 --allow-unauthenticated --no-invoker-iam-check \
  --set-env-vars GCLOUD_PROJECT=YOUR_PROJECT_ID
```

---

## Troubleshooting

- **Login screen never appears / "demo mode":** `firebase-config.js` still has placeholder
  values. Paste your real Firebase web config.
- **Uploads fail with a "make public" error:** enable Firebase Storage (step 4) and grant
  `allUsers` → `Storage Object Viewer` on the bucket, or deploy `storage.rules`.
- **`GET /api/songs` returns 500:** check Cloud Run logs
  (`gcloud run services logs read musicfly --region us-central1`). Usually a missing IAM role
  (step 5) or Firestore not created (step 3).
- **Google sign-in popup error:** add the Cloud Run domain to Firebase Authorized domains.
