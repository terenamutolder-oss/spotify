/* ============================================================
   Musicfly — a Spotify-inspired web player (vanilla JS)
   ============================================================ */

// ----- Song & playlist data -----
// These are the bundled (demo / fallback) tracks. When a Firebase backend is
// configured, SONGS and PLAYLISTS are replaced at runtime with data from the API.
let SONGS = [
    {
        id: "thriller",
        title: "Thriller",
        artist: "Michael Jackson",
        album: "Thriller",
        src: "songs/thriller.mp3",
        color: "#7c3aed",
        color2: "#1e1b4b",
    },
    {
        id: "beat-it",
        title: "Beat It",
        artist: "Michael Jackson",
        album: "Thriller",
        src: "songs/beat-it.mp3",
        color: "#ef4444",
        color2: "#7f1d1d",
    },
    {
        id: "billie-jean",
        title: "Billie Jean",
        artist: "Michael Jackson",
        album: "Thriller",
        src: "songs/billie-jean.mp3",
        color: "#06b6d4",
        color2: "#164e63",
    },
    {
        id: "smooth-criminal",
        title: "Smooth Criminal",
        artist: "Michael Jackson",
        album: "Bad",
        src: "songs/smooth-criminal.mp3",
        color: "#f59e0b",
        color2: "#78350f",
    },
    {
        id: "shape-of-you",
        title: "Shape of You",
        artist: "Ed Sheeran",
        album: "÷ (Divide)",
        src: "songs/shape-of-you.mp3",
        color: "#ec4899",
        color2: "#831843",
    },
    {
        id: "azizam",
        title: "Azizam",
        artist: "Ed Sheeran",
        album: "Azizam",
        src: "songs/azizam.mp3",
        color: "#f97316",
        color2: "#7c2d12",
    },
    {
        id: "nochentera",
        title: "Nochentera (Larry DJ Private Mix)",
        artist: "Vicco & Larry DJ",
        album: "Private Mix",
        src: "songs/nochentera.mp3",
        color: "#a855f7",
        color2: "#581c87",
    },
    {
        id: "dont-stop",
        title: "Don't Stop 'Til You Get Enough",
        artist: "Michael Jackson",
        album: "Off the Wall",
        src: "songs/dont-stop.mp3",
        color: "#eab308",
        color2: "#713f12",
    },
    {
        id: "speed",
        title: "Speed",
        artist: "Unknown Artist",
        album: "Singles",
        src: "songs/speed.mp3",
        color: "#22c55e",
        color2: "#14532d",
    },
    {
        id: "minecraft-calm-1",
        title: "Minecraft — Calm 1",
        artist: "C418",
        album: "Minecraft Volume Alpha",
        src: "songs/minecraft-calm-1.mp3",
        color: "#84cc16",
        color2: "#365314",
    },
    {
        id: "minecraft-calm-2",
        title: "Minecraft — Calm 2",
        artist: "C418",
        album: "Minecraft Volume Alpha",
        src: "songs/minecraft-calm-2.mp3",
        color: "#65a30d",
        color2: "#3f6212",
    },
    {
        id: "minecraft-calm-3",
        title: "Minecraft — Calm 3",
        artist: "C418",
        album: "Minecraft Volume Alpha",
        src: "songs/minecraft-calm-3.mp3",
        color: "#4d7c0f",
        color2: "#1a2e05",
    },
    {
        id: "minecraft-cat",
        title: "Minecraft — Cat",
        artist: "C418",
        album: "Minecraft Volume Alpha",
        src: "songs/minecraft-cat.mp3",
        color: "#14b8a6",
        color2: "#134e4a",
    },
    {
        id: "ocean-waves",
        title: "Soothing Ocean Waves",
        artist: "Dragon Studio",
        album: "Nature Sounds",
        src: "songs/ocean-waves.mp3",
        color: "#0ea5e9",
        color2: "#0c4a6e",
    },
    {
        id: "stereo-madness",
        title: "Stereo Madness",
        artist: "DJVI",
        album: "Geometry Dash Vol. 1",
        src: "songs/stereo-madness.mp3",
        color: "#3b82f6",
        color2: "#1e3a8a",
    },
    {
        id: "years",
        title: "Years",
        artist: "DJVI",
        album: "Geometry Dash Vol. 1",
        src: "songs/years.mp3",
        color: "#6366f1",
        color2: "#312e81",
    },
    {
        id: "geometrical-dominator",
        title: "Geometrical Dominator",
        artist: "F-777",
        album: "Geometry Dash Vol. 1",
        src: "songs/geometrical-dominator.mp3",
        color: "#a855f7",
        color2: "#581c87",
    },
    {
        id: "dash",
        title: "Dash",
        artist: "Zomboy",
        album: "Geometry Dash Vol. 1",
        src: "songs/dash.mp3",
        color: "#f97316",
        color2: "#7c2d12",
    },
    {
        id: "gd-main-menu",
        title: "Main Menu",
        artist: "RobTop Games",
        album: "Geometry Dash Vol. 1",
        src: "songs/gd-main-menu.mp3",
        color: "#06b6d4",
        color2: "#164e63",
    },
    {
        id: "power-trip",
        title: "Power Trip",
        artist: "Boom Kitty",
        album: "Geometry Dash Vol. 2",
        src: "songs/power-trip.mp3",
        color: "#ef4444",
        color2: "#7f1d1d",
    },
    {
        id: "deadlocked",
        title: "Deadlocked",
        artist: "F-777",
        album: "Geometry Dash Vol. 2",
        src: "songs/deadlocked.mp3",
        color: "#dc2626",
        color2: "#450a0a",
    },
    {
        id: "geometry-dash",
        title: "Geometry Dash",
        artist: "RobTop Games",
        album: "Geometry Dash Vol. 3",
        src: "songs/geometry-dash.mp3",
        color: "#22d3ee",
        color2: "#155e75",
    },
    {
        id: "payload",
        title: "Payload",
        artist: "Waterflame",
        album: "Geometry Dash Vol. 3",
        src: "songs/payload.mp3",
        color: "#10b981",
        color2: "#064e3b",
    },
    {
        id: "round-1",
        title: "Round 1",
        artist: "Dex",
        album: "Geometry Dash Vol. 3",
        src: "songs/round-1.mp3",
        color: "#8b5cf6",
        color2: "#4c1d95",
    },
    {
        id: "press-start",
        title: "Press Start",
        artist: "MDK",
        album: "Geometry Dash Vol. 4",
        src: "songs/press-start.mp3",
        color: "#eab308",
        color2: "#713f12",
    },
    {
        id: "knock-me-out",
        title: "Knock Me Out",
        artist: "Raw Power",
        album: "Geometry Dash",
        src: "songs/knock-me-out.mp3",
        color: "#ec4899",
        color2: "#831843",
    },
    {
        id: "gd-death-sound",
        title: "Death Sound Effect",
        artist: "RobTop Games",
        album: "Geometry Dash",
        src: "songs/gd-death-sound.mp3",
        color: "#64748b",
        color2: "#1e293b",
    },
];

