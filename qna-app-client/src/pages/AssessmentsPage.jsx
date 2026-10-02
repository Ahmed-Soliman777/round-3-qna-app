import { useState } from "react";
import { Link } from "react-router";
import {
    ArrowUpRight,
    Diamond,
    Hexagon,
    Shield,
    Target,
    Timer,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import InlineCta from "@/components/InlineCta";
import CountUp from "@/components/CountUp";
import FeatureCard from "@/components/FeatureCard";
import Reveal from "@/components/Reveal";
import { cn } from "@/lib/utils";

const stats = [
    { value: "40+", label: "Supported languages" },
    { value: "10k+", label: "Question library" },
    { value: "99.9%", label: "Uptime SLA" },
    { value: "<2s", label: "Avg. grading time" },
];

const features = [
    {
        icon: Diamond,
        title: "Auto-graded challenges",
        description:
            "Every submission is scored instantly — no manual review needed. Supports coding, multiple choice, free-form written responses, and spreadsheet tasks across 40+ languages.",
    },
    {
        icon: Timer,
        title: "Scheduled access windows",
        description:
            "Set a precise open and close time for each assessment. Candidates outside the window see a locked state with a countdown — no early access, no late submissions.",
    },
    {
        icon: Shield,
        title: "Role-gated by default",
        description:
            "Admins build and publish. Students take. The two roles never overlap. Exam content is invisible to candidates until the window opens, eliminating leaks before they happen.",
    },
    {
        icon: Target,
        title: "Question library",
        description:
            "Choose from thousands of pre-built questions across software engineering, data science, product thinking, and operations — or write your own and save them for reuse.",
    },
    {
        icon: Hexagon,
        title: "Custom question types",
        description:
            "Mix coding challenges, video responses, personality questions, diagram whiteboards, and free-form essays in a single assessment to evaluate the full candidate profile.",
    },
    {
        icon: ArrowUpRight,
        title: "Real-time analytics",
        description:
            "Track completion rates, average scores, per-question drop-off, and time-on-task across every active assessment. Export results to CSV with one click.",
    },
];

const flow = [
    {
        step: "01",
        title: "Admin creates the quiz",
        description:
            "Choose questions from the library or write your own. Set duration, question count, and grading weights.",
    },
    {
        step: "02",
        title: "Set the access window",
        description:
            "Pick your open date/time and close date/time. The quiz is invisible to students until the window opens.",
    },
    {
        step: "03",
        title: "Publish & invite students",
        description:
            "Students are notified by email. They log in and see a countdown to their scheduled window.",
    },
    {
        step: "04",
        title: "Students take the quiz",
        description:
            "During the window, students access the quiz. The timer runs and submissions are locked when time expires.",
    },
    {
        step: "05",
        title: "Auto-graded results",
        description:
            "Scores, per-question breakdowns, and analytics appear in your admin dashboard within seconds of submission.",
    },
];

export default function AssessmentsPage() {
    const [activeStep, setActiveStep] = useState(0);

    return (
        <main className="min-h-screen bg-background text-foreground">
            <SiteHeader />

            <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
                <Link
                    to="/"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    ← Back to home
                </Link>

                <h1 className="mt-6 text-6xl font-black tracking-tight sm:text-7xl">
                    Assessments
                </h1>
                <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
                    Build, schedule, and grade assessments in minutes. Quizgate handles
                    access control and scoring automatically — you focus on what the
                    results actually mean.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-border sm:grid-cols-4">
                    {stats.map((stat) => (
                        <div key={stat.label} className="bg-muted px-6 py-8 text-center transition-colors hover:bg-background">
                            <p className="text-3xl font-black text-orange-600 sm:text-4xl">
                                <CountUp value={stat.value} />
                            </p>
                            <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                    {features.map((feature, i) => (
                        <FeatureCard key={feature.title} {...feature} delay={(i % 2) * 100} />
                    ))}
                </div>

                <Reveal className="mt-8 rounded-2xl bg-muted p-6 sm:p-10">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <h2 className="text-3xl font-black tracking-tight">
                            How an assessment flows
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Step {activeStep + 1} of {flow.length}
                        </p>
                    </div>

                    <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-border">
                        <div
                            className="h-full rounded-full bg-orange-500 transition-all duration-500"
                            style={{ width: `${((activeStep + 1) / flow.length) * 100}%` }}
                        />
                    </div>

                    <ol className="mt-6 space-y-2">
                        {flow.map((item, i) => {
                            const isActive = i === activeStep;
                            const isDone = i < activeStep;
                            return (
                                <li key={item.step}>
                                    <button
                                        type="button"
                                        onClick={() => setActiveStep(i)}
                                        aria-expanded={isActive}
                                        className={cn(
                                            "flex w-full gap-5 rounded-xl p-4 text-left transition-all duration-300",
                                            isActive ? "bg-background shadow-sm ring-1 ring-orange-200" : "hover:bg-background/60"
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-black transition-colors",
                                                isActive
                                                    ? "bg-orange-500 text-white"
                                                    : isDone
                                                        ? "bg-orange-100 text-orange-700"
                                                        : "bg-background text-muted-foreground ring-1 ring-border"
                                            )}
                                        >
                                            {item.step}
                                        </span>
                                        <div className="min-w-0">
                                            <h3 className={cn("pt-1 font-semibold", !isActive && "text-muted-foreground")}>
                                                {item.title}
                                            </h3>
                                            <div
                                                className={cn(
                                                    "grid transition-all duration-300",
                                                    isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                                )}
                                            >
                                                <p className="overflow-hidden text-sm text-muted-foreground">
                                                    <span className="block pt-1">{item.description}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                </li>
                            );
                        })}
                    </ol>

                    <div className="mt-6 flex justify-between gap-3">
                        <button
                            type="button"
                            onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
                            disabled={activeStep === 0}
                            className="rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-border transition hover:bg-background disabled:opacity-40"
                        >
                            ← Previous
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveStep((s) => Math.min(flow.length - 1, s + 1))}
                            disabled={activeStep === flow.length - 1}
                            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/85 disabled:opacity-40"
                        >
                            Next step →
                        </button>
                    </div>
                </Reveal>

                <div className="mt-8">
                    <InlineCta
                        title="Ready to publish your first assessment?"
                        subtitle="One admin seat free. No credit card required."
                    />
                </div>
            </div>

            <SiteFooter />
        </main>
    );
}
