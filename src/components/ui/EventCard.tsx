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
    <div className="event-card">
      <div className="event-date-block">
        <p className="event-date-day">{day}</p>
        <p className="event-date-mon">{mon}</p>
      </div>

      <div className="event-info">
        <h4>{event.title}</h4>
        <p>
          <Icon
            icon="material-symbols:schedule-outline-rounded"
            style={{ verticalAlign: "middle", marginRight: 4 }}
          />
          {event.time}
          {event.recurring && <> · {event.recurring}</>}
        </p>
        {event.location && (
          <p style={{ marginTop: 4 }}>
            <Icon
              icon="material-symbols:location-on-outline-rounded"
              style={{ verticalAlign: "middle", marginRight: 4 }}
            />
            {event.location}
          </p>
        )}
        {event.desc && (
          <p style={{ marginTop: 6, color: "var(--ink-2)", fontSize: 13 }}>
            {event.desc}
          </p>
        )}
      </div>
    </div>
  );
}
