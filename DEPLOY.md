# Deploying Musicfly to Google Cloud

This guide takes you from nothing to a live, login-protected music app with uploads,
running on **Cloud Run**, with audio in **Google Cloud Storage** and metadata in **Firestore**,
and accounts via **Firebase Auth**.

Everything is copy-paste. Replace `YOUR_PROJECT_ID` and `YOUR_BUCKET` with your own values.

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

## 2. Set up Firebase Auth (accounts)

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

6. After you know your Cloud Run URL (step 6), add it under
   **Authentication → Settings → Authorized domains**.

---

## 3. Create the Firestore database

```bash
gcloud firestore databases create --location=us-central1
```

(Choose the region nearest you; keep it consistent with Cloud Run.)

---

## 4. Create the Cloud Storage bucket (audio files)

```bash
gcloud storage buckets create gs://YOUR_BUCKET --location=us-central1 --uniform-bucket-level-access
```

Make objects publicly readable (so the browser can stream audio directly, with seek support):

```bash
gcloud storage buckets add-iam-policy-binding gs://YOUR_BUCKET \
  --member=allUsers --role=roles/storage.objectViewer
```

> Audio files become world-readable by URL. App access and uploading still require login.
> If you prefer private files, that needs signed URLs (not covered here).

(Optional) allow the browser to read audio cross-origin for waveform/duration features:

```bash
echo '[{"origin":["*"],"method":["GET","HEAD"],"responseHeader":["Content-Type","Range"],"maxAgeSeconds":3600}]' > cors.json
gcloud storage buckets update gs://YOUR_BUCKET --cors-file=cors.json
```

---

## 5. Give the Cloud Run service account access

Cloud Run uses the project's compute service account. Grant it Storage + Firestore access:

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
  --set-env-vars GCLOUD_PROJECT=YOUR_PROJECT_ID,GCS_BUCKET=YOUR_BUCKET
```

When it finishes, it prints a **Service URL** like
`https://musicfly-xxxxx-uc.a.run.app`. Open it — you should see the login screen.

Now go back to **Firebase → Authentication → Settings → Authorized domains** and add that
Cloud Run hostname so Google sign-in works.

---

## 7. (Optional) Seed the starter songs

To upload the bundled MP3s in `songs/` into your new library:

```bash
GCLOUD_PROJECT=YOUR_PROJECT_ID GCS_BUCKET=YOUR_BUCKET npm install
GCLOUD_PROJECT=YOUR_PROJECT_ID GCS_BUCKET=YOUR_BUCKET node scripts/seed.js
```

---

## Running locally against the cloud

```bash
npm install
# uses your `gcloud auth application-default login` credentials
GCLOUD_PROJECT=YOUR_PROJECT_ID GCS_BUCKET=YOUR_BUCKET npm start
# open http://localhost:8080
```

---

## Updating the app

Just re-run the deploy command:

```bash
gcloud run deploy musicfly --source . --region us-central1 --allow-unauthenticated \
  --set-env-vars GCLOUD_PROJECT=YOUR_PROJECT_ID,GCS_BUCKET=YOUR_BUCKET
```

---

## Troubleshooting

- **Login screen never appears / "demo mode":** `firebase-config.js` still has placeholder
  values. Paste your real Firebase web config.
- **Uploads fail with a "make public" error:** the bucket uses uniform access — run the
  `add-iam-policy-binding ... allUsers ... objectViewer` command from step 4.
- **`GET /api/songs` returns 500:** check the Cloud Run logs
  (`gcloud run services logs read musicfly --region us-central1`). Usually a missing IAM role
  (step 5) or `GCS_BUCKET` not set.
- **Google sign-in popup error:** add the Cloud Run domain to Firebase Authorized domains.
