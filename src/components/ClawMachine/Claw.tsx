import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getMetalMaterial } from './materials';
import type { GameState } from './types';

interface ClawProps {
    gameState: GameState;
}

export default function Claw({ gameState }: ClawProps) {
    const groupRef = useRef<THREE.Group>(null);
    const clawArmRefs = useRef<THREE.Mesh[]>([]);
    const currentY = useRef(3.0);
    const currentOpen = useRef(1);
    const currentX = useRef(0);
    const currentZ = useRef(0);

    // Materials
    const chromeMat = useMemo(() => getMetalMaterial('#c0c0c0', 0.25), []);
    const darkChromeMat = useMemo(() => getMetalMaterial('#888888', 0.35), []);
    const cableMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#444444',
        roughness: 0.7,
        metalness: 0.3,
    }), []);

    // Cable geometry — taller for bigger machine
    const cableGeo = useMemo(() => new THREE.CylinderGeometry(0.04, 0.04, 8, 8), []);

    // Claw prong shape — thicker, more mechanical
    const prongGeo = useMemo(() => {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(0.14, 0);
        shape.lineTo(0.12, -0.95);
        shape.bezierCurveTo(0.1, -1.2, -0.04, -1.25, -0.07, -1.05);
        shape.lineTo(-0.03, -0.1);
        shape.lineTo(0, 0);

        return new THREE.ExtrudeGeometry(shape, {
            depth: 0.1,
            bevelEnabled: true,
            bevelThickness: 0.025,
            bevelSize: 0.025,
            bevelSegments: 3,
        });
    }, []);

    useFrame((_state, delta) => {
        if (!groupRef.current) return;

        const lerpSpeed = 4 * delta;

        // Smoothly interpolate position
        currentX.current += (gameState.clawX - currentX.current) * lerpSpeed;
        currentZ.current += (gameState.clawZ - currentZ.current) * lerpSpeed;
        currentY.current += (gameState.clawY - currentY.current) * lerpSpeed;
        currentOpen.current += (gameState.clawOpen - currentOpen.current) * lerpSpeed * 1.5;

        groupRef.current.position.x = currentX.current;
        groupRef.current.position.z = currentZ.current;
        groupRef.current.position.y = currentY.current;

        // Animate prong open/close
        const openAngle = 0.4 * currentOpen.current;
        clawArmRefs.current.forEach((mesh, i) => {
            if (!mesh) return;
            const sign = i % 2 === 0 ? 1 : -1;
            mesh.rotation.z = openAngle * sign;
        });
    });

    const setArmRef = (index: number) => (el: THREE.Mesh | null) => {
        if (el) clawArmRefs.current[index] = el;
    };

    return (
        <group ref={groupRef} position={[0, 3.0, 0]}>
            {/* Cable */}
            <mesh geometry={cableGeo} material={cableMat} position={[0, 4, 0]} />

            {/* Motor housing — top cylinder */}
            <mesh position={[0, 0.3, 0]} castShadow>
                <cylinderGeometry args={[0.3, 0.35, 0.5, 16]} />
                <meshStandardMaterial {...chromeMat} />
            </mesh>

            {/* Main hub */}
            <mesh position={[0, 0, 0]} castShadow>
                <cylinderGeometry args={[0.25, 0.25, 0.3, 16]} />
                <meshStandardMaterial {...darkChromeMat} />
            </mesh>

            {/* Decorative ring */}
            <mesh position={[0, -0.1, 0]} castShadow>
                <torusGeometry args={[0.28, 0.04, 8, 24]} />
                <meshStandardMaterial color="#aaaaaa" roughness={0.3} metalness={0.8} />
            </mesh>

            {/* 4 Claw prongs */}
            {[0, 1, 2, 3].map((i) => {
                const angle = (i * Math.PI) / 2;
                return (
                    <group key={i} rotation={[0, angle, 0]} position={[0, -0.2, 0]}>
                        <mesh
                            ref={setArmRef(i)}
                            geometry={prongGeo}
                            material={chromeMat}
                            position={[0.15, 0, 0]}
                            castShadow
                        />
                    </group>
                );
            })}
        </group>
    );
}
