import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface GenieSmokeProps {
    active: boolean;
    burst: boolean;
    pressure: number;
    origin: THREE.Vector3;
    onHeadMove?: (pos: THREE.Vector3) => void;
}

class GenieCurve extends THREE.Curve<THREE.Vector3> {
    private readonly origin: THREE.Vector3;
    private readonly height: number;
    private readonly spin: number;
    private readonly startRadius: number;
    private readonly endRadius: number;
    private readonly wobble: number;
    private readonly phase: number;
    private readonly jitter: number;

    constructor(
        origin: THREE.Vector3,
        height: number,
        spin: number,
        startRadius: number,
        endRadius: number,
        wobble: number,
        phase: number,
        jitter: number,
    ) {
        super();
        this.origin = origin;
        this.height = height;
        this.spin = spin;
        this.startRadius = startRadius;
        this.endRadius = endRadius;
        this.wobble = wobble;
        this.phase = phase;
        this.jitter = jitter;
    }

    getPoint(t: number, target = new THREE.Vector3()) {
        const radius = THREE.MathUtils.lerp(this.startRadius, this.endRadius, t);
        const angle = this.spin * Math.PI * 2 * t + this.phase;
        const waveX = Math.sin(t * 9 + this.phase * 0.9) * this.wobble;
        const waveZ = Math.cos(t * 8 + this.phase * 0.7) * this.wobble;
        const noise = Math.sin((t * 17 + this.phase * 2.1) * 1.7) * this.jitter;

        target.set(
            this.origin.x + Math.cos(angle) * radius + waveX + noise * 0.35,
            this.origin.y + t * this.height,
            this.origin.z + Math.sin(angle) * radius + waveZ - noise * 0.2,
        );
        return target;
    }
}