let PLAYLISTS = [
    {
        id: "all",
        name: "All Songs",
        description: "Every track in your library.",
        type: "playlist",
        owner: "Musicfly",
        color: "#1DB954",
        color2: "#064e3b",
        songIds: SONGS.map((s) => s.id),
    },
    {
        id: "mj-essentials",
        name: "Michael Jackson Essentials",
        description: "The King of Pop's biggest hits.",
        type: "playlist",
        owner: "Musicfly",
        color: "#7c3aed",
        color2: "#1e1b4b",
        songIds: ["thriller", "beat-it", "billie-jean", "smooth-criminal", "dont-stop"],
    },
    {
        id: "minecraft-chill",
        name: "Minecraft Chill",
        description: "Calm tracks from the Overworld.",
        type: "playlist",
        owner: "Musicfly",
        color: "#84cc16",
        color2: "#365314",
        songIds: ["minecraft-calm-1", "minecraft-calm-2", "minecraft-calm-3", "minecraft-cat"],
    },
    {
        id: "geometry-dash",
        name: "Geometry Dash",
        description: "Iconic tracks from the cube-jumping classic.",
        type: "playlist",
        owner: "Musicfly",
        color: "#22d3ee",
        color2: "#155e75",
        songIds: [
            "gd-main-menu",
            "geometry-dash",
            "stereo-madness",
            "years",
            "geometrical-dominator",
            "dash",
            "power-trip",
            "deadlocked",
            "payload",
            "round-1",
            "press-start",
            "knock-me-out",
            "gd-death-sound",
        ],
    },
    {
        id: "top-hits",
        name: "Today's Top Hits",
        description: "Songs that defined an era.",
        type: "playlist",
        owner: "Musicfly",
        color: "#ef4444",
        color2: "#7f1d1d",
        songIds: ["speed", "dont-stop", "nochentera", "azizam", "shape-of-you", "billie-jean", "thriller"],
    },
    {
        id: "chill-mix",
        name: "Chill Mix",
        description: "Relax and unwind.",
        type: "playlist",
        owner: "Musicfly",
        color: "#06b6d4",
        color2: "#164e63",
        songIds: ["ocean-waves", "minecraft-calm-1", "minecraft-calm-2", "minecraft-calm-3", "azizam", "shape-of-you", "billie-jean"],
    },
    {
        id: "discover",
        name: "Discover Weekly",
        description: "Your weekly mixtape of fresh tracks.",
        type: "playlist",
        owner: "Musicfly",
        color: "#f59e0b",
        color2: "#78350f",
        songIds: ["nochentera", "azizam", "smooth-criminal", "beat-it", "shape-of-you"],
    },
];

const BUNDLED_SONGS = SONGS.map((s) => ({ ...s }));
const BUNDLED_PLAYLISTS = JSON.parse(JSON.stringify(PLAYLISTS));
let USER_COLLECTIONS = [];
let PODCASTS = [];
let libraryFilter = "all";

const GENRES = [
    { name: "Pop",        color: "#dc2743" },
    { name: "Rock",       color: "#e91429" },
    { name: "Hip-Hop",    color: "#bc5900" },
    { name: "Indie",      color: "#608108" },
    { name: "Workout",    color: "#477d95" },
    { name: "Chill",      color: "#1e3264" },
    { name: "R&B",        color: "#9b4ade" },
    { name: "Dance",      color: "#8d67ab" },
    { name: "Country",    color: "#d84000" },
    { name: "Jazz",       color: "#7d4b32" },
    { name: "Classical",  color: "#5179a1" },
    { name: "Soul",       color: "#777777" },
];

// ----- Helpers -----
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const formatTime = (sec) => {
    if (!Number.isFinite(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
};

const songById = (id) => SONGS.find((s) => s.id === id);
const playlistById = (id) => PLAYLISTS.find((p) => p.id === id);
const podcastById = (id) => PODCASTS.find((p) => p.id === id);

const gradient = (a, b) => `linear-gradient(135deg, ${a} 0%, ${b} 100%)`;

const initials = (text) => {
    const words = text.split(/\s+/).filter(Boolean);
    return ((words[0]?.[0] ?? "") + (words[1]?.[0] ?? "")).toUpperCase() || "♪";
};

const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 5) return "Good night";
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
};

/** Resolve song paths correctly on GitHub Pages (/spotify/) and locally. */
const resolveSrc = (path) => new URL(path, window.location.href).href;

/** Deterministic gradient colors derived from a string (for uploaded songs). */
function colorsFor(seed) {
    let h = 0;
    for (let i = 0; i < seed.length; i++) {
        h = (h * 31 + seed.charCodeAt(i)) % 360;
    }
    const hue = h;
    const c1 = `hsl(${hue}, 62%, 48%)`;
    const c2 = `hsl(${(hue + 28) % 360}, 55%, 22%)`;
    return { color: c1, color2: c2 };
}

/** Normalize an API song into the shape the player/UI expects. */
function normalizeApiSong(s) {
    const { color, color2 } = colorsFor(s.id || s.title || "song");
    return {
        id: s.id,
        title: s.title,
        artist: s.artist,
        author: s.author || s.uploaderName || s.artist,
        album: s.album || "Single",
        src: s.audioUrl || s.src,
        color,
        color2,
        uploaderUid: s.uploaderUid || null,
        uploaderName: s.uploaderName || null,
        createdAt: s.createdAt || null,
    };
}

function normalizeLocalUpload(s) {
    const song = normalizeApiSong({
        ...s,
        audioUrl: s.audioUrl,
        uploaderUid: s.uploaderUid,
        uploaderName: s.uploaderName,
    });
    return song;
}

function userCollectionToPlaylist(col) {
    const { color, color2 } = colorsFor(col.id || col.name);
    return {
        id: col.id,
        name: col.name,
        description: col.description || "",
        type: col.type || "playlist",
        owner: col.ownerName || "You",
        color,
        color2,
        songIds: col.songIds || [],
        parentId: col.parentId || null,
        isUserCreated: true,
    };
}

function podcastToPlaylist(pod, episodes) {
    const { color, color2 } = colorsFor(pod.id || pod.title);
    return {
        id: `podcast:${pod.id}`,
        podcastId: pod.id,
        name: pod.title,
        description: pod.description || "",
        type: "podcast",
        owner: pod.author || pod.ownerName || "Podcaster",
        color,
        color2,
        songIds: (episodes || []).map((e) => `ep:${pod.id}:${e.id}`),
        episodes: episodes || [],
        isPodcast: true,
    };
}

function episodeAsSong(ep, podcast) {
    const { color, color2 } = colorsFor(ep.id || ep.title);
    return {
        id: `ep:${podcast.id}:${ep.id}`,
        title: ep.title,
        artist: podcast.author || podcast.title,
        author: podcast.author || podcast.ownerName,
        album: `${podcast.title} · Ep ${ep.episodeNumber || 1}`,
        src: ep.audioUrl,
        color,
        color2,
        isEpisode: true,
        podcastId: podcast.id,
        episodeId: ep.id,
    };
}

