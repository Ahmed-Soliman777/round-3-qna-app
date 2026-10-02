import { useEffect, useId, useRef, useState } from "react";
import { CalendarPlus, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { downloadQuizIcs, googleCalendarUrl } from "@/lib/calendar";

// Small menu that saves a quiz window to the student's calendar.
// Stops click propagation so it can sit inside a clickable QuizCard.
export default function AddToCalendar({ quiz, className }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const menuId = useId();

    useEffect(() => {
        if (!open) return;
        const close = (event) => {
            if (!ref.current?.contains(event.target)) setOpen(false);
        };
        const onKey = (event) => event.key === "Escape" && setOpen(false);
        document.addEventListener("mousedown", close);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", close);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    const itemClass =
        "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-foreground transition-colors hover:bg-student-soft focus-visible:bg-student-soft focus-visible:outline-none";

    return (
        <div
            ref={ref}
            className={cn("relative", className)}
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
        >
            <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={open}
                aria-controls={open ? menuId : undefined}
                onClick={() => setOpen((value) => !value)}
                className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-student ring-1 ring-student/20 transition-colors hover:bg-student-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-student",
                    open && "bg-student-soft",
                )}
            >
                <CalendarPlus className="size-3.5" />
                Add to calendar
            </button>

            {open && (
                <div
                    id={menuId}
                    role="menu"
                    className="absolute left-0 top-full z-20 mt-2 w-56 origin-top-left rounded-xl bg-popover p-1.5 shadow-lg ring-1 ring-foreground/10 animate-in fade-in-0 zoom-in-95"
                >
                    <a
                        role="menuitem"
                        href={googleCalendarUrl(quiz)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setOpen(false)}
                        className={itemClass}
                    >
                        <CalendarPlus className="size-4 text-student" />
                        Google Calendar
                    </a>
                    <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                            downloadQuizIcs(quiz);
                            setOpen(false);
                        }}
                        className={itemClass}
                    >
                        <Download className="size-4 text-student" />
                        Apple / Outlook (.ics)
                    </button>
                </div>
            )}
        </div>
    );
}
