import { useRef } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { a, useSpring } from '@react-spring/three';

const CAP_TARGET_X = 0;
const CAP_TARGET_Y = 2.15;
const OPEN_THRESHOLD_XY = 0.95; // 2D proximity radius around cap
const LIFT_THRESHOLD = 0.08; // Upward drag needed while near cap

interface CapOpenerProps {
    onOpen: () => void;
}

export default function CapOpener({ onOpen }: CapOpenerProps) {
    const { size, viewport } = useThree();
    const aspect = size.width / viewport.width;
    const isMobile = size.width < 640;
    const homeX = isMobile ? 1.7 : 2.5;
    const homeY = isMobile ? 2.35 : 2.5;

    const didOpenRef = useRef(false);
    const dragStartYRef = useRef(0);
    const draggingRef = useRef(false);
    const activePointerIdRef = useRef<number | null>(null);
    const pointerStartRef = useRef({ x: 0, y: 0 });
    const openerStartRef = useRef({ x: homeX, y: homeY });

    const [{ x, y, z }, api] = useSpring(() => ({
        x: homeX,
        y: homeY,
        z: 1,
        config: { mass: 1, tension: 280, friction: 25 },
    }));

    const handlePointerDown = (e: any) => {
        e.stopPropagation();
        e.preventDefault?.();

        draggingRef.current = true;
        activePointerIdRef.current = e.pointerId;
        pointerStartRef.current = { x: e.clientX, y: e.clientY };
        openerStartRef.current = { x: x.get(), y: y.get() };
        dragStartYRef.current = y.get();

        if (e.target?.setPointerCapture) {
            e.target.setPointerCapture(e.pointerId);
        }
    };

    const handlePointerMove = (e: any) => {
        if (!draggingRef.current || activePointerIdRef.current !== e.pointerId) return;
        e.stopPropagation();
        e.preventDefault?.();

        const dxPx = e.clientX - pointerStartRef.current.x;
        const dyPx = e.clientY - pointerStartRef.current.y;

        const newX = THREE.MathUtils.clamp(openerStartRef.current.x + dxPx / aspect, -3.2, 3.2);
        const newY = THREE.MathUtils.clamp(openerStartRef.current.y - dyPx / aspect, 0.4, 3.6);

        api.start({ x: newX, y: newY, immediate: true });

        const dx = newX - CAP_TARGET_X;
        const dy = newY - CAP_TARGET_Y;
        const distanceToCapXY = Math.hypot(dx, dy);
        const liftedUp = newY - dragStartYRef.current;

        if (!didOpenRef.current && distanceToCapXY < OPEN_THRESHOLD_XY && liftedUp > LIFT_THRESHOLD) {
            didOpenRef.current = true;
            onOpen();
        }
    };

    const handlePointerUp = (e: any) => {
        if (activePointerIdRef.current !== e.pointerId) return;
        e.stopPropagation();
        e.preventDefault?.();

        draggingRef.current = false;
        activePointerIdRef.current = null;
        if (e.target?.releasePointerCapture) {
            e.target.releasePointerCapture(e.pointerId);
        }

        api.start({ x: homeX, y: homeY });
    };

    return (
        <a.group
            position-x={x}
            position-y={y}
            position-z={z}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
        >
            <mesh>
                <sphereGeometry args={[0.72, 24, 24]} />
                <meshBasicMaterial transparent opacity={0.001} depthWrite={false} />
            </mesh>

            {/* Arm */}
            <mesh castShadow receiveShadow>
                <boxGeometry args={[0.14, 1.4, 0.28]} />
                <meshStandardMaterial metalness={0.75} roughness={0.2} color="#d2d6e0" />
            </mesh>
            {/* Ring */}
            <mesh position={[0, 0.82, 0]}>
                <torusGeometry args={[0.34, 0.07, 20, 48]} />
                <meshStandardMaterial metalness={0.8} roughness={0.16} color="#f4c3d6" />
            </mesh>
            {/* Gripper */}
            <group position={[-0.1, -0.55, -0.2]}>
                <mesh>
                    <cylinderGeometry args={[0.1, 0.1, 0.75, 20]} />
                    <meshStandardMaterial metalness={0.65} roughness={0.26} color="#c24646" />
                </mesh>
                <mesh position={[0, -0.45, 0]}>
                    <boxGeometry args={[0.24, 0.08, 0.3]} />
                    <meshStandardMaterial metalness={0.45} roughness={0.4} color="#f9cbdc" />
                </mesh>
            </group>
        </a.group>
    );
}