// Structured logging for Edge Functions. PII-free by convention:
// callers must NOT pass pupil names, emails, or free text into `fields`.
// IDs (UUIDs) and counts are fine.

type Level = "info" | "warn" | "error";

export interface LogFields {
  [k: string]: string | number | boolean | null | undefined;
}

export function logEvent(
  fn: string,
  level: Level,
  event: string,
  fields: LogFields = {},
) {
  const payload = {
    ts: new Date().toISOString(),
    fn,
    level,
    event,
    ...fields,
  };
  const line = JSON.stringify(payload);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export function makeLogger(fn: string) {
  return {
    info: (event: string, fields?: LogFields) => logEvent(fn, "info", event, fields),
    warn: (event: string, fields?: LogFields) => logEvent(fn, "warn", event, fields),
    error: (event: string, fields?: LogFields) => logEvent(fn, "error", event, fields),
  };
}
