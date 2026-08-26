/** Build and download a .ics event so phones can add it to Calendar. */

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function asDate(value: string | Date): Date {
  return value instanceof Date ? value : new Date(value);
}

/** Local floating time: YYYYMMDDTHHMMSS (no Z — keeps invitation local clock). */
export function toIcsLocalStamp(value: string | Date): string {
  const d = asDate(value);
  return (
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
    `T${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
  );
}

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

export type CalendarEventInput = {
  title: string;
  start: string | Date;
  /** Defaults to 8 hours after start */
  end?: string | Date;
  location?: string;
  description?: string;
  filename?: string;
};

export function buildIcs(event: CalendarEventInput): string {
  const startDate = asDate(event.start);
  const endDate = event.end
    ? asDate(event.end)
    : new Date(startDate.getTime() + 8 * 60 * 60 * 1000);

  const start = toIcsLocalStamp(startDate);
  const end = toIcsLocalStamp(endDate);
  const stamp = toIcsLocalStamp(new Date());
  const uid = `${start}-${crypto.randomUUID?.() ?? String(Date.now())}@klikdovencanja`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//KlikDovencanja//Pozivnica//SR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
  ];

  if (event.location) {
    lines.push(`LOCATION:${escapeIcsText(event.location)}`);
  }
  if (event.description) {
    lines.push(`DESCRIPTION:${escapeIcsText(event.description)}`);
  }

  lines.push("END:VEVENT", "END:VCALENDAR");
  return lines.join("\r\n");
}

export function downloadCalendarEvent(event: CalendarEventInput): void {
  const ics = buildIcs(event);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = event.filename ?? "vencanje.ics";
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}
