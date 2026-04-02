import { useMemo } from 'react';

export default function BackgroundEffects() {
    const isLowPower = typeof window !== 'undefined' && window.innerWidth < 768;
    const particleCount = isLowPower ? 8 : 15;
    const particles = useMemo(
        () =>
            Array.from({ length: particleCount }, (_, i) => ({
                id: i,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${8 + Math.random() * 8}s`,
                fontSize: `${0.6 + Math.random() * 1.0}rem`,
                opacity: 0.12 + Math.random() * 0.08,
                glyph: ['✦', '♥', '·', '✧', '♥'][i % 5],
            })),
        [particleCount]
    );

    return (
        <>
            {/* Soft floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {particles.map((p) => (
                    <div
                        key={p.id}
                        className="absolute"
                        style={{
                            left: p.left,
                            top: p.top,
                            animationDelay: p.animationDelay,
                            animationDuration: p.animationDuration,
                            fontSize: p.fontSize,
                            animation: `float-3d ${p.animationDuration} ease-in-out infinite`,
                            opacity: p.opacity,
                            filter: 'blur(0.5px)',
                        }}
                    >
                        {p.glyph}
                    </div>
                ))}
            </div>

            {/* Ambient glow spots */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute rounded-full" style={{ width: '500px', height: '500px', top: '10%', left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(circle, rgba(225,29,72,0.06) 0%, transparent 70%)' }} />
                <div className="absolute rounded-full" style={{ width: '400px', height: '400px', bottom: '20%', left: '20%', background: 'radial-gradient(circle, rgba(244,63,94,0.04) 0%, transparent 70%)' }} />
                <div className="absolute rounded-full" style={{ width: '350px', height: '350px', top: '60%', right: '10%', background: 'radial-gradient(circle, rgba(236,72,153,0.04) 0%, transparent 70%)' }} />
            </div>
        </>
    );
}
