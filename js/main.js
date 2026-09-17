import { AUDIO_PATHS } from './config.js';
import { DATASETS } from './data.js';
import { parseMarkers } from './markerParser.js';
import { AudioPlayer } from './audioPlayer.js';
import { Scheduler } from './scheduler.js';
import { PopupManager } from './popupManager.js';
import { Logger } from './logger.js';

const speechSelect = document.getElementById('speech-select');
const caiToggle = document.getElementById('cai-toggle');
const playPauseBtn = document.getElementById('play-pause-btn');
const iconPlay = document.getElementById('icon-play');
const iconPause = document.getElementById('icon-pause');
const stopBtn = document.getElementById('stop-btn');
const downloadBtn = document.getElementById('download-btn');
const popupEl = document.getElementById('popup');
const audioEl = document.getElementById('audio-el');
const timeCurrentEl = document.getElementById('time-current');
const timeDurationEl = document.getElementById('time-duration');
const progressFillEl = document.getElementById('progress-fill');
const volumeSlider = document.getElementById('volume-slider');
const helpBtn = document.getElementById('help-btn');
const helpOverlay = document.getElementById('help-overlay');
const helpCloseBtn = document.getElementById('help-close-btn');

const audioPlayer = new AudioPlayer(audioEl);
const popupManager = new PopupManager(popupEl);

let markers = [];
let scheduler = null;
let logger = null;

function updateDownloadButtonState() {
  downloadBtn.disabled = !logger || logger.rows.length === 0;
}

function formatTime(seconds) {
  if (!isFinite(seconds) || seconds < 0) seconds = 0;
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}

function updatePlayPauseIcon() {
  const playing = !audioPlayer.paused;
  // svg is an SVGElement, not an HTMLElement — the `.hidden` IDL property
  // only exists on HTMLElement, so toggling `.hidden` here would silently
  // no-op. classList works on any Element.
  iconPlay.classList.toggle('icon-hidden', playing);
  iconPause.classList.toggle('icon-hidden', !playing);
  playPauseBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
}

function updateTimeDisplay() {
  timeCurrentEl.textContent = formatTime(audioPlayer.currentTime);
  timeDurationEl.textContent = formatTime(audioPlayer.duration);
  const pct = audioPlayer.duration
    ? (audioPlayer.currentTime / audioPlayer.duration) * 100
    : 0;
  progressFillEl.style.width = `${pct}%`;
}

audioPlayer.onPlay(updatePlayPauseIcon);
audioPlayer.onPause(updatePlayPauseIcon);
audioPlayer.onLoadedMetadata(updateTimeDisplay);
audioPlayer.onTimeUpdate(updateTimeDisplay);
audioPlayer.onEnded(updatePlayPauseIcon);

function onTrigger(marker, scheduledWallTime) {
  const shown = popupManager.show(marker.text);
  if (!shown || !logger) return;
  const renderTimeMs = Date.now();
  logger.record({
    renderTimeMs,
    markerText: marker.text,
    audioTimeS: audioPlayer.currentTime,
    deltaMs: renderTimeMs - scheduledWallTime,
  });
  updateDownloadButtonState();
}

function startCAI() {
  if (!logger) {
    logger = new Logger();
    updateDownloadButtonState();
  }
  if (!scheduler) {
    scheduler = new Scheduler(audioPlayer, markers, onTrigger);
  }
  scheduler.start();
}

function stopCAI() {
  if (scheduler) scheduler.stop();
}

function loadSpeech(key) {
  if (logger && logger.rows.length > 0) {
    logger.download();
  }
  stopCAI();
  scheduler = null;
  logger = null;
  updateDownloadButtonState();
  markers = parseMarkers(DATASETS[key]);
  audioPlayer.load(AUDIO_PATHS[key]);
  updatePlayPauseIcon();
  updateTimeDisplay();
}

speechSelect.addEventListener('change', () => loadSpeech(speechSelect.value));

playPauseBtn.addEventListener('click', () => {
  if (audioPlayer.paused) {
    audioPlayer.play();
    if (caiToggle.checked) startCAI();
  } else {
    audioPlayer.pause();
  }
});

stopBtn.addEventListener('click', () => {
  audioPlayer.stop();
  stopCAI();
});

caiToggle.addEventListener('change', () => {
  if (caiToggle.checked) {
    if (!audioPlayer.paused) startCAI();
  } else {
    stopCAI();
  }
});

volumeSlider.addEventListener('input', () => {
  audioPlayer.volume = Number(volumeSlider.value);
});
audioPlayer.volume = Number(volumeSlider.value);

downloadBtn.addEventListener('click', () => {
  if (logger) logger.download();
});

function openHelp() {
  helpOverlay.classList.remove('hidden');
}

function closeHelp() {
  helpOverlay.classList.add('hidden');
}

helpBtn.addEventListener('click', openHelp);
helpCloseBtn.addEventListener('click', closeHelp);
helpOverlay.addEventListener('click', (e) => {
  if (e.target === helpOverlay) closeHelp();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !helpOverlay.classList.contains('hidden')) closeHelp();
});

loadSpeech(speechSelect.value);
