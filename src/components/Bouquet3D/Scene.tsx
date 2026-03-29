import { OrbitControls, Float, Html } from '@react-three/drei';
import BouquetAssembly from './BouquetAssembly';
import FallingPetals from './FallingPetals';
import { Vignette } from './Effects';

export default function Scene() {
    return (
        <>
            {/* Soft warm ambient fill */}
            <ambientLight intensity={0.5} color="#fff0f3" />

            {/* Key light: warm directional from upper-right front */}
            <directionalLight
                position={[5, 8, 6]}
                intensity={1.1}
                color="#fff8f0"
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-camera-near={1}
                shadow-camera-far={25}
                shadow-camera-left={-5}
                shadow-camera-right={5}
                shadow-camera-top={5}
                shadow-camera-bottom={-5}
                shadow-bias={-0.0005}
                shadow-radius={4}
            />

            {/* Fill light: cooler, softer, from left */}
            <directionalLight position={[-5, 4, 3]} intensity={0.45} color="#e8d5e0" />

            {/* Rim / back light */}
            <pointLight position={[0, 3, -6]} intensity={1.0} color="#fda4af" distance={18} decay={2} />

            {/* Subtle top accent */}
            <pointLight position={[2, 8, 2]} intensity={0.35} color="#fff5f7" distance={15} decay={2} />

            {/* Warm bottom bounce for wrapper */}
            <pointLight position={[0, -3, 3]} intensity={0.2} color="#fce4ec" distance={10} decay={2} />

            {/* Side accent for depth */}
            <pointLight position={[-4, 1, 4]} intensity={0.2} color="#f9a8d4" distance={12} decay={2} />

            {/* Ground shadow plane */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.2, 0]} receiveShadow>
                <circleGeometry args={[6, 32]} />
                <shadowMaterial transparent opacity={0.06} />
            </mesh>

            {/* Bouquet with very subtle float */}
            <Float speed={0.6} rotationIntensity={0.03} floatIntensity={0.12}>
                <BouquetAssembly />
            </Float>

            <FallingPetals />

            {/* Subtle vignette */}
            <Vignette />

            {/* Label */}
            <Html position={[0, -3.4, 0]} center>
                <div style={{
                    fontFamily: "'Georgia', serif",
                    fontStyle: 'italic',
                    fontSize: '18px',
                    color: '#e11d48',
                    textShadow: '0 2px 16px rgba(225,29,72,0.25)',
                    whiteSpace: 'nowrap',
                    userSelect: 'none',
                    pointerEvents: 'none',
                    letterSpacing: '0.06em',
                }}>
                    For Angela Kate &#9829;
                </div>
            </Html>

            <OrbitControls
                enableZoom
                enablePan={false}
                autoRotate
                autoRotateSpeed={7.5}
                minDistance={5}
                maxDistance={14}
                minPolarAngle={Math.PI / 5}
                maxPolarAngle={Math.PI / 1.85}
            />
        </>
    );
}
