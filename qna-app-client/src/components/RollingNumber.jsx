import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useSplashDone } from "@/context/splash";

// Odometer-style number: every digit spins up from 0 to its value on mount,
// and rolls to the new digit whenever the value changes.
// `value` can be a number or a pre-formatted string like "87.5%" or "1,204".

const ROW = 1.15; // em — height of one digit row (a little taller than 1em so glyphs never clip)
const SPINS = 2; // full 0–9 revolutions before landing on the first reveal
const COLUMN = Array.from({ length: (SPINS + 1) * 10 }, (_, i) => i % 10);

const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        document.documentElement.hasAttribute("data-reduce-motion"));

function Digit({ digit, rolled, duration, delay }) {
    // Before the first roll every column sits on 0; afterwards it lands on the last revolution.
    const index = rolled ? SPINS * 10 + digit : 0;
    return (
        <span className="relative inline-block overflow-hidden align-top" style={{ height: `${ROW}em` }}>
            <span
                className="flex flex-col"
                style={{
                    transform: `translateY(-${index * ROW}em)`,
                    transition: rolled ? `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, filter ${duration}ms ease-out ${delay}ms` : "none",
                    filter: rolled ? "blur(0)" : "blur(1.5px)",
                }}
            >
                {COLUMN.map((n, i) => (
                    <span key={i} className="block text-center" style={{ height: `${ROW}em`, lineHeight: `${ROW}em` }}>
                        {n}
                    </span>
                ))}
            </span>
        </span>
    );
}

export default function RollingNumber({ value, duration = 1400, delay = 0, stagger = 60, className }) {
    const text = String(value);
    const [rolled, setRolled] = useState(false);
    const splashDone = useSplashDone();

    useEffect(() => {
        if (!splashDone) return;
        // Next tick so the browser paints the "all zeros" state before the transition starts.
        const id = setTimeout(() => setRolled(true), 20);
        return () => clearTimeout(id);
    }, [splashDone]);

    const reduced = prefersReducedMotion();
    const chars = [...text];

    return (
        <span className={cn("inline-flex tabular-nums", className)}>
            <span className="sr-only">{text}</span>
            <span aria-hidden="true" className="inline-flex">
                {chars.map((char, i) => {
                    // Key from the right so units stay put when the number gains a digit.
                    const key = chars.length - i;
                    if (!/\d/.test(char)) {
                        return (
                            <span
                                key={`s${key}`}
                                className="inline-block transition-opacity duration-500"
                                style={{ height: `${ROW}em`, lineHeight: `${ROW}em`, opacity: rolled || reduced ? 1 : 0.3 }}
                            >
                                {char}
                            </span>
                        );
                    }
                    return reduced ? (
                        <span key={`d${key}`} style={{ lineHeight: `${ROW}em` }}>{char}</span>
                    ) : (
                        <Digit
                            key={`d${key}`}
                            digit={Number(char)}
                            rolled={rolled}
                            duration={duration}
                            delay={delay + (chars.length - 1 - i) * stagger}
                        />
                    );
                })}
            </span>
        </span>
    );
}
