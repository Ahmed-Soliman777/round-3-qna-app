import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CalendarDays, ChevronLeft, ChevronRight, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toLocalValue } from "@/lib/dateTime";

// Values are local "YYYY-MM-DDTHH:mm" strings — the same shape a datetime-local input uses,
// so this is a drop-in replacement for one.

const pad = (n) => String(n).padStart(2, "0");
const parse = (value) => {
    if (!value) return null;
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
};
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const sameDay = (a, b) => a && b && startOfDay(a).getTime() === startOfDay(b).getTime();
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n, d.getHours(), d.getMinutes());
const withTime = (d, h, m) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m);

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
// 12-hour clock: 12, 1, 2 … 11 within the chosen AM/PM period.
const HOURS = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const PERIODS = ["AM", "PM"];
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

const monthLabel = (d) => d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
const dayLabel = (d) => d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
const periodOf = (h) => (h < 12 ? "AM" : "PM");
const to12 = (h) => h % 12 || 12;
const to24 = (h12, period) => (h12 % 12) + (period === "PM" ? 12 : 0);
const timeLabel = (d) => `${to12(d.getHours())}:${pad(d.getMinutes())} ${periodOf(d.getHours())}`;

const rtf = typeof Intl !== "undefined" && Intl.RelativeTimeFormat ? new Intl.RelativeTimeFormat(undefined, { numeric: "auto" }) : null;
function relative(d) {
    if (!rtf) return "";
    const mins = Math.round((d - new Date()) / 60000);
    const abs = Math.abs(mins);
    if (abs < 60) return rtf.format(mins, "minute");
    if (abs < 60 * 24) return rtf.format(Math.round(mins / 60), "hour");
    return rtf.format(Math.round(mins / 1440), "day");
}

function spanLabel(from, to) {
    const mins = Math.round((to - from) / 60000);
    if (mins <= 0) return null;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return [h && `${h}h`, m && `${m}m`].filter(Boolean).join(" ");
}

// Monday-first grid of 42 days covering the given month.
function monthGrid(month) {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const offset = (first.getDay() + 6) % 7;
    return Array.from({ length: 42 }, (_, i) => new Date(first.getFullYear(), first.getMonth(), i - offset + 1));
}

function presetsFor(min) {
    const now = new Date();
    if (min) {
        const base = parse(min);
        return [
            { label: "+30 min", date: new Date(base.getTime() + 30 * 60000) },
            { label: "+1 hour", date: new Date(base.getTime() + 60 * 60000) },
            { label: "+2 hours", date: new Date(base.getTime() + 120 * 60000) },
            { label: "+1 day", date: addDays(base, 1) },
        ];
    }
    const nextHour = new Date(now);
    nextHour.setHours(now.getHours() + 1, 0, 0, 0);
    const nextMonday = addDays(startOfDay(now), ((8 - now.getDay()) % 7) || 7);
    return [
        { label: "Next hour", date: nextHour },
        { label: "Tomorrow 9 AM", date: withTime(addDays(now, 1), 9, 0) },
        { label: "Tomorrow 2 PM", date: withTime(addDays(now, 1), 14, 0) },
        { label: "Next Mon 9 AM", date: withTime(nextMonday, 9, 0) },
    ];
}

const SHEET_QUERY = "(max-width: 639px)";

