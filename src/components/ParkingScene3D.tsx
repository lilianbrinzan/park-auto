import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Instances, Instance } from '@react-three/drei';
import * as THREE from 'three';

// 1. Constante și Geometrii Globale (instanțiate o singură dată)
const bayWidth = 2.8;
const bayLength = 4.5;

const carBodyGeometry = new THREE.BoxGeometry(2.2, 0.5, 1.1);
const cabinGeometry = new THREE.BoxGeometry(1.2, 0.4, 0.9);
const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
const headlightGeometry = new THREE.BoxGeometry(0.05, 0.1, 0.2);

const bayGeometry = new THREE.PlaneGeometry(bayWidth - 0.2, bayLength);
const indicatorGeometry = new THREE.BoxGeometry(1, 0.02, 0.1);
const groundGeometry = new THREE.PlaneGeometry(30, 30);

// 2. Materiale Globale (instanțiate o singură dată)
const bodyMaterialActive = new THREE.MeshPhysicalMaterial({
  color: '#06b6d4',
  transmission: 0.85,
  transparent: true,
  opacity: 1,
  roughness: 0.15,
  metalness: 0.2,
  ior: 1.5,
  thickness: 1.5,
  specularIntensity: 1,
});

const bodyMaterialNormal = new THREE.MeshPhysicalMaterial({
  color: '#0070f3',
  transmission: 0.85,
  transparent: true,
  opacity: 1,
  roughness: 0.15,
  metalness: 0.2,
  ior: 1.5,
  thickness: 1.5,
  specularIntensity: 1,
});

const cabinMaterialActive = new THREE.MeshPhysicalMaterial({
  color: '#22d3ee',
  transmission: 0.9,
  transparent: true,
  opacity: 1,
  roughness: 0.1,
  metalness: 0.1,
  ior: 1.5,
  thickness: 1.0,
});

const cabinMaterialNormal = new THREE.MeshPhysicalMaterial({
  color: '#3b82f6',
  transmission: 0.9,
  transparent: true,
  opacity: 1,
  roughness: 0.1,
  metalness: 0.1,
  ior: 1.5,
  thickness: 1.0,
});

const wheelMaterial = new THREE.MeshStandardMaterial({
  color: '#1f2937',
  roughness: 0.5,
  metalness: 0.8,
});

const headlightMaterial = new THREE.MeshBasicMaterial({
  color: '#22d3ee',
  toneMapped: false,
});

const bayMaterialMain = new THREE.MeshBasicMaterial({
  color: '#0070f3',
  wireframe: true,
  transparent: true,
  opacity: 0.8,
});

const bayMaterialNormal = new THREE.MeshBasicMaterial({
  color: '#e5e7eb',
  wireframe: true,
  transparent: true,
  opacity: 0.3,
});

const indicatorMaterial = new THREE.MeshBasicMaterial({
  color: '#0070f3',
});

const groundMaterial = new THREE.MeshStandardMaterial({
  color: '#f8fafc',
  roughness: 0.9,
  metalness: 0.05,
});

const WHEEL_POSITIONS: [number, number, number][] = [
  [-0.7, -0.25, 0.55], // Front Left
  [0.7, -0.25, 0.55],  // Rear Left
  [-0.7, -0.25, -0.55], // Front Right
  [0.7, -0.25, -0.55],  // Rear Right
];

interface GlassCarProps {
  position?: [number, number, number];
  active?: boolean;
}

// Procedural sleek 3D Car Model with Glassmorphic materials
function GlassCar({ position = [0, 0.4, 0], active = false }: GlassCarProps) {
  const carRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const positionRef = useRef<[number, number, number]>(position);

  // Sincronizăm prop-ul de poziție cu ref-ul local pentru a evita stuttering în useFrame
  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  // Animate the car (subtle breathing/floating effect)
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (carRef.current) {
      carRef.current.position.y = positionRef.current[1] + Math.sin(t * 1.5) * 0.05;
      carRef.current.rotation.y = t * 0.1;
    }
  });

  const bodyMaterial = active || hovered ? bodyMaterialActive : bodyMaterialNormal;
  const cabinMaterial = active || hovered ? cabinMaterialActive : cabinMaterialNormal;

  return (
    <group 
      ref={carRef} 
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Lower Main Car Body */}
      <mesh geometry={carBodyGeometry} material={bodyMaterial} castShadow receiveShadow />

      {/* Upper Cabin */}
      <mesh position={[-0.2, 0.4, 0]} geometry={cabinGeometry} material={cabinMaterial} castShadow />

      {/* Wheels instanced for performance */}
      <Instances geometry={wheelGeometry} material={wheelMaterial} castShadow>
        {WHEEL_POSITIONS.map((pos, idx) => (
          <Instance key={idx} position={pos} rotation={[Math.PI / 2, 0, 0]} />
        ))}
      </Instances>

      {/* Headlights (Tehnological Glow) */}
      <mesh position={[1.1, 0, 0.35]} geometry={headlightGeometry} material={headlightMaterial} />
      <mesh position={[1.1, 0, -0.35]} geometry={headlightGeometry} material={headlightMaterial} />
      
      {/* Light glow lines/guides */}
      {hovered && (
        <gridHelper args={[3, 3, '#06b6d4', '#06b6d4']} position={[0, -0.25, 0]} />
      )}
    </group>
  );
}

// 3D Parking Bay / Grid Spaces
function ParkingGrid() {
  const gridLines = [];

  for (let i = -2; i <= 2; i++) {
    const x = i * bayWidth;
    const isMainBay = i === 0; // Highlight center bay
    gridLines.push(
      <group key={i} position={[x, 0, 0]}>
        {/* Border / Lines of Bay */}
        <mesh 
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[0, 0, 0]} 
          geometry={bayGeometry} 
          material={isMainBay ? bayMaterialMain : bayMaterialNormal} 
        />
        {/* Bay text or indicator */}
        {isMainBay && (
          <mesh 
            position={[0, 0.01, 2.3]} 
            geometry={indicatorGeometry} 
            material={indicatorMaterial} 
          />
        )}
      </group>
    );
  }

  return (
    <group>
      {gridLines}
      {/* Ground plane */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.01, 0]} 
        geometry={groundGeometry} 
        material={groundMaterial} 
        receiveShadow 
      />
    </group>
  );
}

export default function ParkingScene3D() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Înlocuim resize listener-ul global cu matchMedia pentru a evita re-randările infinite pe ecranele mobile la scroll
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    setIsMobile(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className="hero-canvas-container glass-panel">
      <div className="grid-overlay" />
      <Canvas shadows gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 4, 7]} fov={50} />
        
        {/* Lighting setup for tech glow */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#06b6d4" />
        <pointLight position={[5, 3, 5]} intensity={0.8} color="#0070f3" />
        
        <ParkingGrid />
        
        {/* Center active car */}
        <GlassCar position={[0, 0.4, 0]} active={true} />
        
        {/* Side decorative cars - hidden on mobile */}
        {!isMobile && (
          <>
            <GlassCar position={[-2.8, 0.4, 0.5]} active={false} />
            <GlassCar position={[2.8, 0.4, -0.5]} active={false} />
          </>
        )}

        <OrbitControls 
          enableZoom={false} 
          maxPolarAngle={Math.PI / 2.2} 
          minPolarAngle={Math.PI / 4}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}

