import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { SharedGeometryProvider } from './sharedGeometry';
import Scene from './Scene';

export default function Bouquet3D() {
    const isLowPower =
        typeof window !== 'undefined' &&
        (window.innerWidth < 768 || (navigator.hardwareConcurrency ?? 8) <= 4);

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <Canvas
                shadows={!isLowPower}
                camera={{ position: [0, 2.2, 8], fov: 30, near: 0.1, far: 100 }}
                gl={{
                    antialias: !isLowPower,
                    alpha: true,
                    powerPreference: isLowPower ? 'low-power' : 'default',
                    failIfMajorPerformanceCaveat: false,
                }}
                dpr={isLowPower ? [0.7, 1] : [1, 1.5]}
                style={{ background: 'transparent' }}
                onCreated={({ gl }) => {
                    gl.toneMapping = THREE.ACESFilmicToneMapping;
                    gl.toneMappingExposure = 1.2;
                    gl.shadowMap.enabled = !isLowPower;
                    gl.shadowMap.type = THREE.VSMShadowMap;
                }}
            >
                <SharedGeometryProvider>
                    <Scene />
                </SharedGeometryProvider>
            </Canvas>
        </div>
    );
}
