import type { NotificationItem } from '@medicare/shared';

export interface NotificationGroup {
  label: string;
  items: NotificationItem[];
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function daysDiff(a: Date, b: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((startOfDay(b).getTime() - startOfDay(a).getTime()) / msPerDay);
}

const BUCKETS: Array<{ label: string; test: (daysAgo: number) => boolean }> = [
  { label: 'TODAY',      test: (d) => d === 0 },
  { label: 'YESTERDAY',  test: (d) => d === 1 },
  { label: 'THIS WEEK',  test: (d) => d >= 2 && d <= 7 },
  { label: 'EARLIER',    test: (d) => d > 7 },
];

export function groupNotifications(
  items: NotificationItem[],
  now: Date = new Date(),
): NotificationGroup[] {
  const sorted = [...items].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  const map = new Map<string, NotificationItem[]>();

  for (const item of sorted) {
    const daysAgo = daysDiff(new Date(item.timestamp), now);
    const bucket = BUCKETS.find((b) => b.test(daysAgo));
    const label = bucket?.label ?? 'EARLIER';
    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(item);
  }

  // Emit groups in the canonical bucket order (only non-empty ones)
  return BUCKETS.reduce<NotificationGroup[]>((acc, bucket) => {
    const group = map.get(bucket.label);
    if (group) acc.push({ label: bucket.label, items: group });
    return acc;
  }, []);
}
