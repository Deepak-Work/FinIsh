import React, { useState, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from 'three';

function Node({ position, label, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position}>
      <mesh 
        onClick={onClick} 
        onPointerOver={() => setHovered(true)} 
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.5 : 1}
      >
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color={hovered ? "#D8BFD8" : label === "My Profile" ? "black" : "purple"} />
      </mesh>
      <Text
        position={[0, -1, 0]} // Adjust the vertical position to place the text below the node
        fontSize={0.2}
        color="black" // Adjust color as needed
        anchorX="center"
        anchorY="top"
      >
        {label}
      </Text>
    </group>
  );
}

export default function HomePage() {
  const nodes = useMemo(() => [
    { label: "Discussion", position: [2, 3, 0], link: "/#discussion" },
    { label: "Enrollment", position: [-2, 3, 0], link: "/#enrollment" },
    { label: "Explore", position: [2, -1, 0], link: "/#explore" },
    { label: "About Us", position: [-2, -1, 0], link: "/#aboutus" },
  ], []);

  return (
    
      <Canvas camera={{ position: [0, 0, 5] }} style={{ backgroundColor: "white" }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} intensity={1} />
        <Node position={[0, 1, 0]} label="My Profile" />
        {nodes.map((node, index) => (
          <Node
            key={index}
            position={node.position}
            label={node.label}
            onClick={() => window.location.href = node.link}
          />
        ))}
        <OrbitControls />
      </Canvas>
    
  );
}
