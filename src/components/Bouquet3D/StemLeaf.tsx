import { useMemo } from 'react';
import * as THREE from 'three';
import { useSharedGeo } from './sharedGeometry';
import { getCachedMaterial } from './materials';

/* ─── Stem ─── */
export function Stem({ height, position, rotation = [0, 0, 0] as [number, number, number], curve = 0 }: {
    height: number;
    position: [number, number, number];
    rotation?: [number, number, number];
    curve?: number;
}) {
    const geometry = useMemo(() => {
        const path = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(curve * 0.3, height * 0.33, curve * 0.1),
            new THREE.Vector3(curve * 0.5, height * 0.66, curve * 0.2),
            new THREE.Vector3(curve * 0.3, height, curve * 0.05),
        ]);
        return new THREE.TubeGeometry(path, 8, 0.012, 6, false);
    }, [height, curve]);

    const mat = useMemo(() => getCachedMaterial('#2d6a4f', { roughness: 0.7 }), []);
    return <mesh position={position} rotation={rotation} geometry={geometry} material={mat} />;
}

/* ─── Leaf ─── */
export function LeafMesh({ position, rotation, scale = 1 }: {
    position: [number, number, number];
    rotation: [number, number, number];
    scale?: number;
}) {
    const { leaf } = useSharedGeo();
    const mat = useMemo(() => getCachedMaterial('#3a9a5b', { roughness: 0.5, metalness: 0.05 }), []);
    return <mesh position={position} rotation={rotation} scale={scale} geometry={leaf} material={mat} />;
}
