interface FloatingHeartsProps {
    onHeartClick: (index: number, e: React.MouseEvent) => void;
}

export default function FloatingHearts({ onHeartClick }: FloatingHeartsProps) {
    return (
        <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
                <div
                    key={i}
                    className="absolute animate-float cursor-pointer transition-all duration-300 hover:scale-150 text-pink-400/30 hover:text-pink-500"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 5}s`,
                        animationDuration: `${3 + Math.random() * 4}s`,
                        fontSize: `${1 + Math.random() * 2}rem`,
                        zIndex: 1
                    }}
                    onClick={(e) => onHeartClick(i, e)}
                >
                    💕
                </div>
            ))}
        </div>
    );
}