/** Build the sidebar/home playlists from a dynamic song list. */
function buildDynamicPlaylists(songs) {
    const playlists = [];
    const allIds = songs.map((s) => s.id);

    playlists.push({
        id: "all",
        name: "All Songs",
        description: "Every track in the library.",
        type: "playlist",
        owner: "Musicfly",
        color: "#1DB954",
        color2: "#064e3b",
        songIds: allIds,
    });

    if (songs.length) {
        playlists.push({
            id: "recently-added",
            name: "Recently Added",
            description: "The newest uploads.",
            type: "playlist",
            owner: "Musicfly",
            color: "#7c3aed",
            color2: "#1e1b4b",
            songIds: allIds.slice(0, Math.min(20, allIds.length)),
        });
    }

    const me = window.Musicfly?.currentUser?.uid;
    if (me) {
        const mine = songs.filter((s) => s.uploaderUid === me).map((s) => s.id);
        if (mine.length) {
            playlists.push({
                id: "your-uploads",
                name: "Your Uploads",
                description: "Songs you published.",
                type: "playlist",
                owner: window.Musicfly.currentUser.name || "You",
                color: "#f59e0b",
                color2: "#78350f",
                songIds: mine,
            });
        }
    }

    // One playlist per artist (with at least one song)
    const byArtist = new Map();
    songs.forEach((s) => {
        const key = s.artist || "Unknown Artist";
        if (!byArtist.has(key)) byArtist.set(key, []);
        byArtist.get(key).push(s.id);
    });
    [...byArtist.entries()]
        .sort((a, b) => b[1].length - a[1].length)
        .forEach(([artist, ids]) => {
            const { color, color2 } = colorsFor(artist);
            playlists.push({
                id: `artist:${artist}`,
                name: artist,
                description: `Tracks by ${artist}.`,
                type: "playlist",
                owner: "Musicfly",
                color,
                color2,
                songIds: ids,
            });
        });

    return playlists;
}

function mergePlaylists(basePlaylists, userCollections) {
    const userPls = userCollections.map(userCollectionToPlaylist);
    return [...userPls, ...basePlaylists];
}

/** Fetch library API — public for visitors, authed for logged-in users. */
function libraryFetch(path) {
    const base = window.Musicfly?.apiBase || "";
    if (window.Musicfly?.isVisitor || !window.Musicfly?.currentUser) {
        return fetch(base + path);
    }
    return window.Musicfly.authedFetch(path);
}

/** Load songs, playlists, and podcasts from API or local store. */
async function bootstrapData() {
    const user = window.Musicfly?.currentUser;
    const isVisitor = window.Musicfly?.isVisitor;

    if (window.Musicfly?.backendMode) {
        try {
            const [songsRes, plRes, podRes] = await Promise.all([
                libraryFetch("/api/songs"),
                user ? window.Musicfly.authedFetch("/api/playlists") : Promise.resolve(null),
                libraryFetch("/api/podcasts"),
            ]);
            if (!songsRes.ok) throw new Error(`API returned ${songsRes.status}`);
            const songsData = await songsRes.json();
            SONGS = (songsData.songs || []).map(normalizeApiSong);

            USER_COLLECTIONS = [];
            if (plRes?.ok) {
                const plData = await plRes.json();
                USER_COLLECTIONS = plData.playlists || [];
            }

            PODCASTS = [];
            if (podRes?.ok) {
                const podData = await podRes.json();
                PODCASTS = podData.podcasts || [];
            }

            const episodeSongs = [];
            for (const pod of PODCASTS) {
                try {
                    const res = await libraryFetch(`/api/podcasts/${pod.id}`);
                    if (res.ok) {
                        const data = await res.json();
                        pod._episodes = data.episodes || [];
                        pod._episodes.forEach((ep) => episodeSongs.push(episodeAsSong(ep, pod)));
                    }
                } catch {}
            }
            SONGS = [...SONGS, ...episodeSongs];

            const base = buildDynamicPlaylists(SONGS.filter((s) => !s.isEpisode));
            PLAYLISTS = mergePlaylists(base, USER_COLLECTIONS);
            PODCASTS.forEach((pod) => {
                PLAYLISTS.push(podcastToPlaylist(pod, pod._episodes || []));
            });
        } catch (err) {
            console.error("Could not load songs from API:", err);
            SONGS = [];
            PLAYLISTS = buildDynamicPlaylists(SONGS);
            showPlaybackError("Could not load the library from the server. Try refreshing.");
        }
        return;
    }

    // Visitor in local demo mode: bundled library only
    if (isVisitor) {
        SONGS = BUNDLED_SONGS.map((s) => ({ ...s, src: resolveSrc(s.src) }));
        PLAYLISTS = BUNDLED_PLAYLISTS.map((pl) => ({ ...pl }));
        USER_COLLECTIONS = [];
        PODCASTS = [];
        return;
    }

    // Demo mode with logged-in user: merge bundled library + local uploads
    if (user && window.MusicflyLocal) {
        const uploads = await window.MusicflyLocal.listUploads();
        const uploadSongs = uploads.map(normalizeLocalUpload);
        SONGS = [...BUNDLED_SONGS.map((s) => ({ ...s, src: resolveSrc(s.src) })), ...uploadSongs];

        USER_COLLECTIONS = window.MusicflyLocal.listPlaylists(user.uid);
        PODCASTS = window.MusicflyLocal.listPodcasts();

        const episodeSongs = [];
        for (const pod of PODCASTS) {
            const data = await window.MusicflyLocal.getPodcast(pod.id);
            if (data) {
                pod._episodes = data.episodes;
                data.episodes.forEach((ep) => episodeSongs.push(episodeAsSong(ep, pod)));
            }
        }
        SONGS = [...SONGS, ...episodeSongs];

        PLAYLISTS = mergePlaylists(
            BUNDLED_PLAYLISTS.map((pl) => ({ ...pl })),
            USER_COLLECTIONS
        );
        // Fix all-songs playlist in demo
        const allPl = PLAYLISTS.find((p) => p.id === "all");
        if (allPl) allPl.songIds = SONGS.filter((s) => !s.isEpisode).map((s) => s.id);

        PODCASTS.forEach((pod) => {
            PLAYLISTS.push(podcastToPlaylist(pod, pod._episodes || []));
        });
    }
}

// ====================================================
// State
// ====================================================
const state = {
    queue: [],          // array of song IDs (the playlist that's currently loaded)
    queueSource: null,  // playlist id that loaded the queue
    currentIndex: -1,   // index inside queue
    isPlaying: false,
    isShuffle: false,
    repeatMode: 0,      // 0 = off, 1 = all, 2 = one
    volume: 0.7,
    likedSongs: new Set(),
    likedPlaylists: new Set(["mj-essentials", "discover"]),
    currentView: "home",
    currentPlaylistId: null,
};

let audio;
let audioReadyHandler = null;
let audioErrorHandler = null;

function getAudio() {
    if (!audio) audio = $("#audio");
    return audio;
}

// ====================================================
// RENDERING
// ====================================================

// ----- Sidebar library -----
function renderLibrary() {
    const list = $("#library-list");
    list.innerHTML = "";

    const items = PLAYLISTS.filter((pl) => {
        if (libraryFilter === "playlists") return pl.type === "playlist" || pl.type === "folder";
        if (libraryFilter === "artists") return pl.id.startsWith("artist:");
        if (libraryFilter === "podcasts") return pl.type === "podcast";
        return true;
    });

    items.forEach((pl) => {
        const li = document.createElement("li");
        li.className = "library-item";
        li.dataset.playlistId = pl.id;
        if (state.currentPlaylistId === pl.id) li.classList.add("active");
        const typeLabel =
            pl.type === "folder" ? "Folder" : pl.type === "podcast" ? "Podcast" : "Playlist";
        li.innerHTML = `
            <div class="library-art" style="background:${gradient(pl.color, pl.color2)}">${initials(pl.name)}</div>
            <div class="library-meta">
                <div class="lib-title">${pl.name}</div>
                <div class="lib-sub">${typeLabel} · ${pl.owner}</div>
            </div>
        `;
        li.addEventListener("click", () => openPlaylist(pl.id));
        list.appendChild(li);
    });
}

