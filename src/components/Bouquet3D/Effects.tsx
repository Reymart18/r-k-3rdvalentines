import { useMemo } from 'react';
import * as THREE from 'three';

export function RomanticBackground() {
    const mat = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 2;
        canvas.height = 512;
        const ctx = canvas.getContext('2d')!;
        const grad = ctx.createLinearGradient(0, 0, 0, 512);
        grad.addColorStop(0, '#fff5f7');
        grad.addColorStop(0.25, '#fce4ec');
        grad.addColorStop(0.5, '#f8bbd0');
        grad.addColorStop(0.75, '#f3a5bf');
        grad.addColorStop(1, '#e8b4c8');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 2, 512);
        const tex = new THREE.CanvasTexture(canvas);
        tex.needsUpdate = true;
        return new THREE.MeshBasicMaterial({
            map: tex,
            side: THREE.BackSide,
            depthWrite: false,
        });
    }, []);

    return (
        <mesh material={mat}>
            <sphereGeometry args={[30, 32, 32]} />
        </mesh>
    );
}

export function Vignette() {
    const mat = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d')!;
        const grad = ctx.createRadialGradient(256, 256, 80, 256, 256, 256);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(0.6, 'rgba(0,0,0,0)');
        grad.addColorStop(1, 'rgba(80,20,40,0.18)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 512, 512);
        const tex = new THREE.CanvasTexture(canvas);
        tex.needsUpdate = true;
        return new THREE.MeshBasicMaterial({
            map: tex,
            transparent: true,
            depthTest: false,
            depthWrite: false,
        });
    }, []);

    return (
        <mesh position={[0, 0, -9]} renderOrder={999} material={mat}>
            <planeGeometry args={[25, 25]} />
        </mesh>
    );
}
