// Single source of truth for marker datasets. TSV rows: start_seconds\tend_seconds\tlabel_text
// Sourced verbatim from data/text/Dataset_*.txt (CRLF normalized to LF).

export const DATASETS = {
  warmup: `14.791756\t14.791756\tAufmerksamkeit ➔ richten
19.226307\t19.226307\tTestphase ➔ abschließen`,

  discorso1: `61.126531\t61.126531\tAnstoß ➔ nehmen
71.645170\t71.645170\tum sich ➔ greifen
156.711474\t156.711474\tVerbrennungen ➔ erleiden
193.457052\t193.457052\tNarben ➔ zurückbleiben
244.506122\t244.506122\tHungerperioden ➔ überstehen
304.901224\t304.901224\tBlutbahn ➔ gelangen
390.931156\t390.931156\tWirkung ➔ ausschalten`,

  discorso2: `71.169161\t71.169161\tMilchseen ➔ verhindern
96.002902\t96.002902\tNachfragezyklus ➔ unterliegen
135.674195\t135.674195\tGründe ➔ zutage fördern
195.140499\t195.140499\tWettlauf ➔ liefern
215.597279\t215.597279\tAnbietergemeinschaften ➔ zusammenschließen
236.530068\t236.530068\tPreiskampf ➔ verfallen
282.401088\t282.401088\tLeben ➔ führen
341.960272\t341.960272\tNahrungsmittelkette ➔ aufnehmen`,
};
