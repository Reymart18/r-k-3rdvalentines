import { useMemo } from 'react';
import * as THREE from 'three';
import { getHeartMaterial } from './materials';

interface Heart3DProps {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: number;
    color: string;
    innerColor: string;
    roughness?: number;
}

function createHeartShape(): THREE.Shape {
    const shape = new THREE.Shape();
    const x = 0, y = 0;

    shape.moveTo(x, y + 0.7);

    // Left lobe
    shape.bezierCurveTo(x, y + 1.4, x - 1.05, y + 1.75, x - 1.05, y + 1.05);
    shape.bezierCurveTo(x - 1.05, y + 0.35, x - 0.525, y - 0.14, x, y - 0.7);

    // Right lobe
    shape.bezierCurveTo(x + 0.525, y - 0.14, x + 1.05, y + 0.35, x + 1.05, y + 1.05);
    shape.bezierCurveTo(x + 1.05, y + 1.75, x, y + 1.4, x, y + 0.7);

    return shape;
}

export default function Heart3D({ position, rotation, scale, color, innerColor, roughness = 0.35 }: Heart3DProps) {
    const geometry = useMemo(() => {
        const shape = createHeartShape();
        const extrudeSettings: THREE.ExtrudeGeometryOptions = {
            depth: 0.45,
            bevelEnabled: true,
            bevelThickness: 0.12,
            bevelSize: 0.1,
            bevelOffset: 0,
            bevelSegments: 8,
            curveSegments: 24,
        };
        const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geo.center();
        geo.computeVertexNormals();
        return geo;
    }, []);

    const outerMat = useMemo(() => getHeartMaterial(color, roughness), [color, roughness]);
    const innerMat = useMemo(() => getHeartMaterial(innerColor, roughness + 0.1), [innerColor, roughness]);

    return (
        <group position={position} rotation={rotation} scale={scale}>
            {/* Outer front/back faces */}
            <mesh geometry={geometry} material={outerMat} castShadow receiveShadow />
            {/* Inner side bevel faces — slightly darker material for depth */}
            <mesh geometry={geometry} material={innerMat} castShadow receiveShadow>
                <meshPhysicalMaterial
                    attach="material"
                    color={innerColor}
                    roughness={roughness + 0.1}
                    metalness={0.02}
                    clearcoat={0.4}
                    clearcoatRoughness={0.3}
                    side={THREE.BackSide}
                />
            </mesh>
        </group>
    );
}
