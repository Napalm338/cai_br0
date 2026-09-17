// Wall-clock scheduling, not audio-clock: audioStartEpoch is the wall-clock
// time at which audio position 0 would have occurred, computed from the
// current playback position so pausing/resuming and enabling CAI mid-track
// both stay correctly aligned. delta_ms (computed by the caller) is
// Date.now() - scheduledWallTime at render time.

export class Scheduler {
  constructor(audioPlayer, markers, onTrigger) {
    this.audioPlayer = audioPlayer;
    this.markers = markers;
    this.onTrigger = onTrigger;
    this.audioStartEpoch = null;
    this.firedIndices = new Set();
    this._handler = () => this._check();
  }

  start() {
    this.audioStartEpoch = Date.now() - this.audioPlayer.currentTime * 1000;
    this.firedIndices = new Set();
    // Markers already behind the current playback position (resume after
    // pause, or CAI enabled mid-track) must be marked fired without
    // triggering, otherwise they'd all satisfy now >= scheduledWallTime on
    // the very first tick and burst-fire at once.
    this.markers.forEach((marker, i) => {
      if (marker.start <= this.audioPlayer.currentTime) {
        this.firedIndices.add(i);
      }
    });
    this.audioPlayer.onTimeUpdate(this._handler);
  }

  _check() {
    const now = Date.now();
    this.markers.forEach((marker, i) => {
      if (this.firedIndices.has(i)) return;
      const scheduledWallTime = this.audioStartEpoch + marker.start * 1000;
      if (now >= scheduledWallTime) {
        this.firedIndices.add(i);
        this.onTrigger(marker, scheduledWallTime);
      }
    });
  }

  stop() {
    this.audioPlayer.offTimeUpdate(this._handler);
  }
}
