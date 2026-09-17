// Thin wrapper around one <audio> element already in index.html (not created
// dynamically, so it stays inspectable/controllable in devtools).

export class AudioPlayer {
  constructor(audioEl) {
    this.audio = audioEl;
  }

  load(src) {
    this.audio.src = src;
    this.audio.load();
  }

  play() {
    return this.audio.play();
  }

  pause() {
    this.audio.pause();
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  get currentTime() {
    return this.audio.currentTime;
  }

  get duration() {
    return this.audio.duration;
  }

  get paused() {
    return this.audio.paused;
  }

  get volume() {
    return this.audio.volume;
  }

  set volume(value) {
    this.audio.volume = value;
  }

  onTimeUpdate(cb) {
    this.audio.addEventListener('timeupdate', cb);
  }

  offTimeUpdate(cb) {
    this.audio.removeEventListener('timeupdate', cb);
  }

  onEnded(cb) {
    this.audio.addEventListener('ended', cb);
  }

  onPlay(cb) {
    this.audio.addEventListener('play', cb);
  }

  onPause(cb) {
    this.audio.addEventListener('pause', cb);
  }

  onLoadedMetadata(cb) {
    this.audio.addEventListener('loadedmetadata', cb);
  }
}
