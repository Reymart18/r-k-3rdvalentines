import * as THREE from 'three';

/* ─── Shared Geometry Interface ─── */
export interface SharedGeo {
    petalInner: THREE.BufferGeometry;
    petalMid: THREE.BufferGeometry;
    petalOuter: THREE.BufferGeometry;
    fallingPetal: THREE.ExtrudeGeometry;
    leaf: THREE.ExtrudeGeometry;
    sepal: THREE.SphereGeometry;
    bud: THREE.SphereGeometry;
}

/* ─── Rose Props ─── */
export interface RoseProps {
    position: [number, number, number];
    rotation?: [number, number, number];
    scale?: number;
    color?: string;
}
