import { useEffect, useState } from 'react';

interface PrizeMessageProps {
    message: string | null;
    onClose: () => void;
}

export default function PrizeMessage({ message, onClose }: PrizeMessageProps) {
    const [visible, setVisible] = useState(false);
    const [animating, setAnimating] = useState(false);

    useEffect(() => {
        if (message) {
            setAnimating(true);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => setVisible(true));
            });
        } else {
            setVisible(false);
            const t = setTimeout(() => setAnimating(false), 500);
            return () => clearTimeout(t);
        }
    }, [message]);

    if (!animating && !message) return null;

    return (
        <div
            style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 50,
                pointerEvents: visible ? 'auto' : 'none',
                transition: 'background 0.5s ease',
                background: visible ? 'rgba(21,10,18,0.7)' : 'rgba(21,10,18,0)',
                backdropFilter: visible ? 'blur(6px)' : 'none',
            }}
            onClick={onClose}
        >
            <div
                style={{
                    maxWidth: 380,
                    padding: '36px 40px',
                    borderRadius: 24,
                    background: 'linear-gradient(135deg, rgba(40,18,32,0.95), rgba(30,13,24,0.98))',
                    border: '1.5px solid rgba(251,113,133,0.25)',
                    boxShadow: visible
                        ? '0 0 60px rgba(251,113,133,0.2), 0 0 120px rgba(244,114,182,0.1), 0 20px 40px rgba(0,0,0,0.3)'
                        : 'none',
                    textAlign: 'center',
                    transform: visible ? 'scale(1) translateY(0)' : 'scale(0.7) translateY(30px)',
                    opacity: visible ? 1 : 0,
                    transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    cursor: 'pointer',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Heart icon */}
                <div style={{
                    fontSize: 48,
                    marginBottom: 16,
                    filter: 'drop-shadow(0 0 20px rgba(251,113,133,0.5))',
                    animation: visible ? 'heartBounce 0.6s ease 0.3s both' : 'none',
                }}>
                    💝
                </div>

                {/* Prize label */}
                <div style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'rgba(251,113,133,0.6)',
                    marginBottom: 14,
                }}>
                    You caught a heart!
                </div>

                {/* Message */}
                <p style={{
                    fontFamily: "'Georgia', serif",
                    fontStyle: 'italic',
                    fontSize: 20,
                    lineHeight: 1.6,
                    color: '#f9a8c8',
                    textShadow: '0 0 20px rgba(251,113,133,0.2)',
                    margin: '0 0 20px',
                }}>
                    "{message}"
                </p>

                {/* Divider */}
                <div style={{
                    width: 60,
                    height: 1,
                    margin: '0 auto 16px',
                    background: 'linear-gradient(90deg, transparent, rgba(251,113,133,0.3), transparent)',
                }} />

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '10px 28px',
                            borderRadius: 50,
                            border: '1.5px solid rgba(251,113,133,0.3)',
                            background: 'linear-gradient(135deg, rgba(251,113,133,0.15), rgba(244,114,182,0.1))',
                            color: '#f9a8c8',
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            letterSpacing: '0.05em',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(251,113,133,0.3), rgba(244,114,182,0.2))';
                            e.currentTarget.style.boxShadow = '0 0 20px rgba(251,113,133,0.2)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(251,113,133,0.15), rgba(244,114,182,0.1))';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        Play Again 🎮
                    </button>
                </div>
            </div>

            {/* Floating hearts animation */}
            {visible && (
                <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div
                            key={i}
                            style={{
                                position: 'absolute',
                                bottom: -20,
                                left: `${8 + (i * 7.5)}%`,
                                fontSize: 16 + (i % 3) * 8,
                                opacity: 0.3 + (i % 4) * 0.1,
                                animation: `floatUp ${3 + (i % 3)}s ease-out ${i * 0.2}s both`,
                            }}
                        >
                            {['💕', '💗', '💖', '💝', '♥', '💞'][i % 6]}
                        </div>
                    ))}
                </div>
            )}

            <style>{`
                @keyframes heartBounce {
                    0% { transform: scale(0) rotate(-20deg); }
                    50% { transform: scale(1.3) rotate(5deg); }
                    100% { transform: scale(1) rotate(0deg); }
                }
                @keyframes floatUp {
                    0% { transform: translateY(0) rotate(0deg); opacity: 0; }
                    20% { opacity: 0.6; }
                    100% { transform: translateY(-80vh) rotate(${Math.random() > 0.5 ? '' : '-'}360deg); opacity: 0; }
                }
            `}</style>
        </div>
    );
}
