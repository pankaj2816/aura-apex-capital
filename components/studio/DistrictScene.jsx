'use client';

import { useMemo } from 'react';
import { OrbitControls } from '@react-three/drei';
import { LIGHTS } from './gl';

const ANCHORS = [
  [-4.4, -1.4],
  [-2.5, -2.3],
  [-0.3, -1.2],
  [1.9, -2.2],
  [3.8, -1.0],
  [-3.5, 0.9],
  [-1.2, 1.5],
  [1.2, 0.7],
  [3.3, 1.6],
  [-2.1, 3.2],
  [0.5, 3.3],
  [2.7, 2.7],
];

const FILL = [
  { x: -5.4, z: 0.4, h: 1.1, w: 0.7, kind: 'commercial' },
  { x: 5.1, z: -0.2, h: 1.8, w: 0.8, kind: 'luxury' },
  { x: -5.0, z: 2.4, h: 0.8, w: 0.6, kind: 'yield' },
  { x: 4.8, z: 2.2, h: 2.4, w: 0.7, kind: 'yield' },
  { x: 0.2, z: -3.3, h: 1.4, w: 1.1, kind: 'commercial' },
  { x: -3.8, z: -3.4, h: 0.9, w: 0.7, kind: 'luxury' },
];

function kindOf(assetClass) {
  if (assetClass === 'reit') return 'yield';
  if (assetClass === 'commercial') return 'commercial';
  return 'luxury';
}

function colorFor(kind, palette) {
  if (kind === 'yield') return palette.emerald;
  if (kind === 'commercial') return palette.cyan;
  return palette.sapphire;
}

export default function DistrictScene({
  properties,
  palette,
  light,
  activeId,
  onSelect,
}) {
  const sun = LIGHTS[light] || LIGHTS.midnight;
  const towers = useMemo(
    () =>
      properties.map((property, index) => {
        const [x, z] = ANCHORS[index % ANCHORS.length];
        const h = 0.75 + Math.min(property.price / 14_000_000, 4.4);
        return {
          id: property.id,
          x,
          z,
          h,
          w: property.class === 'commercial' ? 1.3 : 0.82,
          d: property.class === 'reit' ? 0.68 : 0.92,
          kind: kindOf(property.class),
        };
      }),
    [properties]
  );

  return (
    <>
      <color attach="background" args={[palette.sky]} />
      <fog attach="fog" args={[palette.fog, 14, 36]} />
      <ambientLight intensity={Math.max(0.2, sun.ambient)} />
      <directionalLight position={sun.position} intensity={sun.intensity} color={sun.color} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[28, 28]} />
        <meshStandardMaterial color={palette.ground} roughness={1} />
      </mesh>
      <gridHelper args={[28, 22, palette.metal, palette.ground]} position={[0, 0.01, 0]} />
      {towers.map((tower) => {
        const color = colorFor(tower.kind, palette);
        const active = tower.id === activeId;
        return (
          <mesh
            key={tower.id}
            position={[tower.x, tower.h / 2, tower.z]}
            onClick={(event) => {
              event.stopPropagation();
              onSelect(tower.id);
            }}
          >
            <boxGeometry args={[tower.w, tower.h, tower.d]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={active ? 0.9 : 0.25}
              roughness={0.32}
              metalness={0.18}
            />
          </mesh>
        );
      })}
      {FILL.map((block, index) => {
        const color = colorFor(block.kind, palette);
        return (
          <mesh key={`fill-${index}`} position={[block.x, block.h / 2, block.z]}>
            <boxGeometry args={[block.w, block.h, block.w]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.08}
              roughness={0.6}
              transparent
              opacity={0.55}
            />
          </mesh>
        );
      })}
      <OrbitControls
        enablePan
        enableZoom
        enableDamping
        maxPolarAngle={Math.PI / 2.15}
        minDistance={6}
        maxDistance={28}
        target={[0, 0.6, 0]}
      />
    </>
  );
}
