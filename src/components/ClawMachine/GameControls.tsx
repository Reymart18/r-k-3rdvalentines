import { useCallback, useEffect, useRef } from 'react';
import type { GamePhase } from './types';

interface GameControlsProps {
    phase: GamePhase;
    onMove: (direction: 'left' | 'right' | 'forward' | 'back') => void;
    onStopMove: () => void;
    onGrab: () => void;
}

export default function GameControls({ phase, onMove, onStopMove, onGrab }: GameControlsProps) {
    const moveInterval = useRef<number | null>(null);
    const canMove = phase === 'ready' || phase === 'moving';
    const canGrab = phase === 'ready' || phase === 'moving';
    const isAnimating = phase === 'dropping' || phase === 'grabbing' || phase === 'rising' || phase === 'delivering' || phase === 'releasing';

    const startMove = useCallback((dir: 'left' | 'right' | 'forward' | 'back') => {
        if (!canMove) return;
        onMove(dir);
        if (moveInterval.current) clearInterval(moveInterval.current);
        moveInterval.current = window.setInterval(() => onMove(dir), 50);
    }, [canMove, onMove]);

    const stopMove = useCallback(() => {
        if (moveInterval.current) {
            clearInterval(moveInterval.current);
            moveInterval.current = null;
        }
        onStopMove();
    }, [onStopMove]);

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!canMove && e.key !== ' ') return;
            switch (e.key) {
                case 'ArrowLeft': case 'a': onMove('left'); break;
                case 'ArrowRight': case 'd': onMove('right'); break;
                case 'ArrowUp': case 'w': onMove('forward'); break;
                case 'ArrowDown': case 's': onMove('back'); break;
                case ' ': if (canGrab) { e.preventDefault(); onGrab(); } break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [canMove, canGrab, onMove, onGrab]);

    // Cleanup
    useEffect(() => {
        return () => { if (moveInterval.current) clearInterval(moveInterval.current); };
    }, []);

    // ──────── Arcade-style panel ────────
    const panelStyle: React.CSSProperties = {
        position: 'absolute',
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: 36,
        zIndex: 20,
        pointerEvents: 'auto',
        background: 'linear-gradient(180deg, #3a1a2a 0%, #2a1018 50%, #1e0a14 100%)',
        border: '3px solid rgba(212,160,184,0.3)',
        borderRadius: 18,
        padding: '18px 28px 22px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 20px rgba(251,113,133,0.08)',
    };

    const joystickBase: React.CSSProperties = {
        position: 'relative',
        width: 120,
        height: 120,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 40% 38%, #2a1520 0%, #1a0c14 100%)',
        border: '3px solid rgba(212,160,184,0.2)',
        boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5), 0 0 12px rgba(251,113,133,0.05)',
    };

    const joystickBall: React.CSSProperties = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 42,
        height: 42,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 30%, #fb7185 0%, #e8536c 60%, #c44558 100%)',
        boxShadow: '0 4px 15px rgba(251,113,133,0.4), inset 0 2px 4px rgba(255,255,255,0.2)',
        cursor: canMove ? 'grab' : 'not-allowed',
        zIndex: 5,
    };

    const dirBtn = (pos: React.CSSProperties): React.CSSProperties => ({
        position: 'absolute',
        width: 34,
        height: 34,
        borderRadius: '50%',
        border: 'none',
        background: 'transparent',
        color: 'rgba(248,180,200,0.35)',
        fontSize: 13,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: canMove ? 'pointer' : 'not-allowed',
        opacity: canMove ? 1 : 0.3,
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        zIndex: 6,
        ...pos,
    });

    const grabBtnStyle: React.CSSProperties = {
        width: 80,
        height: 80,
        borderRadius: '50%',
        border: '4px solid rgba(232,83,108,0.5)',
        background: canGrab
            ? 'radial-gradient(circle at 40% 35%, #e8536c 0%, #c44558 60%, #a03548 100%)'
            : 'radial-gradient(circle at 40% 35%, #4a2030 0%, #3a1525 100%)',
        color: '#fff',
        fontSize: 13,
        fontWeight: 800,
        letterSpacing: '0.1em',
        cursor: canGrab ? 'pointer' : 'not-allowed',
        opacity: canGrab ? 1 : 0.4,
        transition: 'all 0.2s ease',
        boxShadow: canGrab
            ? '0 6px 25px rgba(232,83,108,0.4), inset 0 2px 4px rgba(255,255,255,0.15), 0 0 15px rgba(251,113,133,0.15)'
            : 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'none',
        textTransform: 'uppercase',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 2,
        lineHeight: 1.1,
    };

    return (
        <div style={panelStyle}>
            {/* Joystick area */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <span style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'rgba(248,180,200,0.3)',
                    marginBottom: 2,
                }}>
                    MOVE
                </span>
                <div style={joystickBase}>
                    {/* Joystick ball (visual only) */}
                    <div style={joystickBall} />

                    {/* Hit areas */}
                    <button
                        style={dirBtn({ top: 2, left: '50%', transform: 'translateX(-50%)' })}
                        onMouseDown={() => startMove('forward')}
                        onMouseUp={stopMove}
                        onMouseLeave={stopMove}
                        onTouchStart={(e) => { e.preventDefault(); startMove('forward'); }}
                        onTouchEnd={stopMove}
                        disabled={!canMove}
                    >▲</button>
                    <button
                        style={dirBtn({ bottom: 2, left: '50%', transform: 'translateX(-50%)' })}
                        onMouseDown={() => startMove('back')}
                        onMouseUp={stopMove}
                        onMouseLeave={stopMove}
                        onTouchStart={(e) => { e.preventDefault(); startMove('back'); }}
                        onTouchEnd={stopMove}
                        disabled={!canMove}
                    >▼</button>
                    <button
                        style={dirBtn({ left: 2, top: '50%', transform: 'translateY(-50%)' })}
                        onMouseDown={() => startMove('left')}
                        onMouseUp={stopMove}
                        onMouseLeave={stopMove}
                        onTouchStart={(e) => { e.preventDefault(); startMove('left'); }}
                        onTouchEnd={stopMove}
                        disabled={!canMove}
                    >◀</button>
                    <button
                        style={dirBtn({ right: 2, top: '50%', transform: 'translateY(-50%)' })}
                        onMouseDown={() => startMove('right')}
                        onMouseUp={stopMove}
                        onMouseLeave={stopMove}
                        onTouchStart={(e) => { e.preventDefault(); startMove('right'); }}
                        onTouchEnd={stopMove}
                        disabled={!canMove}
                    >▶</button>
                </div>
            </div>

            {/* Decorative divider */}
            <div style={{
                width: 2,
                height: 80,
                background: 'linear-gradient(180deg, transparent, rgba(212,160,184,0.2), transparent)',
                borderRadius: 1,
            }} />

            {/* Grab button */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <span style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'rgba(248,180,200,0.3)',
                    marginBottom: 2,
                }}>
                    DROP
                </span>
                <button
                    style={grabBtnStyle}
                    onClick={() => { if (canGrab) onGrab(); }}
                    disabled={!canGrab}
                >
                    <span style={{ fontSize: 22 }}>🎯</span>
                    <span style={{ fontSize: 8 }}>GRAB</span>
                </button>
            </div>

            {/* Status */}
            <div style={{
                position: 'absolute',
                top: -26,
                left: '50%',
                transform: 'translateX(-50%)',
                whiteSpace: 'nowrap',
                fontSize: 10,
                fontWeight: 600,
                color: 'rgba(248,180,200,0.4)',
                letterSpacing: '0.08em',
                background: 'rgba(21,10,18,0.6)',
                padding: '3px 14px',
                borderRadius: 10,
                border: '1px solid rgba(212,160,184,0.1)',
            }}>
                {canMove ? 'WASD / Arrows to move • Space to grab' : isAnimating ? '✨ Catching a heart...' : ''}
            </div>
        </div>
    );
}
