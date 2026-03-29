import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { SharedGeometryProvider } from './sharedGeometry';
import Scene from './Scene';

export default function Bouquet3D() {
    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <Canvas
                shadows
                camera={{ position: [0, 2.2, 8], fov: 30, near: 0.1, far: 100 }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'default',
                    failIfMajorPerformanceCaveat: false,
                }}
                dpr={[1, 1.5]}
                style={{ background: 'transparent' }}
                onCreated={({ gl }) => {
                    gl.toneMapping = THREE.ACESFilmicToneMapping;
                    gl.toneMappingExposure = 1.2;
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
