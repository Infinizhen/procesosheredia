/**
 * The app's current date — `new Date()`, but never earlier than RELEASE_FLOOR.
 *
 * We're shipping the "El increíble viaje de Paquita" EP (out 2026-06-05) a day
 * early, so we pin "now" forward to its release day: the whole site reads the EP
 * as out and shows its real date (5 Jun), even on the 4th. The floor only moves
 * "now" forward and becomes inert the instant the real clock passes it, so it's
 * safe to leave in — set it to null once the date has genuinely passed.
 */
const RELEASE_FLOOR: string | null = '2026-06-05'

/** `new Date()`, clamped to be no earlier than the release floor. */
export function getNow(): Date {
  const real = new Date()
  if (!RELEASE_FLOOR) return real
  const floor = new Date(`${RELEASE_FLOOR}T00:00:00Z`)
  return floor.getTime() > real.getTime() ? floor : real
}
