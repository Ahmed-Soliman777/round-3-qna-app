import { useEffect, useState } from "react";

// How long the message stays up once the splash starts fading, then the text fade and stair timings.
const HOLD_MS = 1200;
const TEXT_OUT_MS = 250;
const STRIP_MS = 600;
const STAGGER_MS = 45;
const FADE_MS = 300;
const EASE = "cubic-bezier(0.76, 0, 0.24, 1)";

const reducedMotion = () =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Fewer, wider stairs on phones so each step still reads as a step.
function useStripCount() {
    const [count, setCount] = useState(() => (typeof window !== "undefined" && window.innerWidth < 640 ? 6 : 10));
    useEffect(() => {
        const mq = window.matchMedia("(max-width: 639px)");
        const onChange = () => setCount(mq.matches ? 6 : 10);
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, []);
    return count;
}

// Orange cover that sits under the splash, then lifts away in stairs from the left.
export default function StairsPreloader({ play, onDone, text = "Every quiz opens on schedule." }) {
    const [leaving, setLeaving] = useState(false);
    const strips = useStripCount();
    const [reduce] = useState(reducedMotion);

    useEffect(() => {
        if (!play) return;
        const id = setTimeout(() => setLeaving(true), HOLD_MS);
        return () => clearTimeout(id);
    }, [play]);

    useEffect(() => {
        if (!leaving) return;
        const total = reduce ? FADE_MS : TEXT_OUT_MS + (strips - 1) * STAGGER_MS + STRIP_MS;
        const id = setTimeout(() => onDone?.(true), total + 50);
        return () => clearTimeout(id);
    }, [leaving, reduce, strips, onDone]);

    return (
        <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-90 overflow-hidden"
            style={reduce ? { opacity: leaving ? 0 : 1, transition: `opacity ${FADE_MS}ms ease-out` } : undefined}
        >
            {Array.from({ length: strips }, (_, i) => (
                <div
                    key={i}
                    className="absolute inset-y-0 bg-orange-500"
                    style={{
                        left: `${(i * 100) / strips}%`,
                        // 1px overlap hides hairline seams between strips.
                        width: `calc(${100 / strips}% + 1px)`,
                        transform: leaving && !reduce ? "translate3d(0, -100%, 0)" : "translate3d(0, 0, 0)",
                        transition: reduce ? undefined : `transform ${STRIP_MS}ms ${EASE} ${TEXT_OUT_MS + i * STAGGER_MS}ms`,
                        willChange: "transform",
                    }}
                />
            ))}

            <p
                className="absolute inset-0 flex items-center justify-center px-6 text-center font-heading text-2xl font-black tracking-tight text-white sm:text-4xl"
                style={{
                    opacity: leaving ? 0 : 1,
                    transform: leaving ? "translate3d(0, -12px, 0)" : "translate3d(0, 0, 0)",
                    transition: `opacity ${TEXT_OUT_MS}ms ease-out, transform ${TEXT_OUT_MS}ms ease-out`,
                }}
            >
                {text}
            </p>
        </div>
    );
}
