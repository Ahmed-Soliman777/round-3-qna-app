import { useState } from "react";
import { useNavigate } from "react-router";
import { Lock, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import GlowCard from "./GlowCard";

const ADMINS = ["admin@board.edu"];
const INVITED = ["student@board.edu", "sara@board.edu", "omar@board.edu"];

const presets = ["admin@board.edu", "student@board.edu", "unknown@web.io"];

const verdictFor = (email) => {
    const e = email.trim().toLowerCase();
    if (ADMINS.includes(e)) return { label: "Allowed", tone: "ok", reason: "Admin — can reach every quiz, published or not." };
    if (INVITED.includes(e)) return { label: "Invited", tone: "ok", reason: "Invited student — sees the published quiz once the window opens." };
    return { label: "Denied", tone: "bad", reason: "Not an admin and not invited — turned away before touching data." };
};

export default function GateMockup() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [log, setLog] = useState([
        { email: "admin@board.edu", ...verdictFor("admin@board.edu") },
        { email: "student@board.edu", ...verdictFor("student@board.edu") },
        { email: "unknown@web.io", ...verdictFor("unknown@web.io") },
    ]);

    const check = (target) => {
        setLog((prev) => [{ email: target, ...verdictFor(target), fresh: Date.now() }, ...prev].slice(0, 4));
    };

    const latest = log[0];

    return (
        <GlowCard>
            <div className="flex items-center gap-2 text-sm font-semibold transition-colors duration-300 group-hover/glow:text-brand">
                <Lock className="size-4 text-orange-600" />
                Role check
            </div>

            <form
                className="mt-4 flex gap-2"
                onSubmit={(e) => {
                    e.preventDefault();
                    if (email.trim()) navigate("/register", { state: { email: email.trim() } });
                }}
            >
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email to request access…"
                    aria-label="Email to check"
                    className="min-w-0 flex-1 rounded-lg bg-background px-3 py-2 text-sm ring-1 ring-border outline-none transition focus:ring-2 focus:ring-orange-500"
                />
                <button
                    type="submit"
                    disabled={!email.trim()}
                    aria-label="Send request"
                    className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/85 disabled:opacity-50"
                >
                    <Send className="size-4" />
                    <span className="hidden sm:inline">Request</span>
                </button>
            </form>

            <div className="mt-2 flex flex-wrap gap-1.5">
                {presets.map((p) => (
                    <button
                        key={p}
                        type="button"
                        onClick={() => check(p)}
                        className="rounded-full bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground ring-1 ring-border transition hover:text-foreground hover:ring-orange-400 "
                    >
                        {p}
                    </button>
                ))}
            </div>

            <ul className="mt-4 space-y-3">
                {log.map((row) => (
                    <li
                        key={row.fresh ?? row.email}
                        className={cn(
                            "flex items-center justify-between gap-3 rounded-lg bg-background px-3 py-2.5 ring-1 ring-border",
                            row.fresh && "animate-in fade-in slide-in-from-top-2 duration-300",
                        )}
                    >
                        <span className="truncate text-sm font-medium">{row.email}</span>
                        <span
                            className={cn(
                                "shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold",
                                row.tone === "ok" ? "bg-green-100 text-green-700" : "bg-destructive/10 text-destructive",
                            )}
                        >
                            {row.label}
                        </span>
                    </li>
                ))}
            </ul>

            <p role="status" className="mt-4 min-h-5 text-xs font-medium text-muted-foreground">
                {latest.reason}
            </p>
        </GlowCard>
    );
}
