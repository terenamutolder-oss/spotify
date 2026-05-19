/* ============================================================
   Spotifly — a Spotify-inspired web player (vanilla JS)
   ============================================================ */

// ----- Song & playlist data -----
const SONGS = [
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
];

const PLAYLISTS = [
    {
        id: "all",
        name: "All Songs",
        description: "Every track in your library.",
        type: "playlist",
        owner: "Spotifly",
        color: "#1DB954",
        color2: "#064e3b",
        songIds: SONGS.map((s) => s.id),
    },
    {
        id: "mj-essentials",
        name: "Michael Jackson Essentials",
        description: "The King of Pop's biggest hits.",
        type: "playlist",
        owner: "Spotifly",
        color: "#7c3aed",
        color2: "#1e1b4b",
        songIds: ["thriller", "beat-it", "billie-jean", "smooth-criminal"],
    },
    {
        id: "top-hits",
        name: "Today's Top Hits",
        description: "Songs that defined an era.",
        type: "playlist",
        owner: "Spotifly",
        color: "#ef4444",
        color2: "#7f1d1d",
        songIds: ["shape-of-you", "billie-jean", "thriller"],
    },
    {
        id: "chill-mix",
        name: "Chill Mix",
        description: "Relax and unwind.",
        type: "playlist",
        owner: "Spotifly",
        color: "#06b6d4",
        color2: "#164e63",
        songIds: ["shape-of-you", "billie-jean"],
    },
    {
        id: "discover",
        name: "Discover Weekly",
        description: "Your weekly mixtape of fresh tracks.",
        type: "playlist",
        owner: "Spotifly",
        color: "#f59e0b",
        color2: "#78350f",
        songIds: ["smooth-criminal", "beat-it", "shape-of-you"],
    },
];

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

const audio = $("#audio");
audio.volume = state.volume;

// ====================================================
// RENDERING
// ====================================================

// ----- Sidebar library -----
function renderLibrary() {
    const list = $("#library-list");
    list.innerHTML = "";
    PLAYLISTS.forEach((pl) => {
        const li = document.createElement("li");
        li.className = "library-item";
        li.dataset.playlistId = pl.id;
        if (state.currentPlaylistId === pl.id) li.classList.add("active");
        li.innerHTML = `
            <div class="library-art" style="background:${gradient(pl.color, pl.color2)}">${initials(pl.name)}</div>
            <div class="library-meta">
                <div class="lib-title">${pl.name}</div>
                <div class="lib-sub">Playlist · ${pl.owner}</div>
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
            <button class="qc-play" title="Play ${pl.name}">
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
            <button class="card-play" title="Play">
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
            <button class="card-play" title="Play ${song.title}">
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
                <strong>${pl.owner}</strong> · ${pl.description} · <strong>${pl.songIds.length}</strong> songs
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
                    <div class="t-artist">${song.artist}</div>
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

function loadAndPlayCurrent() {
    const songId = state.queue[state.currentIndex];
    const song = songById(songId);
    if (!song) return;

    audio.src = song.src;
    audio.play().catch(() => {});
    state.isPlaying = true;
    updateNowPlayingUI();
    updatePlayingHighlights();
}

function togglePlay() {
    if (state.currentIndex < 0) {
        // Nothing loaded - start with first playlist
        playPlaylist("all");
        return;
    }
    if (audio.paused) {
        audio.play().catch(() => {});
        state.isPlaying = true;
    } else {
        audio.pause();
        state.isPlaying = false;
    }
    updatePlayPauseIcon();
}

function nextSong() {
    if (!state.queue.length) return;
    if (state.repeatMode === 2) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
        return;
    }
    let next = state.currentIndex + 1;
    if (next >= state.queue.length) {
        if (state.repeatMode === 1) {
            next = 0;
        } else {
            audio.pause();
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
    if (audio.currentTime > 3) {
        audio.currentTime = 0;
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
    document.title = `${song.title} • ${song.artist} — Spotifly`;
}

function updatePlayPauseIcon() {
    const icon = $("#play-icon");
    if (state.isPlaying && !audio.paused) {
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
    const cur = audio.currentTime || 0;
    const dur = audio.duration || 0;
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

// ====================================================
// INIT
// ====================================================
function init() {
    renderLibrary();
    renderHome();
    renderBrowse();

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
    audio.addEventListener("error", () => console.warn("Audio error:", audio.error));

    // ----- Scrubbing -----
    bindScrub(
        $("#progress-bar"),
        $("#progress-fill"),
        $("#progress-thumb"),
        (v, commit) => {
            if (!audio.duration) return;
            if (commit) audio.currentTime = v * audio.duration;
        }
    );

    bindScrub(
        $("#volume-bar"),
        $("#volume-fill"),
        $("#volume-thumb"),
        (v) => {
            state.volume = v;
            audio.volume = v;
            audio.muted = false;
        }
    );

    // initial volume render
    $("#volume-fill").style.width = `${state.volume * 100}%`;
    $("#volume-thumb").style.left = `${state.volume * 100}%`;

    $("#volume-btn").addEventListener("click", () => {
        audio.muted = !audio.muted;
        $("#volume-fill").style.width = audio.muted ? "0%" : `${state.volume * 100}%`;
        $("#volume-thumb").style.left = audio.muted ? "0%" : `${state.volume * 100}%`;
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
            audio.volume = state.volume;
            $("#volume-fill").style.width = `${state.volume * 100}%`;
            $("#volume-thumb").style.left = `${state.volume * 100}%`;
        } else if (e.code === "ArrowDown") {
            e.preventDefault();
            state.volume = Math.max(0, state.volume - 0.05);
            audio.volume = state.volume;
            $("#volume-fill").style.width = `${state.volume * 100}%`;
            $("#volume-thumb").style.left = `${state.volume * 100}%`;
        }
    });

    // ----- Library chips (visual filter only) -----
    $$(".chip").forEach((c) => {
        c.addEventListener("click", () => {
            $$(".chip").forEach((x) => x.classList.remove("active"));
            c.classList.add("active");
        });
    });

    // Show home initially
    switchView("home");
}

document.addEventListener("DOMContentLoaded", init);
