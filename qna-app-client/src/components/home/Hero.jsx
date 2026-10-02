import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { useRoleActions } from "@/hooks/useRoleActions";
import { cn } from "@/lib/utils";
import ExamPreviewCard from "./ExamPreviewCard";

const primaryTone = {
    brand: "bg-brand text-brand-foreground shadow-md shadow-brand/25 hover:bg-brand-hover",
    student: "bg-student text-student-foreground shadow-md shadow-student/25 hover:opacity-90",
};

// "Two doors": orange speaks to admins, the student token speaks to students.
export default function Hero() {
    const { primary, secondary } = useRoleActions();

    return (
        <section className="mx-auto grid max-w-7xl gap-12 px-6 py-10 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-14">
            <div>
                <p className="flex flex-wrap items-center gap-2 text-sm font-semibold uppercase tracking-wide">
                    <span className="text-brand">For admins</span>
                    <span className="text-muted-foreground/60" aria-hidden="true">/</span>
                    <span className="text-student">For students</span>
                </p>
                <h1 className="mt-4 text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl">
                    Every quiz opens on{" "}
                    <span className="text-brand">schedule</span>, for the{" "}
                    <span className="text-student underline decoration-student/25 decoration-4 underline-offset-8">
                        right role
                    </span>
                    .
                </h1>
                <p className="mt-6 max-w-xl text-lg text-muted-foreground">
                    Quizgate is the record system under your assessments: admins build and
                    publish, a window controls when it's live, and every request that
                    isn't an admin's gets turned away before it touches your data.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                    {primary && (
                        <Link
                            to={primary.to}
                            state={primary.state}
                            className={cn(
                                "group flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors",
                                primaryTone[primary.tone],
                            )}
                        >
                            {primary.label}
                            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    )}
                    {secondary && (
                        <Link
                            to={secondary.to}
                            className="flex items-center gap-2 rounded-full bg-student-soft px-6 py-3 text-sm font-semibold text-student ring-1 ring-student/10 transition-colors hover:ring-student/30"
                        >
                            <secondary.icon className="size-4" />
                            {secondary.label}
                        </Link>
                    )}
                </div>

                <p className="mt-6 text-sm text-muted-foreground">
                    Unlimited students. Unlimited attempts. One admin seat free, forever.
                </p>
            </div>

            <div className="relative flex justify-center lg:justify-end">
                <ExamPreviewCard />
            </div>
        </section>
    );
}
