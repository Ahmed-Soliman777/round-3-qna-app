import { Link } from "react-router";
import { ArrowRight, MailOpen } from "lucide-react";
import ExamPreviewCard from "./ExamPreviewCard";
import InviteChip from "./InviteChip";

// "Two doors": orange speaks to admins, the student token speaks to students.
export default function Hero() {
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
                    <Link
                        to="/register"
                        className="group flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground shadow-md shadow-brand/25 transition-colors hover:bg-brand-hover"
                    >
                        Create a quiz, free
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                        to="/login"
                        className="flex items-center gap-2 rounded-full bg-student-soft px-6 py-3 text-sm font-semibold text-student ring-1 ring-student/10 transition-colors hover:ring-student/30"
                    >
                        <MailOpen className="size-4" />
                        I have an invite
                    </Link>
                </div>

                <p className="mt-6 text-sm text-muted-foreground">
                    Unlimited students. Unlimited attempts. One admin seat free, forever.
                </p>
            </div>

            <div className="relative flex justify-center pb-10 lg:justify-end">
                <ExamPreviewCard />
                <InviteChip className="absolute -bottom-1 left-2 sm:left-6 lg:-left-6" />
            </div>
        </section>
    );
}
