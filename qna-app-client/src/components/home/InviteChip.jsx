import { MailOpen } from "lucide-react";
import { useCountdown } from "@/hooks/CountDownHook";

// The student's side of the hero exam card: what an invited student sees.
export default function InviteChip({ className }) {
    const countdown = useCountdown(14 * 60 + 9);

    return (
        <div className={className}>
            <div className="flex items-center gap-3 rounded-2xl bg-card p-3 pr-4 shadow-lg ring-1 ring-foreground/10">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-student-soft text-student">
                    <MailOpen className="size-5" />
                </span>
                <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        You're invited
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                        Opens in <span className="font-mono text-student">{countdown}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