// ----- Home view -----
function renderHome() {
    $("#greeting").textContent = getGreeting();

    // Quick-access grid (top 6 playlists)
    const quick = $("#quick-grid");
    quick.innerHTML = "";
    PLAYLISTS.slice(0, 6).forEach((pl) => {
        const card = document.createElement("div");
        card.className = "quick-card";
        card.innerHTML = `
            <div class="qc-art" style="background:${gradient(pl.color, pl.color2)}">${initials(pl.name)}</div>
            <div class="qc-title">${pl.name}</div>
            <button type="button" class="qc-play" title="Play ${pl.name}">
                <svg viewBox="0 0 16 16" width="22" height="22" fill="#000"><path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"/></svg>
            </button>
        `;
        card.addEventListener("click", () => openPlaylist(pl.id));
        card.querySelector(".qc-play").addEventListener("click", (e) => {
            e.stopPropagation();
            playPlaylist(pl.id);
        });
        quick.appendChild(card);
    });

    // Made for you - playlists
    const mfy = $("#made-for-you");
    mfy.innerHTML = "";
    PLAYLISTS.forEach((pl) => {
        mfy.appendChild(buildPlaylistCard(pl));
    });

    // Top songs - all songs as cards
    const topSongs = $("#top-songs");
    topSongs.innerHTML = "";
    SONGS.forEach((song) => {
        topSongs.appendChild(buildSongCard(song));
    });
}

function buildPlaylistCard(pl) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
        <div class="card-art" style="background:${gradient(pl.color, pl.color2)}">
            ${initials(pl.name)}
            <button type="button" class="card-play" title="Play">
                <svg viewBox="0 0 16 16" width="22" height="22" fill="#000"><path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"/></svg>
            </button>
        </div>
        <div class="card-title">${pl.name}</div>
        <div class="card-sub">${pl.description}</div>
    `;
    card.addEventListener("click", () => openPlaylist(pl.id));
    card.querySelector(".card-play").addEventListener("click", (e) => {
        e.stopPropagation();
        playPlaylist(pl.id);
    });
    return card;
}

function buildSongCard(song) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
        <div class="card-art" style="background:${gradient(song.color, song.color2)}">
            ${initials(song.title)}
            <button type="button" class="card-play" title="Play ${song.title}">
                <svg viewBox="0 0 16 16" width="22" height="22" fill="#000"><path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"/></svg>
            </button>
        </div>
        <div class="card-title">${song.title}</div>
        <div class="card-sub">${song.artist}</div>
    `;
    card.addEventListener("click", () => {
        playSongFromList(song.id, SONGS.map((s) => s.id), "all");
    });
    card.querySelector(".card-play").addEventListener("click", (e) => {
        e.stopPropagation();
        playSongFromList(song.id, SONGS.map((s) => s.id), "all");
    });
    return card;
}

// ----- Playlist view -----
function renderPlaylistView(playlistId) {
    const pl = playlistById(playlistId);
    if (!pl) return;
    state.currentPlaylistId = playlistId;

    const header = $("#playlist-header");
    header.style.setProperty("--header-gradient", pl.color);
    header.innerHTML = `
        <div class="playlist-cover" style="background:${gradient(pl.color, pl.color2)}">${initials(pl.name)}</div>
        <div class="playlist-meta">
            <div class="type">${pl.type}</div>
            <h1>${pl.name}</h1>
            <div class="info">
                <strong>${pl.owner}</strong> · ${pl.description} · <strong>${pl.songIds.length}</strong> ${pl.type === "podcast" ? "episodes" : "songs"}
            </div>
        </div>
    `;

    const table = $("#track-table");
    table.innerHTML = `
        <div class="track-header">
            <div style="text-align:right">#</div>
            <div>Title</div>
            <div>Album</div>
            <div style="text-align:right">
                <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"/><path d="M8 3.25a.75.75 0 0 1 .75.75v3.25H11a.75.75 0 0 1 0 1.5H7.25V4A.75.75 0 0 1 8 3.25z"/></svg>
            </div>
        </div>
    `;

    pl.songIds.forEach((sid, idx) => {
        const song = songById(sid);
        if (!song) return;
        const row = document.createElement("div");
        row.className = "track-row";
        row.dataset.songId = song.id;

        // Mark currently playing
        if (state.currentIndex >= 0 && state.queue[state.currentIndex] === song.id && state.queueSource === pl.id) {
            row.classList.add("playing");
        }

        row.innerHTML = `
            <div class="index">${idx + 1}</div>
            <div class="cell-title">
                <div class="row-art" style="background:${gradient(song.color, song.color2)}">${initials(song.title)}</div>
                <div class="cell-title-text">
                    <div class="t-name">${song.title}</div>
                    <div class="t-artist">${song.artist}${song.author && song.author !== song.artist ? ` · by ${song.author}` : ""}</div>
                </div>
            </div>
            <div class="cell-album">${song.album}</div>
            <div class="cell-duration" data-duration-for="${song.id}">—:—</div>
        `;
        row.addEventListener("dblclick", () => playSongFromList(song.id, pl.songIds, pl.id));
        row.addEventListener("click", () => playSongFromList(song.id, pl.songIds, pl.id));
        table.appendChild(row);

        // Lazily load duration via a hidden audio
        const tmp = new Audio();
        tmp.preload = "metadata";
        tmp.src = song.src;
        tmp.addEventListener("loadedmetadata", () => {
            const el = document.querySelector(`[data-duration-for="${song.id}"]`);
            if (el) el.textContent = formatTime(tmp.duration);
        });
    });
}

// ----- Search view -----
function renderBrowse() {
    const grid = $("#genre-grid");
    grid.innerHTML = "";
    GENRES.forEach((g) => {
        const div = document.createElement("div");
        div.className = "genre-card";
        div.style.background = g.color;
        div.textContent = g.name;
        grid.appendChild(div);
    });
}

