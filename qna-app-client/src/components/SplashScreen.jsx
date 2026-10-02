import { useEffect } from "react";

export default function SplashScreen({ visible, onFadeEnd }) {
    // Fallback in case transitionend never fires (e.g. the tab is in the background).
    useEffect(() => {
        if (visible) return;
        const id = setTimeout(() => onFadeEnd?.(true), 600);
        return () => clearTimeout(id);
    }, [visible, onFadeEnd]);

    return (
        <div
            aria-hidden={!visible}
            className={`fixed inset-0 z-100 flex items-center justify-center bg-background transition-opacity duration-500 ${
                visible ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            onTransitionEnd={(e) => {
                if (!visible && e.target === e.currentTarget && e.propertyName === "opacity") onFadeEnd?.(true);
            }}
        >
            <span className="animate-splash-pulse font-heading text-5xl font-black tracking-tight text-foreground sm:text-6xl">
                Quizgate
            </span>
        </div>
    );
}
