import { useRef, useCallback, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface Joystick3DProps {
    onMove: (dir: 'left' | 'right' | 'forward' | 'back') => void;
    /** Current keyboard-driven tilt direction, e.g. { x: -1, z: 0 } for left */
    keyboardTilt?: { x: number; z: number };
}

const MAX_TILT = 0.45; // max radians the stick tilts
const DEAD_ZONE = 0.15; // normalized dead zone
const MOVE_INTERVAL = 60; // ms between move fires while held

export default function Joystick3D({ onMove, keyboardTilt }: Joystick3DProps) {
    const stickGroupRef = useRef<THREE.Group>(null);
    const isDragging = useRef(false);
    const dragStartNDC = useRef({ x: 0, y: 0 });
    const tiltTarget = useRef({ x: 0, z: 0 });
    const tiltCurrent = useRef({ x: 0, z: 0 });
    const moveTimerRef = useRef<number | null>(null);
    const lastDir = useRef<{ x: number; z: number }>({ x: 0, z: 0 });
    const { gl } = useThree();

    // Fire continuous moves while dragging
    const startContinuousMove = useCallback((nx: number, nz: number) => {
        if (moveTimerRef.current) clearInterval(moveTimerRef.current);

        const fireMove = () => {
            const dx = lastDir.current.x;
            const dz = lastDir.current.z;
            const absDx = Math.abs(dx);
            const absDz = Math.abs(dz);

            if (absDx < DEAD_ZONE && absDz < DEAD_ZONE) return;

            // Fire the dominant direction, or both if diagonal enough
            if (absDx > absDz) {
                onMove(dx > 0 ? 'right' : 'left');
            } else {
                // In 3D space: -Z = forward (into screen), +Z = back
                onMove(nz > 0 ? 'forward' : 'back');
            }
        };

        lastDir.current = { x: nx, z: nz };
        fireMove();
        moveTimerRef.current = window.setInterval(fireMove, MOVE_INTERVAL);
    }, [onMove]);

    const stopContinuousMove = useCallback(() => {
        if (moveTimerRef.current) {
            clearInterval(moveTimerRef.current);
            moveTimerRef.current = null;
        }
    }, []);

    const handlePointerDown = useCallback((e: THREE.Event) => {
        const event = e as unknown as { stopPropagation: () => void; nativeEvent: PointerEvent };
        event.stopPropagation();
        isDragging.current = true;
        document.body.style.cursor = 'grabbing';

        // Capture mouse NDC at drag start
        const rect = gl.domElement.getBoundingClientRect();
        const pe = event.nativeEvent;
        dragStartNDC.current = {
            x: ((pe.clientX - rect.left) / rect.width) * 2 - 1,
            y: -((pe.clientY - rect.top) / rect.height) * 2 + 1,
        };

        // Grab pointer for smooth dragging even outside canvas
        gl.domElement.setPointerCapture(pe.pointerId);
    }, [gl]);

    useEffect(() => {
        const canvas = gl.domElement;

        const handlePointerMove = (pe: PointerEvent) => {
            if (!isDragging.current) return;

            const rect = canvas.getBoundingClientRect();
            const ndcX = ((pe.clientX - rect.left) / rect.width) * 2 - 1;
            const ndcY = -((pe.clientY - rect.top) / rect.height) * 2 + 1;

            // Delta from drag start, scaled to joystick range
            const sensitivity = 4.0;
            let dx = (ndcX - dragStartNDC.current.x) * sensitivity;
            let dz = -(ndcY - dragStartNDC.current.y) * sensitivity; // flip: drag up = forward (-Z)

            // Clamp to unit circle
            const len = Math.sqrt(dx * dx + dz * dz);
            if (len > 1) { dx /= len; dz /= len; }

            tiltTarget.current = { x: dx, z: dz };
            lastDir.current = { x: dx, z: dz };

            // Check if past dead zone → fire moves
            if (Math.abs(dx) > DEAD_ZONE || Math.abs(dz) > DEAD_ZONE) {
                if (!moveTimerRef.current) {
                    startContinuousMove(dx, dz);
                }
            } else {
                stopContinuousMove();
            }
        };

        const handlePointerUp = () => {
            if (!isDragging.current) return;
            isDragging.current = false;
            tiltTarget.current = { x: 0, z: 0 };
            lastDir.current = { x: 0, z: 0 };
            document.body.style.cursor = 'auto';
            stopContinuousMove();
        };

        canvas.addEventListener('pointermove', handlePointerMove);
        canvas.addEventListener('pointerup', handlePointerUp);
        canvas.addEventListener('pointercancel', handlePointerUp);
        window.addEventListener('pointerup', handlePointerUp);

        return () => {
            canvas.removeEventListener('pointermove', handlePointerMove);
            canvas.removeEventListener('pointerup', handlePointerUp);
            canvas.removeEventListener('pointercancel', handlePointerUp);
            window.removeEventListener('pointerup', handlePointerUp);
            stopContinuousMove();
        };
    }, [gl, startContinuousMove, stopContinuousMove]);

    // Animate stick tilt smoothly — merge drag + keyboard tilt
    useFrame((_state, delta) => {
        if (!stickGroupRef.current) return;

        // If not dragging, use keyboard tilt; if dragging, use drag tilt
        const targetX = isDragging.current ? tiltTarget.current.x : (keyboardTilt?.x ?? 0);
        const targetZ = isDragging.current ? tiltTarget.current.z : (keyboardTilt?.z ?? 0);

        const lerpSpeed = 12 * delta;
        tiltCurrent.current.x += (targetX - tiltCurrent.current.x) * lerpSpeed;
        tiltCurrent.current.z += (targetZ - tiltCurrent.current.z) * lerpSpeed;

        // Tilt: rotation.z controls left/right tilt, rotation.x controls forward/back tilt
        stickGroupRef.current.rotation.z = -tiltCurrent.current.x * MAX_TILT;
        stickGroupRef.current.rotation.x = tiltCurrent.current.z * MAX_TILT;
    });

    return (
        <group>
            {/* Joystick base plate — stays fixed */}
            <mesh castShadow>
                <cylinderGeometry args={[0.28, 0.32, 0.1, 20]} />
                <meshStandardMaterial color="#1a0c14" roughness={0.4} metalness={0.6} />
            </mesh>
            {/* Rubber boot — stays fixed */}
            <mesh position={[0, 0.08, 0]} castShadow>
                <cylinderGeometry args={[0.14, 0.22, 0.12, 16]} />
                <meshStandardMaterial color="#111" roughness={0.95} metalness={0.02} />
            </mesh>

            {/* Tilting stick group (shaft + ball) */}
            <group ref={stickGroupRef} position={[0, 0.12, 0]}>
                {/* Metal shaft */}
                <mesh position={[0, 0.22, 0]} castShadow>
                    <cylinderGeometry args={[0.045, 0.045, 0.45, 12]} />
                    <meshStandardMaterial color="#c0c0c0" roughness={0.25} metalness={0.85} />
                </mesh>

                {/* Ball top — pink, draggable */}
                <mesh
                    position={[0, 0.5, 0]}
                    castShadow
                    onPointerDown={handlePointerDown}
                    onPointerOver={(e) => { e.stopPropagation(); if (!isDragging.current) document.body.style.cursor = 'grab'; }}
                    onPointerOut={() => { if (!isDragging.current) document.body.style.cursor = 'auto'; }}
                >
                    <sphereGeometry args={[0.18, 20, 20]} />
                    <meshStandardMaterial
                        color="#fb7185"
                        roughness={0.25}
                        metalness={0.1}
                        emissive="#fb7185"
                        emissiveIntensity={0.08}
                    />
                </mesh>

                {/* Larger invisible grab area for easier interaction */}
                <mesh
                    position={[0, 0.45, 0]}
                    onPointerDown={handlePointerDown}
                    onPointerOver={(e) => { e.stopPropagation(); if (!isDragging.current) document.body.style.cursor = 'grab'; }}
                    onPointerOut={() => { if (!isDragging.current) document.body.style.cursor = 'auto'; }}
                >
                    <sphereGeometry args={[0.32, 10, 10]} />
                    <meshStandardMaterial transparent opacity={0} />
                </mesh>
            </group>
        </group>
    );
}
