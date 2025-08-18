type Unit = "second" | "minute" | "hour" | "day" | "month" | "year";

interface FormatDistanceToNowOptions {
  addSuffix?: boolean;
  includeSeconds?: boolean;
}

const SEC = 1_000;
const MIN = 60 * SEC;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;
const MONTH = 30.44 * DAY;
const YEAR = 365.2425 * DAY;

const locale = {
  xSeconds: { singular: "a few seconds", plural: "{{count}} seconds" },
  xMinutes: { singular: "a minute", plural: "{{count}} minutes" },
  xHours: { singular: "an hour", plural: "{{count}} hours" },
  xDays: { singular: "a day", plural: "{{count}} days" },
  xMonths: { singular: "a month", plural: "{{count}} months" },
  xYears: { singular: "a year", plural: "{{count}} years" },
};

function pluralize(token: keyof typeof locale, count: number): string {
  const dict = locale[token];
  return count === 1 ? dict.singular : dict.plural.replace("{{count}}", String(count));
}

function toToken(diff: number): { unit: Unit; value: number } {
  if (diff < MIN) return { unit: "second", value: Math.round(diff / SEC) };
  if (diff < HOUR) return { unit: "minute", value: Math.round(diff / MIN) };
  if (diff < DAY) return { unit: "hour", value: Math.round(diff / HOUR) };
  if (diff < MONTH) return { unit: "day", value: Math.round(diff / DAY) };
  if (diff < YEAR) return { unit: "month", value: Math.round(diff / MONTH) };
  return { unit: "year", value: Math.round(diff / YEAR) };
}

export function formatDistanceToNow(date: Date | number, options: FormatDistanceToNowOptions = {}): string {
  const now = Date.now();
  const target = date instanceof Date ? date.getTime() : date;
  const diff = Math.abs(target - now);

  let token: keyof typeof locale;
  let value: number;
  const { unit, value: v } = toToken(diff);
  value = v;

  if (unit === "second" && !options.includeSeconds) {
    token = "xMinutes";
    value = 1; // “less than a minute” → we map to “a minute” for simplicity
  } else {
    token = `x${unit.charAt(0).toUpperCase()}${unit.slice(1)}s` as keyof typeof locale;
  }

  const phrase = pluralize(token, value);

  if (!options.addSuffix) return phrase;

  return target < now ? `${phrase} ago` : `in ${phrase}`;
}

/* ---- usage examples ---- */
// console.log(formatDistanceToNow(new Date(Date.now() - 5_000), { addSuffix: true }));
// → "a few seconds ago"
// console.log(formatDistanceToNow(Date.now() + 120_000, { addSuffix: true }));
// → "in 2 minutes"
