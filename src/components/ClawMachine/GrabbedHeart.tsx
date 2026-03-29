import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Heart3D from './Heart3D';
import type { GameState, HeartConfig } from './types';

interface GrabbedHeartProps {
    gameState: GameState;
    heart: HeartConfig;
}

export default function GrabbedHeart({ gameState, heart }: GrabbedHeartProps) {
    const groupRef = useRef<THREE.Group>(null);
    const currentPos = useRef(new THREE.Vector3(0, 0, 0));
    const fallY = useRef<number | null>(null);
    const fallVel = useRef(0);

    const isVisible =
        gameState.phase === 'rising' ||
        gameState.phase === 'delivering' ||
        gameState.phase === 'releasing';

    useFrame((_state, delta) => {
        if (!groupRef.current || !isVisible) {
            fallY.current = null;
            fallVel.current = 0;
            return;
        }

        if (gameState.phase === 'releasing') {
            // Heart falls from claw into prize chute area (right side)
            if (fallY.current === null) {
                fallY.current = currentPos.current.y;
                fallVel.current = 0;
            }
            fallVel.current -= 9.8 * delta;
            fallY.current += fallVel.current * delta;

            // Drift toward prize drop zone (left side inside machine)
            const targetDriftX = -1.8;
            currentPos.current.x += (targetDriftX - currentPos.current.x) * 1.5 * delta;

            groupRef.current.position.x = currentPos.current.x;
            groupRef.current.position.y = fallY.current;
            groupRef.current.position.z = currentPos.current.z;
            groupRef.current.rotation.z += delta * 2;
        } else {
            // Follow claw position (offset below claw)
            const targetX = gameState.clawX;
            const targetY = gameState.clawY - 1.4;
            const targetZ = gameState.clawZ;

            currentPos.current.x += (targetX - currentPos.current.x) * 4 * delta;
            currentPos.current.y += (targetY - currentPos.current.y) * 4 * delta;
            currentPos.current.z += (targetZ - currentPos.current.z) * 4 * delta;

            groupRef.current.position.copy(currentPos.current);
        }
    });

    if (!isVisible) return null;

    return (
        <group ref={groupRef}>
            <Heart3D
                position={[0, 0, 0]}
                rotation={heart.rotation}
                scale={heart.scale * 1.2}
                color={heart.color}
                innerColor={heart.innerColor}
                roughness={0.3}
            />
        </group>
    );
}
