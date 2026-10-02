// A glowing beam that laps its parent's edge at a steady speed over a faint track.
// The parent needs `relative` and padding equal to `width`; the content inside needs `relative`
// so it paints over the beam's inner glow.

// Stacked dashes that all end at the same head point. Their opacities compound where they
// overlap: the front ~16% of the edge is solid, then the tail fades out over the last ~12%.
const TRAIL = [
    { len: 28, className: "stroke-orange-500/30" },
    { len: 24, className: "stroke-orange-500/50" },
    { len: 20, className: "stroke-orange-500/70" },
    { len: 16, className: "stroke-orange-500" },
    { len: 3, className: "stroke-orange-400" },
];

export default function RunnerBorder({ radius = 16, width = 2 }) {
    const inset = width / 2;
    const rect = {
        x: inset,
        y: inset,
        rx: radius - inset,
        fill: "none",
        strokeWidth: width,
        style: { width: `calc(100% - ${width}px)`, height: `calc(100% - ${width}px)` },
    };
    return (
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full overflow-visible">
            <rect {...rect} className="stroke-orange-500/20" />
            <g className="runner-border">
                {TRAIL.map((t) => (
                    <rect
                        key={t.len}
                        {...rect}
                        pathLength="100"
                        className={t.className}
                        // Pattern "0, gap, dash, 0" puts every dash's head at the path start, so they stay aligned.
                        strokeDasharray={`0 ${100 - t.len} ${t.len} 0`}
                    />
                ))}
            </g>
        </svg>
    );
}
