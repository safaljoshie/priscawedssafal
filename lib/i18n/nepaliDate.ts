import NepaliDate from "nepali-date-converter";

const DEVANAGARI_DIGITS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

export function toDevanagariDigits(value: number | string, minLength = 0): string {
  const str = String(value).padStart(minLength, "0");
  return str.replace(/\d/g, (digit) => DEVANAGARI_DIGITS[Number(digit)]);
}

export function formatNepaliTime(time: string): string {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return time;

  const [, hour, minute, period] = match;
  const periodNe = period.toUpperCase() === "AM" ? "बिहान" : "बेलुका";

  return `${toDevanagariDigits(hour)}:${toDevanagariDigits(minute)} ${periodNe}`;
}

function parseAdDate(value: string): Date | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    const [y, m, d] = trimmed.slice(0, 10).split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  const parsed = Date.parse(trimmed);
  return Number.isNaN(parsed) ? null : new Date(parsed);
}

export function formatBsDate(adValue: string, pattern = "ddd, MMMM DD, YYYY"): string {
  const date = parseAdDate(adValue);
  if (!date) return adValue;
  return NepaliDate.fromAD(date).format(pattern, "np");
}

export function formatBsDateRange(start: string, end: string): string {
  const startDate = parseAdDate(start);
  const endDate = parseAdDate(end);
  if (!startDate || !endDate) return "";

  const bsStart = NepaliDate.fromAD(startDate);
  const bsEnd = NepaliDate.fromAD(endDate);

  if (
    bsStart.getYear() === bsEnd.getYear() &&
    bsStart.getMonth() === bsEnd.getMonth()
  ) {
    return `${bsStart.format("MMMM DD", "np")} – ${bsEnd.format("DD, YYYY", "np")}`;
  }

  if (bsStart.getYear() === bsEnd.getYear()) {
    return `${bsStart.format("MMMM DD", "np")} – ${bsEnd.format("MMMM DD, YYYY", "np")}`;
  }

  return `${bsStart.format("MMMM DD, YYYY", "np")} – ${bsEnd.format("MMMM DD, YYYY", "np")}`;
}

export function formatWeddingDateDisplay(
  locale: "en" | "ne",
  dateDisplay: string,
  dateRange?: { start: string; end: string }
): string {
  if (locale === "en") return dateDisplay;
  if (dateRange?.start && dateRange?.end) {
    return formatBsDateRange(dateRange.start, dateRange.end);
  }
  return dateDisplay;
}

export function formatEventDate(
  locale: "en" | "ne",
  eventDate: string
): string {
  if (locale === "en") return eventDate;
  return formatBsDate(eventDate);
}
