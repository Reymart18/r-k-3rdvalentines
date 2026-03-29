import * as THREE from 'three';

/* ─── Petal Material Cache ─── */
const petalMatCache = new Map<string, THREE.MeshPhysicalMaterial>();

export function getPetalMat(color: string): THREE.MeshPhysicalMaterial {
    if (!petalMatCache.has(color)) {
        petalMatCache.set(color, new THREE.MeshPhysicalMaterial({
            color,
            roughness: 0.52,
            metalness: 0.0,
            side: THREE.DoubleSide,
            clearcoat: 0.03,
            clearcoatRoughness: 0.9,
            transmission: 0.04,
            thickness: 0.25,
            ior: 1.3,
            sheen: 0.18,
            sheenRoughness: 0.55,
            sheenColor: new THREE.Color(color).lerp(new THREE.Color('#ffffff'), 0.35),
        }));
    }
    return petalMatCache.get(color)!;
}

/* ─── Standard Material Cache ─── */
const materialCache = new Map<string, THREE.MeshStandardMaterial>();

export function getCachedMaterial(color: string, opts?: {
    roughness?: number;
    metalness?: number;
    side?: THREE.Side;
    transparent?: boolean;
    opacity?: number;
}): THREE.MeshStandardMaterial {
    const key = `${color}-${opts?.roughness ?? 0.4}-${opts?.side ?? ''}-${opts?.opacity ?? 1}`;
    if (!materialCache.has(key)) {
        materialCache.set(key, new THREE.MeshStandardMaterial({
            color,
            roughness: opts?.roughness ?? 0.4,
            metalness: opts?.metalness ?? 0.1,
            side: opts?.side ?? THREE.DoubleSide,
            transparent: opts?.transparent,
            opacity: opts?.opacity,
        }));
    }
    return materialCache.get(key)!;
}

/* ─── Color Helper ─── */
export function shadeColor(hex: string, percent: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + percent));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + percent));
    const b = Math.min(255, Math.max(0, (num & 0x0000ff) + percent));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}
