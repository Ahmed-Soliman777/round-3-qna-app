import { useEffect, useRef, useState } from "react";
import { useSplashDone } from "@/context/splash";

// Animates the numeric part of a value like "10k+", "99.9%" or "<2s" from 0 once it scrolls into view.
export default function CountUp({ value, duration = 1200, className }) {
    const match = /^(\D*)([\d.]+)(.*)$/.exec(value);
    const ref = useRef(null);
    const [progress, setProgress] = useState(0);
    const splashDone = useSplashDone();

    useEffect(() => {
        const el = ref.current;
        if (!match || !el || !splashDone) return;
        if (
            typeof IntersectionObserver === "undefined" ||
            window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
            document.documentElement.hasAttribute("data-reduce-motion")
        ) {
            setProgress(1);
            return;
        }
        let frame;
        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            observer.disconnect();
            const start = performance.now();
            const tick = (now) => {
                const t = Math.min(1, (now - start) / duration);
                setProgress(1 - Math.pow(1 - t, 3));
                if (t < 1) frame = requestAnimationFrame(tick);
            };
            frame = requestAnimationFrame(tick);
        });
        observer.observe(el);
        return () => {
            observer.disconnect();
            cancelAnimationFrame(frame);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, duration, splashDone]);

    if (!match) return <span className={className}>{value}</span>;

    const [, prefix, number, suffix] = match;
    const decimals = number.includes(".") ? number.split(".")[1].length : 0;
    const current = (parseFloat(number) * progress).toFixed(decimals);

    return (
        <span ref={ref} className={className} aria-label={value}>
            <span aria-hidden="true" className="tabular-nums">
                {prefix}
                {current}
                {suffix}
            </span>
        </span>
    );
}
