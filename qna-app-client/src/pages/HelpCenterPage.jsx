import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight, ChevronDown, Search, ThumbsDown, ThumbsUp, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Reveal from "@/components/Reveal";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const faqs = [
    {
        question: "How do I create a scheduled quiz?",
        answer:
            "Go to the admin dashboard, click 'New Quiz', set your open and close window under the Schedule tab, then publish. Students will only see the quiz during the active window.",
    },
    {
        question: "Can students access a quiz outside the scheduled window?",
        answer:
            "No. Quizgate enforces access at the server level. Outside the window, students see a countdown to the next open slot — no workarounds possible.",
    },
    {
        question: "How do role assignments work?",
        answer:
            "When you add a user, you assign them either Admin or Student. Admins can create, edit, and publish quizzes. Students can only view and take quizzes assigned to them.",
    },
    {
        question: "Is there a limit on the number of students per quiz?",
        answer:
            "On the Free plan, there is no limit on students. All plans support unlimited quiz attempts per student.",
    },
    {
        question: "How do I export results?",
        answer:
            "From the quiz analytics page, click 'Export CSV'. You'll get per-student scores, time-on-question breakdowns, and completion timestamps.",
    },
    {
        question: "Can I reuse questions across quizzes?",
        answer:
            "Yes. Save any question to your Question Library and import it into future quizzes with one click.",
    },
];

function Highlight({ text, query }) {
    if (!query) return text;
    const i = text.toLowerCase().indexOf(query.toLowerCase());
    if (i === -1) return text;
    return (
        <>
            {text.slice(0, i)}
            <mark className="rounded bg-orange-100 px-0.5 text-orange-800">{text.slice(i, i + query.length)}</mark>
            {text.slice(i + query.length)}
        </>
    );
}

function FaqItem({ faq, open, onToggle, query }) {
    const [vote, setVote] = useState(null);

    return (
        <div className="py-2">
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                className="group flex w-full items-center justify-between gap-6 rounded-xl px-4 py-5 text-left transition-colors hover:bg-muted"
            >
                <h3 className="text-lg font-bold tracking-tight sm:text-xl">
                    <Highlight text={faq.question} query={query} />
                </h3>
                <ChevronDown
                    className={cn(
                        "size-5 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:text-orange-600",
                        open && "rotate-180 text-orange-600"
                    )}
                />
            </button>
            <div
                className={cn(
                    "grid transition-all duration-300 ease-out",
                    open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}
            >
                <div className="overflow-hidden">
                    <div className="px-4 pb-5">
                        <p className="text-muted-foreground">
                            <Highlight text={faq.answer} query={query} />
                        </p>
                        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                            {vote ? (
                                <span className="animate-in fade-in text-green-600">
                                    {vote === "up" ? "Glad it helped!" : "Thanks — we'll improve this answer."}
                                </span>
                            ) : (
                                <>
                                    <span>Was this helpful?</span>
                                    <button
                                        type="button"
                                        aria-label="Yes, helpful"
                                        onClick={() => setVote("up")}
                                        className="rounded-full p-1.5 ring-1 ring-border transition hover:text-green-600 hover:ring-green-300"
                                    >
                                        <ThumbsUp className="size-3.5" />
                                    </button>
                                    <button
                                        type="button"
                                        aria-label="No, not helpful"
                                        onClick={() => setVote("down")}
                                        className="rounded-full p-1.5 ring-1 ring-border transition hover:text-destructive hover:ring-destructive/40"
                                    >
                                        <ThumbsDown className="size-3.5" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function HelpCenterPage() {
    const [query, setQuery] = useState("");
    const [openIndex, setOpenIndex] = useState(0);

    const q = query.trim().toLowerCase();
    const results = faqs.filter(
        (faq) => !q || faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q)
    );

    return (
        <main className="min-h-screen bg-background text-foreground">
            <SiteHeader />

            <div className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
                <Link
                    to="/"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    ← Back to home
                </Link>

                <h1 className="mt-6 text-6xl font-black tracking-tight sm:text-7xl">
                    Help center
                </h1>

                <div className="relative mt-8">
                    <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setOpenIndex(0);
                        }}
                        placeholder="Search questions — try “window” or “export”"
                        aria-label="Search help articles"
                        className="w-full rounded-full bg-muted py-3.5 pl-12 pr-12 text-base ring-1 ring-transparent outline-none transition focus:bg-background focus:ring-2 focus:ring-orange-500 [&::-webkit-search-cancel-button]:hidden"
                    />
                    {query && (
                        <button
                            type="button"
                            aria-label="Clear search"
                            onClick={() => setQuery("")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-foreground"
                        >
                            <X className="size-4" />
                        </button>
                    )}
                </div>
                <p role="status" className="mt-3 px-4 text-sm text-muted-foreground">
                    {q ? `${results.length} of ${faqs.length} questions match` : `${faqs.length} common questions`}
                </p>

                <div className="mt-4 divide-y divide-border">
                    {results.map((faq, i) => (
                        <FaqItem
                            key={faq.question}
                            faq={faq}
                            query={query.trim()}
                            open={openIndex === i}
                            onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
                        />
                    ))}
                    {results.length === 0 && (
                        <p className="py-10 text-center text-muted-foreground animate-in fade-in">
                            No answers for “{query}”. Try another word, or ask us directly below.
                        </p>
                    )}
                </div>

                <Reveal className="mt-8 rounded-2xl bg-muted p-10">
                    <h2 className="text-2xl font-black tracking-tight">Still need help?</h2>
                    <p className="mt-2 text-muted-foreground">
                        Our team responds within one business day.
                    </p>
                    <a
                        href="mailto:hello@quizgate.io"
                        className="group mt-4 inline-flex items-center gap-1.5 font-semibold text-orange-600 hover:underline"
                    >
                        hello@quizgate.io
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </a>
                </Reveal>
            </div>

            <SiteFooter />
        </main>
    );
}
