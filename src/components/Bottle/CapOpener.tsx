import { useRef } from 'react';
import * as THREE from 'three';
import { useDrag } from '@use-gesture/react';
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

    const [{ x, y, z }, api] = useSpring(() => ({
        x: homeX,
        y: homeY,
        z: 1,
        config: { mass: 1, tension: 280, friction: 25 },
    }));

    const bind = useDrag(
        ({ active, first, offset: [ox, oy], event }) => {
            if (active) {
                // Convert pointer pixel offset to scene units and clamp to the bottle stage.
                const newX = THREE.MathUtils.clamp(homeX + ox / aspect, -3.2, 3.2);
                const newY = THREE.MathUtils.clamp(homeY - oy / aspect, 0.4, 3.6);

                if (first) {
                    dragStartYRef.current = newY;
                }

                api.start({ x: newX, y: newY, immediate: true });

                const dx = newX - CAP_TARGET_X;
                const dy = newY - CAP_TARGET_Y;
                const distanceToCapXY = Math.hypot(dx, dy);
                const liftedUp = newY - dragStartYRef.current;

                if (!didOpenRef.current && distanceToCapXY < OPEN_THRESHOLD_XY && liftedUp > LIFT_THRESHOLD) {
                    didOpenRef.current = true;
                    onOpen();
                }
            } else {
                // On release, spring back to default position
                api.start({ x: homeX, y: homeY });
            }
            return event;
        },
        { pointer: { touch: true } }
    );

    return (
        <a.group position-x={x} position-y={y} position-z={z} {...bind()}>
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