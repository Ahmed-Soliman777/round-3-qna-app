import { useState } from "react";
import { cn } from "@/lib/utils";

const MAX_TILT = 6;

// Interactive mockup card: tilts toward the pointer and shows an orange ring plus a glow that
// follows it (same hover language as the hero exam card). The tilt pauses while the visitor is
// using something inside (typing, a picker, dragging the slider) so controls stay upright and precise.
// Titles inside can react with `group-hover/glow:*`.
export default function GlowCard({ className, children }) {
    const [pointer, setPointer] = useState({ rx: 0, ry: 0, mx: "50%", my: "0%" });
    const [engaged, setEngaged] = useState(false);

    const handleMove = (e) => {
        if (e.pointerType !== "mouse") return;
        const box = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - box.left) / box.width - 0.5;
        const y = (e.clientY - box.top) / box.height - 0.5;
        setPointer({ rx: y * -MAX_TILT, ry: x * MAX_TILT, mx: `${e.clientX - box.left}px`, my: `${e.clientY - box.top}px` });
    };

    const tilted = !engaged && (pointer.rx !== 0 || pointer.ry !== 0);

    return (
        <div
            onPointerMove={handleMove}
            onPointerLeave={() => setPointer((p) => ({ ...p, rx: 0, ry: 0 }))}
            onPointerDown={() => setEngaged(true)}
            onFocus={() => setEngaged(true)}
            onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) setEngaged(false);
            }}
            style={{
                transform: tilted ? `perspective(1000px) rotateX(${pointer.rx}deg) rotateY(${pointer.ry}deg)` : undefined,
            }}
            className={cn(
                "group/glow relative isolate rounded-2xl bg-muted p-6 ring-1 ring-foreground/10",
                "transition-[transform,translate,box-shadow] duration-200 ease-out motion-reduce:transform-none",
                "hover:z-10 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand/15 hover:ring-2 hover:ring-brand/40 focus-within:z-10",
                className,
            )}
        >
            <span
                aria-hidden="true"
                style={{
                    background: `radial-gradient(380px circle at ${pointer.mx} ${pointer.my}, color-mix(in oklch, var(--brand) 11%, transparent), transparent 65%)`,
                }}
                className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/glow:opacity-100"
            />
            {children}
        </div>
    );
}