function runSearch(query) {
    const q = query.trim().toLowerCase();
    const header = $("#search-results-header");
    const results = $("#search-results");
    const browse = $("#browse");

    if (!q) {
        header.innerHTML = "";
        results.innerHTML = "";
        browse.style.display = "block";
        return;
    }

    browse.style.display = "none";

    const matches = SONGS.filter(
        (s) =>
            s.title.toLowerCase().includes(q) ||
            s.artist.toLowerCase().includes(q) ||
            s.album.toLowerCase().includes(q)
    );
    const plMatches = PLAYLISTS.filter(
        (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
    );

    header.innerHTML = `<h2 style="font-size:1.5rem;font-weight:800;">Results for “${query}”</h2>`;
    results.innerHTML = "";

    if (matches.length === 0 && plMatches.length === 0) {
        results.innerHTML = `<p style="color:var(--text-secondary);padding:24px 0;">No matches found. Try another search term.</p>`;
        return;
    }

    if (plMatches.length) {
        const row = document.createElement("div");
        row.innerHTML = `<h3 style="margin:16px 0 12px;font-size:1.1rem;font-weight:800;">Playlists</h3>`;
        const grid = document.createElement("div");
        grid.className = "card-grid";
        plMatches.forEach((pl) => grid.appendChild(buildPlaylistCard(pl)));
        row.appendChild(grid);
        results.appendChild(row);
    }

    if (matches.length) {
        const row = document.createElement("div");
        row.innerHTML = `<h3 style="margin:24px 0 12px;font-size:1.1rem;font-weight:800;">Songs</h3>`;
        const grid = document.createElement("div");
        grid.className = "card-grid";
        matches.forEach((s) => grid.appendChild(buildSongCard(s)));
        row.appendChild(grid);
        results.appendChild(row);
    }
}

// ====================================================
// NAVIGATION
// ====================================================
function switchView(viewName) {
    state.currentView = viewName;
    $$(".view").forEach((v) => v.classList.toggle("active", v.dataset.view === viewName));
    $$(".nav-item").forEach((n) => n.classList.toggle("active", n.dataset.view === viewName));

    if (viewName === "search") {
        $("#search-input").focus();
    }

    // Reset main scroll
    $("#content").scrollTop = 0;
}

function openPlaylist(playlistId) {
    renderPlaylistView(playlistId);
    switchView("playlist");
    // ensure the playlist nav-item highlight in sidebar
    $$(".library-item").forEach((li) =>
        li.classList.toggle("active", li.dataset.playlistId === playlistId)
    );
}

// ====================================================
// PLAYBACK
// ====================================================
function playPlaylist(playlistId) {
    const pl = playlistById(playlistId);
    if (!pl || !pl.songIds.length) return;
    state.queue = [...pl.songIds];
    state.queueSource = playlistId;
    state.currentIndex = 0;
    if (state.isShuffle) shuffleQueueFromCurrent();
    loadAndPlayCurrent();
}

function playSongFromList(songId, sourceIds, sourceId) {
    state.queue = [...sourceIds];
    state.queueSource = sourceId;
    state.currentIndex = state.queue.indexOf(songId);
    if (state.currentIndex < 0) state.currentIndex = 0;
    loadAndPlayCurrent();
}

function showPlaybackError(message) {
    const toast = $("#playback-toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.remove("hidden");
}

function hidePlaybackError() {
    $("#playback-toast")?.classList.add("hidden");
}

function audioErrorMessage(song) {
    if (window.location.protocol === "file:") {
        return "Open via the local server: run start.cmd, then go to http://localhost:5500/";
    }
    if (window.location.hostname.includes("github.io") || window.location.hostname.includes("vercel.app")) {
        return `“${song.title}” could not be loaded. Try refreshing — if it persists, redeploy with the songs/ folder included.`;
    }
    return `Could not load “${song.title}”. Make sure the server is running (start.cmd) and songs/ has the MP3 files.`;
}

function clearAudioHandlers() {
    const el = getAudio();
    if (audioReadyHandler) {
        el.removeEventListener("canplay", audioReadyHandler);
        audioReadyHandler = null;
    }
    if (audioErrorHandler) {
        el.removeEventListener("error", audioErrorHandler);
        audioErrorHandler = null;
    }
}

function startPlayback() {
    const el = getAudio();
    return el.play().then(() => {
        state.isPlaying = true;
        hidePlaybackError();
        updatePlayPauseIcon();
        updatePlayingHighlights();
    }).catch((err) => {
        state.isPlaying = false;
        updatePlayPauseIcon();
        if (err?.name !== "AbortError") {
            const song = songById(state.queue[state.currentIndex]);
            showPlaybackError(
                song
                    ? `Playback blocked or failed for “${song.title}”. Click play again.`
                    : "Playback failed. Click play again."
            );
        }
    });
}

function loadAndPlayCurrent() {
    const songId = state.queue[state.currentIndex];
    const song = songById(songId);
    if (!song) return;

    const el = getAudio();
    const src = resolveSrc(song.src);

    updateNowPlayingUI();
    clearAudioHandlers();

    const onReady = () => {
        clearAudioHandlers();
        startPlayback();
    };

    const onFail = () => {
        clearAudioHandlers();
        state.isPlaying = false;
        updatePlayPauseIcon();
        showPlaybackError(audioErrorMessage(song));
    };

    audioReadyHandler = onReady;
    audioErrorHandler = onFail;

    if (el.dataset.loadedSrc === src && el.readyState >= 2) {
        startPlayback();
        return;
    }

    el.dataset.loadedSrc = src;
    el.src = src;
    el.load();
    el.addEventListener("canplay", onReady);
    el.addEventListener("error", onFail);
}

function togglePlay() {
    if (state.currentIndex < 0) {
        playPlaylist("all");
        return;
    }
    const el = getAudio();
    if (el.paused) {
        startPlayback();
    } else {
        el.pause();
        state.isPlaying = false;
        updatePlayPauseIcon();
    }
}

function nextSong() {
    if (!state.queue.length) return;
    if (state.repeatMode === 2) {
        const el = getAudio();
        el.currentTime = 0;
        startPlayback();
        return;
    }
    let next = state.currentIndex + 1;
    if (next >= state.queue.length) {
        if (state.repeatMode === 1) {
            next = 0;
        } else {
            getAudio().pause();
            state.isPlaying = false;
            updatePlayPauseIcon();
            return;
        }
    }
    state.currentIndex = next;
    loadAndPlayCurrent();
}

function prevSong() {
    if (!state.queue.length) return;
    const el = getAudio();
    if (el.currentTime > 3) {
        el.currentTime = 0;
        return;
    }
    let prev = state.currentIndex - 1;
    if (prev < 0) prev = state.queue.length - 1;
    state.currentIndex = prev;
    loadAndPlayCurrent();
}

function toggleShuffle() {
    state.isShuffle = !state.isShuffle;
    $("#shuffle-btn").classList.toggle("active", state.isShuffle);
    if (state.isShuffle) shuffleQueueFromCurrent();
}

function shuffleQueueFromCurrent() {
    const current = state.queue[state.currentIndex];
    const rest = state.queue.filter((_, i) => i !== state.currentIndex);
    for (let i = rest.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rest[i], rest[j]] = [rest[j], rest[i]];
    }
    state.queue = current ? [current, ...rest] : rest;
    state.currentIndex = 0;
}

function cycleRepeat() {
    state.repeatMode = (state.repeatMode + 1) % 3;
    const btn = $("#repeat-btn");
    btn.classList.toggle("active", state.repeatMode > 0);
    btn.title = ["Repeat off", "Repeat all", "Repeat one"][state.repeatMode];
    // Visually distinguish repeat-one by adding a small "1" badge via title text;
    // for simplicity we just leave the dot indicator.
}

// ====================================================
// UI updates
// ====================================================
function updateNowPlayingUI() {
    if (state.currentIndex < 0) return;
    const song = songById(state.queue[state.currentIndex]);
    if (!song) return;
    $("#player-title").textContent = song.title;
    $("#player-artist").textContent = song.artist;
    $("#player-art").style.background = gradient(song.color, song.color2);
    $("#player-art").textContent = initials(song.title);
    $("#like-btn").classList.toggle("liked", state.likedSongs.has(song.id));
    updatePlayPauseIcon();
    document.title = `${song.title} • ${song.artist} — Musicfly`;
}

function updatePlayPauseIcon() {
    const icon = $("#play-icon");
    const el = getAudio();
    if (state.isPlaying && el && !el.paused) {
        icon.innerHTML = '<path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"/>';
        $("#play-btn").title = "Pause";
    } else {
        icon.innerHTML = '<path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"/>';
        $("#play-btn").title = "Play";
    }
}

function updatePlayingHighlights() {
    if (state.currentView === "playlist" && state.currentPlaylistId === state.queueSource) {
        $$(".track-row").forEach((row) => {
            row.classList.toggle("playing", row.dataset.songId === state.queue[state.currentIndex]);
        });
    }
}

function updateProgressUI() {
    const el = getAudio();
    const cur = el?.currentTime || 0;
    const dur = el?.duration || 0;
    $("#current-time").textContent = formatTime(cur);
    $("#duration").textContent = formatTime(dur);
    const pct = dur ? (cur / dur) * 100 : 0;
    $("#progress-fill").style.width = `${pct}%`;
    $("#progress-thumb").style.left = `${pct}%`;
}

// ====================================================
// SCRUBBING
// ====================================================
function bindScrub(barEl, fillEl, thumbEl, onSeek) {
    let dragging = false;

    const valueFromEvent = (e) => {
        const rect = barEl.getBoundingClientRect();
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        return Math.min(1, Math.max(0, x / rect.width));
    };

    const apply = (v) => {
        fillEl.style.width = `${v * 100}%`;
        thumbEl.style.left = `${v * 100}%`;
    };

    barEl.addEventListener("mousedown", (e) => {
        dragging = true;
        const v = valueFromEvent(e);
        apply(v);
        onSeek(v, false);
    });

    document.addEventListener("mousemove", (e) => {
        if (!dragging) return;
        const v = valueFromEvent(e);
        apply(v);
        onSeek(v, false);
    });

    document.addEventListener("mouseup", (e) => {
        if (!dragging) return;
        dragging = false;
        const v = valueFromEvent(e);
        onSeek(v, true);
    });
}

async function checkLibraryAvailable() {
    if (window.Musicfly && window.Musicfly.backendMode) return; // API mode handles its own errors
    const song = SONGS[0];
    if (!song) return;
    try {
        const res = await fetch(resolveSrc(song.src), { method: "HEAD" });
        if (!res.ok) {
            showPlaybackError(audioErrorMessage(song));
        }
    } catch {
        if (window.location.protocol === "file:") {
            showPlaybackError("Open via the local server: run start.cmd, then go to http://localhost:5500/");
        }
    }
}

// ====================================================
// INIT
// ====================================================
function init() {
    audio = $("#audio");
    if (!audio) {
        console.error("Audio element not found");
        return;
    }
    audio.volume = state.volume;

    renderLibrary();
    renderHome();
    renderBrowse();
    checkLibraryAvailable();

    // ----- Top nav -----
    $$(".nav-item").forEach((n) => {
        n.addEventListener("click", () => switchView(n.dataset.view));
    });

    // ----- Search input -----
    const searchInput = $("#search-input");
    searchInput.addEventListener("focus", () => switchView("search"));
    searchInput.addEventListener("input", (e) => runSearch(e.target.value));

    // ----- Player controls -----
    $("#play-btn").addEventListener("click", togglePlay);
    $("#next-btn").addEventListener("click", nextSong);
    $("#prev-btn").addEventListener("click", prevSong);
    $("#shuffle-btn").addEventListener("click", toggleShuffle);
    $("#repeat-btn").addEventListener("click", cycleRepeat);

    $("#play-playlist").addEventListener("click", () => {
        if (state.currentPlaylistId) playPlaylist(state.currentPlaylistId);
    });

    $("#like-btn").addEventListener("click", () => {
        if (state.currentIndex < 0) return;
        const sid = state.queue[state.currentIndex];
        if (state.likedSongs.has(sid)) state.likedSongs.delete(sid);
        else state.likedSongs.add(sid);
        $("#like-btn").classList.toggle("liked", state.likedSongs.has(sid));
    });

    // ----- Audio events -----
    audio.addEventListener("play", () => {
        state.isPlaying = true;
        updatePlayPauseIcon();
    });
    audio.addEventListener("pause", () => {
        state.isPlaying = false;
        updatePlayPauseIcon();
    });
    audio.addEventListener("timeupdate", updateProgressUI);
    audio.addEventListener("loadedmetadata", updateProgressUI);
    audio.addEventListener("ended", nextSong);
    audio.addEventListener("error", () => {
        const song = songById(state.queue[state.currentIndex]);
        if (song) showPlaybackError(audioErrorMessage(song));
    });

    // ----- Scrubbing -----
    bindScrub(
        $("#progress-bar"),
        $("#progress-fill"),
        $("#progress-thumb"),
        (v, commit) => {
            const el = getAudio();
            if (!el.duration) return;
            if (commit) el.currentTime = v * el.duration;
        }
    );

    bindScrub(
        $("#volume-bar"),
        $("#volume-fill"),
        $("#volume-thumb"),
        (v) => {
            state.volume = v;
            const el = getAudio();
            el.volume = v;
            el.muted = false;
        }
    );

    // initial volume render
    $("#volume-fill").style.width = `${state.volume * 100}%`;
    $("#volume-thumb").style.left = `${state.volume * 100}%`;

    $("#volume-btn").addEventListener("click", () => {
        const el = getAudio();
        el.muted = !el.muted;
        $("#volume-fill").style.width = el.muted ? "0%" : `${state.volume * 100}%`;
        $("#volume-thumb").style.left = el.muted ? "0%" : `${state.volume * 100}%`;
    });

    // ----- Keyboard shortcuts -----
    document.addEventListener("keydown", (e) => {
        if (e.target.tagName === "INPUT") return;
        if (e.code === "Space") { e.preventDefault(); togglePlay(); }
        else if (e.code === "ArrowRight" && e.shiftKey) nextSong();
        else if (e.code === "ArrowLeft" && e.shiftKey) prevSong();
        else if (e.code === "ArrowUp") {
            e.preventDefault();
            state.volume = Math.min(1, state.volume + 0.05);
            getAudio().volume = state.volume;
            $("#volume-fill").style.width = `${state.volume * 100}%`;
            $("#volume-thumb").style.left = `${state.volume * 100}%`;
        } else if (e.code === "ArrowDown") {
            e.preventDefault();
            state.volume = Math.max(0, state.volume - 0.05);
            getAudio().volume = state.volume;
            $("#volume-fill").style.width = `${state.volume * 100}%`;
            $("#volume-thumb").style.left = `${state.volume * 100}%`;
        }
    });

    // ----- Library chips -----
    $$(".chip").forEach((c) => {
        c.addEventListener("click", () => {
            $$(".chip").forEach((x) => x.classList.remove("active"));
            c.classList.add("active");
            libraryFilter = c.dataset.filter || "all";
            renderLibrary();
        });
    });

    wireAccountUI();
    wireUploadUI();
    wireCreateUI();

    // Show home initially
    switchView("home");
}

// ====================================================
// ACCOUNT UI (avatar + logout)
// ====================================================
function updateAccountUI() {
    const user = window.Musicfly?.currentUser;
    const isVisitor = window.Musicfly?.isVisitor;
    const avatar = $("#avatar-btn");
    const uploadBtn = $("#upload-btn");
    const createBtn = $("#create-btn");
    const dropName = $("#user-dropdown-name");
    const loginBtn = $("#login-btn");
    const logoutBtn = $("#logout-btn");
    const sidebarCreate = $("#create-playlist-btn");

    if (user) {
        const label = user.name || user.email || "You";
        if (avatar) avatar.textContent = (label[0] || "U").toUpperCase();
        if (dropName) dropName.textContent = label;
        // Any signed-in account can upload music.
        uploadBtn?.classList.remove("hidden");
        createBtn?.classList.toggle("hidden", !window.Musicfly?.canUpload);
        sidebarCreate?.classList.toggle("hidden", !window.Musicfly?.canUpload);
        loginBtn?.classList.add("hidden");
        logoutBtn?.classList.remove("hidden");
    } else if (isVisitor) {
        if (avatar) avatar.textContent = "V";
        if (dropName) dropName.textContent = "Visitor";
        // Keep Upload visible so visitors can discover the feature (opens login).
        uploadBtn?.classList.remove("hidden");
        createBtn?.classList.add("hidden");
        sidebarCreate?.classList.add("hidden");
        loginBtn?.classList.remove("hidden");
        logoutBtn?.classList.remove("hidden");
    } else {
        if (avatar) avatar.textContent = "T";
        uploadBtn?.classList.remove("hidden");
        createBtn?.classList.add("hidden");
        sidebarCreate?.classList.add("hidden");
        loginBtn?.classList.add("hidden");
        logoutBtn?.classList.remove("hidden");
    }
}

function wireAccountUI() {
    const avatar = $("#avatar-btn");
    const dropdown = $("#user-dropdown");
    const logout = $("#logout-btn");
    const login = $("#login-btn");

    avatar?.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!window.Musicfly?.currentUser && !window.Musicfly?.isVisitor) return;
        dropdown?.classList.toggle("hidden");
    });

    document.addEventListener("click", () => dropdown?.classList.add("hidden"));

    login?.addEventListener("click", () => {
        dropdown?.classList.add("hidden");
        window.Musicfly?.showLogin();
    });

    logout?.addEventListener("click", () => {
        dropdown?.classList.add("hidden");
        window.Musicfly?.signOut();
    });
}

