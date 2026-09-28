import Reveal from "@/components/Reveal";

export default function FeatureCard({ icon: Icon, title, description, delay = 0 }) {
    return (
        <Reveal delay={delay}>
            <div className="group h-full rounded-2xl bg-muted p-8 ring-1 ring-transparent transition duration-300 hover:-translate-y-1 hover:bg-background hover:shadow-lg hover:ring-orange-200">
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-orange-100 transition-colors duration-300 group-hover:bg-orange-500">
                    <Icon className="size-5 text-orange-600 transition-all duration-300 group-hover:scale-110 group-hover:text-white" />
                </span>
                <h3 className="mt-4 text-lg font-bold tracking-tight">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            </div>
        </Reveal>
    );
}
