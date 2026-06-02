import { Icon } from "@iconify/react";
import type { Event } from "@/payload-types";

const MONTHS_SHORT = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const rawDate = event.date?.includes("T")
    ? event.date
    : event.date
      ? `${event.date}T12:00:00`
      : null;
  const dateValue = rawDate ? new Date(rawDate) : null;
  const hasValidDate = Boolean(dateValue && !Number.isNaN(dateValue.getTime()));
  const day = hasValidDate && dateValue ? dateValue.getDate() : "—";
  const mon =
    hasValidDate && dateValue ? MONTHS_SHORT[dateValue.getMonth()] : "";

  return (
    <div className="flex gap-4 rounded-card border border-border bg-white p-4 shadow-soft">
      <div className="flex min-w-[70px] flex-col items-center justify-center rounded-soft bg-brand-50 px-3 py-2 text-brand-700">
        <p className="font-display text-2xl font-extrabold leading-none">
          {day}
        </p>
        <p className="mt-1 font-display text-xs font-semibold uppercase tracking-wide">
          {mon}
        </p>
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="font-display text-lg font-bold text-ink">
          {event.title}
        </h4>
        <p className="mt-1 text-sm text-ink-2">
          <Icon
            icon="material-symbols:schedule-outline-rounded"
            style={{ verticalAlign: "middle", marginRight: 4 }}
          />
          {event.time}
          {event.recurring && <> · {event.recurring}</>}
        </p>
        {event.location && (
          <p className="mt-1 text-sm text-ink-2">
            <Icon
              icon="material-symbols:location-on-outline-rounded"
              style={{ verticalAlign: "middle", marginRight: 4 }}
            />
            {event.location}
          </p>
        )}
        {event.desc && (
          <p className="mt-2 text-sm leading-6 text-ink-2">{event.desc}</p>
        )}
      </div>
    </div>
  );
}