export default function GenieSmoke({ active, burst, pressure, origin, onHeadMove }: GenieSmokeProps) {
    const tubeRef = useRef<THREE.Mesh>(null);
    const cloudRef = useRef<THREE.Mesh>(null);
    const leakRefs = useRef<Array<THREE.Mesh | null>>([]);
    const genieRef = useRef<THREE.Mesh>(null);
    const headPos = useRef(new THREE.Vector3(origin.x, origin.y, origin.z));

    const flowRef = useRef(0);
    const burstRef = useRef(0);
    const phaseRef = useRef(0);

    const tubeMaterial = useMemo(
        () =>
            new THREE.MeshPhysicalMaterial({
                color: new THREE.Color('#8eb6ff'),
                emissive: new THREE.Color('#7f95ff'),
                emissiveIntensity: 0.4,
                roughness: 0.2,
                metalness: 0.05,
                transparent: true,
                opacity: 0,
                transmission: 0.55,
                thickness: 0.45,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
            }),
        [],
    );

    const cloudMaterial = useMemo(
        () =>
            new THREE.MeshStandardMaterial({
                color: new THREE.Color('#a5c1ff'),
                emissive: new THREE.Color('#89a6ff'),
                emissiveIntensity: 0.2,
                roughness: 0.35,
                metalness: 0.08,
                transparent: true,
                opacity: 0,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
            }),
        [],
    );

    const genieMaterial = useMemo(
        () =>
            new THREE.MeshPhysicalMaterial({
                color: new THREE.Color('#7f9fff'),
                emissive: new THREE.Color('#6d85ff'),
                emissiveIntensity: 0.25,
                roughness: 0.3,
                metalness: 0.1,
                transparent: true,
                opacity: 0,
                transmission: 0.35,
                thickness: 0.3,
                depthWrite: false,
            }),
        [],
    );

    const starterGeo = useMemo(() => {
        const curve = new GenieCurve(origin, 0.01, 2, 0.05, 0.06, 0.01, 0, 0);
        return new THREE.TubeGeometry(curve, 20, 0.03, 14, false);
    }, [origin]);

    useFrame((state, delta) => {
        const flowTarget = active ? 1 : 0;
        const flowSpeed = active ? (burst ? 6.2 : 2.2) : 1.6;
        flowRef.current += (flowTarget - flowRef.current) * Math.min(1, delta * flowSpeed);

        const burstTarget = burst ? 1 : 0;
        burstRef.current += (burstTarget - burstRef.current) * Math.min(1, delta * 7.5);
        phaseRef.current += delta * (1.4 + burstRef.current * 1.8);

        const flow = flowRef.current;
        const burstEnergy = burstRef.current;
        const height = 2.3 * flow + 1.9 * burstEnergy;
        const jitter = 0.015 + 0.06 * burstEnergy;
        const wobble = 0.02 + 0.05 * flow + 0.04 * burstEnergy;
        const curve = new GenieCurve(
            origin,
            Math.max(0.01, height),
            2.4 + burstEnergy * 1.1,
            0.05,
            0.18 + flow * 0.15 + burstEnergy * 0.08,
            wobble,
            phaseRef.current,
            jitter,
        );

        if (tubeRef.current) {
            const tubeRadius = 0.04 + flow * 0.045 + burstEnergy * 0.025;
            const nextGeo = new THREE.TubeGeometry(curve, 120, tubeRadius, 16, false);
            tubeRef.current.geometry.dispose();
            tubeRef.current.geometry = nextGeo;

            const mat = tubeRef.current.material as THREE.MeshPhysicalMaterial;
            mat.opacity = 0.05 + flow * 0.55 + burstEnergy * 0.3;
            mat.emissiveIntensity = 0.35 + flow * 0.45 + burstEnergy * 0.55;
        }

        curve.getPoint(1, headPos.current);
        if (onHeadMove) {
            onHeadMove(headPos.current);
        }

        if (cloudRef.current) {
            const cloud = cloudRef.current;
            const cloudScale = 0.3 + flow * 0.7 + burstEnergy * 0.25;
            cloud.position.set(
                headPos.current.x,
                headPos.current.y + 0.06 + Math.sin(state.clock.elapsedTime * 2.2) * 0.05,
                headPos.current.z,
            );
            cloud.scale.set(cloudScale * 1.1, cloudScale, cloudScale * 1.1);

            const mat = cloud.material as THREE.MeshStandardMaterial;
            mat.opacity = 0.08 + flow * 0.62 + burstEnergy * 0.12;
            mat.emissiveIntensity = 0.15 + flow * 0.55 + burstEnergy * 0.2;
        }

        leakRefs.current.forEach((mesh, idx) => {
            if (!mesh) return;
            const leakLift = 0.03 + pressure * 0.25 + burstEnergy * 0.22;
            const wiggle = Math.sin(state.clock.elapsedTime * (6 + idx) + idx * 1.7) * 0.04;
            mesh.position.set(origin.x + wiggle * 0.6, origin.y + leakLift + idx * 0.02, origin.z + wiggle * 0.35);
            const scale = 0.08 + pressure * 0.22 + burstEnergy * 0.2;
            mesh.scale.set(scale, scale * 0.9, scale);

            const mat = mesh.material as THREE.MeshStandardMaterial;
            mat.opacity = 0.05 + pressure * 0.35 + burstEnergy * 0.28;
            mat.emissiveIntensity = 0.1 + pressure * 0.3 + burstEnergy * 0.3;
        });

        if (genieRef.current) {
            const reveal = Math.max(0, flow - 0.2);
            const floatY = Math.sin(state.clock.elapsedTime * 1.5) * 0.11;
            const genieScale = 0.45 + reveal * 0.52;

            genieRef.current.position.set(headPos.current.x, headPos.current.y + 0.2 + floatY, headPos.current.z);
            genieRef.current.scale.set(genieScale, genieScale * 1.32, genieScale);

            const mat = genieRef.current.material as THREE.MeshPhysicalMaterial;
            mat.opacity = 0.03 + reveal * 0.67;
            mat.emissiveIntensity = 0.22 + reveal * 0.58;
        }
    });

    return (
        <group>
            <mesh ref={tubeRef} geometry={starterGeo} material={tubeMaterial} />

            <mesh ref={cloudRef} material={cloudMaterial}>
                <sphereGeometry args={[0.45, 20, 20]} />
            </mesh>

            {[0, 1, 2].map((idx) => (
                <mesh
                    key={idx}
                    ref={(el) => {
                        leakRefs.current[idx] = el;
                    }}
                    position={[origin.x, origin.y, origin.z]}
                >
                    <sphereGeometry args={[0.1, 12, 12]} />
                    <meshStandardMaterial
                        color={new THREE.Color('#93b7ff')}
                        emissive={new THREE.Color('#7f9fff')}
                        roughness={0.35}
                        metalness={0.05}
                        transparent
                        opacity={0.15}
                        depthWrite={false}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            ))}

            <mesh ref={genieRef} material={genieMaterial}>
                <capsuleGeometry args={[0.24, 0.7, 12, 18]} />
            </mesh>
        </group>
    );
}
