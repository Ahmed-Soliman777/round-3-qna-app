import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Hero from "@/components/home/Hero";
import PickYourDoor from "@/components/home/PickYourDoor";
import HowItWorks from "@/components/home/HowItWorks";
import ContactSection from "@/components/home/ContactSection";

export default function HomePage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <SiteHeader />
            <Hero />
            <PickYourDoor />
            <HowItWorks />
            <ContactSection />
            <SiteFooter />
        </main>
    );
}
