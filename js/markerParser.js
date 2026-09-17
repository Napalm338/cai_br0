// TSV string -> [{start, end, text}]. Source datasets use Audacity point
// labels (start === end) and CRLF line endings; both are handled defensively
// here so a future dataset swap needs zero code changes.

export function parseMarkers(tsv) {
  return tsv
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      const [start, end, text] = line.split('\t');
      return {
        start: parseFloat(start),
        end: parseFloat(end),
        text: text.trim(),
      };
    });
}
