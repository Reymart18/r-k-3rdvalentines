import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Heart3D from './Heart3D';
import type { HeartConfig, GameState } from './types';

// Varied pink/red/coral palette
const HEART_COLORS: { color: string; inner: string }[] = [
    { color: '#e8536c', inner: '#c44558' },
    { color: '#f472b6', inner: '#d45a9a' },
    { color: '#fb7185', inner: '#d95f70' },
    { color: '#f9a8c8', inner: '#d88fac' },
    { color: '#ff8a9e', inner: '#d97384' },
    { color: '#e56b8a', inner: '#c45874' },
    { color: '#f48fb1', inner: '#d47a9a' },
    { color: '#ef5a73', inner: '#cc4c62' },
    { color: '#fbb4c4', inner: '#d99aaa' },
    { color: '#ec6e8c', inner: '#c95d77' },
];

// Love messages for Angela Kate
const HEART_MESSAGES: string[] = [
    "You're my forever, Angela Kate!",
    "Ikaw ang paborito kong regalong natanggap!",
    "Ikaw at ikaw lamang palagi!🥰",
    "Just so you know, you make my world more beautiful!",
    "I'd choose you everyday! mwa mwa!",
    "Napakaspecial mo sa buhay ko!",
    "You are my answered prayer :)",
    "Mahal na mahal kita, always!!",
    "You are the best!",
    "You're literally my home, my safe place :))",
    "I fall for you more each day!!!!!!!",
    "Hi po, paiyot! bleh😜",
    "Ang paborito kong tao sa mundo!😚",
    "Wow wow wow na lang talaga ako sa sobrang pretty mo!!!",
    "Thank you for always! I love you so much!!😚",
    "Pakagat po wahahaahahahaha mwa!",
    "Don't be too hard on yourself, you're doing amazing and I love you so much!!😚",
    "Damn, ganda mo talaga!! paiyot hehehehe",
    "Kantahan mo me hehehe",
    "My safest place ay sa piling mo, mwaaaaaa!!",
    "With you, every moment is very special!!",
    "Sino ang aking paborito? edi syempre si angela kate lucot gumatas!!",
    "I love you, more than you can imagine!!",
    "Tingin nga po smile pretty girl :))",
    "I hope that we will be successful together!!",
    "You are my everything, Angela Kate!!",
    "Really really lucky to have you in my life!!",
    "I'm so very very proud of you, and I will always be here to support you love love sa lahat ng ginagawa mo!!😚",
    "Hi po, pakiss!",
    "I'm always here for you po!!😚",
    "Balang araw, gagala tayo out of town and country together!!",
    "Laplapan na this! hehe",
    "Thankyou po palagi talaga sa lahat lahat! super thankful and grateful ako sayo!!",
    "I'm so lucky to have you!!!",
    "You're the best!!",
    "Thankyou sa pagmamahal mo, sa pag-aalaga sa akin, ang iyong baby boy! hehehe",
    "Reymart + Angela Kate = Iyot wahahaahahaahahahah",
    "I will love you, forever!!😚😚",
    "Salamat po talagaaaaaaa palagiiii!!!",
    "You really complete me po, grabe hayyyy, mwaaa!!😚",
];

function seededRandom(seed: number): number {
    const x = Math.sin(seed * 9301 + 49297) * 49297;
    return x - Math.floor(x);
}

function generateHearts(count: number): HeartConfig[] {
    const hearts: HeartConfig[] = [];
    const baseY = -3.8;

    for (let i = 0; i < count; i++) {
        const seed = i * 137.5;
        const palette = HEART_COLORS[i % HEART_COLORS.length];
        const layer = Math.floor(i / 10);
        const yOffset = layer * 0.6 + seededRandom(seed + 1) * 0.4;
        const spread = Math.max(2.2 - layer * 0.15, 0.8);

        // Clamp hearts inside machine body (W=5.5, D=4.5) and away from drop zone on left
        const rawX = (seededRandom(seed + 2) - 0.5) * spread * 2.0 + 0.5;
        const clampedX = Math.max(-1.4, Math.min(2.2, rawX)); // keep away from left drop zone, within right side
        const rawZ = (seededRandom(seed + 3) - 0.5) * spread * 1.8;
        const clampedZ = Math.max(-1.8, Math.min(1.8, rawZ));

        hearts.push({
            position: [
                clampedX,
                baseY + yOffset,
                clampedZ,
            ],
            rotation: [
                (seededRandom(seed + 4) - 0.5) * Math.PI * 0.7,
                (seededRandom(seed + 5) - 0.5) * Math.PI * 1.2,
                (seededRandom(seed + 6) - 0.5) * Math.PI * 0.5,
            ],
            scale: 0.35 + seededRandom(seed + 7) * 0.35,
            color: palette.color,
            innerColor: palette.inner,
            message: HEART_MESSAGES[i % HEART_MESSAGES.length],
        });
    }
    return hearts;
}

interface HeartPileProps {
    gameState: GameState;
    removedHearts: Set<number>;
}

export { generateHearts, HEART_MESSAGES };

export default function HeartPile({ gameState, removedHearts }: HeartPileProps) {
    const groupRef = useRef<THREE.Group>(null);
    const hearts = useMemo(() => generateHearts(40), []);

    // Very subtle idle settling animation
    useFrame((state) => {
        if (!groupRef.current) return;
        const t = state.clock.elapsedTime;
        groupRef.current.children.forEach((child, i) => {
            // Skip grabbed heart animation
            if (i === gameState.grabbedHeartIndex) return;
            if (child instanceof THREE.Group || child.type === 'Group') {
                const offset = i * 0.3;
                child.position.y += Math.sin(t * 0.4 + offset) * 0.0003;
                child.rotation.z += Math.sin(t * 0.25 + offset) * 0.00008;
            }
        });
    });

    return (
        <group ref={groupRef} position={[0, 0, 0]}>
            {hearts.map((heart, i) => {
                // If this heart is grabbed, hide it from pile (it'll be shown on the claw)
                // Hide if permanently removed or currently grabbed
                if (removedHearts.has(i)) return null;

                const isGrabbed = gameState.grabbedHeartIndex === i &&
                    (gameState.phase === 'rising' || gameState.phase === 'delivering' || gameState.phase === 'releasing');

                if (isGrabbed) return null;

                return (
                    <Heart3D
                        key={i}
                        position={heart.position}
                        rotation={heart.rotation}
                        scale={heart.scale}
                        color={heart.color}
                        innerColor={heart.innerColor}
                        roughness={0.28 + (i % 5) * 0.04}
                    />
                );
            })}
        </group>
    );
}
