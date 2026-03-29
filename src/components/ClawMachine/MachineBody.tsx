import { useMemo } from 'react';
import * as THREE from 'three';
import GlassPanel from './GlassPanel';
import Joystick3D from './Joystick3D';

interface MachineBodyProps {
    onJoystick?: (dir: 'left' | 'right' | 'forward' | 'back') => void;
    onGrab?: () => void;
    joystickTilt?: { x: number; z: number };
}

export default function MachineBody({ onJoystick, onGrab, joystickTilt }: MachineBodyProps) {
    // Machine colors — soft cream/pink tones for romantic look
    const bodyMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#f5e6ec',
        roughness: 0.6,
        metalness: 0.05,
    }), []);

    const baseMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#e8d0da',
        roughness: 0.5,
        metalness: 0.1,
    }), []);

    const topMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#f0dce4',
        roughness: 0.55,
        metalness: 0.08,
    }), []);

    const trimMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#d4a0b8',
        roughness: 0.3,
        metalness: 0.4,
    }), []);

    const darkMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#2a1520',
        roughness: 0.9,
        metalness: 0,
    }), []);

    const chromeMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#c0c0c0',
        roughness: 0.25,
        metalness: 0.85,
    }), []);

    // ============ DIMENSIONS ============
    const W = 5.5;
    const D = 4.5;
    const glassH = 7.0;
    const baseH = 2.2;
    const topH = 1.8;
    const totalH = baseH + glassH + topH;

    const baseY = -totalH / 2 + baseH / 2;
    const glassBottomY = baseY + baseH / 2;
    const glassMidY = glassBottomY + glassH / 2;
    const topY = glassBottomY + glassH + topH / 2;

    // Internal prize drop zone — left side inside the glass compartment
    const dropZoneW = 1.4;
    const dropZoneD = D - 0.6;
    const dropZoneX = -W / 2 + dropZoneW / 2 + 0.2;

    return (
        <group>
            {/* ======================== BASE ======================== */}
            <group position={[0, baseY, 0]}>
                <mesh castShadow receiveShadow>
                    <boxGeometry args={[W + 0.2, baseH, D + 0.2]} />
                    <primitive object={baseMat} attach="material" />
                </mesh>

                {/* Bottom trim */}
                <mesh position={[0, -baseH / 2 + 0.06, 0]} castShadow>
                    <boxGeometry args={[W + 0.35, 0.12, D + 0.35]} />
                    <primitive object={trimMat} attach="material" />
                </mesh>

                {/* Prize pickup door on front-left */}
                <mesh position={[dropZoneX, -0.1, D / 2 + 0.11]} castShadow>
                    <boxGeometry args={[1.6, 1.2, 0.08]} />
                    <meshStandardMaterial color="#e0c0d0" roughness={0.5} metalness={0.1} />
                </mesh>
                {/* Door opening — recessed dark */}
                <mesh position={[dropZoneX, -0.35, D / 2 + 0.08]}>
                    <boxGeometry args={[1.2, 0.7, 0.05]} />
                    <primitive object={darkMat} attach="material" />
                </mesh>
                {/* Door trim */}
                <mesh position={[dropZoneX, -0.1, D / 2 + 0.16]} castShadow>
                    <boxGeometry args={[1.7, 1.3, 0.02]} />
                    <primitive object={trimMat} attach="material" />
                </mesh>
            </group>

            {/* ======================== CORNER PILLARS ======================== */}
            {[
                [-W / 2, 0, -D / 2],
                [W / 2, 0, -D / 2],
                [-W / 2, 0, D / 2],
                [W / 2, 0, D / 2],
            ].map(([x, _, z], i) => (
                <mesh key={`pillar-${i}`} position={[x, glassMidY, z]} castShadow>
                    <boxGeometry args={[0.2, glassH, 0.2]} />
                    <primitive object={bodyMat} attach="material" />
                </mesh>
            ))}

            {/* Pillar trim strips */}
            {[
                [-W / 2, 0, -D / 2],
                [W / 2, 0, -D / 2],
                [-W / 2, 0, D / 2],
                [W / 2, 0, D / 2],
            ].map(([x, _, z], i) => (
                <mesh key={`pillar-trim-${i}`} position={[x, glassMidY, z]}>
                    <boxGeometry args={[0.24, glassH + 0.1, 0.05]} />
                    <primitive object={trimMat} attach="material" />
                </mesh>
            ))}

            {/* ======================== GLASS PANELS ======================== */}
            <GlassPanel position={[0, glassMidY, D / 2 - 0.02]} size={[W - 0.22, glassH - 0.1]} />
            <mesh position={[0, glassMidY, -D / 2 + 0.02]} receiveShadow>
                <boxGeometry args={[W - 0.22, glassH - 0.1, 0.08]} />
                <primitive object={bodyMat} attach="material" />
            </mesh>
            {/* Left glass — upper portion only, leaving drop zone open at bottom */}
            <GlassPanel position={[-W / 2 + 0.02, glassMidY + 1.3, 0]} rotation={[0, Math.PI / 2, 0]} size={[D - 0.22, glassH - 2.7]} />
            <GlassPanel position={[W / 2 - 0.02, glassMidY, 0]} rotation={[0, Math.PI / 2, 0]} size={[D - 0.22, glassH - 0.1]} />

            {/* ======================== INTERNAL PRIZE DROP ZONE (left side inside — open top) ======================== */}
            {/* Short divider wall — front half only (over the hole), back half open for hearts */}
            <mesh position={[dropZoneX + dropZoneW / 2 + 0.04, glassBottomY + 1.0, dropZoneD / 4]} castShadow>
                <boxGeometry args={[0.08, 2.0, dropZoneD / 2]} />
                <meshStandardMaterial color="#e8d0da" roughness={0.5} metalness={0.1} transparent opacity={0.85} />
            </mesh>
            {/* Divider trim top edge — front half only */}
            <mesh position={[dropZoneX + dropZoneW / 2 + 0.04, glassBottomY + 2.05, dropZoneD / 4]}>
                <boxGeometry args={[0.14, 0.1, dropZoneD / 2 + 0.05]} />
                <primitive object={trimMat} attach="material" />
            </mesh>

            {/* Drop zone hole — front half is a dark hole, back half is floor */}
            <mesh position={[dropZoneX, glassBottomY - 0.05, dropZoneD / 4]}>
                <boxGeometry args={[dropZoneW, 0.3, dropZoneD / 2]} />
                <meshStandardMaterial color="#000000" roughness={1} metalness={0} />
            </mesh>
            {/* Floor on the back half */}
            <mesh position={[dropZoneX, glassBottomY + 0.06, -dropZoneD / 4]} receiveShadow>
                <boxGeometry args={[dropZoneW - 0.1, 0.1, dropZoneD / 2]} />
                <meshStandardMaterial color="#f0d0e0" roughness={0.6} />
            </mesh>
            {/* Top cover over the hole area so the space is clearly visible */}
            <mesh position={[dropZoneX, glassBottomY + 2.05, dropZoneD / 4]}>
                <boxGeometry args={[dropZoneW, 0.1, dropZoneD / 2]} />
                <meshStandardMaterial color="#e8d0da" roughness={0.5} metalness={0.1} transparent opacity={0.6} />
            </mesh>

            {/* Back wall of drop zone (so hearts don't visually fly through) */}
            <mesh position={[dropZoneX - dropZoneW / 2 + 0.06, glassBottomY + 1.0, 0]}>
                <boxGeometry args={[0.06, 2.0, dropZoneD]} />
                <meshStandardMaterial color="#e8d0da" roughness={0.5} metalness={0.1} />
            </mesh>

            {/* "PRIZE" label on divider wall top */}
            <mesh position={[dropZoneX + dropZoneW / 2 + 0.09, glassBottomY + 1.7, 0]}>
                <boxGeometry args={[0.02, 0.3, 1.0]} />
                <meshStandardMaterial color="#f9a8c8" roughness={0.4} emissive="#f9a8c8" emissiveIntensity={0.2} />
            </mesh>

            {/* Soft light inside drop zone */}
            <pointLight
                position={[dropZoneX, glassBottomY + 1.5, 0]}
                intensity={0.4}
                color="#f9a8c8"
                distance={5}
                decay={2}
            />

            {/* ======================== TOP HOUSING ======================== */}
            <group position={[0, topY, 0]}>
                <mesh castShadow receiveShadow>
                    <boxGeometry args={[W + 0.2, topH, D + 0.2]} />
                    <primitive object={topMat} attach="material" />
                </mesh>

                {/* Top crown trim */}
                <mesh position={[0, topH / 2 - 0.05, 0]} castShadow>
                    <boxGeometry args={[W + 0.35, 0.12, D + 0.35]} />
                    <primitive object={trimMat} attach="material" />
                </mesh>

                {/* Bottom trim of top housing */}
                <mesh position={[0, -topH / 2 + 0.05, 0]} castShadow>
                    <boxGeometry args={[W + 0.35, 0.1, D + 0.35]} />
                    <primitive object={trimMat} attach="material" />
                </mesh>

                {/* Claw rail slot — dark track */}
                <mesh position={[0, -topH / 2 + 0.05, 0]}>
                    <boxGeometry args={[W - 0.5, 0.06, D - 0.5]} />
                    <meshStandardMaterial color="#3a2030" roughness={0.8} metalness={0.2} />
                </mesh>
            </group>

            {/* ======================== CONTROL PANEL (front base — bottom of machine) ======================== */}
            {/* Angled panel shelf protruding from the front of the BASE */}
            <group position={[0.6, baseY - baseH / 2 + 0.9, D / 2 + 0.75]}>
                {/* Panel body — angled surface */}
                <mesh castShadow rotation={[0.35, 0, 0]}>
                    <boxGeometry args={[W * 0.55, 0.14, 1.3]} />
                    <meshStandardMaterial color="#2a1520" roughness={0.5} metalness={0.15} />
                </mesh>

                {/* Panel trim border */}
                <mesh castShadow rotation={[0.35, 0, 0]} position={[0, 0.08, 0]}>
                    <boxGeometry args={[W * 0.57, 0.03, 1.32]} />
                    <primitive object={trimMat} attach="material" />
                </mesh>

                {/* Panel side walls */}
                <mesh castShadow position={[-W * 0.275, 0, 0]} rotation={[0.35, 0, 0]}>
                    <boxGeometry args={[0.06, 0.2, 1.3]} />
                    <meshStandardMaterial color="#3a1a2a" roughness={0.6} metalness={0.1} />
                </mesh>
                <mesh castShadow position={[W * 0.275, 0, 0]} rotation={[0.35, 0, 0]}>
                    <boxGeometry args={[0.06, 0.2, 1.3]} />
                    <meshStandardMaterial color="#3a1a2a" roughness={0.6} metalness={0.1} />
                </mesh>

                {/* ======= INTERACTIVE JOYSTICK (left side of panel) ======= */}
                <group position={[-0.65, 0.28, -0.1]} rotation={[0.35, 0, 0]}>
                    <Joystick3D onMove={(dir) => onJoystick?.(dir)} keyboardTilt={joystickTilt} />
                </group>

                {/* ======= INTERACTIVE DROP BUTTON (right side of panel) ======= */}
                <group position={[0.65, 0.22, -0.1]} rotation={[0.35, 0, 0]}>
                    {/* Button housing ring */}
                    <mesh castShadow>
                        <cylinderGeometry args={[0.34, 0.38, 0.12, 20]} />
                        <meshStandardMaterial color="#1a0c14" roughness={0.4} metalness={0.6} />
                    </mesh>
                    {/* Inner chrome ring */}
                    <mesh position={[0, 0.06, 0]} castShadow>
                        <torusGeometry args={[0.28, 0.028, 8, 24]} />
                        <primitive object={chromeMat} attach="material" />
                    </mesh>
                    {/* Big red dome button — clickable */}
                    <mesh
                        position={[0, 0.12, 0]}
                        castShadow
                        onClick={(e) => { e.stopPropagation(); onGrab?.(); }}
                        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
                        onPointerOut={() => { document.body.style.cursor = 'auto'; }}
                    >
                        <sphereGeometry args={[0.26, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
                        <meshStandardMaterial
                            color="#e8536c"
                            roughness={0.2}
                            metalness={0.1}
                            emissive="#e8536c"
                            emissiveIntensity={0.2}
                        />
                    </mesh>
                    {/* Larger invisible click area for easier targeting */}
                    <mesh
                        position={[0, 0.2, 0]}
                        onClick={(e) => { e.stopPropagation(); onGrab?.(); }}
                        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
                        onPointerOut={() => { document.body.style.cursor = 'auto'; }}
                    >
                        <sphereGeometry args={[0.4, 12, 12]} />
                        <meshStandardMaterial transparent opacity={0} />
                    </mesh>
                </group>
            </group>

            {/* ======================== FLOOR INSIDE ======================== */}
            <mesh position={[0, glassBottomY + 0.04, 0]} receiveShadow>
                <boxGeometry args={[W - 0.24, 0.08, D - 0.24]} />
                <meshStandardMaterial color="#f5e0e8" roughness={0.7} metalness={0.0} />
            </mesh>

            {/* ======================== SIGN / MARQUEE ======================== */}
            <mesh position={[0, topY + topH / 2 + 0.4, D / 2 * 0.5]} castShadow>
                <boxGeometry args={[3.8, 0.8, 0.1]} />
                <meshStandardMaterial color="#f9a8c8" roughness={0.4} metalness={0.05} emissive="#f9a8c8" emissiveIntensity={0.15} />
            </mesh>

            {/* Decorative spheres on top */}
            {[-1.5, 0, 1.5].map((x, i) => (
                <mesh key={`top-deco-${i}`} position={[x, topY + topH / 2 + 0.9, D / 2 * 0.35]} castShadow>
                    <sphereGeometry args={[0.14, 14, 14]} />
                    <meshStandardMaterial color="#fb7185" roughness={0.3} emissive="#fb7185" emissiveIntensity={0.3} />
                </mesh>
            ))}
        </group>
    );
}
