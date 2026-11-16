/* ============================================================
   Musicfly — authentication & API access layer
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
        isVisitor: false,
        canUpload: false,
        _auth: null,
        async getToken() {
            if (this.backendMode && this._auth?.currentUser) {
                return this._auth.currentUser.getIdToken();
            }
            if (!this.backendMode && this.currentUser) {
                return "local:" + this.currentUser.uid;
            }
            return null;
        },
        async authedFetch(path, options = {}) {
            const headers = new Headers(options.headers || {});
            const token = await this.getToken();
            if (token) headers.set("Authorization", `Bearer ${token}`);
            return fetch(apiBase + path, { ...options, headers });
        },
        signOut() {
            if (this.isVisitor) {
                visitorMode = false;
                this.isVisitor = false;
                showOverlay();
                window.MusicflyApp?.onSignedOut();
                return;
            }
            if (this.backendMode && this._auth) {
                this._auth.signOut();
            } else {
                window.MusicflyLocal?.signOut();
                this.currentUser = null;
                this.canUpload = false;
                showOverlay();
                window.MusicflyApp?.onSignedOut();
            }
        },
        showLogin() {
            visitorMode = false;
            this.isVisitor = false;
            showOverlay();
        },
        async refreshProfile() {
            if (!this.currentUser) return;
            if (this.backendMode) {
                try {
                    const res = await this.authedFetch("/api/me");
                    if (res.ok) {
                        const data = await res.json();
                        const u = data.user;
                        this.currentUser.birthDate = u.birthDate;
                        this.canUpload = true;
                    }
                } catch {}
            } else {
                this.canUpload = true;
            }
        },
    };
    window.Musicfly = Musicfly;

    let mode = "login";
    let appStarted = false;
    let pendingBirthDate = null;
    let visitorMode = false;

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
                <p class="auth-sub" id="auth-sub">Listen, upload and share your music. Sign in to upload tracks.</p>

                ${isConfigured ? `
                <button type="button" class="auth-google" id="auth-google">
                    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.167 6.656 3.58 9 3.58z"/></svg>
                    Continue with Google
                </button>
                <div class="auth-divider"><span>or</span></div>
                ` : ""}

                <form id="auth-form" class="auth-form">
                    <label>Email address
                        <input type="email" id="auth-email" autocomplete="email" required placeholder="you@example.com" />
                    </label>
                    <label>Password
                        <input type="password" id="auth-password" autocomplete="current-password" required minlength="6" placeholder="At least 6 characters" />
                    </label>
                    <label id="auth-birth-label" class="hidden">Date of birth
                        <input type="date" id="auth-birthdate" />
                        <span class="field-hint">Optional. Required only for podcasts and folders (16+).</span>
                    </label>
                    <div class="auth-error hidden" id="auth-error"></div>
                    <button type="submit" class="auth-submit" id="auth-submit">Log In</button>
                </form>

                <p class="auth-toggle">
                    <span id="auth-toggle-text">Don't have an account?</span>
                    <button type="button" id="auth-toggle-btn">Sign up</button>
                </p>

                <button type="button" class="auth-visitor" id="auth-visitor">Continue as visitor</button>
            </div>
        `;
        document.body.appendChild(el);
        wireAuthForm();
    }

    function injectAgeOverlay() {
        if (document.getElementById("age-overlay")) return;
        const el = document.createElement("div");
        el.id = "age-overlay";
        el.className = "auth-overlay";
        el.innerHTML = `
            <div class="auth-card">
                <h1 class="auth-title">Confirm your age</h1>
                <p class="auth-sub">Optional for music uploads. Enter your date of birth if you want to create podcasts or folders (16+).</p>
                <form id="age-form" class="auth-form">
                    <label>Date of birth
                        <input type="date" id="age-birthdate" required />
                    </label>
                    <div class="auth-error hidden" id="age-error"></div>
                    <button type="submit" class="auth-submit">Continue</button>
                </form>
            </div>
        `;
        document.body.appendChild(el);

        document.getElementById("age-form").addEventListener("submit", async (e) => {
            e.preventDefault();
            const birthDate = document.getElementById("age-birthdate").value;
            const errBox = document.getElementById("age-error");
            errBox.classList.add("hidden");
            try {
                if (Musicfly.backendMode) {
                    const res = await Musicfly.authedFetch("/api/me", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ birthDate }),
                    });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.error || "Could not save birth date.");
                    Musicfly.currentUser.birthDate = data.user.birthDate;
                    Musicfly.canUpload = data.user.canUpload;
                } else {
                    const user = await window.MusicflyLocal.setBirthDate(Musicfly.currentUser.uid, birthDate);
                    Musicfly.currentUser = user;
                    Musicfly.canUpload = user.canUpload;
                }
                hideAgeOverlay();
                window.MusicflyApp?.onUserChanged();
            } catch (err) {
                errBox.textContent = err.message;
                errBox.classList.remove("hidden");
            }
        });
    }

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
        document.getElementById("auth-birth-label").classList.toggle("hidden", !isSignup);
        const birthInput = document.getElementById("auth-birthdate");
        if (birthInput) birthInput.required = false;
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
            const birthDate = document.getElementById("auth-birthdate")?.value;
            const submit = document.getElementById("auth-submit");
            submit.disabled = true;
            showError("");
            try {
                if (Musicfly.backendMode) {
                    if (mode === "signup") {
                        pendingBirthDate = birthDate || null;
                        await Musicfly._auth.createUserWithEmailAndPassword(email, password);
                    } else {
                        await Musicfly._auth.signInWithEmailAndPassword(email, password);
                    }
                } else {
                    if (mode === "signup") {
                        const user = await window.MusicflyLocal.signUp({ email, password, birthDate: birthDate || null });
                        await onLocalSignedIn(user);
                    } else {
                        const user = await window.MusicflyLocal.signIn({ email, password });
                        await onLocalSignedIn(user);
                    }
                }
            } catch (err) {
                showError(friendlyError(err));
            } finally {
                submit.disabled = false;
            }
        });

        const googleBtn = document.getElementById("auth-google");
        googleBtn?.addEventListener("click", async () => {
            showError("");
            try {
                const provider = new firebase.auth.GoogleAuthProvider();
                await Musicfly._auth.signInWithPopup(provider);
            } catch (err) {
                showError(friendlyError(err));
            }
        });

        document.getElementById("auth-visitor").addEventListener("click", () => {
            continueAsVisitor();
        });
    }

    async function continueAsVisitor() {
        visitorMode = true;
        Musicfly.isVisitor = true;
        Musicfly.currentUser = null;
        Musicfly.canUpload = false;
        hideOverlay();
        if (!appStarted) {
            appStarted = true;
            await window.MusicflyApp?.start();
        } else {
            await window.MusicflyApp?.onUserChanged();
        }
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

    function showAgeOverlay() {
        injectAgeOverlay();
        document.getElementById("age-overlay").classList.remove("hidden");
        document.body.classList.add("auth-locked");
    }

    function hideAgeOverlay() {
        const el = document.getElementById("age-overlay");
        if (el) el.classList.add("hidden");
        if (document.getElementById("auth-overlay")?.classList.contains("hidden")) {
            document.body.classList.remove("auth-locked");
        }
    }

    async function onLocalSignedIn(user) {
        visitorMode = false;
        Musicfly.isVisitor = false;
        Musicfly.currentUser = user;
        Musicfly.canUpload = true;
        hideOverlay();
        if (!appStarted) {
            appStarted = true;
            await window.MusicflyApp?.start();
        } else {
            await window.MusicflyApp?.onUserChanged();
        }
    }

    async function onFirebaseSignedIn(user) {
        visitorMode = false;
        Musicfly.isVisitor = false;
        Musicfly.currentUser = {
            uid: user.uid,
            name: user.displayName || (user.email ? user.email.split("@")[0] : "Listener"),
            email: user.email,
            birthDate: null,
        };
        // Signed-in users can upload music immediately.
        Musicfly.canUpload = true;

        if (pendingBirthDate) {
            try {
                const res = await Musicfly.authedFetch("/api/me", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ birthDate: pendingBirthDate }),
                });
                if (res.ok) {
                    const data = await res.json();
                    Musicfly.currentUser.birthDate = data.user.birthDate;
                    Musicfly.canUpload = true;
                }
            } catch {}
            pendingBirthDate = null;
        } else {
            await Musicfly.refreshProfile();
            Musicfly.canUpload = true;
        }

        hideOverlay();

        if (!appStarted) {
            appStarted = true;
            await window.MusicflyApp?.start();
        } else {
            await window.MusicflyApp?.onUserChanged();
        }
    }

    // ---------- Demo / local auth mode ----------
    if (!isConfigured) {
        document.addEventListener("DOMContentLoaded", () => {
            const user = window.MusicflyLocal?.getCurrentUser();
            if (user) {
                onLocalSignedIn(user);
            } else {
                showOverlay();
            }
        });
        return;
    }

    // ---------- Firebase auth mode ----------
    firebase.initializeApp(cfg);
    const auth = firebase.auth();
    Musicfly._auth = auth;

    auth.onAuthStateChanged(async (user) => {
        if (user) {
            await onFirebaseSignedIn(user);
        } else if (!visitorMode) {
            Musicfly.currentUser = null;
            Musicfly.canUpload = false;
            Musicfly.isVisitor = false;
            showOverlay();
            window.MusicflyApp?.onSignedOut();
        }
    });

    document.addEventListener("DOMContentLoaded", () => {
        if (!auth.currentUser) showOverlay();
    });
})();
