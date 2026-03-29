import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface CapProps {
    isOpen: boolean;
}

export default function Cap({ isOpen }: CapProps) {
    const groupRef = useRef<THREE.Group>(null);
    const progressRef = useRef(0);

    useFrame((_, delta) => {
        const target = isOpen ? 1 : 0;
        progressRef.current += (target - progressRef.current) * Math.min(1, delta * 6);

        if (!groupRef.current) return;

        const t = THREE.MathUtils.smoothstep(progressRef.current, 0, 1);
        const x = THREE.MathUtils.lerp(0, 0.58, t);
        const y = THREE.MathUtils.lerp(2.15, 4.95, t);
        const z = THREE.MathUtils.lerp(0, 0.36, t);
        const tilt = THREE.MathUtils.lerp(0, -Math.PI * 0.72, t);
        const spin = THREE.MathUtils.lerp(0, Math.PI * 1.2, t);

        groupRef.current.position.set(x, y, z);
        groupRef.current.rotation.set(tilt, spin, 0);
    });

    return (
        <group ref={groupRef} position={[0, 2.15, 0]} rotation={[0, 0, 0]}>
            <mesh castShadow receiveShadow>
                <cylinderGeometry args={[0.55, 0.6, 0.38, 48]} />
                <meshStandardMaterial metalness={0.55} roughness={0.25} color="#c24646" />
            </mesh>
            <mesh position={[0, 0.19, 0]}>
                <torusGeometry args={[0.48, 0.06, 24, 64]} />
                <meshStandardMaterial metalness={0.65} roughness={0.18} color="#f2d7c4" />
            </mesh>
        </group>
    );
}