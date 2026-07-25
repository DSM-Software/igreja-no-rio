import { Icon } from "@iconify/react";
import type { Event } from "@/payload-types";
import { getSafeExternalURL } from "@/lib/utils";

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

function parseEventDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const raw = value.includes("T") ? value : `${value}T12:00:00`;
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

const pad2 = (n: number) => String(n).padStart(2, "0");

export default function EventCard({ event }: EventCardProps) {
  const dateValue = parseEventDate(event.date);
  const day = dateValue ? dateValue.getDate() : "—";
  const mon = dateValue ? MONTHS_SHORT[dateValue.getMonth()] : "";

  const endValue = parseEventDate(event.endDate);
  const isMultiDay = Boolean(
    dateValue &&
      endValue &&
      (endValue.getDate() !== dateValue.getDate() ||
        endValue.getMonth() !== dateValue.getMonth() ||
        endValue.getFullYear() !== dateValue.getFullYear()),
  );
  const sameMonth = Boolean(
    isMultiDay &&
      dateValue &&
      endValue &&
      endValue.getMonth() === dateValue.getMonth() &&
      endValue.getFullYear() === dateValue.getFullYear(),
  );
  // Mesmo mês: o bloco de data mostra o intervalo ("01–03" / "AGO").
  // Meses diferentes: o bloco mantém o início e a linha de horário indica o término.
  const dayLabel =
    sameMonth && dateValue && endValue
      ? `${pad2(dateValue.getDate())}–${pad2(endValue.getDate())}`
      : day;
  const crossMonthEndLabel =
    isMultiDay && !sameMonth && endValue
      ? `até ${pad2(endValue.getDate())} ${MONTHS_SHORT[endValue.getMonth()]}`
      : null;
  // O dia de término só entra aqui quando o bloco de data não o mostra e não
  // há rótulo de virada de mês — evita repetir a mesma informação duas vezes.
  const timeLabel =
    event.endTime && endValue
      ? isMultiDay && sameMonth
        ? `${event.time} → ${event.endTime} (dia ${pad2(endValue.getDate())})`
        : `${event.time} → ${event.endTime}`
      : event.time;

  const safeRegistrationUrl = getSafeExternalURL(event.registrationUrl);

  return (
    <div className="flex gap-4 rounded-card border border-border bg-white p-4 shadow-soft">
      <div className="flex min-w-[70px] flex-col items-center justify-center rounded-soft bg-brand-50 px-3 py-2 text-brand-700">
        <p className="font-display text-2xl font-extrabold leading-none">
          {dayLabel}
        </p>
        <p className="mt-1 font-display text-xs font-semibold uppercase tracking-wide">
          {mon}
        </p>
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="font-display text-lg font-bold text-ink">
          {event.title}
        </h4>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-2">
          <Icon icon="material-symbols:schedule-outline-rounded" />
          {timeLabel}
          {crossMonthEndLabel && <> · {crossMonthEndLabel}</>}
          {event.recurring && <> · {event.recurring}</>}
        </p>
        {event.location && (
          <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-2">
            <Icon icon="material-symbols:location-on-outline-rounded" />
            {event.location}
          </p>
        )}
        {event.desc && (
          <p className="mt-2 text-sm leading-6 text-ink-2">{event.desc}</p>
        )}
        {safeRegistrationUrl && (
          <a
            href={safeRegistrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm mt-3 inline-block"
          >
            Inscrever-se
          </a>
        )}
      </div>
    </div>
  );
}
