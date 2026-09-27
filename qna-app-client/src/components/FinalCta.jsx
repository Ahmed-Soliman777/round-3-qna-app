import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowRight, ArrowUpRight, ClipboardCheck, MailOpen } from "lucide-react";
import Reveal from "@/components/Reveal";
import DoorCard from "@/components/home/DoorCard";
import { cn } from "@/lib/utils";

const iconTile =
    "flex size-11 items-center justify-center rounded-xl transition-[rotate,scale,background-color,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[state=active]:-rotate-6 group-data-[state=active]:scale-110";
const cornerArrow =
    "absolute right-6 top-6 size-5 -translate-x-1 translate-y-1 opacity-0 transition-[translate,opacity] duration-300 group-data-[state=active]:translate-x-0 group-data-[state=active]:translate-y-0 group-data-[state=active]:opacity-100";

// Closing section: one door for admins (orange), one for invited students.
export default function FinalCta() {
    const navigate = useNavigate();
    const emailRef = useRef(null);
    const [email, setEmail] = useState("");
    const [active, setActive] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/register", { state: { email: email.trim() } });
    };

    // Mouse hover drives the doors; touch gets the press effect instead of a sticky hover.
    const doorEvents = (door) => ({
        onPointerEnter: (e) => e.pointerType === "mouse" && setActive(door),
        onPointerLeave: (e) => e.pointerType === "mouse" && setActive(null),
        onFocus: () => setActive(door),
        onBlur: (e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setActive(null);
        },
    });
    const stateOf = (door) => (active === null ? "idle" : active === door ? "active" : "dimmed");

    return (
        <section className="border-t border-border bg-muted/40 py-16">
            <div className="mx-auto max-w-5xl px-6 lg:px-8">
                <Reveal className="text-center">
                    <h2 className="text-4xl font-black tracking-tight sm:text-5xl">Pick your door.</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Whether you're running the quiz or taking it, you're one step away.
                    </p>
                </Reveal>

                <div className="mt-10 grid gap-5 md:grid-cols-2">
                    <Reveal className="h-full">
                        <DoorCard
                            tone="brand"
                            state={stateOf("admin")}
                            {...doorEvents("admin")}
                            // Clicking anywhere on the door (outside the form) jumps to the email field.
                            onClick={(e) => {
                                if (!e.target.closest("form")) emailRef.current?.focus();
                            }}
                            className="cursor-pointer"
                        >
                            <ArrowUpRight className={cn(cornerArrow, "text-brand")} />
                            <span className={cn(iconTile, "bg-brand-soft text-brand group-data-[state=active]:bg-brand group-data-[state=active]:text-brand-foreground")}>
                                <ClipboardCheck className="size-5" />
                            </span>
                            <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-brand">I run quizzes</p>
                            <h3 className="mt-1 text-2xl font-bold tracking-tight">Publish your first quiz</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                One admin seat, free forever. No credit card.
                            </p>
                            <form
                                onSubmit={handleSubmit}
                                className="mt-auto flex cursor-auto flex-col gap-3 pt-6 sm:flex-row sm:rounded-full sm:bg-background sm:p-1.5 sm:ring-1 sm:ring-border sm:transition-shadow sm:focus-within:ring-2 sm:focus-within:ring-brand"
                            >
                                <input
                                    ref={emailRef}
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@school.edu"
                                    aria-label="Email address"
                                    className="min-w-0 flex-1 rounded-full bg-background px-4 py-3 text-sm ring-1 ring-border outline-none sm:bg-transparent sm:py-2 sm:ring-0"
                                />
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand-hover sm:py-2.5"
                                >
                                    Start free
                                    <ArrowRight className="size-4 transition-transform duration-300 group-data-[state=active]:translate-x-1" />
                                </button>
                            </form>
                        </DoorCard>
                    </Reveal>

                    <Reveal delay={120} className="h-full">
                        <DoorCard
                            as={Link}
                            to="/login"
                            tone="student"
                            state={stateOf("student")}
                            {...doorEvents("student")}
                            className="focus-visible:ring-2 focus-visible:ring-student/50"
                        >
                            <ArrowUpRight className={cn(cornerArrow, "text-student")} />
                            <span className={cn(iconTile, "bg-student-soft text-student group-data-[state=active]:bg-student group-data-[state=active]:text-student-foreground")}>
                                <MailOpen className="size-5" />
                            </span>
                            <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-student">I take quizzes</p>
                            <h3 className="mt-1 text-2xl font-bold tracking-tight">Got an invite?</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Open the link in your email, or sign in to see every quiz you've been invited to.
                            </p>
                            <div className="mt-auto pt-6">
                                <span className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-student px-5 py-3 text-sm font-semibold text-student-foreground transition-opacity group-hover:opacity-90 sm:w-auto">
                                    Sign in to my quizzes
                                    <ArrowRight className="size-4 transition-transform duration-300 group-data-[state=active]:translate-x-1" />
                                </span>
                            </div>
                        </DoorCard>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
