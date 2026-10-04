import type { CycleSettings, CycleSummary } from "@/types/cycle";

const DAY_MS = 86_400_000;

export function startOfDay(date: Date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function parseLocalDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function toDateInputValue(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(date: Date, amount: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return startOfDay(result);
}

export function diffDays(later: Date, earlier: Date) {
  return Math.round((startOfDay(later).getTime() - startOfDay(earlier).getTime()) / DAY_MS);
}

export function calculateCycleSummary(
  settings: CycleSettings,
  today = new Date()
): CycleSummary {
  const now = startOfDay(today);
  const start = startOfDay(parseLocalDate(settings.lastPeriodDate));

  let elapsed = diffDays(now, start);
  let cycleStart = start;

  // If the saved date is older than one cycle, advance cycleStart by whole cycles.
  if (elapsed >= settings.cycleLength) {
    const completedCycles = Math.floor(elapsed / settings.cycleLength);
    cycleStart = addDays(start, completedCycles * settings.cycleLength);
    elapsed = diffDays(now, cycleStart);
  }

  // If a future date is accidentally selected, keep the UI stable.
  if (elapsed < 0) elapsed = 0;

  const cycleDay = elapsed + 1;
  const nextPeriodDate = addDays(cycleStart, settings.cycleLength);
  const daysUntilNextPeriod = Math.max(0, diffDays(nextPeriodDate, now));

  // Common calendar estimate: ovulation ~14 days before the next period.
  const ovulationDate = addDays(nextPeriodDate, -14);
  const fertileStart = addDays(ovulationDate, -5);
  const fertileEnd = addDays(ovulationDate, 1);

  const isPeriodWindow = cycleDay <= settings.periodLength;
  const isFertileWindow = now >= fertileStart && now <= fertileEnd;

  return {
    cycleDay,
    daysUntilNextPeriod,
    nextPeriodDate,
    fertileStart,
    fertileEnd,
    ovulationDate,
    isPeriodWindow,
    isFertileWindow,
  };
}

export function formatShortDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

export function formatLongDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
  }).format(date);
}
