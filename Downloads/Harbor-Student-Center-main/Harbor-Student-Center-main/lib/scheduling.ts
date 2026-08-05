export type PublishStatus = "draft" | "scheduled" | "published";

export type SchedulePayload = {
  status: PublishStatus;
  scheduled_for: string | null;
};

/** Convert ISO / timestamptz to `datetime-local` input value (local time). */
export function toDatetimeLocalValue(iso: string | null | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** Build status + scheduled_for from an optional datetime-local string. */
export function resolveSchedulePayload(datetimeLocal: string): SchedulePayload {
  const trimmed = datetimeLocal.trim();

  if (!trimmed) {
    return { status: "published", scheduled_for: null };
  }

  const scheduled = new Date(trimmed);
  if (Number.isNaN(scheduled.getTime())) {
    return { status: "published", scheduled_for: null };
  }

  const iso = scheduled.toISOString();
  if (scheduled.getTime() <= Date.now()) {
    return { status: "published", scheduled_for: iso };
  }

  return { status: "scheduled", scheduled_for: iso };
}

export function formatScheduledLabel(iso: string | null | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
