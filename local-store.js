/* ============================================================
   Musicfly — local persistence for demo mode (no Firebase)
   ============================================================ */
(function () {
    const USERS_KEY = "musicfly_users";
    const SESSION_KEY = "musicfly_session";
    const PLAYLISTS_KEY = "musicfly_playlists";
    const PODCASTS_KEY = "musicfly_podcasts";
    const DB_NAME = "musicfly_local";
    const DB_VERSION = 1;

    function readJson(key, fallback) {
        try {
            return JSON.parse(localStorage.getItem(key)) ?? fallback;
        } catch {
            return fallback;
        }
    }

    function writeJson(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function calcAge(birthDate) {
        const m = String(birthDate).match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (!m) return null;
        const dob = new Date(+m[1], +m[2] - 1, +m[3]);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const md = today.getMonth() - dob.getMonth();
        if (md < 0 || (md === 0 && today.getDate() < dob.getDate())) age -= 1;
        return age;
    }

    function isAge16Plus(birthDate) {
        const age = calcAge(birthDate);
        return age !== null && age >= 16;
    }

    async function hashPassword(password) {
        const data = new TextEncoder().encode(password);
        const buf = await crypto.subtle.digest("SHA-256", data);
        return Array.from(new Uint8Array(buf))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
    }

    function openDb() {
        return new Promise((resolve, reject) => {
            const req = indexedDB.open(DB_NAME, DB_VERSION);
            req.onerror = () => reject(req.error);
            req.onupgradeneeded = () => {
                const db = req.result;
                if (!db.objectStoreNames.contains("uploads")) db.createObjectStore("uploads", { keyPath: "id" });
                if (!db.objectStoreNames.contains("episodes")) db.createObjectStore("episodes", { keyPath: "id" });
            };
            req.onsuccess = () => resolve(req.result);
        });
    }

    async function dbPut(store, value) {
        const db = await openDb();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(store, "readwrite");
            tx.objectStore(store).put(value);
            tx.oncomplete = () => resolve(value);
            tx.onerror = () => reject(tx.error);
        });
    }

    async function dbGetAll(store) {
        const db = await openDb();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(store, "readonly");
            const req = tx.objectStore(store).getAll();
            req.onsuccess = () => resolve(req.result || []);
            req.onerror = () => reject(req.error);
        });
    }

    async function dbDelete(store, id) {
        const db = await openDb();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(store, "readwrite");
            tx.objectStore(store).delete(id);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    function uid() {
        return "local_" + Math.random().toString(36).slice(2, 11);
    }

    const LocalStore = {
        calcAge,
        isAge16Plus,

        async signUp({ email, password, name, birthDate }) {
            const users = readJson(USERS_KEY, []);
            if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
                throw new Error("An account already exists with that email.");
            }
            const user = {
                uid: uid(),
                email: email.toLowerCase(),
                passwordHash: await hashPassword(password),
                name: name || email.split("@")[0],
                birthDate: birthDate || null,
                createdAt: new Date().toISOString(),
            };
            users.push(user);
            writeJson(USERS_KEY, users);
            writeJson(SESSION_KEY, user.uid);
            return this.toPublicUser(user);
        },

        async signIn({ email, password }) {
            const users = readJson(USERS_KEY, []);
            const hash = await hashPassword(password);
            const user = users.find((u) => u.email === email.toLowerCase() && u.passwordHash === hash);
            if (!user) throw new Error("Incorrect email or password.");
            writeJson(SESSION_KEY, user.uid);
            return this.toPublicUser(user);
        },

        signOut() {
            localStorage.removeItem(SESSION_KEY);
        },

        getCurrentUser() {
            const sessionUid = localStorage.getItem(SESSION_KEY);
            if (!sessionUid) return null;
            const users = readJson(USERS_KEY, []);
            const user = users.find((u) => u.uid === sessionUid);
            return user ? this.toPublicUser(user) : null;
        },

        toPublicUser(user) {
            return {
                uid: user.uid,
                email: user.email,
                name: user.name,
                birthDate: user.birthDate,
                canUpload: true,
                canCreateMature: isAge16Plus(user.birthDate),
            };
        },

        async setBirthDate(uid, birthDate) {
            if (!birthDate) throw new Error("Date of birth is required.");
            const users = readJson(USERS_KEY, []);
            const idx = users.findIndex((u) => u.uid === uid);
            if (idx < 0) throw new Error("User not found.");
            users[idx].birthDate = birthDate;
            writeJson(USERS_KEY, users);
            return this.toPublicUser(users[idx]);
        },

        listPlaylists(uid) {
            const all = readJson(PLAYLISTS_KEY, []);
            return all.filter((p) => p.ownerUid === uid);
        },

        createPlaylist({ name, description, type, ownerUid, ownerName, parentId, songIds }) {
            const all = readJson(PLAYLISTS_KEY, []);
            const pl = {
                id: "pl_" + uid(),
                name: name.trim(),
                description: (description || "").trim(),
                type: type === "folder" ? "folder" : "playlist",
                ownerUid,
                ownerName,
                songIds: songIds || [],
                parentId: parentId || null,
                createdAt: new Date().toISOString(),
            };
            all.push(pl);
            writeJson(PLAYLISTS_KEY, all);
            return pl;
        },

        deletePlaylist(id, uid) {
            const all = readJson(PLAYLISTS_KEY, []);
            const idx = all.findIndex((p) => p.id === id && p.ownerUid === uid);
            if (idx < 0) return false;
            all.splice(idx, 1);
            writeJson(PLAYLISTS_KEY, all);
            return true;
        },

        listPodcasts() {
            return readJson(PODCASTS_KEY, []);
        },

        createPodcast({ title, description, author, ownerUid, ownerName }) {
            const all = readJson(PODCASTS_KEY, []);
            const podcast = {
                id: "pod_" + uid(),
                title: title.trim(),
                description: (description || "").trim(),
                author: (author || ownerName).trim(),
                ownerUid,
                ownerName,
                episodeCount: 0,
                createdAt: new Date().toISOString(),
            };
            all.push(podcast);
            writeJson(PODCASTS_KEY, all);
            return podcast;
        },

        async getPodcast(id) {
            const podcast = readJson(PODCASTS_KEY, []).find((p) => p.id === id);
            if (!podcast) return null;
            const episodes = (await dbGetAll("episodes")).filter((e) => e.podcastId === id);
            episodes.sort((a, b) => a.episodeNumber - b.episodeNumber);
            return { podcast, episodes };
        },

        async addEpisode(podcastId, uid, { title, description, episodeNumber, file }) {
            const all = readJson(PODCASTS_KEY, []);
            const idx = all.findIndex((p) => p.id === podcastId);
            if (idx < 0) return null;
            if (all[idx].ownerUid !== uid) throw new Error("FORBIDDEN");

            const id = "ep_" + uid();
            const audioUrl = URL.createObjectURL(file);
            const episode = {
                id,
                podcastId,
                title: title.trim(),
                description: (description || "").trim(),
                episodeNumber: Number(episodeNumber) || 1,
                audioUrl,
                blob: file,
                createdAt: new Date().toISOString(),
            };
            await dbPut("episodes", episode);
            all[idx].episodeCount = (all[idx].episodeCount || 0) + 1;
            writeJson(PODCASTS_KEY, all);
            return { ...episode, blob: undefined };
        },

        async listUploads() {
            const rows = await dbGetAll("uploads");
            return rows.map((r) => ({
                ...r,
                audioUrl: r.blob ? URL.createObjectURL(r.blob) : r.audioUrl,
                blob: undefined,
            }));
        },

        async addUpload({ title, artist, author, album, uploaderUid, uploaderName, file }) {
            const id = "up_" + uid();
            const row = {
                id,
                title,
                artist,
                author: author || uploaderName || artist,
                album: album || "Single",
                uploaderUid,
                uploaderName,
                blob: file,
                createdAt: new Date().toISOString(),
            };
            await dbPut("uploads", row);
            return {
                ...row,
                audioUrl: URL.createObjectURL(file),
                blob: undefined,
            };
        },
    };

    window.MusicflyLocal = LocalStore;
})();