// True on phone-sized screens, where the picker opens as a bottom sheet.
function useIsSheet() {
    const [isSheet, setIsSheet] = useState(() => typeof window !== "undefined" && window.matchMedia(SHEET_QUERY).matches);
    useEffect(() => {
        const mq = window.matchMedia(SHEET_QUERY);
        const onChange = () => setIsSheet(mq.matches);
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, []);
    return isSheet;
}

function TimeColumn({ label, items, selected, isDisabled, onSelect, format = pad }) {
    const listRef = useRef(null);

    useLayoutEffect(() => {
        const list = listRef.current;
        const el = list?.querySelector("[data-selected]");
        if (list && el) list.scrollTop = el.offsetTop - list.clientHeight / 2 + el.clientHeight / 2;
    }, [selected]);

    return (
        <div className="flex min-w-0 flex-1 flex-col">
            <p className="pb-1.5 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {label}
            </p>
            <div
                ref={listRef}
                role="listbox"
                aria-label={label}
                className="relative h-44 snap-y overflow-y-auto overscroll-contain rounded-lg bg-muted/60 p-1 [scrollbar-width:thin] sm:h-60"
            >
                {items.map((n) => {
                    const active = n === selected;
                    const disabled = isDisabled(n);
                    return (
                        <button
                            key={n}
                            type="button"
                            role="option"
                            aria-selected={active}
                            data-selected={active || undefined}
                            disabled={disabled}
                            onClick={() => onSelect(n)}
                            className={cn(
                                "block w-full snap-center rounded-md py-1.5 text-center text-sm font-medium tabular-nums transition-colors",
                                active
                                    ? "bg-orange-500 text-white shadow-sm"
                                    : "text-foreground hover:bg-background",
                                disabled && "cursor-not-allowed opacity-30 hover:bg-transparent"
                            )}
                        >
                            {format(n)}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default function DateTimePicker({
    id,
    value,
    onChange,
    min,
    rangeStart,
    rangeEnd,
    placeholder = "Pick a date & time",
    align = "start",
    required,
    className,
    triggerClassName,
}) {
    const selected = parse(value);
    const minDate = parse(min);
    const rangeFrom = parse(rangeStart);
    const rangeTo = parse(rangeEnd);

    const [open, setOpen] = useState(false);
    const [month, setMonth] = useState(() => startOfDay(selected ?? minDate ?? new Date()));
    const wrapperRef = useRef(null);
    const popoverRef = useRef(null);
    const isSheet = useIsSheet();
    const gridRef = useRef(null);
    const popoverId = useId();
    const today = new Date();

    // Close on outside click / Escape.
    useEffect(() => {
        if (!open) return;
        const onDown = (e) => {
            if (!wrapperRef.current?.contains(e.target) && !popoverRef.current?.contains(e.target)) setOpen(false);
        };
        const onKey = (e) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    const toggle = () => {
        if (!open) setMonth(startOfDay(selected ?? minDate ?? new Date()));
        setOpen((o) => !o);
    };

    const commit = (d) => {
        let next = d;
        if (minDate && next < minDate) next = minDate;
        onChange(toLocalValue(next));
        if (next.getMonth() !== month.getMonth() || next.getFullYear() !== month.getFullYear()) {
            setMonth(startOfDay(next));
        }
    };

    const dayDisabled = (d) => minDate && startOfDay(d) < startOfDay(minDate);
    const pickDay = (d) => {
        const base = selected ?? (minDate && sameDay(d, minDate) ? minDate : withTime(d, 9, 0));
        commit(withTime(d, base.getHours(), base.getMinutes()));
    };

    const onGridKey = (e) => {
        const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
        if (!step) return;
        e.preventDefault();
        const next = addDays(selected ?? withTime(today, 9, 0), step);
        if (!dayDisabled(next)) {
            commit(next);
            requestAnimationFrame(() => gridRef.current?.querySelector("[aria-selected=true]")?.focus());
        }
    };

    const selDay = selected ?? minDate ?? today;
    const onMinDay = minDate && sameDay(selDay, minDate);
    const period = periodOf((selected ?? withTime(selDay, 9, 0)).getHours());
    const hourDisabled = (h12) => onMinDay && to24(h12, period) < minDate.getHours();
    const minuteDisabled = (m) =>
        onMinDay && selDay.getHours() === minDate.getHours() && m < minDate.getMinutes();
    // AM is off-limits only when the earliest allowed time is already in the afternoon.
    const periodDisabled = (p) => onMinDay && p === "AM" && minDate.getHours() >= 12;
    const setHour = (h12) => commit(withTime(selDay, to24(h12, period), selected ? selected.getMinutes() : 0));
    const setMinute = (m) => commit(withTime(selDay, selected ? selected.getHours() : 9, m));
    const setPeriod = (p) => {
        const base = selected ?? withTime(selDay, 9, 0);
        commit(withTime(selDay, to24(to12(base.getHours()), p), base.getMinutes()));
    };

    const inRange = (d) => rangeFrom && rangeTo && startOfDay(d) >= startOfDay(rangeFrom) && startOfDay(d) <= startOfDay(rangeTo);
    const isPast = selected && selected < today;
    const span = rangeFrom && rangeTo ? spanLabel(rangeFrom, rangeTo) : null;
    // The phone sheet is fixed-position, so render it at the body to escape any transformed ancestor.
    const renderPopover = (node) => (isSheet ? createPortal(node, document.body) : node);

    return (
        <div ref={wrapperRef} className={cn("relative", className)}>
            <button
                id={id}
                type="button"
                onClick={toggle}
                aria-haspopup="dialog"
                aria-expanded={open}
                aria-controls={popoverId}
                className={cn(
                    "group flex w-full items-center gap-3 rounded-lg bg-background px-3 py-2 text-left ring-1 ring-border outline-none transition hover:ring-orange-300 focus-visible:ring-2 focus-visible:ring-orange-500",
                    open && "ring-2 ring-orange-500",
                    triggerClassName
                )}
            >
                <span
                    className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-md transition-colors",
                        selected ? "bg-orange-100 text-orange-600 dark:bg-orange-500/15" : "bg-muted text-muted-foreground",
                        "group-hover:bg-orange-500 group-hover:text-white"
                    )}
                >
                    <CalendarDays className="size-4" />
                </span>
                {selected ? (
                    <span className="min-w-0 leading-tight">
                        <span className="block truncate text-sm font-semibold text-foreground">
                            {dayLabel(selected)} · <span className="tabular-nums">{timeLabel(selected)}</span>
                        </span>
                        <span className={cn("block truncate text-xs", isPast ? "text-destructive" : "text-muted-foreground")}>
                            {relative(selected)}
                        </span>
                    </span>
                ) : (
                    <span className="text-sm text-muted-foreground">{placeholder}</span>
                )}
            </button>

            {/* Keeps native "required" validation working. */}
            {required && (
                <input
                    tabIndex={-1}
                    aria-hidden="true"
                    required
                    value={value ?? ""}
                    onChange={() => {}}
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-0 opacity-0"
                />
            )}

            {open && renderPopover(
                <>
                    <div
                        className="fixed inset-0 z-40 bg-black/30 animate-in fade-in sm:hidden"
                        onClick={() => setOpen(false)}
                    />
                    <div
                        id={popoverId}
                        ref={popoverRef}
                        role="dialog"
                        aria-label="Choose date and time"
                        className={cn(
                            "z-50 bg-popover text-popover-foreground shadow-2xl ring-1 ring-foreground/10",
                            // Bottom sheet on phones, anchored popover from sm up.
                            "fixed inset-x-0 bottom-0 max-h-[90vh] overflow-y-auto rounded-t-2xl p-4 animate-in slide-in-from-bottom-8 fade-in duration-200",
                            "sm:absolute sm:inset-x-auto sm:bottom-auto sm:top-full sm:mt-2 sm:w-[34rem] sm:max-w-[calc(100vw-2rem)] sm:rounded-2xl sm:slide-in-from-bottom-0 sm:slide-in-from-top-2",
                            align === "end" ? "sm:right-0" : "sm:left-0"
                        )}
                    >
                        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border sm:hidden" />

                        <div className="flex flex-wrap gap-1.5">
                            {presetsFor(min).map((p) => (
                                <button
                                    key={p.label}
                                    type="button"
                                    onClick={() => commit(p.date)}
                                    className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground ring-1 ring-transparent transition hover:bg-background hover:text-foreground hover:ring-orange-400"
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>

                        <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                            {/* Calendar */}
                            <div className="sm:w-[17rem] sm:shrink-0">
                                <div className="flex items-center justify-between">
                                    <button
                                        type="button"
                                        aria-label="Previous month"
                                        onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
                                        className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                                    >
                                        <ChevronLeft className="size-4" />
                                    </button>
                                    <p key={month.getTime()} className="text-sm font-bold animate-in fade-in">
                                        {monthLabel(month)}
                                    </p>
                                    <button
                                        type="button"
                                        aria-label="Next month"
                                        onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
                                        className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                                    >
                                        <ChevronRight className="size-4" />
                                    </button>
                                </div>

                                <div className="mt-2 grid grid-cols-7 text-center text-[11px] font-semibold uppercase text-muted-foreground">
                                    {WEEKDAYS.map((d) => (
                                        <span key={d} className="py-1">{d}</span>
                                    ))}
                                </div>
                                <div
                                    ref={gridRef}
                                    role="grid"
                                    onKeyDown={onGridKey}
                                    className="grid grid-cols-7 gap-y-1"
                                >
                                    {monthGrid(month).map((d) => {
                                        const isSelected = sameDay(d, selected);
                                        const isToday = sameDay(d, today);
                                        const outside = d.getMonth() !== month.getMonth();
                                        const disabled = dayDisabled(d);
                                        const ranged = inRange(d);
                                        return (
                                            <div
                                                key={d.getTime()}
                                                className={cn(
                                                    "flex justify-center",
                                                    ranged && "bg-orange-100/70 dark:bg-orange-500/10",
                                                    ranged && sameDay(d, rangeFrom) && "rounded-l-full",
                                                    ranged && sameDay(d, rangeTo) && "rounded-r-full"
                                                )}
                                            >
                                                <button
                                                    type="button"
                                                    role="gridcell"
                                                    aria-selected={isSelected}
                                                    aria-label={d.toDateString()}
                                                    tabIndex={isSelected ? 0 : -1}
                                                    disabled={disabled}
                                                    onClick={() => pickDay(d)}
                                                    className={cn(
                                                        "relative flex size-9 items-center justify-center rounded-full text-sm tabular-nums transition-all",
                                                        isSelected
                                                            ? "scale-105 bg-orange-500 font-bold text-white shadow-md shadow-orange-500/30"
                                                            : "hover:bg-muted",
                                                        !isSelected && outside && "text-muted-foreground/50",
                                                        !isSelected && isToday && "font-bold text-orange-600",
                                                        disabled && "cursor-not-allowed text-muted-foreground/30 line-through hover:bg-transparent"
                                                    )}
                                                >
                                                    {d.getDate()}
                                                    {isToday && !isSelected && (
                                                        <span className="absolute bottom-1 size-1 rounded-full bg-orange-500" />
                                                    )}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setMonth(startOfDay(today))}
                                    className="mt-2 text-xs font-semibold text-orange-600 hover:underline"
                                >
                                    Jump to today
                                </button>
                            </div>

                            {/* Time */}
                            <div className="flex flex-1 flex-col border-t border-border pt-4 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
                                <p className="flex items-center gap-1.5 pb-2 text-sm font-bold">
                                    <Clock className="size-4 text-orange-600" /> Time
                                </p>
                                <div className="flex gap-2">
                                    <TimeColumn
                                        label="Hour"
                                        items={HOURS}
                                        selected={selected && to12(selected.getHours())}
                                        isDisabled={hourDisabled}
                                        onSelect={setHour}
                                        format={String}
                                    />
                                    <TimeColumn
                                        label="Min"
                                        items={MINUTES}
                                        selected={selected?.getMinutes()}
                                        isDisabled={minuteDisabled}
                                        onSelect={setMinute}
                                    />
                                    <TimeColumn
                                        label="AM/PM"
                                        items={PERIODS}
                                        selected={selected && periodOf(selected.getHours())}
                                        isDisabled={periodDisabled}
                                        onSelect={setPeriod}
                                        format={String}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3">
                            <div className="min-w-0 text-xs">
                                {selected ? (
                                    <>
                                        <p className="truncate font-semibold text-foreground">
                                            {selected.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}{" "}
                                            at {timeLabel(selected)}
                                        </p>
                                        <p className="text-muted-foreground">
                                            {relative(selected)}
                                            {span && ` · window ${span}`}
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-muted-foreground">Pick a day, then a time.</p>
                                )}
                            </div>
                            <div className="flex shrink-0 gap-2">
                                {value && !required && (
                                    <button
                                        type="button"
                                        aria-label="Clear"
                                        onClick={() => onChange("")}
                                        className="rounded-full p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                                    >
                                        <X className="size-4" />
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/85"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
