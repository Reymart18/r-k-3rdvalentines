import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { useSharedGeo } from './sharedGeometry';
import { getCachedMaterial } from './materials';

export default function FallingPetals() {
    const { fallingPetal } = useSharedGeo();
    const groupRef = useRef<Group>(null);
    const count = 15;
    const colors = ['#fda4af', '#fb7185', '#f472b6', '#f9a8d4', '#fecdd3'];

    const data = useMemo(() =>
        Array.from({ length: count }, (_, i) => ({
            x: (Math.random() - 0.5) * 6,
            y: Math.random() * 5 + 2,
            z: (Math.random() - 0.5) * 6,
            speed: 0.0015 + Math.random() * 0.003,
            rotSpeed: 0.008 + Math.random() * 0.012,
            wobble: Math.random() * Math.PI * 2,
            scale: 0.4 + Math.random() * 0.5,
            color: colors[i % 5],
        })),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const mats = useMemo(() =>
        colors.map(c => getCachedMaterial(c, { roughness: 0.5, transparent: true, opacity: 0.8 })),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    useFrame((_, delta) => {
        if (!groupRef.current) return;
        const dt = Math.min(delta, 0.05) * 60;
        groupRef.current.children.forEach((child, i) => {
            const d = data[i];
            child.position.y -= d.speed * dt;
            child.position.x += Math.sin(child.position.y * 2 + d.wobble) * 0.001 * dt;
            child.rotation.x += d.rotSpeed * dt;
            child.rotation.z += d.rotSpeed * 0.5 * dt;
            if (child.position.y < -4) {
                child.position.y = 5 + Math.random() * 2;
                child.position.x = (Math.random() - 0.5) * 6;
                child.position.z = (Math.random() - 0.5) * 6;
            }
        });
    });

    return (
        <group ref={groupRef}>
            {data.map((p, i) => (
                <mesh key={i} position={[p.x, p.y, p.z]} scale={p.scale} geometry={fallingPetal} material={mats[i % 4]} />
            ))}
        </group>
    );
}
