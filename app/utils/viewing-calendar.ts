function toICSDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function viewingGoogleCalendarUrl(
  title: string,
  start: Date,
  end: Date,
  location: string,
): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${toICSDate(start)}/${toICSDate(end)}`,
    location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function viewingOutlookCalendarUrl(
  title: string,
  start: Date,
  end: Date,
  location: string,
): string {
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: title,
    startdt: start.toISOString(),
    enddt: end.toISOString(),
    location,
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

export function downloadViewingICS(
  uid: string,
  title: string,
  start: Date,
  end: Date,
  location: string,
): void {
  const now = toICSDate(new Date());
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Virify//Viewing//EN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${toICSDate(start)}`,
    `DTEND:${toICSDate(end)}`,
    `SUMMARY:${title}`,
    `LOCATION:${location}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "viewing.ics";
  a.click();
  URL.revokeObjectURL(url);
}
