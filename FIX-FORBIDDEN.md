# Fix Cloud Run "Forbidden" error

Your Google organization blocks public IAM (`allUsers`), so Cloud Run returns:

> Error: Forbidden — Your client does not have permission to get URL / from this server.

## Quick fix (use this link now)

**https://spotify-five-teal.vercel.app/** — works without any setup.

---

## Fix the Cloud Run URL (one-time)

### Option A — Run locally (fastest)

Open **PowerShell** or **Command Prompt** and run:

```powershell
gcloud auth login
gcloud run services update musicfly --region=us-central1 --no-invoker-iam-check
```

Or double-click: `scripts\fix-public-access.cmd` (after `gcloud auth login`).

Then open: **https://musicfly-107401835210.us-central1.run.app/**

### Option B — GitHub Actions (no local gcloud needed)

1. **Create a service account** in [Google Cloud Console](https://console.cloud.google.com/iam-admin/serviceaccounts?project=marsels-project):
   - Name: `github-deploy`
   - Roles: **Cloud Run Admin**, **Service Account User**, **Storage Admin**, **Cloud Build Editor**

2. **Create a JSON key** for that service account → Download it.

3. **Add GitHub secret:**
   - Go to https://github.com/terenamutolder-oss/spotify/settings/secrets/actions
   - New secret: `GCP_SA_KEY` → paste the entire JSON file contents

4. **Run the workflow:**
   - Go to https://github.com/terenamutolder-oss/spotify/actions/workflows/cloud-run-deploy.yml
   - Click **Run workflow** → Run

This redeploys with `--no-invoker-iam-check` so the site is public without `allUsers` IAM.

---

## Why this happens

Google Cloud Run requires either:
- `allUsers` has `roles/run.invoker` — **blocked** by your org's Domain Restricted Sharing policy, or
- `--no-invoker-iam-check` — disables the check (recommended workaround)

The first deploy used `--allow-unauthenticated` but that only adds `allUsers` IAM, which your org rejects.
