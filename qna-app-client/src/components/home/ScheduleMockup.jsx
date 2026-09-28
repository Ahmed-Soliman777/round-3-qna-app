import { useState } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import GlowCard from "./GlowCard";

// Demo day runs 08:00–18:00; the quiz window is 14:00–16:00.
const DAY_START = 8 * 60;
const DAY_END = 18 * 60;
const OPENS = 14 * 60;
const CLOSES = 16 * 60;

const pct = (minutes) => ((minutes - DAY_START) / (DAY_END - DAY_START)) * 100;
const fmt = (minutes) =>
    `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

const phases = [
    {
        key: "before",
        label: "Before window",
        badge: "Locked",
        active: "ring-2 ring-foreground/30",
        badgeActive: "bg-foreground text-background",
        note: (now) => `Opens in ${Math.floor((OPENS - now) / 60)}h ${(OPENS - now) % 60}m — students see a countdown.`,
    },
    {
        key: "during",
        label: "During window",
        badge: "Live",
        active: "ring-2 ring-orange-400",
        badgeActive: "bg-green-100 text-green-700",
        note: (now) => `Live — ${CLOSES - now} min left before every link stops working.`,
    },
    {
        key: "after",
        label: "After window",
        badge: "Closed",
        active: "ring-2 ring-destructive/40",
        badgeActive: "bg-destructive/10 text-destructive",
        note: () => "Closed automatically at 16:00. No manual toggling needed.",
    },
];

export default function ScheduleMockup() {
    const [now, setNow] = useState(13 * 60 + 30);
    const current = now < OPENS ? "before" : now < CLOSES ? "during" : "after";
    const currentPhase = phases.find((p) => p.key === current);

    return (
        <GlowCard>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold transition-colors duration-300 group-hover/glow:text-brand">
                    <Clock className="size-4 text-orange-600" />
                    Access window
                </div>
                <span className="font-mono text-sm font-bold text-orange-600 tabular-nums">
                    {fmt(now)}
                </span>
            </div>

            <div className="mt-5">
                <input
                    type="range"
                    aria-label="Time of day"
                    min={DAY_START}
                    max={DAY_END}
                    step={5}
                    value={now}
                    onChange={(e) => setNow(Number(e.target.value))}
                    className="w-full cursor-grab accent-orange-500 active:cursor-grabbing"
                />
                <div className="relative mt-1 h-1.5 rounded-full bg-background ring-1 ring-border">
                    <div
                        className="absolute inset-y-0 rounded-full bg-orange-500/40"
                        style={{ left: `${pct(OPENS)}%`, width: `${pct(CLOSES) - pct(OPENS)}%` }}
                    />
                </div>
                <div className="relative mt-1 h-4 text-[11px] font-medium text-muted-foreground tabular-nums">
                    <span className="absolute left-0">{fmt(DAY_START)}</span>
                    {[OPENS, CLOSES].map((m) => (
                        <span
                            key={m}
                            className="absolute -translate-x-1/2 text-orange-600"
                            style={{ left: `${pct(m)}%` }}
                        >
                            {fmt(m)}
                        </span>
                    ))}
                    <span className="absolute right-0">{fmt(DAY_END)}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Drag to move the clock.</p>
            </div>

            <div className="mt-4 space-y-3">
                {phases.map((phase) => {
                    const isActive = phase.key === current;
                    return (
                        <div
                            key={phase.key}
                            className={cn(
                                "flex items-center justify-between rounded-lg bg-background px-3 py-2.5 ring-1 ring-border transition-all duration-300",
                                isActive ? cn(phase.active, "scale-[1.02] shadow-sm") : "opacity-60",
                            )}
                        >
                            <span className={cn("text-sm", isActive ? "font-medium" : "text-muted-foreground")}>
                                {phase.label}
                            </span>
                            <span
                                className={cn(
                                    "rounded-full px-2 py-0.5 text-xs font-semibold transition-colors",
                                    isActive ? phase.badgeActive : "bg-secondary text-secondary-foreground",
                                )}
                            >
                                {phase.badge}
                            </span>
                        </div>
                    );
                })}
            </div>

            <p role="status" className="mt-4 min-h-5 text-xs font-medium text-muted-foreground">
                {currentPhase.note(now)}
            </p>
        </GlowCard>
    );
}