// ====================================================
// UPLOAD UI
// ====================================================
function wireUploadUI() {
    const modal = $("#upload-modal");
    const openBtn = $("#upload-btn");
    const closeBtn = $("#upload-close");
    const form = $("#upload-form");
    const fileInput = $("#upload-file");
    const fileText = $("#file-drop-text");
    const errorBox = $("#upload-error");
    const progress = $("#upload-progress");
    const progressFill = $("#upload-progress-fill");
    const submit = $("#upload-submit");

    const open = () => {
        if (!window.Musicfly?.currentUser || window.Musicfly?.isVisitor) {
            window.Musicfly?.showLogin?.();
            return;
        }
        modal?.classList.remove("hidden");
        showUploadError("");
    };
    const close = () => {
        modal?.classList.add("hidden");
        form?.reset();
        if (fileText) fileText.textContent = "Click to choose an audio file (MP3, max 32 MB)";
        progress?.classList.add("hidden");
        if (progressFill) progressFill.style.width = "0%";
    };

    function showUploadError(msg) {
        if (!errorBox) return;
        errorBox.textContent = msg;
        errorBox.classList.toggle("hidden", !msg);
    }

    openBtn?.addEventListener("click", open);
    document.getElementById("home-upload-cta")?.addEventListener("click", open);
    closeBtn?.addEventListener("click", close);
    modal?.addEventListener("click", (e) => {
        if (e.target === modal) close();
    });

    fileInput?.addEventListener("change", () => {
        const f = fileInput.files?.[0];
        if (f && fileText) fileText.textContent = f.name;
    });

    form?.addEventListener("submit", async (e) => {
        e.preventDefault();
        showUploadError("");

        const file = fileInput.files?.[0];
        const title = $("#upload-title").value.trim();
        const artist = $("#upload-artist").value.trim();
        const author = ($("#upload-author").value.trim() || window.Musicfly.currentUser?.name || artist);
        const album = $("#upload-album").value.trim();

        if (!file) return showUploadError("Please choose an audio file.");
        if (file.size > 32 * 1024 * 1024) return showUploadError("File is larger than 32 MB.");
        if (!title || !artist) return showUploadError("Title and artist are required.");
        if (!window.Musicfly?.currentUser || window.Musicfly?.isVisitor) {
            return showUploadError("Log in to upload music.");
        }

        submit.disabled = true;
        submit.textContent = "Uploading…";
        progress?.classList.remove("hidden");

        try {
            if (window.Musicfly.backendMode) {
                const token = await window.Musicfly.getToken();
                if (!token) return showUploadError("You must be logged in to upload.");

                const fd = new FormData();
                fd.append("audio", file);
                fd.append("title", title);
                fd.append("artist", artist);
                fd.append("author", author);
                fd.append("album", album);

                await uploadWithProgress(
                    (window.Musicfly.apiBase || "") + "/api/songs",
                    fd,
                    token,
                    (pct) => {
                        if (progressFill) progressFill.style.width = `${pct}%`;
                    }
                );
            } else {
                const user = window.Musicfly.currentUser;
                await window.MusicflyLocal.addUpload({
                    title,
                    artist,
                    author,
                    album,
                    uploaderUid: user.uid,
                    uploaderName: user.name,
                    file,
                });
                if (progressFill) progressFill.style.width = "100%";
            }
            close();
            await bootstrapData();
            renderLibrary();
            renderHome();
            renderBrowse();
            updateAccountUI();
            switchView("home");
        } catch (err) {
            showUploadError(err.message || "Upload failed.");
        } finally {
            submit.disabled = false;
            submit.textContent = "Publish to library";
        }
    });
}

