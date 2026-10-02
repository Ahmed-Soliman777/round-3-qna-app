import { MailOpen } from "lucide-react";

// The student's side of the hero exam card: an invite landing in their inbox.
export default function InviteChip({ className }) {
    return (
        <div className={className}>
            <div className="flex items-center gap-3 rounded-2xl bg-card p-3 pr-5 shadow-lg ring-1 ring-foreground/10">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-student-soft text-student">
                    <MailOpen className="size-5" />
                </span>
                <p className="text-sm font-semibold text-foreground">You're invited</p>
            </div>
        </div>
    );
}
