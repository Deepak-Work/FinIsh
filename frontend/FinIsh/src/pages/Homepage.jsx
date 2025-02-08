import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function Node({ position, label, onClick }) {
  return (
    <mesh position={position} onClick={onClick}>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshStandardMaterial color={label === "User" ? "blue" : "gray"} />
    </mesh>
  );
}

export default function HomePage() {
  const nodes = [
    { label: "Profile", position: [2, 2, 0], link: "/profile" },
    { label: "Projects", position: [-2, 2, 0], link: "/projects" },
    { label: "Contact", position: [2, -2, 0], link: "/contact" },
    { label: "Blog", position: [-2, -2, 0], link: "/blog" },
  ];

  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 2]} intensity={1} />
      <Node position={[0, 0, 0]} label="User" />
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
