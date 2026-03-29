import { useMemo } from 'react';
import * as THREE from 'three';
import { getGlassMaterial } from './materials';

interface GlassPanelProps {
    position: [number, number, number];
    rotation?: [number, number, number];
    size: [number, number];
}

export default function GlassPanel({ position, rotation = [0, 0, 0], size }: GlassPanelProps) {
    const glassMat = useMemo(() => getGlassMaterial('#f8f0f4', 0.1), []);
    const edgeMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#c4a0b0',
        roughness: 0.4,
        metalness: 0.5,
        transparent: true,
        opacity: 0.3,
    }), []);

    const thickness = 0.06;

    return (
        <group position={position} rotation={rotation}>
            {/* Main glass panel */}
            <mesh castShadow receiveShadow>
                <boxGeometry args={[size[0], size[1], thickness]} />
                <primitive object={glassMat} attach="material" />
            </mesh>

            {/* Thin edge frame for glass — subtle border */}
            {/* Top edge */}
            <mesh position={[0, size[1] / 2, 0]}>
                <boxGeometry args={[size[0] + 0.04, 0.03, thickness + 0.02]} />
                <primitive object={edgeMat} attach="material" />
            </mesh>
            {/* Bottom edge */}
            <mesh position={[0, -size[1] / 2, 0]}>
                <boxGeometry args={[size[0] + 0.04, 0.03, thickness + 0.02]} />
                <primitive object={edgeMat} attach="material" />
            </mesh>
            {/* Left edge */}
            <mesh position={[-size[0] / 2, 0, 0]}>
                <boxGeometry args={[0.03, size[1] + 0.04, thickness + 0.02]} />
                <primitive object={edgeMat} attach="material" />
            </mesh>
            {/* Right edge */}
            <mesh position={[size[0] / 2, 0, 0]}>
                <boxGeometry args={[0.03, size[1] + 0.04, thickness + 0.02]} />
                <primitive object={edgeMat} attach="material" />
            </mesh>
        </group>
    );
}
