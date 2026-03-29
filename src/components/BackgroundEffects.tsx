export default function BackgroundEffects() {
    return (
        <>
            {/* Soft floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${8 + Math.random() * 8}s`,
                            fontSize: `${0.6 + Math.random() * 1.0}rem`,
                            animation: `float-3d ${8 + Math.random() * 8}s ease-in-out infinite`,
                            opacity: 0.12 + Math.random() * 0.08,
                            filter: 'blur(0.5px)',
                        }}
                    >
                        {['✦', '♥', '·', '✧', '♥'][i % 5]}
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
