import { useMemo } from 'react';
import * as THREE from 'three';

export default function BouquetWrapper() {
    const hash = (n: number) => {
        let x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
        return x - Math.floor(x);
    };

    /* ══════════ 1. Main wrapper body ══════════ */
    const wrapperGeo = useMemo(() => {
        const pts: THREE.Vector2[] = [];
        const segs = 40;
        for (let i = 0; i <= segs; i++) {
            const t = i / segs;
            const base = 0.025 + t * t * 0.48;
            const cinch = t > 0.25 && t < 0.45 ? -0.025 * Math.sin((t - 0.25) / 0.2 * Math.PI) : 0;
            const crinkle = Math.sin(t * Math.PI * 7) * 0.008 * t
                + Math.sin(t * Math.PI * 13 + 2.3) * 0.005 * t;
            const topFlare = t > 0.85 ? (t - 0.85) * 0.35 : 0;
            const r = base + cinch + crinkle + topFlare;
            const y = t * 1.1 - 0.55;
            pts.push(new THREE.Vector2(r, y));
        }
        const geo = new THREE.LatheGeometry(pts, 48);
        const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);
            const z = pos.getZ(i);
            const t = (y + 0.55) / 1.1;
            const angle = Math.atan2(z, x);
            const crease = Math.sin(angle * 6) * 0.012 * (0.3 + t * 0.7);
            const micro = (hash(i * 7.3) - 0.5) * 0.006 * (0.4 + t);
            const dir = Math.sqrt(x * x + z * z);
            if (dir > 0.001) {
                const scale = 1 + (crease + micro) / dir;
                pos.setX(i, x * scale);
                pos.setZ(i, z * scale);
            }
            pos.setY(i, y + (hash(i * 13.1) - 0.5) * 0.004 * t);
        }
        geo.computeVertexNormals();
        return geo;
    }, []);

    /* ══════════ 2. Outer wrapping paper ══════════ */
    const outerMat = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: '#f5d6de',
        roughness: 0.72,
        metalness: 0,
        transparent: true,
        opacity: 0.92,
        side: THREE.DoubleSide,
        clearcoat: 0.04,
        clearcoatRoughness: 0.95,
        sheen: 0.08,
        sheenColor: new THREE.Color('#ffe0e8'),
        sheenRoughness: 0.85,
        transmission: 0.02,
        thickness: 0.5,
    }), []);

    /* ══════════ 3. Inner lining ══════════ */
    const innerMat = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: '#f0b8c8',
        roughness: 0.6,
        metalness: 0,
        transparent: true,
        opacity: 0.85,
        side: THREE.BackSide,
        sheen: 0.05,
        sheenColor: new THREE.Color('#ffd4e0'),
        sheenRoughness: 0.9,
    }), []);

    /* ══════════ 4. Paper fold sheets ══════════ */
    const foldData = useMemo(() => {
        const folds: { geo: THREE.BufferGeometry; angle: number; color: string; yOff: number; tilt: number }[] = [];
        const configs = [
            { angle: 0.0, color: '#fce4ec', w: 0.42, h: 0.78, tilt: 0.06, yOff: -0.18 },
            { angle: 1.05, color: '#fef0f5', w: 0.38, h: 0.82, tilt: -0.04, yOff: -0.20 },
            { angle: 2.1, color: '#f8e0ea', w: 0.45, h: 0.76, tilt: 0.08, yOff: -0.16 },
            { angle: 3.15, color: '#fce4ec', w: 0.40, h: 0.80, tilt: -0.05, yOff: -0.19 },
            { angle: 4.2, color: '#fef0f5', w: 0.36, h: 0.84, tilt: 0.03, yOff: -0.21 },
            { angle: 5.25, color: '#f5dce4', w: 0.43, h: 0.77, tilt: -0.07, yOff: -0.17 },
        ];
        for (const cfg of configs) {
            const plane = new THREE.PlaneGeometry(cfg.w, cfg.h, 12, 18);
            const pos = plane.attributes.position;
            for (let i = 0; i < pos.count; i++) {
                const px = pos.getX(i);
                const py = pos.getY(i);
                const t = (py + cfg.h / 2) / cfg.h;
                const curveR = 0.04 + t * t * 0.52;
                const bulgePrimary = Math.sin(px * 6) * 0.018 * (0.4 + t * 0.6);
                const bulgeSecondary = Math.sin(px * 14 + py * 5) * 0.006 * t;
                const topCrumple = t > 0.7 ? Math.sin(px * 20 + py * 12) * 0.015 * (t - 0.7) / 0.3 : 0;
                const edgeCurl = t > 0.88 ? (t - 0.88) * 0.12 * Math.sin(px * 4) : 0;
                pos.setZ(i, curveR + bulgePrimary + bulgeSecondary + topCrumple + edgeCurl);
                pos.setY(i, py + (hash(i * 3.7 + cfg.angle * 100) - 0.5) * 0.005 * t);
            }
            plane.computeVertexNormals();
            folds.push({ geo: plane, angle: cfg.angle, color: cfg.color, yOff: cfg.yOff, tilt: cfg.tilt });
        }
        return folds;
    }, []);

    const foldMats = useMemo(() => foldData.map(f => new THREE.MeshPhysicalMaterial({
        color: f.color,
        roughness: 0.68,
        metalness: 0,
        transparent: true,
        opacity: 0.82,
        side: THREE.DoubleSide,
        clearcoat: 0.03,
        clearcoatRoughness: 0.92,
        sheen: 0.06,
        sheenColor: new THREE.Color('#fff0f4'),
        sheenRoughness: 0.88,
    })), [foldData]);

    /* ══════════ 5. Top ruffled edge ══════════ */
    const ruffleGeos = useMemo(() => {
        const ruffles: { geo: THREE.BufferGeometry; angle: number; scale: number }[] = [];
        const count = 10;
        for (let r = 0; r < count; r++) {
            const w = 0.18 + hash(r * 5.1) * 0.08;
            const h = 0.12 + hash(r * 7.3) * 0.06;
            const geo = new THREE.PlaneGeometry(w, h, 8, 6);
            const pos = geo.attributes.position;
            for (let i = 0; i < pos.count; i++) {
                const px = pos.getX(i);
                const py = pos.getY(i);
                const ty = (py + h / 2) / h;
                const curlOut = 0.42 + ty * 0.18 + ty * ty * 0.06;
                const crinkle = Math.sin(px * 25 + r * 4) * 0.012 * (0.5 + ty)
                    + Math.cos(py * 18 + px * 12) * 0.008;
                pos.setZ(i, curlOut + crinkle);
                pos.setY(i, py + ty * ty * 0.08);
            }
            geo.computeVertexNormals();
            ruffles.push({
                geo,
                angle: (r / count) * Math.PI * 2 + hash(r * 2.9) * 0.3,
                scale: 0.9 + hash(r * 11.3) * 0.25,
            });
        }
        return ruffles;
    }, []);

    const ruffleMat = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: '#fce8ef',
        roughness: 0.75,
        metalness: 0,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
        sheen: 0.1,
        sheenColor: new THREE.Color('#fff5f8'),
        sheenRoughness: 0.8,
    }), []);

    /* ══════════ 6. Tissue paper ══════════ */
    const tissueGeos = useMemo(() => {
        return [0, 1, 2, 3].map(idx => {
            const w = 0.38 + hash(idx * 3.7) * 0.12;
            const h = 0.22 + hash(idx * 5.1) * 0.08;
            const geo = new THREE.PlaneGeometry(w, h, 14, 8);
            const pos = geo.attributes.position;
            for (let i = 0; i < pos.count; i++) {
                const px = pos.getX(i);
                const py = pos.getY(i);
                const ty = (py + h / 2) / h;
                const crinkle = Math.sin(px * 22 + idx * 3) * 0.015
                    + Math.cos(py * 28 + px * 15 + idx * 7) * 0.012
                    + Math.sin((px + py) * 35) * 0.006;
                const puff = 0.40 + ty * 0.12 + crinkle;
                const edgeRise = ty * ty * 0.06;
                pos.setZ(i, puff);
                pos.setY(i, py + edgeRise);
            }
            geo.computeVertexNormals();
            return geo;
        });
    }, []);

    const tissueMat = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: '#fff8fa',
        roughness: 0.82,
        metalness: 0,
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide,
        transmission: 0.15,
        thickness: 0.1,
        sheen: 0.12,
        sheenColor: new THREE.Color('#fff0f5'),
        sheenRoughness: 0.7,
    }), []);

    /* ══════════ 7. Satin ribbon ══════════ */
    const ribbonMat = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: '#d81b60',
        roughness: 0.22,
        metalness: 0.08,
        clearcoat: 0.6,
        clearcoatRoughness: 0.15,
        sheen: 0.8,
        sheenColor: new THREE.Color('#ff6090'),
        sheenRoughness: 0.3,
    }), []);

    const knotMat = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: '#ad1457',
        roughness: 0.28,
        metalness: 0.05,
        clearcoat: 0.4,
        clearcoatRoughness: 0.2,
        sheen: 0.6,
        sheenColor: new THREE.Color('#e91e63'),
        sheenRoughness: 0.35,
    }), []);

    const ribbonTailGeo = useMemo(() => {
        const geo = new THREE.PlaneGeometry(0.022, 0.14, 1, 10);
        const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const py = pos.getY(i);
            const t = (py + 0.07) / 0.14;
            pos.setZ(i, Math.sin(t * Math.PI * 1.5) * 0.02);
            pos.setX(i, pos.getX(i) * (1.0 - t * 0.3));
        }
        geo.computeVertexNormals();
        return geo;
    }, []);

    const bowLoopGeo = useMemo(() => {
        const curve = new THREE.CubicBezierCurve3(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0.05, 0.06, 0.02),
            new THREE.Vector3(0.02, 0.08, -0.01),
            new THREE.Vector3(0, 0.005, 0),
        );
        return new THREE.TubeGeometry(curve, 16, 0.008, 6, false);
    }, []);

    return (
        <group position={[0, -0.35, 0]}>
            {/* Main wrapper body */}
            <mesh geometry={wrapperGeo} material={outerMat} castShadow receiveShadow />
            <mesh geometry={wrapperGeo} material={innerMat} scale={[0.96, 0.99, 0.96]} />

            {/* 6 overlapping paper fold sheets */}
            {foldData.map((f, i) => (
                <mesh key={`fold-${i}`} geometry={f.geo} material={foldMats[i]} position={[0, f.yOff, 0]} rotation={[f.tilt, f.angle, 0]} castShadow />
            ))}

            {/* Ruffled top edge petals */}
            {ruffleGeos.map((r, i) => (
                <mesh key={`ruffle-${i}`} geometry={r.geo} material={ruffleMat} position={[0, 0.48, 0]} rotation={[-0.15, r.angle, 0]} scale={r.scale} />
            ))}

            {/* 4 tissue paper sheets */}
            {tissueGeos.map((geo, i) => {
                const a = (i / 4) * Math.PI * 2 + 0.4;
                return (
                    <mesh key={`tissue-${i}`} geometry={geo} material={tissueMat} position={[0, 0.46, 0]} rotation={[0.15 + hash(i * 6.1) * 0.2, a, (hash(i * 9.3) - 0.5) * 0.15]} />
                );
            })}

            {/* Satin ribbon ring */}
            <mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]} material={ribbonMat} castShadow>
                <torusGeometry args={[0.30, 0.016, 12, 48]} />
            </mesh>

            {/* Ribbon bow */}
            <group position={[0, 0.04, 0.31]}>
                <mesh geometry={bowLoopGeo} material={ribbonMat} position={[-0.02, 0, 0]} rotation={[0.1, 0.4, -0.5]} scale={1.1} castShadow />
                <mesh geometry={bowLoopGeo} material={ribbonMat} position={[0.02, 0, 0]} rotation={[0.1, -0.4, 0.5]} scale={[-1.1, 1.1, 1.1]} castShadow />
                <mesh material={knotMat} scale={[1.0, 0.8, 1.0]}>
                    <sphereGeometry args={[0.018, 10, 10]} />
                </mesh>
                <mesh geometry={ribbonTailGeo} material={ribbonMat} position={[-0.025, -0.04, 0.005]} rotation={[0.5, 0.2, -0.35]} castShadow />
                <mesh geometry={ribbonTailGeo} material={ribbonMat} position={[0.025, -0.05, 0.005]} rotation={[0.6, -0.15, 0.3]} scale={[-1, 1, 1]} castShadow />
            </group>
        </group>
    );
}
