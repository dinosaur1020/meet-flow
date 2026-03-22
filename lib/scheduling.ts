// ─── Shared scheduling primitives ─────────────────────────────────────────────

export type TimeSlot = string; // "day-hour", e.g. "0-9" = Monday 9am

export const DAYS = ["週一", "週二", "週三", "週四", "週五"] as const;
export const HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17] as const;

export function slot(day: number, hour: number): TimeSlot {
  return `${day}-${hour}`;
}

export type Member = {
  id: string;
  name: string;
  color: string;
  availability: TimeSlot[];
};

export function commonSlotsForMembers(members: Member[]): TimeSlot[] {
  return DAYS.flatMap((_, d) =>
    HOURS.filter((h) =>
      members.every((m) => m.availability.includes(slot(d, h)))
    ).map((h) => slot(d, h))
  );
}

export function formatSlotLabel(s: TimeSlot): string {
  const [d, h] = s.split("-").map(Number);
  return `${DAYS[d]} ${h}:00–${h + 1}:00`;
}

export function parseSlot(s: TimeSlot): { day: number; hour: number } {
  const [d, h] = s.split("-").map(Number);
  return { day: d, hour: h };
}
