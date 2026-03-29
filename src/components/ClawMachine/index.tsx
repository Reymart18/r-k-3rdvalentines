import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Scene from './Scene';
import PrizeMessage from './PrizeMessage';
import type { GameState, GamePhase, HeartConfig } from './types';
import { generateHearts } from './HeartPile';

// Claw Y positions — adjusted for bigger machine
const CLAW_TOP_Y = 3.0;
const CLAW_BOTTOM_Y = -2.8;
const MOVE_STEP = 0.15;
const CLAMP_X = 2.2;
const CLAMP_Z = 1.6;
// Prize chute delivery position (left side inside machine)
const DELIVER_X = -1.8;
const DELIVER_Z = 0;

export default function ClawMachine() {
    const hearts = useMemo(() => generateHearts(40), []);
    const [removedHearts, setRemovedHearts] = useState<Set<number>>(new Set());
    const [joystickTilt, setJoystickTilt] = useState<{ x: number; z: number }>({ x: 0, z: 0 });
    const keysDown = useRef<Set<string>>(new Set());

    const [gameState, setGameState] = useState<GameState>({
        phase: 'ready',
        clawX: 0,
        clawZ: 0,
        clawY: CLAW_TOP_Y,
        clawOpen: 1,
        grabbedHeartIndex: null,
        wonMessage: null,
    });

    const phaseTimerRef = useRef<number | null>(null);
    const animFrameRef = useRef<number | null>(null);

    // Cleanup
    useEffect(() => {
        return () => {
            if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, []);

    const clampPosition = useCallback((x: number, z: number) => ({
        x: Math.max(-CLAMP_X, Math.min(CLAMP_X, x)),
        z: Math.max(-CLAMP_Z, Math.min(CLAMP_Z, z)),
    }), []);

    const handleMove = useCallback((dir: 'left' | 'right' | 'forward' | 'back') => {
        setGameState(prev => {
            if (prev.phase !== 'ready' && prev.phase !== 'moving') return prev;
            let dx = 0, dz = 0;
            if (dir === 'left') dx = -MOVE_STEP;
            if (dir === 'right') dx = MOVE_STEP;
            if (dir === 'forward') dz = -MOVE_STEP;
            if (dir === 'back') dz = MOVE_STEP;
            const clamped = clampPosition(prev.clawX + dx, prev.clawZ + dz);
            return { ...prev, phase: 'moving', clawX: clamped.x, clawZ: clamped.z };
        });
    }, [clampPosition]);

    // Find the closest heart to the claw position
    const findClosestHeart = useCallback((clawX: number, clawZ: number, heartsList: HeartConfig[]): number => {
        let bestIdx = 0;
        let bestDist = Infinity;
        heartsList.forEach((h, i) => {
            if (removedHearts.has(i)) return; // skip already removed hearts
            const dx = h.position[0] - clawX;
            const dz = h.position[2] - clawZ;
            const dist = dx * dx + dz * dz;
            if (dist < bestDist) {
                bestDist = dist;
                bestIdx = i;
            }
        });
        return bestIdx;
    }, [removedHearts]);

    // Animate through phases with smooth transitions
    const animatePhase = useCallback((
        phase: GamePhase,
        updates: Partial<GameState>,
        duration: number,
        next: () => void,
    ) => {
        setGameState(prev => ({ ...prev, phase, ...updates }));
        phaseTimerRef.current = window.setTimeout(next, duration);
    }, []);

    const handleGrab = useCallback(() => {
        setGameState(prev => {
            if (prev.phase !== 'ready' && prev.phase !== 'moving') return prev;
            return prev; // Will be handled below
        });

        // Check if we can grab
        setGameState(prev => {
            if (prev.phase !== 'ready' && prev.phase !== 'moving') return prev;

            // Start the grab sequence
            const currentX = prev.clawX;
            const currentZ = prev.clawZ;

            // Phase 1: Drop down (claw open)
            setTimeout(() => {
                animatePhase('dropping', { clawY: CLAW_BOTTOM_Y, clawOpen: 1 }, 1500, () => {
                    // Phase 2: Close claw (grab)
                    const heartIdx = findClosestHeart(currentX, currentZ, hearts);
                    animatePhase('grabbing', { clawOpen: 0, grabbedHeartIndex: heartIdx }, 800, () => {
                        // Phase 3: Rise up
                        animatePhase('rising', { clawY: CLAW_TOP_Y }, 1500, () => {
                            // Phase 4: Move to drop zone (right side — prize chute)
                            animatePhase('delivering', { clawX: DELIVER_X, clawZ: DELIVER_Z }, 1200, () => {
                                // Phase 5: Open claw (release)
                                const msg = hearts[heartIdx].message;
                                animatePhase('releasing', { clawOpen: 1 }, 1000, () => {
                                    // Permanently remove the grabbed heart
                                    setRemovedHearts(prev => new Set(prev).add(heartIdx));
                                    // Phase 6: Show prize message
                                    setGameState(p => ({
                                        ...p,
                                        phase: 'won',
                                        wonMessage: msg,
                                        grabbedHeartIndex: null,
                                    }));
                                });
                            });
                        });
                    });
                });
            }, 10);

            return { ...prev, phase: 'dropping' };
        });
    }, [hearts, animatePhase, findClosestHeart]);

    const handleClosePrize = useCallback(() => {
        // Reset everything
        setGameState({
            phase: 'resetting',
            clawX: 0,
            clawZ: 0,
            clawY: CLAW_TOP_Y,
            clawOpen: 1,
            grabbedHeartIndex: null,
            wonMessage: null,
        });
        // Short delay then ready
        setTimeout(() => {
            setGameState(prev => ({ ...prev, phase: 'ready' }));
        }, 500);
    }, []);

    // Compute joystick tilt from currently held keys
    const updateTiltFromKeys = useCallback(() => {
        let tx = 0, tz = 0;
        if (keysDown.current.has('a') || keysDown.current.has('ArrowLeft')) tx = -1;
        if (keysDown.current.has('d') || keysDown.current.has('ArrowRight')) tx = 1;
        if (keysDown.current.has('w') || keysDown.current.has('ArrowUp')) tz = -1;
        if (keysDown.current.has('s') || keysDown.current.has('ArrowDown')) tz = 1;
        setJoystickTilt({ x: tx, z: tz });
    }, []);

    // Keyboard support with visual joystick tilt
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const canMove = gameState.phase === 'ready' || gameState.phase === 'moving';
            const canGrab = canMove;

            const key = e.key;
            if (['a', 'd', 'w', 's', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key)) {
                if (!canMove) return;
                keysDown.current.add(key);
                updateTiltFromKeys();
                switch (key) {
                    case 'ArrowLeft': case 'a': handleMove('left'); break;
                    case 'ArrowRight': case 'd': handleMove('right'); break;
                    case 'ArrowUp': case 'w': handleMove('forward'); break;
                    case 'ArrowDown': case 's': handleMove('back'); break;
                }
            }
            if (key === ' ' && canGrab) { e.preventDefault(); handleGrab(); }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            keysDown.current.delete(e.key);
            updateTiltFromKeys();
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [gameState.phase, handleMove, handleGrab, updateTiltFromKeys]);

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <Canvas
                shadows
                camera={{
                    position: [1, 2.5, 18],
                    fov: 35,
                    near: 0.1,
                    far: 100,
                }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'default',
                    failIfMajorPerformanceCaveat: false,
                }}
                dpr={[1, 1.5]}
                style={{ background: 'transparent' }}
                onCreated={({ gl }) => {
                    gl.toneMapping = THREE.ACESFilmicToneMapping;
                    gl.toneMappingExposure = 1.1;
                    gl.shadowMap.enabled = true;
                    gl.shadowMap.type = THREE.VSMShadowMap;
                }}
            >
                <Scene gameState={gameState} hearts={hearts} removedHearts={removedHearts} onJoystick={handleMove} onGrab={handleGrab} joystickTilt={joystickTilt} />
                <OrbitControls
                    enablePan={false}
                    enableZoom={false}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 2.1}
                    autoRotate={gameState.phase === 'ready' || gameState.phase === 'won'}
                    autoRotateSpeed={0.8}
                    target={[0, 0.5, 0]}
                />
            </Canvas>

            {/* Prize popup */}
            <PrizeMessage
                message={gameState.wonMessage}
                onClose={handleClosePrize}
            />
        </div>
    );
}
