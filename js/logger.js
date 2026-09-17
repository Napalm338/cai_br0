import { CSV_HEADER, CSV_FILENAME_PREFIX } from './config.js';

// Scoped to a single speech (see CLAUDE.md — CSV columns are fixed with no
// speech/session id, so mixing multiple speeches into one log would be
// distinguishable only by marker_text, which isn't guaranteed unique).

export class Logger {
  constructor() {
    this.rows = [];
  }

  record({ renderTimeMs, markerText, audioTimeS, deltaMs }) {
    this.rows.push({ renderTimeMs, markerText, audioTimeS, deltaMs });
  }

  toCSV() {
    const lines = this.rows.map(
      (r) =>
        `${r.renderTimeMs},"${r.markerText.replace(/"/g, '""')}",${r.audioTimeS},${r.deltaMs}`
    );
    return [CSV_HEADER, ...lines].join('\n');
  }

  download() {
    const ts = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const name = `${CSV_FILENAME_PREFIX}${ts.getFullYear()}${pad(ts.getMonth() + 1)}${pad(ts.getDate())}_${pad(ts.getHours())}${pad(ts.getMinutes())}${pad(ts.getSeconds())}.csv`;
    const blob = new Blob([this.toCSV()], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  }
}
