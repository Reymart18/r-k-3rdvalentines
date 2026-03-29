import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import BottleModel from './BottleModel';
import Cap from './Cap';
import CapOpener from './CapOpener';
import GenieSmoke from './GenieSmoke';

interface SceneProps {
    isOpen: boolean;
    onOpen: () => void;
    onPaperClick?: () => void;
}

function Lights({ isOpen }: { isOpen: boolean }) {
    return (
        <>
            <ambientLight intensity={0.45} color="#f5d3ff" />
            <directionalLight
                position={[4, 6, 5]}
                intensity={1.5}
                color="#ffd6f4"
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-near={0.5}
                shadow-camera-far={18}
                shadow-camera-left={-8}
                shadow-camera-right={8}
                shadow-camera-top={8}
                shadow-camera-bottom={-8}
                shadow-bias={-0.0006}
            />
            <spotLight position={[-3, 5, 2]} angle={0.6} penumbra={0.6} intensity={1.2} color="#ffe2c8" castShadow />
            <pointLight position={[0, 2.4, 2]} intensity={isOpen ? 1.3 : 0.8} color={isOpen ? '#ffb6e7' : '#c08aff'} />
            <pointLight position={[0, 1.2, -2]} intensity={0.5} color="#5ad8ff" />
        </>
    );
}

export default function Scene({ isOpen, onOpen, onPaperClick }: SceneProps) {
    const progress = useRef(0);
    const pressureRef = useRef(0);
    const preShakeTimerRef = useRef(0);
    const burstShakeRef = useRef(0);
    const paperVibrationRef = useRef(0);
    const paperLiftRef = useRef(0);
    const paperTriggeredRef = useRef(false);
    const bottleGroupRef = useRef<THREE.Group>(null);
    const innerLightRef = useRef<THREE.PointLight>(null);
    const smokeHeadRef = useRef(new THREE.Vector3(0, 1.15, 0));
    const streamOrigin = useMemo(() => new THREE.Vector3(0, 2.15, 0), []);

    const [isBursting, setIsBursting] = useState(false);
    const [flowActive, setFlowActive] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setIsBursting(false);
            setFlowActive(false);
            paperTriggeredRef.current = false;
            return;
        }

        // Always start paper emergence when release starts.
        paperTriggeredRef.current = true;
        setFlowActive(true);
        setIsBursting(true);
        burstShakeRef.current = 1.35;

        const timer = setTimeout(() => setIsBursting(false), 600);
        return () => clearTimeout(timer);
    }, [isOpen]);

    useFrame((_, delta) => {
        const target = isOpen ? 1 : 0;
        progress.current += (target - progress.current) * Math.min(1, delta * 4.5);

        if (!isOpen) {
            preShakeTimerRef.current = Math.min(4.5, preShakeTimerRef.current + delta);
        } else {
            preShakeTimerRef.current = Math.max(0, preShakeTimerRef.current - delta * 3.2);
        }

        const build = THREE.MathUtils.clamp(preShakeTimerRef.current / 4.5, 0, 1);
        pressureRef.current = build;
        burstShakeRef.current = Math.max(0, burstShakeRef.current - delta * 2.3);
        paperVibrationRef.current = build * 0.35 + burstShakeRef.current * 0.32;

        // Envelope must stay inside until bottle is opened.
        const paperTarget = isOpen && paperTriggeredRef.current ? 1 : 0;
        const liftSpeed = isOpen ? 1.6 : 2.1;
        paperLiftRef.current += (paperTarget - paperLiftRef.current) * Math.min(1, delta * liftSpeed);

        if (bottleGroupRef.current) {
            const t = performance.now() * 0.001;
            const pre = build;
            const recoil = burstShakeRef.current;
            const preAmp = THREE.MathUtils.lerp(0.0025, 0.032, pre);
            const preFreq = THREE.MathUtils.lerp(6, 28, pre);

            const vibX = Math.sin(t * preFreq) * preAmp;
            const vibZ = Math.cos(t * (preFreq * 1.15)) * preAmp * 0.92;

            bottleGroupRef.current.rotation.set(
                vibX - recoil * 0.07,
                Math.cos(t * 0.006) * 0.002 * pre,
                vibZ + recoil * 0.05,
            );
            bottleGroupRef.current.position.y = -recoil * 0.035;
        }

        if (innerLightRef.current) {
            const t = performance.now() * 0.016;
            const flicker = Math.sin(t) * 0.08 + Math.sin(t * 0.67) * 0.05;
            const base = 0.5 + build * 0.55;
            const burstBoost = isBursting ? 1.45 : 0.3;
            const targetIntensity = base + burstBoost + flicker * build;

            innerLightRef.current.intensity += (targetIntensity - innerLightRef.current.intensity) * Math.min(1, delta * 5);

            const targetPos = isOpen
                ? smokeHeadRef.current.clone().multiplyScalar(0.78).add(new THREE.Vector3(0, 0.35, 0))
                : new THREE.Vector3(0, 1.15, 0);
            innerLightRef.current.position.lerp(targetPos, Math.min(1, delta * 3));
        }
    });

    return (
        <>
            <Lights isOpen={isOpen} />

            {/* Ground shadow catcher */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.8, 0]} receiveShadow>
                <circleGeometry args={[6, 64]} />
                <shadowMaterial transparent opacity={0.12} />
            </mesh>

            <group ref={bottleGroupRef}>
                <BottleModel
                    progress={progress.current}
                    vibrationRef={paperVibrationRef}
                    paperEmergenceRef={paperLiftRef}
                    onPaperClick={onPaperClick}
                />
                <Cap isOpen={isOpen} />

                <GenieSmoke
                    active={flowActive}
                    burst={isBursting}
                    pressure={pressureRef.current}
                    origin={streamOrigin}
                    onHeadMove={(pos) => smokeHeadRef.current.copy(pos)}
                />

                <pointLight
                    ref={innerLightRef}
                    position={[0, 1.15, 0]}
                    color="#95b8ff"
                    intensity={0.8}
                    distance={6.4}
                    decay={2.1}
                />
            </group>
            <CapOpener onOpen={onOpen} />

        </>
    );
}