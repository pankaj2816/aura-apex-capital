'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { HOTSPOTS } from '@/data/fixtures';
import { LIGHTS } from './gl';

function CameraRig({ hotspotId }) {
  const { camera } = useThree();
  const controls = useRef(null);
  const flying = useRef(false);
  const focus = useRef(new THREE.Vector3(7.2, 3.8, 7.4));
  const look = useRef(new THREE.Vector3(0, 0.7, 0));

  useEffect(() => {
    const spot = HOTSPOTS.find((item) => item.id === hotspotId);
    if (!spot) return;
    focus.current.set(spot.camera[0], spot.camera[1], spot.camera[2]);
    look.current.set(spot.look[0], spot.look[1], spot.look[2]);
    flying.current = true;
  }, [hotspotId]);

  useFrame((_, delta) => {
    if (!flying.current || !controls.current) return;
    const step = 1 - Math.pow(0.05, delta);
    camera.position.lerp(focus.current, step);
    controls.current.target.lerp(look.current, step);
    if (camera.position.distanceTo(focus.current) < 0.08) flying.current = false;
  });

  return (
    <OrbitControls
      ref={controls}
      enablePan
      enableZoom
      enableDamping
      dampingFactor={0.08}
      maxPolarAngle={Math.PI / 2.05}
      minDistance={2.8}
      maxDistance={18}
      target={[0, 0.7, 0]}
    />
  );
}

function Villa({ explode, palette, hotspot, onHotspot }) {
  const amount = useRef(0);
  const nodes = useRef({});

  const parts = useMemo(
    () => [
      { id: 'plinth', base: [0, 0.08, 0], shift: [0, -0.85, 0], args: [4.5, 0.16, 3.35] },
      { id: 'volume', base: [0.15, 0.95, -0.05], shift: [0, 0.7, 0], args: [2.55, 1.28, 1.9] },
      { id: 'wing', base: [-1.65, 0.58, 0.2], shift: [-1.25, 0.25, 0.15], args: [1.15, 0.7, 1.45] },
      { id: 'canopy', base: [0.1, 1.78, 0.02], shift: [0.15, 1.25, 0], args: [3.7, 0.045, 2.45] },
      { id: 'pool', base: [1.5, 0.22, 1.32], shift: [1.45, 0.2, 1.65], args: [1.55, 0.08, 1.02] },
      { id: 'vault', base: [0.35, -0.18, -0.15], shift: [0.45, -1.2, -0.3], args: [1.3, 0.4, 1.05] },
      { id: 'helipad', base: [-1.3, 1.58, -0.95], shift: [-1.55, 1.35, -1.45], args: [1.15, 0.06, 1.15] },
    ],
    []
  );

  useFrame((_, delta) => {
    const goal = explode ? 1 : 0;
    amount.current += (goal - amount.current) * Math.min(1, delta * 2.6);
    const t = amount.current;
    parts.forEach((part) => {
      const node = nodes.current[part.id];
      if (!node) return;
      node.position.set(
        part.base[0] + part.shift[0] * t,
        part.base[1] + part.shift[1] * t,
        part.base[2] + part.shift[2] * t
      );
    });
  });

  const glass = {
    color: palette.glass,
    roughness: 0.08,
    metalness: 0.15,
    transparent: true,
    opacity: 0.55,
  };

  return (
    <group>
      <mesh ref={(node) => (nodes.current.plinth = node)} position={[0, 0.08, 0]} receiveShadow>
        <boxGeometry args={[4.5, 0.16, 3.35]} />
        <meshStandardMaterial color={palette.ground} roughness={0.9} />
      </mesh>
      <mesh ref={(node) => (nodes.current.volume = node)} position={[0.15, 0.95, -0.05]}>
        <boxGeometry args={[2.55, 1.28, 1.9]} />
        <meshStandardMaterial {...glass} />
      </mesh>
      <mesh ref={(node) => (nodes.current.wing = node)} position={[-1.65, 0.58, 0.2]}>
        <boxGeometry args={[1.15, 0.7, 1.45]} />
        <meshStandardMaterial color={palette.metal} roughness={0.42} metalness={0.35} />
      </mesh>
      <mesh ref={(node) => (nodes.current.canopy = node)} position={[0.1, 1.78, 0.02]}>
        <boxGeometry args={[3.7, 0.045, 2.45]} />
        <meshStandardMaterial
          color={palette.bronze}
          emissive={palette.bronze}
          emissiveIntensity={0.25}
          transparent
          opacity={0.72}
          roughness={0.2}
          metalness={0.4}
        />
      </mesh>
      <mesh ref={(node) => (nodes.current.pool = node)} position={[1.5, 0.22, 1.32]}>
        <boxGeometry args={[1.55, 0.08, 1.02]} />
        <meshStandardMaterial
          color={palette.pool}
          emissive={palette.pool}
          emissiveIntensity={0.55}
          roughness={0.15}
        />
      </mesh>
      <mesh ref={(node) => (nodes.current.vault = node)} position={[0.35, -0.18, -0.15]}>
        <boxGeometry args={[1.3, 0.4, 1.05]} />
        <meshStandardMaterial color="#3a2430" roughness={0.6} metalness={0.1} />
      </mesh>
      <group ref={(node) => (nodes.current.helipad = node)} position={[-1.3, 1.58, -0.95]}>
        <mesh>
          <cylinderGeometry args={[0.62, 0.62, 0.05, 32]} />
          <meshStandardMaterial color={palette.metal} roughness={0.35} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.42, 0.5, 32]} />
          <meshBasicMaterial color={palette.bronze} />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[0.08, 0.02, 0.28]} />
          <meshBasicMaterial color={palette.ink} />
        </mesh>
      </group>
      {HOTSPOTS.map((spot) => (
        <mesh
          key={spot.id}
          position={spot.position}
          onClick={(event) => {
            event.stopPropagation();
            onHotspot(spot.id);
          }}
        >
          <sphereGeometry args={[hotspot === spot.id ? 0.12 : 0.08, 18, 18]} />
          <meshStandardMaterial
            color={hotspot === spot.id ? palette.gold || palette.bronze : palette.cyan}
            emissive={palette.cyan}
            emissiveIntensity={hotspot === spot.id ? 0.9 : 0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function MonolithScene({ explode, palette, light, hotspot, onHotspot }) {
  const sun = LIGHTS[light] || LIGHTS.noon;
  return (
    <>
      <color attach="background" args={[palette.sky]} />
      <fog attach="fog" args={[palette.fog, 10, 28]} />
      <ambientLight intensity={sun.ambient} />
      <directionalLight position={sun.position} intensity={sun.intensity} color={sun.color} />
      <hemisphereLight args={[palette.glass, palette.ground, 0.35]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <circleGeometry args={[9, 48]} />
        <meshStandardMaterial color={palette.ground} roughness={1} />
      </mesh>
      <Villa explode={explode} palette={palette} hotspot={hotspot} onHotspot={onHotspot} />
      <CameraRig hotspotId={hotspot} />
    </>
  );
}
