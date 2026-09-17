import { POPUP_FADE_IN_MS, POPUP_HOLD_MS, POPUP_FADE_OUT_MS } from './config.js';

// CSS drives the actual fade (see .visible in css/style.css); this class only
// toggles a class and tracks visibility so a cue that fires while one is
// already showing gets dropped, never queued.

export class PopupManager {
  constructor(el) {
    this.el = el;
    this.visible = false;
    this._hideTimer = null;
  }

  show(text) {
    if (this.visible) return false;
    this.visible = true;
    this.el.textContent = text;
    this.el.classList.add('visible');
    this._hideTimer = setTimeout(() => {
      this.el.classList.remove('visible');
      this.visible = false;
    }, POPUP_FADE_IN_MS + POPUP_HOLD_MS + POPUP_FADE_OUT_MS);
    return true;
  }
}
