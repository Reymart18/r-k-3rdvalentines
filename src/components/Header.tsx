import { useState, useEffect, useRef } from 'react';

interface HeaderProps {
    onLogout: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
    const [showTypewriter, setShowTypewriter] = useState(false);
    const [displayText, setDisplayText] = useState('');
    const [showStar, setShowStar] = useState(false);
    const [starPopped, setStarPopped] = useState(false);
    const [starPos, setStarPos] = useState<{ left: number, top: number } | null>(null);
    const fullMessage = 'I love you, Always! ❤️😚';
    const indexRef = useRef(0);
    const btnRef = useRef<HTMLButtonElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);

    // Typewriter effect
    useEffect(() => {
        if (!showTypewriter) return;
        indexRef.current = 0;
        setDisplayText('');
        const interval = setInterval(() => {
            indexRef.current++;
            setDisplayText(fullMessage.slice(0, indexRef.current));
            if (indexRef.current >= fullMessage.length) {
                clearInterval(interval);
                setTimeout(() => onLogout(), 1500);
            }
        }, 80);
        return () => clearInterval(interval);
    }, [showTypewriter, onLogout]);

    // Shooting star animation
    const handleLogoutClick = () => {
        if (!btnRef.current || !headerRef.current) return;
        const btnRect = btnRef.current.getBoundingClientRect();
        const headerRect = headerRef.current.getBoundingClientRect();
        // Start at button center
        const startLeft = btnRect.left + btnRect.width / 2 - headerRect.left;
        const startTop = btnRect.top + btnRect.height / 2 - headerRect.top;
        setStarPos({ left: startLeft, top: startTop });
        setShowStar(true);
        setStarPopped(false);
        // Animate to center
        setTimeout(() => {
            setStarPos({ left: headerRect.width / 2, top: headerRect.height / 2 });
            // Pop after travel
            setTimeout(() => {
                setStarPopped(true);
                setTimeout(() => {
                    setShowStar(false);
                    setShowTypewriter(true);
                }, 400);
            }, 700);
        }, 30);
    };

    return (
        <div ref={headerRef} className="relative flex items-center justify-between gap-3 overflow-visible px-4 pb-4 pt-6 sm:px-6 sm:pt-8">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                <img src="/src/assets/logo.png" alt="RK" className="h-14 w-14 rounded-full object-cover sm:h-20 sm:w-20" style={{ boxShadow: '0 0 15px rgba(225,29,72,0.2)' }} />
                <div>
                    <h1 className="text-lg font-bold sm:text-2xl" style={{ color: '#f9a8c8', textShadow: '0 2px 20px rgba(225,29,72,0.2)' }}>
                        Our Story
                    </h1>
                    <p className="mt-0.5 truncate text-xs sm:mt-1 sm:text-sm" style={{ color: 'rgba(248,180,200,0.5)' }}>Reymart & Angela Kate</p>
                </div>
            </div>

            {/* Shooting star animation */}
            {showStar && starPos && (
                <div
                    style={{
                        position: 'absolute',
                        left: starPos.left,
                        top: starPos.top,
                        width: starPopped ? 120 : 32,
                        height: starPopped ? 120 : 32,
                        marginLeft: starPopped ? -60 : -16,
                        marginTop: starPopped ? -60 : -16,
                        zIndex: 50,
                        pointerEvents: 'none',
                        transition: starPopped
                            ? 'all 0.35s cubic-bezier(.7,1.7,.7,1)'
                            : 'left 0.7s cubic-bezier(.7,1.7,.7,1), top 0.7s cubic-bezier(.7,1.7,.7,1)',
                        opacity: starPopped ? 0 : 1,
                        filter: starPopped ? 'blur(8px)' : 'none',
                    }}
                >
                    {/* Star body */}
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            background: 'radial-gradient(circle at 40% 40%, #fff 60%, #f9a8c8 90%, #fb7185 100%)',
                            boxShadow: '0 0 40px 10px #f9a8c8, 0 0 80px 30px #fb7185',
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            transform: starPopped ? 'scale(2.2)' : 'scale(1)',
                            transition: 'transform 0.35s cubic-bezier(.7,1.7,.7,1)',
                        }}
                    />
                    {/* Star trail */}
                    {!starPopped && (
                        <div
                            style={{
                                position: 'absolute',
                                left: '50%',
                                top: '50%',
                                width: 6,
                                height: 80,
                                marginLeft: -3,
                                marginTop: -40,
                                background: 'linear-gradient(180deg, #fff 0%, #f9a8c8 60%, transparent 100%)',
                                borderRadius: 8,
                                boxShadow: '0 0 16px 2px #f9a8c8',
                                transform: 'rotate(18deg)',
                                opacity: 0.7,
                            }}
                        />
                    )}
                </div>
            )}

            {/* Typewriter message in center after pop */}
            {showTypewriter && (
                <div
                    className="absolute left-1/2 top-1/2 w-[88vw] max-w-md -translate-x-1/2 -translate-y-1/2 text-center text-base font-bold tracking-wide sm:text-xl"
                    style={{
                        color: '#f9a8c8',
                        textShadow: '0 0 20px rgba(251,113,133,0.4)',
                        zIndex: 40,
                    }}
                >
                    {displayText}
                    <span className="animate-pulse">|</span>
                </div>
            )}

            {/* Logout button (hidden during animation) */}
            {!showStar && !showTypewriter && (
                <button
                    ref={btnRef}
                    onClick={handleLogoutClick}
                    className="group relative overflow-hidden rounded-full px-3 py-2 text-xs transition-all duration-500 sm:px-5 sm:py-3 sm:text-sm"
                    style={{
                        color: 'rgba(248,180,200,0.6)',
                        border: '1px solid rgba(251,113,133,0.2)',
                        background: 'rgba(251,113,133,0.04)',
                        backdropFilter: 'blur(8px)',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.color = '#fff';
                        e.currentTarget.style.borderColor = 'rgba(251,113,133,0.5)';
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(251,113,133,0.2), rgba(244,114,182,0.15))';
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(251,113,133,0.2), inset 0 0 20px rgba(251,113,133,0.05)';
                        e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.color = 'rgba(248,180,200,0.6)';
                        e.currentTarget.style.borderColor = 'rgba(251,113,133,0.2)';
                        e.currentTarget.style.background = 'rgba(251,113,133,0.04)';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                >
                    <span className="relative z-10 flex items-center gap-1.5 font-medium tracking-wide">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-[-2px]">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Logout
                    </span>
                </button>
            )}
        </div>
    );
}
