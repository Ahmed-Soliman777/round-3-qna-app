import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowRight, ClipboardCheck, MailOpen } from "lucide-react";
import Reveal from "@/components/Reveal";

// Closing section: one door for admins (orange), one for invited students.
export default function FinalCta() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/register", { state: { email: email.trim() } });
    };

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
                    <Reveal className="flex flex-col rounded-3xl bg-card p-7 shadow-lg shadow-brand/10 ring-1 ring-brand/25">
                        <span className="flex size-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
                            <ClipboardCheck className="size-5" />
                        </span>
                        <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-brand">I run quizzes</p>
                        <h3 className="mt-1 text-2xl font-bold tracking-tight">Publish your first quiz</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            One admin seat, free forever. No credit card.
                        </p>
                        <form
                            onSubmit={handleSubmit}
                            className="mt-auto flex flex-col gap-3 pt-6 sm:flex-row sm:rounded-full sm:bg-background sm:p-1.5 sm:ring-1 sm:ring-border sm:focus-within:ring-2 sm:focus-within:ring-brand"
                        >
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@school.edu"
                                aria-label="Email address"
                                className="min-w-0 flex-1 rounded-full bg-background px-4 py-3 text-sm ring-1 ring-border outline-none sm:bg-transparent sm:py-2 sm:ring-0"
                            />
                            <button
                                type="submit"
                                className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand-hover sm:py-2.5"
                            >
                                Start free
                                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                            </button>
                        </form>
                    </Reveal>

                    <Reveal delay={120} className="flex flex-col rounded-3xl bg-card p-7 shadow-lg ring-1 ring-student/10">
                        <span className="flex size-11 items-center justify-center rounded-xl bg-student-soft text-student">
                            <MailOpen className="size-5" />
                        </span>
                        <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-student">I take quizzes</p>
                        <h3 className="mt-1 text-2xl font-bold tracking-tight">Got an invite?</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Open the link in your email, or sign in to see every quiz you've been invited to.
                        </p>
                        <div className="mt-auto pt-6">
                            <Link
                                to="/login"
                                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-student px-5 py-3 text-sm font-semibold text-student-foreground transition-opacity hover:opacity-85 sm:w-auto"
                            >
                                Sign in to my quizzes
                                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
