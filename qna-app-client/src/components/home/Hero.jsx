import { Link } from "react-router";
import { ArrowRight, MailOpen, Send } from "lucide-react";
import { useSession } from "@/context/session";
import { cn } from "@/lib/utils";
import ExamPreviewCard from "./ExamPreviewCard";
import InviteChip from "./InviteChip";

const brandButton = "bg-brand text-brand-foreground shadow-md shadow-brand/25 hover:bg-brand-hover";

// Signed-in visitors get buttons for their own role instead of sign-up and sign-in prompts.
const actionsByRole = {
    guest: {
        primary: { to: "/register", label: "Create a quiz, free", className: brandButton },
        secondary: { to: "/login", label: "I have an invite", icon: MailOpen },
    },
    admin: {
        primary: { to: "/admin-panel/quizzes", state: { openCreate: true }, label: "Create quiz", className: brandButton },
        secondary: { to: "/admin-panel/quizzes", label: "Invite students", icon: Send },
    },
    student: {
        primary: {
            to: "/dashboard",
            label: "Go to my quizzes",
            className: "bg-student text-student-foreground shadow-md shadow-student/25 hover:opacity-90",
        },
        secondary: null,
    },
};

// "Two doors": orange speaks to admins, the student token speaks to students.
export default function Hero() {
    const { user } = useSession();
    const { primary, secondary } = actionsByRole[user?.role ?? "guest"];

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
                                primary.className,
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

            <div className="relative flex justify-center pb-10 lg:justify-end">
                <ExamPreviewCard />
                <InviteChip className="absolute -bottom-1 left-2 sm:left-6 lg:-left-6" />
            </div>
        </section>
    );
}