/** Upload via XHR so we get a progress bar (fetch has no upload progress). */
function uploadWithProgress(url, formData, token, onProgress) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable && onProgress) {
                onProgress(Math.round((e.loaded / e.total) * 100));
            }
        };
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(JSON.parse(xhr.responseText || "{}"));
            } else {
                let msg = `Upload failed (${xhr.status}).`;
                try {
                    msg = JSON.parse(xhr.responseText).error || msg;
                } catch {}
                reject(new Error(msg));
            }
        };
        xhr.onerror = () => reject(new Error("Network error during upload."));
        xhr.send(formData);
    });
}

// ====================================================
// CREATE UI (playlists, folders, podcasts)
// ====================================================
function requireCanUpload() {
    if (window.Musicfly?.isVisitor || !window.Musicfly?.currentUser) {
        window.Musicfly?.showLogin?.();
        alert("Log in to upload music or create content.");
        return false;
    }
    if (!window.Musicfly?.canUpload) {
        alert("Log in to upload music or create content.");
        return false;
    }
    return true;
}

function wireCreateUI() {
    const menuModal = $("#create-menu-modal");
    const openMenu = () => {
        if (!requireCanUpload()) return;
        menuModal?.classList.remove("hidden");
    };
    const closeMenu = () => menuModal?.classList.add("hidden");

    $("#create-btn")?.addEventListener("click", openMenu);
    $("#create-playlist-btn")?.addEventListener("click", openMenu);
    $("#create-menu-close")?.addEventListener("click", closeMenu);
    menuModal?.addEventListener("click", (e) => {
        if (e.target === menuModal) closeMenu();
    });

    $$(".create-menu-item").forEach((btn) => {
        btn.addEventListener("click", () => {
            closeMenu();
            const kind = btn.dataset.create;
            if (kind === "playlist") openCollectionModal("playlist");
            else if (kind === "folder") openCollectionModal("folder");
            else if (kind === "podcast") openPodcastModal();
            else if (kind === "episode") openEpisodeModal();
        });
    });

    // Collection (playlist / folder)
    const collModal = $("#create-collection-modal");
    const collForm = $("#create-collection-form");
    const closeColl = () => {
        collModal?.classList.add("hidden");
        collForm?.reset();
        hideFormError("create-collection-error");
    };
    $("#create-collection-close")?.addEventListener("click", closeColl);
    collModal?.addEventListener("click", (e) => {
        if (e.target === collModal) closeColl();
    });

    collForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!requireCanUpload()) return;
        const name = $("#create-collection-name").value.trim();
        const description = $("#create-collection-desc").value.trim();
        const type = $("#create-collection-type").value;
        const user = window.Musicfly.currentUser;
        hideFormError("create-collection-error");
        try {
            if (window.Musicfly.backendMode) {
                const res = await window.Musicfly.authedFetch("/api/playlists", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, description, type }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Could not create.");
            } else {
                window.MusicflyLocal.createPlaylist({
                    name,
                    description,
                    type,
                    ownerUid: user.uid,
                    ownerName: user.name,
                });
            }
            closeColl();
            await bootstrapData();
            renderLibrary();
            renderHome();
        } catch (err) {
            showFormError("create-collection-error", err.message);
        }
    });

    // Podcast
    const podModal = $("#create-podcast-modal");
    const podForm = $("#create-podcast-form");
    const closePod = () => {
        podModal?.classList.add("hidden");
        podForm?.reset();
        hideFormError("create-podcast-error");
    };
    $("#create-podcast-close")?.addEventListener("click", closePod);
    podModal?.addEventListener("click", (e) => {
        if (e.target === podModal) closePod();
    });

    podForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!requireCanUpload()) return;
        const title = $("#create-podcast-title").value.trim();
        const author = ($("#create-podcast-author").value.trim() || window.Musicfly.currentUser?.name);
        const description = $("#create-podcast-desc").value.trim();
        const user = window.Musicfly.currentUser;
        hideFormError("create-podcast-error");
        try {
            if (window.Musicfly.backendMode) {
                const res = await window.Musicfly.authedFetch("/api/podcasts", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title, author, description }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Could not create podcast.");
            } else {
                window.MusicflyLocal.createPodcast({
                    title,
                    author,
                    description,
                    ownerUid: user.uid,
                    ownerName: user.name,
                });
            }
            closePod();
            await bootstrapData();
            renderLibrary();
            renderHome();
        } catch (err) {
            showFormError("create-podcast-error", err.message);
        }
    });

    // Episode upload
    const epModal = $("#episode-modal");
    const epForm = $("#episode-form");
    const epFile = $("#episode-file");
    const closeEp = () => {
        epModal?.classList.add("hidden");
        epForm?.reset();
        hideFormError("episode-error");
        if ($("#episode-file-text")) $("#episode-file-text").textContent = "Choose episode audio (max 32 MB)";
    };
    $("#episode-close")?.addEventListener("click", closeEp);
    epModal?.addEventListener("click", (e) => {
        if (e.target === epModal) closeEp();
    });

    epFile?.addEventListener("change", () => {
        const f = epFile.files?.[0];
        if (f && $("#episode-file-text")) $("#episode-file-text").textContent = f.name;
    });

    epForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!requireCanUpload()) return;
        const podcastId = $("#episode-podcast").value;
        const file = epFile.files?.[0];
        const title = $("#episode-title").value.trim();
        const episodeNumber = $("#episode-number").value || 1;
        const description = $("#episode-desc").value.trim();
        hideFormError("episode-error");
        if (!podcastId) return showFormError("episode-error", "Choose a podcast.");
        if (!file) return showFormError("episode-error", "Choose an audio file.");
        if (file.size > 32 * 1024 * 1024) return showFormError("episode-error", "File is larger than 32 MB.");

        const submit = $("#episode-submit");
        submit.disabled = true;
        try {
            if (window.Musicfly.backendMode) {
                const token = await window.Musicfly.getToken();
                const fd = new FormData();
                fd.append("audio", file);
                fd.append("title", title);
                fd.append("episodeNumber", episodeNumber);
                fd.append("description", description);
                await uploadWithProgress(
                    `${window.Musicfly.apiBase || ""}/api/podcasts/${podcastId}/episodes`,
                    fd,
                    token,
                    () => {}
                );
            } else {
                await window.MusicflyLocal.addEpisode(podcastId, window.Musicfly.currentUser.uid, {
                    title,
                    episodeNumber,
                    description,
                    file,
                });
            }
            closeEp();
            await bootstrapData();
            renderLibrary();
            renderHome();
        } catch (err) {
            showFormError("episode-error", err.message);
        } finally {
            submit.disabled = false;
        }
    });
}

