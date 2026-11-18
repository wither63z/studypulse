const pad = (n: number) => String(n).padStart(2, "0");

/** Fecha local en formato YYYY-MM-DD. */
export function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/** Lunes 00:00 y domingo 23:59:59 de la semana de `date`. */
export function weekRange(date = new Date()): { start: Date; end: Date } {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  const end = addDays(start, 7);
  end.setMilliseconds(-1);
  return { start, end };
}

export function isInWeek(iso: string | undefined, date = new Date()): boolean {
  if (!iso) return false;
  const t = new Date(iso).getTime();
  const { start, end } = weekRange(date);
  return t >= start.getTime() && t <= end.getTime();
}

/** "Hoy", "Mañana", "Vencida · ..." o fecha corta. */
export function formatDue(dateKey: string): string {
  const today = toDateKey(new Date());
  if (dateKey === today) return "Hoy";
  if (dateKey === toDateKey(addDays(new Date(), 1))) return "Mañana";
  const label = fromDateKey(dateKey).toLocaleDateString("es", { weekday: "short", day: "numeric", month: "short" });
  return dateKey < today ? `Vencida · ${label}` : label;
}

/** Convierte "YYYY-MM-DD" a Date local. */
export function fromDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Días completos entre hoy y la fecha (negativo = pasada). */
export function daysFromToday(key: string): number {
  const today = fromDateKey(toDateKey(new Date()));
  return Math.round((fromDateKey(key).getTime() - today.getTime()) / 86400000);
}

export function formatLongDate(key: string): string {
  const s = fromDateKey(key).toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function formatDayMonth(date: Date): string {
  return date.toLocaleDateString("es", { day: "numeric", month: "short" });
}

export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.ceil(totalSeconds));
  return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
}

export const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
