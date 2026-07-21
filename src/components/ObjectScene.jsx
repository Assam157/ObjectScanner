import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Box, Cylinder, Text, Torus, Ring, Plane, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// ------------------------------
// Realistic Ammeter
// ------------------------------
function Ammeter() {
  const needleRef = useRef();

  useFrame(({ clock }) => {
    // Sweep needle smoothly between 0 and 1
    const t = Math.sin(clock.getElapsedTime() * 0.6) * 0.5 + 0.5;
    if (needleRef.current) {
      needleRef.current.rotation.z = -0.8 + t * 1.6; // from -0.8 to 0.8 rad
    }
  });

  return (
    <group position={[0, 0, 0]} scale={0.8}>
      {/* Base / housing */}
      <Cylinder args={[1.5, 1.5, 0.3, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#3a3a3a" roughness={0.6} metalness={0.4} />
      </Cylinder>

      {/* Bezel (ring) */}
      <Torus args={[1.4, 0.08, 16, 48]} position={[0, 0, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#aaa" metalness={0.8} roughness={0.2} />
      </Torus>

      {/* Dial face (slightly inset) */}
      <Cylinder args={[1.3, 1.3, 0.05, 32]} position={[0, 0, 0.12]}>
        <meshStandardMaterial color="#f5f5f0" roughness={0.4} metalness={0.1} />
      </Cylinder>

      {/* Scale markings (ticks) */}
      {Array.from({ length: 13 }, (_, i) => {
        const angle = -0.8 + (i / 12) * 1.6;
        const x = Math.sin(angle) * 1.1;
        const z = Math.cos(angle) * 1.1 - 0.1;
        const length = i % 5 === 0 ? 0.15 : 0.08;
        return (
          <Box
            key={i}
            args={[0.02, 0.02, length]}
            position={[x, 0.12, z]}
            rotation={[0, -angle, 0]}
          >
            <meshStandardMaterial color="#222" />
          </Box>
        );
      })}

      {/* Needle with pivot */}
      <group position={[0, 0, 0.2]}>
        <Box ref={needleRef} args={[0.04, 0.02, 0.9]} position={[0, 0, 0.45]} rotation={[0, 0, 0]}>
          <meshStandardMaterial color="#d32f2f" emissive="#d32f2f" emissiveIntensity={0.3} metalness={0.2} roughness={0.6} />
        </Box>
        <Sphere args={[0.06, 12, 12]}>
          <meshStandardMaterial color="#555" metalness={0.9} roughness={0.2} />
        </Sphere>
      </group>

      {/* Glass cover */}
      <Sphere args={[1.3, 32, 32]} position={[0, 0, 0.22]} scale={[1, 1, 0.06]}>
        <meshStandardMaterial color="#ffffff" transparent opacity={0.15} roughness={0.05} metalness={0.1} envMapIntensity={0.5} />
      </Sphere>

      {/* Label "A" */}
      <Text position={[0, 0, 0.25]} fontSize={0.25} color="#222" anchorX="center" anchorY="middle">
        A
      </Text>
    </group>
  );
}

// ------------------------------
// Realistic Transformer
// ------------------------------
function Transformer() {
  const coilRef = useRef();

  useFrame(({ clock }) => {
    if (coilRef.current) {
      coilRef.current.rotation.y = clock.getElapsedTime() * 0.4;
    }
  });

  return (
    <group position={[0, 0, 0]} scale={0.7}>
      {/* Base plate */}
      <Box args={[2.2, 0.15, 1.6]} position={[0, -0.9, 0]}>
        <meshStandardMaterial color="#555" roughness={0.7} metalness={0.3} />
      </Box>

      {/* Core (E-shaped simplified) */}
      <group position={[0, 0.2, 0]}>
        {/* Center leg */}
        <Box args={[0.3, 1.2, 0.4]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#2a2a2a" roughness={0.8} metalness={0.2} />
        </Box>
        {/* Outer legs */}
        <Box args={[0.25, 1.0, 0.4]} position={[-0.7, -0.1, 0]}>
          <meshStandardMaterial color="#2a2a2a" roughness={0.8} metalness={0.2} />
        </Box>
        <Box args={[0.25, 1.0, 0.4]} position={[0.7, -0.1, 0]}>
          <meshStandardMaterial color="#2a2a2a" roughness={0.8} metalness={0.2} />
        </Box>
        {/* Top yoke */}
        <Box args={[1.6, 0.2, 0.4]} position={[0, 0.6, 0]}>
          <meshStandardMaterial color="#2a2a2a" roughness={0.8} metalness={0.2} />
        </Box>
        {/* Bottom yoke */}
        <Box args={[1.6, 0.2, 0.4]} position={[0, -0.6, 0]}>
          <meshStandardMaterial color="#2a2a2a" roughness={0.8} metalness={0.2} />
        </Box>
      </group>

      {/* Windings (coils) */}
      <group ref={coilRef} position={[0, 0.2, 0]}>
        <Cylinder args={[0.5, 0.5, 0.6, 24]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#b87333" metalness={0.8} roughness={0.3} />
        </Cylinder>
        <Cylinder args={[0.45, 0.45, 0.65, 24]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#8b5a2b" metalness={0.6} roughness={0.5} />
        </Cylinder>
        {/* Wire ends */}
        <Cylinder args={[0.04, 0.04, 0.3]} position={[0.35, 0.3, 0.5]} rotation={[0.3, 0, 0]}>
          <meshStandardMaterial color="#ffaa00" metalness={0.9} roughness={0.2} />
        </Cylinder>
        <Cylinder args={[0.04, 0.04, 0.3]} position={[-0.35, -0.3, 0.5]} rotation={[-0.3, 0, 0]}>
          <meshStandardMaterial color="#ffaa00" metalness={0.9} roughness={0.2} />
        </Cylinder>
      </group>

      {/* Terminal posts on top */}
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

// ------------------------------
// Realistic Newton's Cradle
// ------------------------------
function NewtonsCradle() {
  const ballRefs = useRef([]);
  const angle = useRef(0);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const swing = Math.sin(t * 1.2) * 0.5; // max angle ~0.5 rad
    angle.current = swing;

    // Move only the first ball (index 0)
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
      {/* Base */}
      <Box args={[3.0, 0.1, 1.2]} position={[0, -0.4, -0.6]}>
        <meshStandardMaterial color="#444" roughness={0.7} metalness={0.3} />
      </Box>

      {/* Frame uprights */}
      <Box args={[0.1, 1.6, 0.1]} position={[-1.5, 0.6, -0.6]}>
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
      </Box>
      <Box args={[0.1, 1.6, 0.1]} position={[1.5, 0.6, -0.6]}>
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
      </Box>
      {/* Top bar */}
      <Box args={[3.0, 0.06, 0.1]} position={[0, 1.4, -0.6]}>
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
      </Box>

      {/* Strings (thin cylinders) */}
      {[0, 1, 2, 3, 4].map((i) => {
        const x = -1.2 + i * 0.6;
        // For the first ball, we need to tilt the string to follow the ball
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

      {/* Balls */}
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

// ------------------------------
// Default fallback (a generic object)
// ------------------------------
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

// ------------------------------
// Main Component
// ------------------------------
const objectMap = {
  ammeter: Ammeter,
  transformer: Transformer,
  newtonscradle: NewtonsCradle,
  // add more: resistor, capacitor, etc.
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