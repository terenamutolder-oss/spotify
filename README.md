# Musicfly

A Spotify-inspired web music player, built with plain HTML, CSS and JavaScript. No frameworks, no build step, no dependencies — just open and play.

## Features

- Spotify-style dark UI (sidebar, main view, sticky now-playing bar)
- Home, Search and Playlist views
- 5 starter tracks ready to go (Michael Jackson + Ed Sheeran)
- 5 curated playlists (All Songs, MJ Essentials, Today's Top Hits, Chill Mix, Discover Weekly)
- Full audio controls: play / pause, next / previous, scrubbing, volume, mute, shuffle, repeat (off / all / one)
- Search across songs, artists, albums and playlists
- "Browse all" genre grid
- Keyboard shortcuts: `Space` (play/pause), `Shift+→` / `Shift+←` (next/prev), `↑` / `↓` (volume)
- Responsive layout

## Live demo

- **Vercel (production):** https://spotify-five-teal.vercel.app/
- **Google Cloud Run:** https://musicfly-107401835210.us-central1.run.app/ *(requires Google sign-in if your org blocks public access)*
- **GitHub Pages:** https://terenamutolder-oss.github.io/spotify/ *(enable Pages → GitHub Actions in repo settings if 404)*

Static demo mode works on Vercel without login. Cloud Run adds accounts + uploads once Firebase is configured in `firebase-config.js`.

## Run locally

You need Python (3.x) installed. Then either:

- Double-click `start.cmd`, **or**
- Run from this folder:

```bash
python server.py
```

It serves the app at <http://localhost:5500/> and opens your browser automatically.

> Any static file server works (the app is just static files), but using the bundled server makes sure MP3 range requests (used for seeking) work correctly.

## Project layout

```text
spotify/
├── index.html      Page markup (sidebar, main, player bar)
├── styles.css      Spotify-inspired theme + layout
├── app.js          Player, navigation, search, playlists
├── server.py       Tiny static file server
├── start.cmd       Windows launcher
└── songs/          MP3 files
    ├── thriller.mp3
    ├── beat-it.mp3
    ├── billie-jean.mp3
    ├── smooth-criminal.mp3
    └── shape-of-you.mp3
```

## Adding more songs

1. Drop your `.mp3` into `songs/`.
2. Open `app.js` and add an entry to the `SONGS` array:

```js
{
    id: "my-song",
    title: "My Song",
    artist: "Some Artist",
    album: "Some Album",
    src: "songs/my-song.mp3",
    color: "#06b6d4",  // gradient start
    color2: "#164e63", // gradient end
}
```

3. Optionally add it to any playlist's `songIds` array.

Refresh the page and your song appears everywhere.
