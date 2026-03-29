interface HeartBoxProps {
    heartOpen: boolean;
    onToggle: () => void;
}

export default function HeartBox({ heartOpen, onToggle }: HeartBoxProps) {
    return (
        <div
            className="absolute -top-12 left-1/2 z-20 -translate-x-1/2 scale-90 cursor-pointer sm:-top-16 sm:scale-100"
            onClick={onToggle}
            style={{ perspective: '1000px' }}
        >
            <div className={`heart-container ${heartOpen ? 'heart-open' : ''}`} style={{
                transformStyle: 'preserve-3d',
                position: 'relative',
                width: '120px',
                height: '120px'
            }}>
                {/* Front Heart (Lid) */}
                <div className={`heart-lid ${heartOpen ? 'lid-open' : ''}`} style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '6rem',
                    filter: 'drop-shadow(0 10px 25px rgba(236, 72, 153, 0.6))',
                    transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                    transformOrigin: 'left center',
                    transform: heartOpen ? 'rotateY(-160deg) translateZ(10px)' : 'rotateY(0deg)',
                    zIndex: heartOpen ? 1 : 10
                }}>
                    💝
                </div>

                {/* Inside - Photo */}
                <div className={`heart-inside ${heartOpen ? 'inside-visible' : ''}`} style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: heartOpen ? 1 : 0,
                    transform: heartOpen ? 'scale(1)' : 'scale(0.5)',
                    transition: 'all 0.6s ease 0.3s',
                    zIndex: heartOpen ? 10 : 1
                }}>
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-pink-300 shadow-xl" style={{
                            boxShadow: '0 0 30px rgba(236, 72, 153, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.3)'
                        }}>
                            <img
                                src="/src/assets/pic.jpg"
                                alt="Our Love"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-2xl">💕</span>
                    </div>
                </div>
            </div>

            <p className={`text-center text-pink-400 text-xs mt-2 transition-opacity duration-300 ${heartOpen ? 'opacity-0' : 'opacity-100 animate-pulse'}`}>
                Tap me! 💕
            </p>
        </div>
    );
}
