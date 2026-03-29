import { useMemo, createContext, useContext } from 'react';
import * as THREE from 'three';
import type { SharedGeo } from './types';

const GeoContext = createContext<SharedGeo | null>(null);

export function useSharedGeo(): SharedGeo {
    const ctx = useContext(GeoContext);
    if (!ctx) throw new Error('GeoContext missing');
    return ctx;
}

/* ─── Parametric rose petal builder ─── */
function makePetalGeo(w: number, h: number, curl: number, inward: boolean, sW: number, sH: number): THREE.BufferGeometry {
    const verts: number[] = [], uvs: number[] = [], idx: number[] = [];
    for (let iv = 0; iv <= sH; iv++) {
        const v = iv / sH;
        for (let iu = 0; iu <= sW; iu++) {
            const u = iu / sW;
            const uc = u - 0.5;
            const ws = Math.sin(v * Math.PI) * (1.0 - v * 0.12);
            const x = uc * w * ws;
            const y = v * h;
            const cup = (1 - v * 0.3) * uc * uc * 4.0 * w;
            const dir = inward ? 1 : -1;
            const lc = dir * curl * v * v * v;
            const sc = Math.sin(uc * Math.PI) * v * v * 0.015;
            const z = -cup + lc + sc;
            verts.push(x, y, z);
            uvs.push(u, v);
        }
    }
    for (let iv = 0; iv < sH; iv++)
        for (let iu = 0; iu < sW; iu++) {
            const a = iv * (sW + 1) + iu, b = a + 1, c = a + (sW + 1), d = c + 1;
            idx.push(a, c, b, b, c, d);
        }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    return geo;
}

export function SharedGeometryProvider({ children }: { children: React.ReactNode }) {
    const geos = useMemo<SharedGeo>(() => {
        const petalInner = makePetalGeo(0.055, 0.09, 0.11, true, 8, 10);
        const petalMid = makePetalGeo(0.095, 0.14, 0.055, true, 10, 12);
        const petalOuter = makePetalGeo(0.13, 0.17, 0.075, false, 10, 12);

        const fpShape = new THREE.Shape();
        fpShape.moveTo(0, 0);
        fpShape.bezierCurveTo(0.03, 0.05, 0.06, 0.08, 0.02, 0.12);
        fpShape.bezierCurveTo(0, 0.14, -0.02, 0.12, -0.02, 0.12);
        fpShape.bezierCurveTo(-0.06, 0.08, -0.03, 0.05, 0, 0);
        const fpGeo = new THREE.ExtrudeGeometry(fpShape, { depth: 0.003, bevelEnabled: false });

        const leafShape = new THREE.Shape();
        leafShape.moveTo(0, 0);
        leafShape.bezierCurveTo(0.04, 0.06, 0.08, 0.12, 0.03, 0.2);
        leafShape.bezierCurveTo(0.01, 0.24, -0.01, 0.24, -0.03, 0.2);
        leafShape.bezierCurveTo(-0.08, 0.12, -0.04, 0.06, 0, 0);
        const leafGeo = new THREE.ExtrudeGeometry(leafShape, {
            steps: 1, depth: 0.003, bevelEnabled: false,
        });

        return {
            petalInner, petalMid, petalOuter,
            fallingPetal: fpGeo,
            leaf: leafGeo,
            sepal: new THREE.SphereGeometry(1, 5, 5),
            bud: new THREE.SphereGeometry(0.028, 10, 10),
        };
    }, []);

    return <GeoContext.Provider value={geos}>{children}</GeoContext.Provider>;
}
