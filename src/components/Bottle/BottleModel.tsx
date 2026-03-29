import { useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';

interface BottleModelProps {
    progress: number; // 0 = sealed, 1 = open
    vibrationRef: MutableRefObject<number>;
    paperEmergenceRef: MutableRefObject<number>;
    onPaperClick?: () => void;
}

export default function BottleModel({ progress, vibrationRef, paperEmergenceRef, onPaperClick }: BottleModelProps) {
    const groupRef = useRef<THREE.Group>(null);
    const glowRef = useRef<THREE.Mesh>(null);
    const envelopeRef = useRef<THREE.Group>(null);
    const flapRef = useRef<THREE.Mesh>(null);
    const auraRef = useRef<THREE.Mesh>(null);

    const lathePoints = useMemo(() => {
        const p: THREE.Vector2[] = [];
        p.push(new THREE.Vector2(0.0, 0.0));
        p.push(new THREE.Vector2(0.92, 0.0));
        p.push(new THREE.Vector2(1.05, 0.22));
        p.push(new THREE.Vector2(1.18, 0.5));
        p.push(new THREE.Vector2(1.3, 0.9));
        p.push(new THREE.Vector2(1.28, 1.3));
        p.push(new THREE.Vector2(1.05, 1.7));
        p.push(new THREE.Vector2(0.7, 2.5));
        p.push(new THREE.Vector2(0.55, 3.0));
        p.push(new THREE.Vector2(0.4, 3.4));
        p.push(new THREE.Vector2(0.38, 3.7));
        p.push(new THREE.Vector2(0.42, 3.95));
        p.push(new THREE.Vector2(0.45, 4.25));
        p.push(new THREE.Vector2(0.48, 4.55));
        return p;
    }, []);

    const envelopeFlapGeometry = useMemo(() => {
        const shape = new THREE.Shape();
        shape.moveTo(-0.48, -0.01);
        shape.lineTo(0.48, -0.01);
        shape.lineTo(0, 0.42);
        shape.lineTo(-0.48, -0.01);
        return new THREE.ShapeGeometry(shape, 1);
    }, []);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (glowRef.current) {
            const mat = glowRef.current.material as THREE.MeshBasicMaterial;
            mat.opacity = 0.32 + Math.sin(t * 1.3) * 0.06 + progress * 0.15;
        }

        if (envelopeRef.current) {
            const emergeRaw = THREE.MathUtils.clamp(paperEmergenceRef.current, 0, 1);
            const emerge = THREE.MathUtils.smoothstep(emergeRaw, 0, 1);
            const vib = THREE.MathUtils.clamp(vibrationRef.current, 0, 1);
            const wave = Math.sin(t * 2.4) * 0.05 + Math.cos(t * 1.7) * 0.03;

            // Envelope rises from bottle and gently sways.
            const baseY = THREE.MathUtils.lerp(0.9, 5.2, emerge);
            const baseX = 0.04 + Math.sin(t * 1.3) * 0.03 * emerge;
            const baseZ = 0.12 + Math.cos(t * 1.4) * 0.02 * emerge;

            const unfold = THREE.MathUtils.smoothstep(emerge, 0.12, 0.82);
            const scaleX = THREE.MathUtils.lerp(0.58, 1.1, unfold);
            const scaleY = THREE.MathUtils.lerp(0.62, 1.06, unfold);
            const scaleZ = THREE.MathUtils.lerp(0.62, 1.0, unfold);

            const rx = THREE.MathUtils.lerp(0.24, 0.03, unfold) + wave * 0.03 + Math.sin(t * (10 + vib * 16)) * 0.004 * vib;
            const ry = 0.54 + Math.sin(t * 1.8) * 0.12 * emerge;
            const rz = THREE.MathUtils.lerp(-0.24, -0.02, unfold) + Math.cos(t * (11 + vib * 12)) * 0.005 * vib;

            envelopeRef.current.position.set(baseX, baseY + Math.sin(t * 2.2) * 0.05 * emerge, baseZ);
            envelopeRef.current.rotation.set(rx, ry, rz);
            envelopeRef.current.scale.set(scaleX, scaleY, scaleZ);

            if (flapRef.current) {
                const flapJitter = Math.sin(t * 2.8) * 0.03 * emerge;
                flapRef.current.rotation.x = THREE.MathUtils.lerp(-0.06, 0.16, unfold) + flapJitter;
            }

            if (auraRef.current) {
                auraRef.current.position.set(0, 0, -0.03);
                auraRef.current.scale.set(1 + emerge * 0.3, 1 + emerge * 0.2, 1);
                const auraMat = auraRef.current.material as THREE.MeshBasicMaterial;
                auraMat.opacity = 0.04 + emerge * 0.24;
            }
        }
    });

    return (
        <group ref={groupRef} position={[0, -2.8, 0]}>
            <mesh castShadow receiveShadow>
                <latheGeometry args={[lathePoints, 96]} />
                <meshPhysicalMaterial
                    transparent
                    opacity={0.82}
                    metalness={0.04}
                    roughness={0.06}
                    transmission={0.93}
                    thickness={0.5}
                    envMapIntensity={1.3}
                    color={new THREE.Color('#cfe0ff')}
                    attenuationColor={new THREE.Color('#f1d4ff')}
                    attenuationDistance={5}
                />
            </mesh>

            {/* Inner glow */}
            <mesh ref={glowRef} position={[0, 1.2, 0]} scale={1 + progress * 0.06} renderOrder={-1}>
                <sphereGeometry args={[0.65, 32, 32]} />
                <meshBasicMaterial color="#ff9bd4" transparent opacity={0.36} blending={THREE.AdditiveBlending} />
            </mesh>

            {/* Liquid */}
            <mesh position={[0, 0.5, 0]}>
                <cylinderGeometry args={[1.0, 1.15, 1.3, 56]} />
                <meshPhysicalMaterial
                    transparent
                    opacity={0.62}
                    metalness={0.02}
                    roughness={0.22}
                    color={new THREE.Color('#f6baff')}
                    emissive={new THREE.Color('#d777c5')}
                    emissiveIntensity={0.35 + progress * 0.2}
                />
            </mesh>

            {/* Envelope that rises from bottle */}
            <group
                ref={envelopeRef}
                position={[0.04, 0.9, 0.12]}
                rotation={[0.06, 0.54, -0.08]}
                onClick={(event: ThreeEvent<MouseEvent>) => {
                    event.stopPropagation();
                    if (paperEmergenceRef.current > 0.75 && onPaperClick) {
                        onPaperClick();
                    }
                }}
                onPointerOver={() => {
                    if (paperEmergenceRef.current > 0.75) {
                        document.body.style.cursor = 'pointer';
                    }
                }}
                onPointerOut={() => {
                    document.body.style.cursor = 'auto';
                }}
            >
                {/* Soft glow aura around envelope */}
                <mesh ref={auraRef}>
                    <planeGeometry args={[0.95, 0.54]} />
                    <meshBasicMaterial
                        color="#9fc0ff"
                        transparent
                        opacity={0.05}
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                    />
                </mesh>

                {/* Envelope body */}
                <mesh castShadow receiveShadow position={[0, -0.02, 0]}>
                    <planeGeometry args={[0.98, 0.62]} />
                    <meshStandardMaterial
                        color="#f2e2bf"
                        roughness={0.86}
                        metalness={0.0}
                        side={THREE.DoubleSide}
                    />
                </mesh>

                {/* Lower fold */}
                <mesh position={[0, -0.2, 0.01]} castShadow>
                    <planeGeometry args={[0.8, 0.28]} />
                    <meshStandardMaterial color="#e6d2a8" roughness={0.9} metalness={0.0} side={THREE.DoubleSide} />
                </mesh>

                {/* Top flap */}
                <mesh ref={flapRef} geometry={envelopeFlapGeometry} position={[0, 0.12, 0.02]} castShadow>
                    <meshStandardMaterial color="#ecd8b1" roughness={0.88} metalness={0.0} side={THREE.DoubleSide} />
                </mesh>

                {/* Seal accent */}
                <mesh position={[0, -0.05, 0.03]} castShadow>
                    <circleGeometry args={[0.08, 28]} />
                    <meshStandardMaterial color="#c65f73" roughness={0.45} metalness={0.05} />
                </mesh>
            </group>
        </group>
    );
}