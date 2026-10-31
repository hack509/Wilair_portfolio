/**
 * Source de données locale (fichiers de src/data).
 * Les services renvoient des promesses : en phase 2, ils interrogeront Supabase
 * sans que les composants aient à changer.
 */
export async function fromLocal(read) {
  // Copie profonde : les composants ne peuvent pas modifier les données sources.
  return structuredClone(read())
}
