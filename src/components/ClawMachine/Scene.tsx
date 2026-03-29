import MachineBody from './MachineBody';
import HeartPile from './HeartPile';
import Claw from './Claw';
import GrabbedHeart from './GrabbedHeart';
import type { GameState, HeartConfig } from './types';

interface SceneProps {
    gameState: GameState;
    hearts: HeartConfig[];
    removedHearts: Set<number>;
    onJoystick?: (dir: 'left' | 'right' | 'forward' | 'back') => void;
    joystickTilt?: { x: number; z: number };
    onGrab?: () => void;
}

function SceneLighting() {
    return (
        <>
            {/* Ambient fill — warm pink tint */}
            <ambientLight intensity={0.35} color="#f5e0e8" />

            {/* Key light — warm from upper right */}
            <directionalLight
                position={[4, 6, 5]}
                intensity={1.0}
                color="#fff0f4"
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-near={0.5}
                shadow-camera-far={25}
                shadow-camera-left={-8}
                shadow-camera-right={8}
                shadow-camera-top={10}
                shadow-camera-bottom={-8}
                shadow-bias={-0.001}
            />

            {/* Fill light — soft from left */}
            <directionalLight
                position={[-5, 3, 3]}
                intensity={0.4}
                color="#f9c8d8"
            />

            {/* Rim light — from behind for separation */}
            <directionalLight
                position={[0, 4, -6]}
                intensity={0.3}
                color="#f0d0e0"
            />

            {/* Soft overhead */}
            <pointLight
                position={[0, 8, 0]}
                intensity={0.6}
                color="#fff5f8"
                distance={20}
                decay={2}
            />

            {/* Subtle warm floor bounce */}
            <pointLight
                position={[0, -4, 2]}
                intensity={0.2}
                color="#f9a8c8"
                distance={12}
                decay={2}
            />

            {/* Pink accent on the hearts */}
            <pointLight
                position={[0, -1, 3]}
                intensity={0.4}
                color="#fb7185"
                distance={8}
                decay={2}
            />

            {/* Environment hemisphere */}
            <hemisphereLight
                args={['#f5e0e8', '#2a1520', 0.3]}
            />
        </>
    );
}

export default function Scene({ gameState, hearts, removedHearts, onJoystick, onGrab, joystickTilt }: SceneProps) {
    const grabbedHeart = gameState.grabbedHeartIndex !== null ? hearts[gameState.grabbedHeartIndex] : null;

    return (
        <>
            <SceneLighting />

            {/* Ground plane for shadow catching */}
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, -5.8, 0]}
                receiveShadow
            >
                <planeGeometry args={[40, 40]} />
                <shadowMaterial opacity={0.25} />
            </mesh>

            {/* Subtle ground reflection plane */}
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, -5.78, 0]}
            >
                <planeGeometry args={[16, 16]} />
                <meshStandardMaterial
                    color="#2a1520"
                    roughness={0.3}
                    metalness={0.4}
                    transparent
                    opacity={0.4}
                />
            </mesh>

            {/* The machine assembly */}
            <group position={[0, 1.2, 0]}>
                <MachineBody onJoystick={onJoystick} onGrab={onGrab} joystickTilt={joystickTilt} />
                <HeartPile gameState={gameState} removedHearts={removedHearts} />
                <Claw gameState={gameState} />
                {grabbedHeart && (
                    <GrabbedHeart gameState={gameState} heart={grabbedHeart} />
                )}
            </group>
        </>
    );
}
