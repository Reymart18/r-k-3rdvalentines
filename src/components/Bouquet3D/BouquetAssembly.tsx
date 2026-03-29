import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import Rose from './Rose';
import { Stem, LeafMesh } from './StemLeaf';
import BouquetWrapper from './BouquetWrapper';

export default function BouquetAssembly() {
    const group = useRef<Group>(null);

    useFrame((state) => {
        if (!group.current) return;
        group.current.rotation.y += 0.0012;
        group.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.035;
    });

    const roses = useMemo<{ pos: [number, number, number]; rot: [number, number, number]; scale: number; color: string }[]>(() => [
        { pos: [0, 0.52, 0], rot: [0.08, 0, 0], scale: 2.4, color: '#e11d48' },
        { pos: [0.2, 0.44, 0.12], rot: [0.25, 0.5, 0.08], scale: 2.0, color: '#f43f5e' },
        { pos: [-0.18, 0.46, 0.14], rot: [0.2, -0.3, -0.1], scale: 2.0, color: '#ec4899' },
        { pos: [0.06, 0.45, -0.18], rot: [-0.2, 1.0, 0], scale: 1.9, color: '#e11d48' },
        { pos: [-0.1, 0.43, -0.14], rot: [0.15, 2.0, 0.05], scale: 1.8, color: '#be185d' },
        { pos: [0.28, 0.38, -0.06], rot: [0.45, 0.8, 0.12], scale: 1.7, color: '#fb7185' },
        { pos: [-0.26, 0.39, -0.1], rot: [0.35, -0.6, -0.15], scale: 1.7, color: '#f472b6' },
        { pos: [0.14, 0.37, 0.26], rot: [0.3, 1.5, 0.08], scale: 1.6, color: '#fda4af' },
        { pos: [-0.16, 0.38, 0.22], rot: [0.28, -1.2, 0], scale: 1.6, color: '#f9a8d4' },
    ], []);

    const stems = useMemo(() => roses.map((r) => ({
        pos: [r.pos[0] * 0.25, -0.3, r.pos[2] * 0.25] as [number, number, number],
        rot: [0, Math.atan2(r.pos[0], r.pos[2]), 0] as [number, number, number],
        curve: r.pos[0] * 1.3,
        h: 0.65 + Math.abs(r.pos[0]) * 0.18,
    })), [roses]);

    return (
        <group ref={group} scale={2}>
            {stems.map((s, i) => (
                <Stem key={`st${i}`} position={s.pos} rotation={s.rot} height={s.h} curve={s.curve} />
            ))}
            {[
                { pos: [0.08, -0.1, 0.04] as [number, number, number], rot: [0.3, 0.5, -0.5] as [number, number, number], s: 2.2 },
                { pos: [-0.1, -0.05, 0.06] as [number, number, number], rot: [0.2, -0.8, 0.3] as [number, number, number], s: 2.4 },
                { pos: [0.05, 0.02, -0.08] as [number, number, number], rot: [-0.3, 1.2, 0.4] as [number, number, number], s: 2.0 },
                { pos: [-0.06, -0.15, -0.05] as [number, number, number], rot: [0.4, -0.3, -0.6] as [number, number, number], s: 1.8 },
                { pos: [0.12, -0.03, 0.08] as [number, number, number], rot: [0.15, 1.0, 0.2] as [number, number, number], s: 2.0 },
                { pos: [-0.11, 0.05, -0.03] as [number, number, number], rot: [-0.2, -1.1, 0.5] as [number, number, number], s: 1.9 },
            ].map((l, i) => (
                <LeafMesh key={`lf${i}`} position={l.pos} rotation={l.rot} scale={l.s} />
            ))}
            {roses.map((r, i) => (
                <Rose key={`r${i}`} position={r.pos} rotation={r.rot} scale={r.scale} color={r.color} />
            ))}
            <BouquetWrapper />
        </group>
    );
}
