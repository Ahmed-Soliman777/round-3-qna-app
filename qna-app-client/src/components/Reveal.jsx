import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Fades and slides its children in the first time they scroll into view.
export default function Reveal({ as: Tag = "div", delay = 0, className, children, ...props }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el || typeof IntersectionObserver === "undefined") {
            setVisible(true);
            return;
        }
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <Tag
            ref={ref}
            data-shown={visible || undefined}
            style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
            className={cn(
                "transition-all duration-700 ease-out motion-reduce:transition-none",
                visible ? "opacity-100" : "translate-y-6 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100",
                className,
            )}
            {...props}
        >
            {children}
        </Tag>
    );
}
