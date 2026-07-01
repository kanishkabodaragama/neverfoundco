export const COLOMBO_TIME_ZONE = "Asia/Colombo";

export function formatColomboDate(value: string | number | Date) {
  return new Intl.DateTimeFormat("en-LK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: COLOMBO_TIME_ZONE,
  }).format(new Date(value));
}

export function formatColomboTime(value: string | number | Date) {
  return new Intl.DateTimeFormat("en-LK", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: COLOMBO_TIME_ZONE,
  }).format(new Date(value));
}

export function formatColomboDateTime(value: string | number | Date) {
  return `${formatColomboDate(value)}, ${formatColomboTime(value)}`;
}

export function formatColomboDateKey(value: string | number | Date) {
  const parts = getColomboParts(value);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function formatColomboDateTimeLocalInput(value: string | number | Date) {
  const parts = getColomboParts(value);
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

function getColomboParts(value: string | number | Date) {
  const date = new Date(value);
  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
    month: "2-digit",
    timeZone: COLOMBO_TIME_ZONE,
    year: "numeric",
  }).formatToParts(date);

  const partMap = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  return {
    day: partMap.day ?? "01",
    hour: partMap.hour === "24" ? "00" : (partMap.hour ?? "00"),
    minute: partMap.minute ?? "00",
    month: partMap.month ?? "01",
    year: partMap.year ?? "1970",
  };
}
