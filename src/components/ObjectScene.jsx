 import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Box, Cylinder, Text, Torus, Plane, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// ============================================================
// 1. AMMETER
// ============================================================
function Ammeter() {
  const needleRef = useRef();

  useFrame(({ clock }) => {
    const t = Math.sin(clock.getElapsedTime() * 0.6) * 0.5 + 0.5;
    if (needleRef.current) {
      needleRef.current.rotation.z = -0.8 + t * 1.6;
    }
  });

  return (
    <group position={[0, 0, 0]} scale={0.8}>
      <Cylinder args={[1.5, 1.5, 0.3, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#3a3a3a" roughness={0.6} metalness={0.4} />
      </Cylinder>
      <Torus args={[1.4, 0.08, 16, 48]} position={[0, 0, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#aaa" metalness={0.8} roughness={0.2} />
      </Torus>
      <Cylinder args={[1.3, 1.3, 0.05, 32]} position={[0, 0, 0.12]}>
        <meshStandardMaterial color="#f5f5f0" roughness={0.4} metalness={0.1} />
      </Cylinder>
      {Array.from({ length: 13 }, (_, i) => {
        const angle = -0.8 + (i / 12) * 1.6;
        const x = Math.sin(angle) * 1.1;
        const z = Math.cos(angle) * 1.1 - 0.1;
        const length = i % 5 === 0 ? 0.15 : 0.08;
        return (
          <Box key={i} args={[0.02, 0.02, length]} position={[x, 0.12, z]} rotation={[0, -angle, 0]}>
            <meshStandardMaterial color="#222" />
          </Box>
        );
      })}
      <group position={[0, 0, 0.2]}>
        <Box ref={needleRef} args={[0.04, 0.02, 0.9]} position={[0, 0, 0.45]}>
          <meshStandardMaterial color="#d32f2f" emissive="#d32f2f" emissiveIntensity={0.3} metalness={0.2} roughness={0.6} />
        </Box>
        <Sphere args={[0.06, 12, 12]}>
          <meshStandardMaterial color="#555" metalness={0.9} roughness={0.2} />
        </Sphere>
      </group>
      <Sphere args={[1.3, 32, 32]} position={[0, 0, 0.22]} scale={[1, 1, 0.06]}>
        <meshStandardMaterial color="#ffffff" transparent opacity={0.15} roughness={0.05} metalness={0.1} envMapIntensity={0.5} />
      </Sphere>
      <Text position={[0, 0, 0.25]} fontSize={0.25} color="#222" anchorX="center" anchorY="middle">
        A
      </Text>
    </group>
  );
}

// ============================================================
// 2. TRANSFORMER
// ============================================================
function Transformer() {
  const coilRef = useRef();

  useFrame(({ clock }) => {
    if (coilRef.current) {
      coilRef.current.rotation.y = clock.getElapsedTime() * 0.4;
    }
  });

  return (
    <group position={[0, 0, 0]} scale={0.7}>
      <Box args={[2.2, 0.15, 1.6]} position={[0, -0.9, 0]}>
        <meshStandardMaterial color="#555" roughness={0.7} metalness={0.3} />
      </Box>
      <group position={[0, 0.2, 0]}>
        <Box args={[0.3, 1.2, 0.4]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#2a2a2a" roughness={0.8} metalness={0.2} />
        </Box>
        <Box args={[0.25, 1.0, 0.4]} position={[-0.7, -0.1, 0]}>
          <meshStandardMaterial color="#2a2a2a" roughness={0.8} metalness={0.2} />
        </Box>
        <Box args={[0.25, 1.0, 0.4]} position={[0.7, -0.1, 0]}>
          <meshStandardMaterial color="#2a2a2a" roughness={0.8} metalness={0.2} />
        </Box>
        <Box args={[1.6, 0.2, 0.4]} position={[0, 0.6, 0]}>
          <meshStandardMaterial color="#2a2a2a" roughness={0.8} metalness={0.2} />
        </Box>
        <Box args={[1.6, 0.2, 0.4]} position={[0, -0.6, 0]}>
          <meshStandardMaterial color="#2a2a2a" roughness={0.8} metalness={0.2} />
        </Box>
      </group>
      <group ref={coilRef} position={[0, 0.2, 0]}>
        <Cylinder args={[0.5, 0.5, 0.6, 24]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#b87333" metalness={0.8} roughness={0.3} />
        </Cylinder>
        <Cylinder args={[0.45, 0.45, 0.65, 24]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#8b5a2b" metalness={0.6} roughness={0.5} />
        </Cylinder>
        <Cylinder args={[0.04, 0.04, 0.3]} position={[0.35, 0.3, 0.5]} rotation={[0.3, 0, 0]}>
          <meshStandardMaterial color="#ffaa00" metalness={0.9} roughness={0.2} />
        </Cylinder>
        <Cylinder args={[0.04, 0.04, 0.3]} position={[-0.35, -0.3, 0.5]} rotation={[-0.3, 0, 0]}>
          <meshStandardMaterial color="#ffaa00" metalness={0.9} roughness={0.2} />
        </Cylinder>
      </group>
      <Cylinder args={[0.06, 0.08, 0.2]} position={[-0.5, 0.9, 0.3]}>
        <meshStandardMaterial color="#aaa" metalness={0.8} roughness={0.2} />
      </Cylinder>
      <Cylinder args={[0.06, 0.08, 0.2]} position={[0.5, 0.9, 0.3]}>
        <meshStandardMaterial color="#aaa" metalness={0.8} roughness={0.2} />
      </Cylinder>
      <Sphere args={[0.05, 8, 8]} position={[-0.5, 1.0, 0.3]}>
        <meshStandardMaterial color="#ccc" metalness={0.9} roughness={0.1} />
      </Sphere>
      <Sphere args={[0.05, 8, 8]} position={[0.5, 1.0, 0.3]}>
        <meshStandardMaterial color="#ccc" metalness={0.9} roughness={0.1} />
      </Sphere>
    </group>
  );
}

// ============================================================
// 3. NEWTON’S CRADLE
// ============================================================
function NewtonsCradle() {
  const ballRefs = useRef([]);
  const angle = useRef(0);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const swing = Math.sin(t * 1.2) * 0.5;
    angle.current = swing;

    if (ballRefs.current.length === 5) {
      const ball = ballRefs.current[0];
      if (ball) {
        const radius = 1.0;
        ball.position.x = -1.2 + Math.sin(swing) * radius;
        ball.position.z = -1.2 + (1 - Math.cos(swing)) * radius;
      }
    }
  });

  return (
    <group position={[0, 0, 0]} scale={0.8}>
      <Box args={[3.0, 0.1, 1.2]} position={[0, -0.4, -0.6]}>
        <meshStandardMaterial color="#444" roughness={0.7} metalness={0.3} />
      </Box>
      <Box args={[0.1, 1.6, 0.1]} position={[-1.5, 0.6, -0.6]}>
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
      </Box>
      <Box args={[0.1, 1.6, 0.1]} position={[1.5, 0.6, -0.6]}>
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
      </Box>
      <Box args={[3.0, 0.06, 0.1]} position={[0, 1.4, -0.6]}>
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
      </Box>

      {[0, 1, 2, 3, 4].map((i) => {
        const x = -1.2 + i * 0.6;
        let rotX = 0;
        let posX = x;
        let posZ = -1.2;
        if (i === 0) {
          const swing = angle.current;
          posX = -1.2 + Math.sin(swing) * 1.0;
          posZ = -1.2 + (1 - Math.cos(swing)) * 1.0;
          rotX = -swing * 0.5;
        }
        return (
          <Cylinder
            key={i}
            args={[0.005, 0.005, 0.9]}
            position={[posX, 1.0, posZ]}
            rotation={[rotX + 0.2, 0, 0]}
          >
            <meshStandardMaterial color="#aaa" />
          </Cylinder>
        );
      })}

      {[0, 1, 2, 3, 4].map((i) => {
        const x = -1.2 + i * 0.6;
        let posX = x;
        let posZ = -1.2;
        if (i === 0) {
          const swing = angle.current;
          posX = -1.2 + Math.sin(swing) * 1.0;
          posZ = -1.2 + (1 - Math.cos(swing)) * 1.0;
        }
        return (
          <Sphere
            key={i}
            ref={(el) => (ballRefs.current[i] = el)}
            args={[0.25, 32, 32]}
            position={[posX, 0.6, posZ]}
          >
            <meshStandardMaterial
              color={i === 0 ? '#e74c3c' : '#3498db'}
              metalness={0.9}
              roughness={0.1}
              envMapIntensity={0.8}
            />
          </Sphere>
        );
      })}
    </group>
  );
}

// ============================================================
// 4. CHAIR
// ============================================================
function Chair() {
  return (
    <group position={[0, -0.5, 0]} scale={0.6}>
      <Box args={[1.6, 0.1, 1.6]} position={[0, 0.9, 0]}>
        <meshStandardMaterial color="#8B6914" roughness={0.6} metalness={0.1} />
      </Box>
      <RoundedBox args={[1.5, 0.08, 1.5]} radius={0.05} position={[0, 0.96, 0]}>
        <meshStandardMaterial color="#a0522d" roughness={0.8} />
      </RoundedBox>
      <Box args={[1.5, 0.8, 0.08]} position={[0, 1.3, -0.75]}>
        <meshStandardMaterial color="#8B6914" roughness={0.6} metalness={0.1} />
      </Box>
      <RoundedBox args={[1.5, 0.06, 0.08]} radius={0.03} position={[0, 1.72, -0.75]}>
        <meshStandardMaterial color="#8B6914" roughness={0.6} metalness={0.1} />
      </RoundedBox>
      <Cylinder args={[0.06, 0.06, 0.9]} position={[-0.6, 0.45, 0.6]}>
        <meshStandardMaterial color="#555" metalness={0.7} roughness={0.3} />
      </Cylinder>
      <Cylinder args={[0.06, 0.06, 0.9]} position={[0.6, 0.45, 0.6]}>
        <meshStandardMaterial color="#555" metalness={0.7} roughness={0.3} />
      </Cylinder>
      <Cylinder args={[0.06, 0.06, 0.9]} position={[-0.6, 0.45, -0.6]}>
        <meshStandardMaterial color="#555" metalness={0.7} roughness={0.3} />
      </Cylinder>
      <Cylinder args={[0.06, 0.06, 0.9]} position={[0.6, 0.45, -0.6]}>
        <meshStandardMaterial color="#555" metalness={0.7} roughness={0.3} />
      </Cylinder>
    </group>
  );
}

// ============================================================
// 5. MONITOR
// ============================================================
function Monitor() {
  return (
    <group position={[0, -0.2, 0]} scale={0.6}>
      <Box args={[2.0, 1.2, 0.05]} position={[0, 0.2, 0]}>
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} metalness={0.2} />
      </Box>
      <Box args={[1.8, 1.0, 0.02]} position={[0, 0.2, 0.04]}>
        <meshStandardMaterial color="#2a4a7f" emissive="#0a1a3a" emissiveIntensity={0.3} roughness={0.1} metalness={0.1} />
      </Box>
      <Box args={[1.85, 1.05, 0.01]} position={[0, 0.2, 0.02]}>
        <meshStandardMaterial color="#333" />
      </Box>
      <Box args={[0.1, 0.6, 0.1]} position={[0, -0.15, 0]}>
        <meshStandardMaterial color="#444" metalness={0.6} roughness={0.3} />
      </Box>
      <Box args={[0.8, 0.06, 0.8]} position={[0, -0.5, 0]}>
        <meshStandardMaterial color="#444" metalness={0.6} roughness={0.3} />
      </Box>
      <RoundedBox args={[0.6, 0.04, 0.6]} radius={0.02} position={[0, -0.48, 0]}>
        <meshStandardMaterial color="#555" metalness={0.5} roughness={0.3} />
      </RoundedBox>
    </group>
  );
}

// ============================================================
// 6. HAMMER
// ============================================================
function Hammer() {
  const hammerRef = useRef();

  useFrame(({ clock }) => {
    if (hammerRef.current) {
      hammerRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.8) * 0.05;
    }
  });

  return (
    <group ref={hammerRef} position={[0, -0.2, 0]} scale={0.7}>
      <Cylinder args={[0.06, 0.06, 1.6]} position={[0, -0.4, 0]} rotation={[0.1, 0, 0]}>
        <meshStandardMaterial color="#8B7355" roughness={0.8} metalness={0.05} />
      </Cylinder>
      <Cylinder args={[0.08, 0.07, 0.3]} position={[0, -0.9, 0]} rotation={[0.1, 0, 0]}>
        <meshStandardMaterial color="#5a4a3a" roughness={0.9} />
      </Cylinder>
      <group position={[0, 0.5, 0]}>
        <Box args={[0.4, 0.2, 0.15]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#888" metalness={0.9} roughness={0.2} />
        </Box>
        <Box args={[0.2, 0.2, 0.15]} position={[0.3, 0, 0]}>
          <meshStandardMaterial color="#aaa" metalness={0.9} roughness={0.2} />
        </Box>
        <Cylinder args={[0.04, 0.04, 0.2]} position={[-0.3, 0.05, 0]} rotation={[0, 0, -0.3]}>
          <meshStandardMaterial color="#aaa" metalness={0.9} roughness={0.2} />
        </Cylinder>
        <Cylinder args={[0.04, 0.04, 0.2]} position={[-0.3, -0.05, 0]} rotation={[0, 0, 0.3]}>
          <meshStandardMaterial color="#aaa" metalness={0.9} roughness={0.2} />
        </Cylinder>
        <Torus args={[0.06, 0.015, 8, 12]} position={[-0.1, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#444" metalness={0.5} roughness={0.5} />
        </Torus>
      </group>
    </group>
  );
}

// ============================================================
// 7. DEFAULT FALLBACK
// ============================================================
function DefaultObject() {
  return (
    <group>
      <Sphere args={[1, 32, 32]}>
        <meshStandardMaterial color="#666" roughness={0.4} metalness={0.6} />
      </Sphere>
      <Box args={[1.6, 0.2, 1.6]} position={[0, -1.2, 0]}>
        <meshStandardMaterial color="#888" />
      </Box>
    </group>
  );
}

// ============================================================
// MAIN – mapping and export
// ============================================================

const objectMap = {
  ammeter: Ammeter,
  transformer: Transformer,
  newtonscradle: NewtonsCradle,
  chair: Chair,
  monitor: Monitor,
  hammer: Hammer,
  // add more as needed
};

export default function ObjectScene({ objectType }) {
  const Component = objectMap[objectType] || DefaultObject;
  return (
    <Canvas camera={{ position: [3, 2, 4], fov: 40 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, -5, -5]} intensity={0.3} />
      <pointLight position={[0, 2, 3]} intensity={0.5} />
      <OrbitControls enableRotate autoRotate autoRotateSpeed={0.5} />
      <Component />
    </Canvas>
  );
}
