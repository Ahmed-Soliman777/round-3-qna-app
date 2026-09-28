import { useState } from "react";
import { useCountdown } from "@/hooks/CountDownHook";

export default function ExamPreviewCard() {
    const countdown = useCountdown(6 * 3600 + 56 * 60 + 38);
    const [tilt, setTilt] = useState({ x: 0, y: 0, mx: "50%", my: "0%" });

    // Tilt toward the pointer and remember where it is so the glow can follow it.
    const handleMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({ x: y * -8, y: x * 8, mx: `${e.clientX - rect.left}px`, my: `${e.clientY - rect.top}px` });
    };

    return (
        <div
            onMouseMove={handleMove}
            onMouseLeave={() => setTilt((t) => ({ ...t, x: 0, y: 0 }))}
            style={{ transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
            className="group relative isolate w-full max-w-md overflow-hidden rounded-2xl bg-card p-6 shadow-xl ring-1 ring-foreground/10 transition-[transform,box-shadow] duration-200 ease-out hover:shadow-2xl hover:shadow-brand/20 hover:ring-2 hover:ring-brand/40 motion-reduce:transform-none"
        >
            {/* Soft orange glow that follows the pointer while hovering. */}
            <span
                aria-hidden="true"
                style={{
                    background: `radial-gradient(360px circle at ${tilt.mx} ${tilt.my}, color-mix(in oklch, var(--brand) 12%, transparent), transparent 65%)`,
                }}
                className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />

            <div className="flex items-start justify-between gap-4">
                <h3 className="text-lg font-bold leading-snug transition-colors duration-300 group-hover:text-brand">
                    Placement Exam — Cohort 14
                </h3>
                <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                    <span className="relative flex size-1.5">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-500 opacity-75" />
                        <span className="relative inline-flex size-1.5 rounded-full bg-green-600" />
                    </span>
                    PUBLISHED
                </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
                45 questions · logic, aptitude, written response
            </p>

            <div className="mt-5 flex items-center justify-between rounded-xl bg-muted px-4 py-3 transition-colors duration-300 group-hover:bg-brand-soft">
                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Window
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                        Sep 12, 09:00 → 11:00
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Closes in
                    </p>
                    <p className="font-mono text-lg font-bold text-orange-600">{countdown}</p>
                </div>
            </div>

            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                <span>120 min duration</span>
                <span>212 invited</span>
                <span>admin@board.edu</span>
            </div>
        </div>
    );
}
