import React, { useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Line } from "@react-three/drei";
import { useNavigate } from 'react-router-dom';
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
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={hovered ? "#D8BFD8" : label === "My Profile" ? "black" : "purple"} />
      </mesh>
      <Text
        position={[0, -1, 0]}
        fontSize={0.2}
        color="black"
        anchorX="center"
        anchorY="top"
      >
        {label}
      </Text>
    </group>
  );
}

function Connections({ nodes }) {
  return (
    <>
      {nodes.map((node, index) => (
        <Line
          key={index}
          points={[[0, 1, 0], node.position]} // Connecting My Profile to each node
          color="gray"
          lineWidth={2}
        />
      ))}
    </>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const nodes = useMemo(() => [
    { label: "Discussion", position: [2, 3, 0], link: "/discussion" },
    { label: "Enrollment", position: [-2, 3, 0], link: "/enrollment" },
    { label: "Explore", position: [2, -1, 0], link: "/explore" },
    { label: "Sections", position: [-2, -1, 0], link: "/sections" },
  ], []);

  const handleNodeClick = (link) => {
    if (link) {
      navigate(link);
    }
  };

  return (
    <Canvas camera={{ position: [0, 0, 6] }} style={{ background: "linear-gradient(to bottom, #f0f0f0, #d8bfd8)" }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 2, 2]} intensity={1} />
      <Connections nodes={nodes} />
      <Node position={[0, 1, 0]} label="My Profile" />
      {nodes.map((node, index) => (
        <Node
          key={index}
          position={node.position}
          label={node.label}
          onClick={() => handleNodeClick(node.link)}
        />
      ))}
      <OrbitControls />
    </Canvas>
  );
}
