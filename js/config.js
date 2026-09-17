// No-build "env file" equivalent — real .env/dotenv needs a bundler or
// server, neither of which exist in this zero-dependency static site.

export const AUDIO_PATHS = {
  warmup: 'assets/audio/warmup.mp3',
  discorso1: 'assets/audio/discorso1.mp3',
  discorso2: 'assets/audio/discorso2.mp3',
};

// Keep in sync with the .visible transition in css/style.css.
export const POPUP_FADE_IN_MS = 300;
export const POPUP_HOLD_MS = 3500;
export const POPUP_FADE_OUT_MS = 300;

export const CSV_HEADER = 'render_time_ms,marker_text,audio_time_s,delta_ms';
export const CSV_FILENAME_PREFIX = 'log_session_';
