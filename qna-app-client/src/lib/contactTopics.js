import { Briefcase, LifeBuoy, MessageCircle, Receipt } from "lucide-react";

export const CONTACT_EMAIL = "hello@quizgate.io";

// Shared by the Contact page's topic picker and the home page's contact section.
export const contactTopics = [
    {
        id: "sales",
        icon: Briefcase,
        title: "Sales & demos",
        reply: "Reply in 1 business day",
        description: "Plans for bigger teams, SSO / SAML, SLAs, and a guided walkthrough of Quizgate for your organization.",
        placeholder: "Tell us about your team and what you'd like to run on Quizgate.",
    },
    {
        id: "support",
        icon: LifeBuoy,
        title: "Product support",
        reply: "Reply in 1 business day",
        description: "Something not working as expected? Tell us what you were doing and what happened instead.",
        placeholder: "What were you trying to do, and what happened?",
        note: "Students: quiz access, deadlines and retakes are set by your instructor, so they can help fastest.",
    },
    {
        id: "billing",
        icon: Receipt,
        title: "Billing",
        reply: "Reply in 2 business days",
        description: "Invoices, receipts, plan changes, and questions about what you're paying for.",
        placeholder: "Which plan are you on, and what do you need help with?",
    },
    {
        id: "other",
        icon: MessageCircle,
        title: "Something else",
        reply: "Reply in 2 business days",
        description: "Partnerships, press, feedback, or anything that doesn't fit the other topics.",
        placeholder: "What's on your mind?",
    },
];