function openCollectionModal(type) {
    if (!requireCanUpload()) return;
    $("#create-collection-type").value = type;
    $("#create-collection-title").textContent = type === "folder" ? "New folder" : "New playlist";
    $("#create-collection-modal")?.classList.remove("hidden");
}

function openPodcastModal() {
    if (!requireCanUpload()) return;
    const authorInput = $("#create-podcast-author");
    if (authorInput && !authorInput.value) {
        authorInput.placeholder = window.Musicfly.currentUser?.name || "Your name";
    }
    $("#create-podcast-modal")?.classList.remove("hidden");
}

function openEpisodeModal() {
    if (!requireCanUpload()) return;
    const select = $("#episode-podcast");
    if (!select) return;
    const myUid = window.Musicfly.currentUser?.uid;
    const mine = PODCASTS.filter((p) => p.ownerUid === myUid);
    select.innerHTML = mine.length
        ? mine.map((p) => `<option value="${p.id}">${p.title}</option>`).join("")
        : `<option value="">Create a podcast first</option>`;
    $("#episode-modal")?.classList.remove("hidden");
}

function showFormError(id, msg) {
    const box = document.getElementById(id);
    if (!box) return;
    box.textContent = msg;
    box.classList.toggle("hidden", !msg);
}

function hideFormError(id) {
    showFormError(id, "");
}

// ====================================================
// APP ENTRY (controlled by auth.js)
// ====================================================
let appWired = false;

window.MusicflyApp = {
    async start() {
        await window.Musicfly?.refreshProfile();
        await bootstrapData();
        if (!appWired) {
            init();
            appWired = true;
        } else {
            renderLibrary();
            renderHome();
            renderBrowse();
        }
        updateAccountUI();
    },
    async onUserChanged() {
        await window.Musicfly?.refreshProfile();
        await bootstrapData();
        renderLibrary();
        renderHome();
        renderBrowse();
        updateAccountUI();
        switchView("home");
    },
    onSignedOut() {
        try {
            getAudio().pause();
        } catch {}
        state.isPlaying = false;
        state.queue = [];
        state.currentIndex = -1;
        updateAccountUI();
    },
};
