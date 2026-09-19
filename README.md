# CAI A/B Test

Computer-Assisted Interpreting (CAI) A/B testing web app. Professional
interpreters play a speech with or without synced text-cue popups; popup
render latency gets logged to CSV for analysis.

Pure client-side, zero dependency, ES modules, no framework, no build step —
deployed as a GitHub Pages static site.

## Running locally

`<script type="module">` needs an HTTP server (not `file://`) in some
browsers.

```
python -m http.server
```

or, without Python, the dependency-free dev helper:

```
node serve.js
```

Then open `http://localhost:8000/`.

## Usage

UI text is in Italian.

- **Speech buttons** — pick a speech (Warm-Up, Discorso 1, Discorso 2); the
  loaded one is highlighted. Switching speeches downloads any unsaved log for
  the outgoing speech first.
- **Modalità CAI switch** — ON: popups (top-right) show synced text cues,
  render latency is logged. OFF: plain audio, no popups, nothing logged.
  Live — takes effect immediately, even mid-playback.
- **Player** — Play/Pause, Stop (halts and resets to start), elapsed /
  total time, volume.
- **Help (`?`)** — opens a modal explaining each control.
- **Scarica Log (Test concluso)** — downloads the current speech's log as CSV
  (render time, marker text, audio time, latency). Enabled once something's
  been logged.

## Project layout

```
index.html
css/style.css
js/
  main.js          bootstrap, wires modules, UI event handlers
  config.js        constants (audio paths, popup timings, CSV header/filename)
  data.js          DATASETS (TSV marker strings) — single source of truth
  audioPlayer.js   wraps HTMLAudioElement
  markerParser.js  TSV string -> [{start, end, text}]
  scheduler.js     drives popup timing off audio.currentTime
  popupManager.js  CSS fade popup renderer
  logger.js        event log -> CSV
assets/audio/       warmup.mp3, discorso1.mp3, discorso2.mp3
```

CSV columns: `render_time_ms,marker_text,audio_time_s,delta_ms`.

## Data

Source labels are Audacity point-label exports (`data/text/*.txt`, 3-column
TSV, German text, `start == end` per row, CRLF line endings) embedded
verbatim into `js/data.js`. See `CLAUDE.md` for the full data-flow and design
rationale, and `/home/nik/Desktop/Tesi_Brollo/docs/open_points.md` for
provisional/undecided design points.

## Status

Thesis project. Architecture may evolve — see `CLAUDE.md` for
current state and non-obvious design decisions before changing behavior
around scheduling, logging, or the CAI toggle.
