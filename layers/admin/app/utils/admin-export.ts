/**
 * Escapes a value for safe inclusion in a CSV cell.
 * Wraps in quotes, doubles any internal quotes.
 */
export function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Converts an array of flat objects into a CSV string with a header row.
 */
export function objectsToCsv(rows: Record<string, unknown>[]): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]!);
  const headerRow = headers.map(escapeCsvCell).join(",");
  const dataRows = rows.map((row) =>
    headers.map((h) => escapeCsvCell(row[h])).join(",")
  );
  return [headerRow, ...dataRows].join("\n");
}

/**
 * Returns a section header separator string for use in combined CSV exports.
 */
export function formatSectionHeader(title: string): string {
  return `\n=== ${title.toUpperCase()} ===\n`;
}

/**
 * Triggers a browser download of the given CSV content as a .csv file.
 */
export function downloadCsv(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

/**
 * Returns today's date formatted as YYYY-MM-DD for use in filenames.
 */
export function todayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}
