import { MailOpen, Send } from "lucide-react";
import { useSession } from "@/context/session";

// The two marketing calls to action, matched to whoever is looking:
// guests get sign-up / sign-in, admins get create / invite, students go to their quizzes.
const actionsByRole = {
    guest: {
        primary: { to: "/register", label: "Create a quiz, free", tone: "brand" },
        secondary: { to: "/login", label: "I have an invite", icon: MailOpen },
    },
    admin: {
        primary: { to: "/admin-panel/quizzes", state: { openCreate: true }, label: "Create quiz", tone: "brand" },
        secondary: { to: "/admin-panel/quizzes", label: "Invite students", icon: Send },
    },
    student: {
        primary: { to: "/dashboard", label: "Go to my quizzes", tone: "student" },
        secondary: null,
    },
};

export function useRoleActions() {
    const { user } = useSession();
    return actionsByRole[user?.role ?? "guest"];
}
