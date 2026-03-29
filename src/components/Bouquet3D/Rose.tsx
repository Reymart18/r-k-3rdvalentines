import { useMemo } from 'react';
import { useSharedGeo } from './sharedGeometry';
import { getPetalMat, getCachedMaterial, shadeColor } from './materials';
import type { RoseProps } from './types';

export default function Rose({ position, rotation = [0, 0, 0], scale = 1, color = '#e11d48' }: RoseProps) {
    const { petalInner, petalMid, petalOuter, sepal, bud } = useSharedGeo();
    const rng = (seed: number) => ((Math.sin(seed * 127.1 + 311.7) * 43758.5453) % 1 + 1) % 1;

    const petals = useMemo(() => {
        const res: { geo: 'i' | 'm' | 'o'; pos: [number, number, number]; rot: [number, number, number]; s: number; c: string }[] = [];

        // Layer 1: Tight core — 4 petals
        for (let i = 0; i < 4; i++) {
            const a = (i / 4) * Math.PI * 2 + rng(i + 1) * 0.4;
            const r = 0.008 + rng(i + 10) * 0.005;
            const tilt = 0.15 + rng(i + 20) * 0.1;
            res.push({ geo: 'i', pos: [Math.cos(a) * r, 0.08 + rng(i + 30) * 0.01, Math.sin(a) * r], rot: [tilt, a + Math.PI, 0], s: 0.6 + rng(i + 40) * 0.1, c: shadeColor(color, -40) });
        }

        // Layer 2: Inner — 5
        for (let i = 0; i < 5; i++) {
            const a = (i / 5) * Math.PI * 2 + 0.3 + rng(i + 50) * 0.3;
            const r = 0.024 + rng(i + 60) * 0.008;
            const tilt = 0.32 + rng(i + 70) * 0.15;
            res.push({ geo: 'i', pos: [Math.cos(a) * r, 0.06 + rng(i + 80) * 0.012, Math.sin(a) * r], rot: [tilt, a + Math.PI, 0], s: 0.78 + rng(i + 90) * 0.12, c: shadeColor(color, -28 + rng(i + 100) * 6) });
        }

        // Layer 3: Mid-inner — 6
        for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2 + 0.15 + rng(i + 110) * 0.2;
            const r = 0.044 + rng(i + 120) * 0.01;
            const tilt = 0.52 + rng(i + 130) * 0.14;
            res.push({ geo: 'm', pos: [Math.cos(a) * r, 0.035 + rng(i + 140) * 0.012, Math.sin(a) * r], rot: [tilt, a + Math.PI, 0], s: 0.85 + rng(i + 150) * 0.14, c: shadeColor(color, -12 + rng(i + 160) * 8) });
        }

        // Layer 4: Mid-outer — 7
        for (let i = 0; i < 7; i++) {
            const a = (i / 7) * Math.PI * 2 + 0.08 + rng(i + 170) * 0.15;
            const r = 0.068 + rng(i + 180) * 0.014;
            const tilt = 0.72 + rng(i + 190) * 0.18;
            res.push({ geo: 'm', pos: [Math.cos(a) * r, 0.01 + rng(i + 200) * 0.01, Math.sin(a) * r], rot: [tilt, a + Math.PI, rng(i + 210) * 0.05 - 0.025], s: 1.0 + rng(i + 220) * 0.16, c: shadeColor(color, -3 + rng(i + 230) * 6) });
        }

        // Layer 5: Outer — 7
        for (let i = 0; i < 7; i++) {
            const a = (i / 7) * Math.PI * 2 + 0.22 + rng(i + 240) * 0.12;
            const r = 0.098 + rng(i + 250) * 0.016;
            const tilt = 1.0 + rng(i + 260) * 0.2;
            res.push({ geo: 'o', pos: [Math.cos(a) * r, -0.012 + rng(i + 270) * 0.01, Math.sin(a) * r], rot: [tilt, a + Math.PI, rng(i + 280) * 0.06 - 0.03], s: 1.0 + rng(i + 290) * 0.18, c: shadeColor(color, 5 + rng(i + 300) * 10) });
        }

        return res;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [color]);

    const budMat = useMemo(() => getPetalMat(shadeColor(color, -50)), [color]);
    const sepalMat = useMemo(() => getCachedMaterial('#2d6a4f', { roughness: 0.6 }), []);
    const geoMap = { i: petalInner, m: petalMid, o: petalOuter };

    return (
        <group position={position} rotation={rotation} scale={scale}>
            <mesh position={[0, 0.085, 0]} geometry={bud} material={budMat} />
            {petals.map((p, idx) => (
                <mesh key={idx} position={p.pos} rotation={p.rot} scale={p.s} geometry={geoMap[p.geo]} material={getPetalMat(p.c)} castShadow />
            ))}
            {[0, 1, 2, 3, 4].map((i) => {
                const a = (i / 5) * Math.PI * 2;
                return (
                    <mesh key={`s${i}`} position={[Math.cos(a) * 0.09, -0.05, Math.sin(a) * 0.09]} rotation={[-1.3, a, 0]} scale={[0.04, 0.1, 0.008]} geometry={sepal} material={sepalMat} />
                );
            })}
        </group>
    );
}
