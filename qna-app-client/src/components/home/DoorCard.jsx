import { useRef } from "react";
import { cn } from "@/lib/utils";

const tones = {
    brand: {
        glow: "color-mix(in oklch, var(--brand) 16%, transparent)",
        ring: "ring-brand/25",
        activeRing: "ring-brand/60 shadow-brand/20",
    },
    student: {
        glow: "color-mix(in oklch, var(--student) 14%, transparent)",
        ring: "ring-student/10",
        activeRing: "ring-student/35 shadow-student/15",
    },
};

// One "door" on the final CTA. `mode` comes from the parent so the doors react to each other:
// the hovered one lifts, the other steps back. A soft glow follows the pointer.
export default function DoorCard({ as: Tag = "div", tone = "brand", mode = "idle", className, children, ...props }) {
    const ref = useRef(null);
    const t = tones[tone];

    // Write straight to CSS variables so tracking the pointer never re-renders.
    const trackPointer = (e) => {
        const el = ref.current;
        if (!el) return;
        const box = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - box.left}px`);
        el.style.setProperty("--my", `${e.clientY - box.top}px`);
    };

    return (
        <Tag
            ref={ref}
            onPointerMove={trackPointer}
            data-state={mode}
            className={cn(
                "group relative isolate flex h-full flex-col overflow-hidden rounded-3xl bg-card p-7 shadow-lg ring-1 outline-none",
                "transition-[translate,scale,box-shadow,opacity,filter] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                "active:scale-[0.99]",
                t.ring,
                mode === "active" && cn("-translate-y-1.5 shadow-2xl motion-reduce:translate-y-0", t.activeRing),
                mode === "dimmed" && "scale-[0.98] opacity-70 saturate-50 motion-reduce:scale-100",
                className,
            )}
            {...props}
        >
            <span
                aria-hidden="true"
                style={{ background: `radial-gradient(420px circle at var(--mx, 50%) var(--my, 0%), ${t.glow}, transparent 65%)` }}
                className={cn(
                    "pointer-events-none absolute inset-0 -z-10 transition-opacity duration-300",
                    mode === "active" ? "opacity-100" : "opacity-0",
                )}
            />
            {children}
        </Tag>
    );
}
