import * as THREE from 'three';

const materialCache = new Map<string, THREE.MeshPhysicalMaterial>();

export function getHeartMaterial(color: string, roughness = 0.35): THREE.MeshPhysicalMaterial {
    const key = `${color}-${roughness}`;
    if (materialCache.has(key)) return materialCache.get(key)!;

    const mat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(color),
        roughness,
        metalness: 0.02,
        clearcoat: 0.6,
        clearcoatRoughness: 0.25,
        envMapIntensity: 0.8,
        side: THREE.DoubleSide,
    });
    materialCache.set(key, mat);
    return mat;
}

const glassMaterialCache = new Map<string, THREE.MeshPhysicalMaterial>();

export function getGlassMaterial(tint = '#ffffff', opacity = 0.12): THREE.MeshPhysicalMaterial {
    const key = `glass-${tint}-${opacity}`;
    if (glassMaterialCache.has(key)) return glassMaterialCache.get(key)!;

    const mat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(tint),
        transparent: true,
        opacity,
        roughness: 0.05,
        metalness: 0.0,
        transmission: 0.92,
        thickness: 0.3,
        ior: 1.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        envMapIntensity: 1.2,
        side: THREE.DoubleSide,
    });
    glassMaterialCache.set(key, mat);
    return mat;
}

export function getMetalMaterial(color: string, roughness = 0.4): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        roughness,
        metalness: 0.85,
        envMapIntensity: 0.6,
    });
}

export function getPlasticMaterial(color: string): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        roughness: 0.5,
        metalness: 0.05,
    });
}
