/* ============================================================
   Musicfly — authentication & API access layer
   ------------------------------------------------------------
   Initializes Firebase Auth (if configured), gates the app behind
   login/signup, and exposes a small API for app.js:

     window.Musicfly.backendMode   → true when a real backend+Firebase is configured
     window.Musicfly.currentUser   → { uid, name, email } or null
     window.Musicfly.authedFetch() → fetch() with a fresh Firebase ID token attached
     window.Musicfly.apiBase       → API origin ("" = same origin)
   ============================================================ */
(function () {
    const cfg = window.FIREBASE_CONFIG || {};
    const apiBase = (window.MUSICFLY_API_BASE || "").replace(/\/$/, "");

    const isConfigured =
        cfg.apiKey &&
        !String(cfg.apiKey).startsWith("YOUR_") &&
        cfg.projectId &&
        !String(cfg.projectId).startsWith("YOUR_");

    const Musicfly = {
        backendMode: Boolean(isConfigured),
        apiBase,
        currentUser: null,
        _auth: null,
        async getToken() {
            if (!this._auth || !this._auth.currentUser) return null;
            return this._auth.currentUser.getIdToken();
        },
        async authedFetch(path, options = {}) {
            const headers = new Headers(options.headers || {});
            const token = await this.getToken();
            if (token) headers.set("Authorization", `Bearer ${token}`);
            return fetch(apiBase + path, { ...options, headers });
        },
        signOut() {
            if (this._auth) this._auth.signOut();
        },
    };
    window.Musicfly = Musicfly;

    // ---------- Demo / static mode ----------
    if (!isConfigured) {
        // No Firebase configured: run the static bundled library, no login.
        document.addEventListener("DOMContentLoaded", () => {
            window.MusicflyApp && window.MusicflyApp.start();
        });
        return;
    }

    // ---------- Real auth mode ----------
    firebase.initializeApp(cfg);
    const auth = firebase.auth();
    Musicfly._auth = auth;

    function injectAuthOverlay() {
        if (document.getElementById("auth-overlay")) return;
        const el = document.createElement("div");
        el.id = "auth-overlay";
        el.className = "auth-overlay";
        el.innerHTML = `
            <div class="auth-card">
                <div class="auth-logo">
                    <svg viewBox="0 0 24 24" fill="#1DB954" width="40" height="40" aria-hidden="true"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
                    <span>Musicfly</span>
                </div>
                <h1 class="auth-title" id="auth-title">Log in to Musicfly</h1>
                <p class="auth-sub" id="auth-sub">Listen, upload and share your music.</p>

                <button type="button" class="auth-google" id="auth-google">
                    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.167 6.656 3.58 9 3.58z"/></svg>
                    Continue with Google
                </button>

                <div class="auth-divider"><span>or</span></div>

                <form id="auth-form" class="auth-form">
                    <label>Email address
                        <input type="email" id="auth-email" autocomplete="email" required placeholder="you@example.com" />
                    </label>
                    <label>Password
                        <input type="password" id="auth-password" autocomplete="current-password" required minlength="6" placeholder="At least 6 characters" />
                    </label>
                    <div class="auth-error hidden" id="auth-error"></div>
                    <button type="submit" class="auth-submit" id="auth-submit">Log In</button>
                </form>

                <p class="auth-toggle">
                    <span id="auth-toggle-text">Don't have an account?</span>
                    <button type="button" id="auth-toggle-btn">Sign up</button>
                </p>
            </div>
        `;
        document.body.appendChild(el);
        wireAuthForm();
    }

    let mode = "login"; // or "signup"

    function setMode(next) {
        mode = next;
        const isSignup = mode === "signup";
        document.getElementById("auth-title").textContent = isSignup ? "Sign up for Musicfly" : "Log in to Musicfly";
        document.getElementById("auth-submit").textContent = isSignup ? "Sign Up" : "Log In";
        document.getElementById("auth-toggle-text").textContent = isSignup
            ? "Already have an account?"
            : "Don't have an account?";
        document.getElementById("auth-toggle-btn").textContent = isSignup ? "Log in" : "Sign up";
        document.getElementById("auth-password").autocomplete = isSignup ? "new-password" : "current-password";
        showError("");
    }

    function showError(msg) {
        const box = document.getElementById("auth-error");
        if (!box) return;
        box.textContent = msg;
        box.classList.toggle("hidden", !msg);
    }

    function friendlyError(err) {
        const code = err?.code || "";
        const map = {
            "auth/invalid-email": "That email address looks invalid.",
            "auth/user-not-found": "No account found with that email.",
            "auth/wrong-password": "Incorrect password.",
            "auth/invalid-credential": "Incorrect email or password.",
            "auth/email-already-in-use": "An account already exists with that email.",
            "auth/weak-password": "Password should be at least 6 characters.",
            "auth/popup-closed-by-user": "Sign-in popup was closed.",
            "auth/too-many-requests": "Too many attempts. Try again later.",
        };
        return map[code] || err?.message || "Something went wrong. Please try again.";
    }

    function wireAuthForm() {
        document.getElementById("auth-toggle-btn").addEventListener("click", () => {
            setMode(mode === "login" ? "signup" : "login");
        });

        document.getElementById("auth-form").addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("auth-email").value.trim();
            const password = document.getElementById("auth-password").value;
            const submit = document.getElementById("auth-submit");
            submit.disabled = true;
            showError("");
            try {
                if (mode === "signup") {
                    await auth.createUserWithEmailAndPassword(email, password);
                } else {
                    await auth.signInWithEmailAndPassword(email, password);
                }
            } catch (err) {
                showError(friendlyError(err));
            } finally {
                submit.disabled = false;
            }
        });

        document.getElementById("auth-google").addEventListener("click", async () => {
            showError("");
            try {
                const provider = new firebase.auth.GoogleAuthProvider();
                await auth.signInWithPopup(provider);
            } catch (err) {
                showError(friendlyError(err));
            }
        });
    }

    function showOverlay() {
        injectAuthOverlay();
        document.getElementById("auth-overlay").classList.remove("hidden");
        document.body.classList.add("auth-locked");
    }

    function hideOverlay() {
        const el = document.getElementById("auth-overlay");
        if (el) el.classList.add("hidden");
        document.body.classList.remove("auth-locked");
    }

    let appStarted = false;

    auth.onAuthStateChanged((user) => {
        if (user) {
            Musicfly.currentUser = {
                uid: user.uid,
                name: user.displayName || (user.email ? user.email.split("@")[0] : "Listener"),
                email: user.email,
            };
            hideOverlay();
            if (!appStarted) {
                appStarted = true;
                window.MusicflyApp && window.MusicflyApp.start();
            } else {
                window.MusicflyApp && window.MusicflyApp.onUserChanged();
            }
        } else {
            Musicfly.currentUser = null;
            showOverlay();
            window.MusicflyApp && window.MusicflyApp.onSignedOut();
        }
    });

    document.addEventListener("DOMContentLoaded", () => {
        if (!auth.currentUser) showOverlay();
    });
})();
