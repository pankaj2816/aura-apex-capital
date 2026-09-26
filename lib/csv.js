const FORMULA = /^[=+\-@\t\r]/;

export function csvCell(value) {
  const text = String(value ?? '');
  const guarded = FORMULA.test(text) ? `'${text}` : text;
  if (/[",\n\r]/.test(guarded)) {
    return `"${guarded.replace(/"/g, '""')}"`;
  }
  return guarded;
}

export function toCsv(rows, columns) {
  const header = columns.map((column) => csvCell(column.label)).join(',');
  const body = rows.map((row) =>
    columns.map((column) => csvCell(column.value(row))).join(',')
  );
  return [header, ...body].join('\r\n');
}

export function downloadText(filename, text, type) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
