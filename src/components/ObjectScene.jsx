import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Box, Cylinder,Text } from '@react-three/drei';
import * as THREE from 'three';

// ------------------------------
// Individual object animations
// ------------------------------

function Ammeter() {
  const needleRef = useRef();
  useFrame(({ clock }) => {
    // Sweep needle back and forth
    const t = Math.sin(clock.getElapsedTime() * 0.8) * 0.7 + 0.7;
    if (needleRef.current) {
      needleRef.current.rotation.z = t * 1.2 - 0.6;
    }
  });
  return (
    <group>
      {/* Dial face */}
      <Cylinder args={[1.2, 1.2, 0.15, 32]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#2d2d2d" roughness={0.7} metalness={0.3} />
      </Cylinder>
      {/* Scale markings - simplified */}
      <Box args={[0.02, 0.2, 0.02]} position={[0.8, 0, 0.1]}>
        <meshStandardMaterial color="#fff" />
      </Box>
      <Box args={[0.02, 0.2, 0.02]} position={[-0.8, 0, 0.1]}>
        <meshStandardMaterial color="#fff" />
      </Box>
      {/* Needle */}
      <Box ref={needleRef} args={[0.04, 0.8, 0.02]} position={[0, 0.4, 0.1]}>
        <meshStandardMaterial color="#ff4444" emissive="#ff0000" emissiveIntensity={0.5} />
      </Box>
      {/* Center dot */}
      <Sphere args={[0.08, 16, 16]} position={[0, 0, 0.1]}>
        <meshStandardMaterial color="#888" />
      </Sphere>
      {/* Text label */}
      <Text position={[0, -0.9, 0.1]} fontSize={0.2} color="white">
        A
      </Text>
    </group>
  );
}

function Transformer() {
  const coilRef = useRef();
  useFrame(({ clock }) => {
    if (coilRef.current) {
      coilRef.current.rotation.y = clock.getElapsedTime() * 0.5;
    }
  });
  return (
    <group>
      {/* Core */}
      <Box args={[1.2, 1.8, 0.8]}>
        <meshStandardMaterial color="#4a4a4a" roughness={0.6} metalness={0.4} />
      </Box>
      {/* Coils */}
      <group ref={coilRef}>
        <Cylinder args={[0.6, 0.6, 0.3, 16]} position={[0.7, 0, 0]}>
          <meshStandardMaterial color="#b8860b" metalness={0.8} roughness={0.3} />
        </Cylinder>
        <Cylinder args={[0.6, 0.6, 0.3, 16]} position={[-0.7, 0, 0]}>
          <meshStandardMaterial color="#b8860b" metalness={0.8} roughness={0.3} />
        </Cylinder>
      </group>
      {/* Wires */}
      <Box args={[0.1, 0.4, 0.1]} position={[0.7, 1.0, 0]}>
        <meshStandardMaterial color="#ffaa00" />
      </Box>
      <Box args={[0.1, 0.4, 0.1]} position={[-0.7, -1.0, 0]}>
        <meshStandardMaterial color="#ffaa00" />
      </Box>
    </group>
  );
}

function NewtonsCradle() {
  const balls = useRef([]);
  const [swing, setSwing] = useState(0);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Swing the first ball
    const angle = Math.sin(t * 1.5) * 0.6;
    if (balls.current.length === 5) {
      balls.current[0].position.x = -1.2 + Math.sin(angle) * 1.2;
      balls.current[0].position.z = -1.2 + (1 - Math.cos(angle)) * 1.2;
      // others stay mostly still, but we can add small damping
    }
  });

  return (
    <group>
      {/* Frame */}
      <Box args={[3.0, 0.1, 0.1]} position={[0, 1.5, 0]}>
        <meshStandardMaterial color="#aaa" metalness={0.7} roughness={0.3} />
      </Box>
      <Box args={[0.1, 1.5, 0.1]} position={[-1.5, 0.75, 0]}>
        <meshStandardMaterial color="#aaa" metalness={0.7} roughness={0.3} />
      </Box>
      <Box args={[0.1, 1.5, 0.1]} position={[1.5, 0.75, 0]}>
        <meshStandardMaterial color="#aaa" metalness={0.7} roughness={0.3} />
      </Box>
      {/* Balls */}
      {[0, 1, 2, 3, 4].map((i) => (
        <Sphere
          key={i}
          ref={(el) => (balls.current[i] = el)}
          args={[0.25, 32, 32]}
          position={[-1.2 + i * 0.6, 0.6, -1.2]}
        >
          <meshStandardMaterial
            color={i === 0 ? '#ff6b6b' : '#4ecdc4'}
            metalness={0.8}
            roughness={0.2}
          />
        </Sphere>
      ))}
      {/* Strings (visual lines) */}
      {[0, 1, 2, 3, 4].map((i) => (
        <Cylinder
          key={`string-${i}`}
          args={[0.01, 0.01, 0.9]}
          position={[-1.2 + i * 0.6, 1.0, -1.2]}
          rotation={[0.2, 0, 0]}
        >
          <meshStandardMaterial color="#aaa" />
        </Cylinder>
      ))}
    </group>
  );
}

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
// Main Component: choose based on label
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
    <Canvas camera={{ position: [3, 2, 4], fov: 45 }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, -5, -5]} intensity={0.3} />
      <OrbitControls enableRotate autoRotate autoRotateSpeed={0.5} />
      <Component />
    </Canvas>
  );
}
