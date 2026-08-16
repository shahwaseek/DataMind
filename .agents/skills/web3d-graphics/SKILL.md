---
name: web3d-graphics
description: Guidelines and patterns for 3D web applications, Three.js, React Three Fiber (R3F), WebGL canvas rendering, 3D data visualization, lighting, and GPU-accelerated graphics.
---

# 3D Web & Interactive Graphics Skill

This skill provides reference patterns and instructions for integrating 3D graphics, WebGL canvases, Three.js scenes, and React Three Fiber components into web applications.

---

## 🧊 1. Tech Stack & Setup

- **Core Library**: `three` (@types/three)
- **React Integration**: `@react-three/fiber` (R3F)
- **Helper Utilities**: `@react-three/drei` (OrbitControls, Float, Canvas, MeshDistortMaterial, Text3D, Stars)

---

## 💡 2. Scene Architecture & Lighting

- **Camera Setup**: PerspectiveCamera with `fov: 45` or `60`, near: `0.1`, far: `1000`.
- **Lighting Model**:
  - `ambientLight`: low intensity (`0.4`) for base illumination.
  - `directionalLight`: primary light source (`intensity: 1.2`) with shadow map support.
  - `pointLight` / `spotLight`: vibrant accent lights (cyan/purple colored point lights for cinematic glow).
- **Environment**: Use dark background color (`#0a0d14`) or blurred HDRI environment maps for realistic reflections.

```tsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';

export function DataGlobe3D() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#06b6d4" />
      <pointLight position={[-10, -10, -5]} intensity={1.0} color="#a855f7" />
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh>
          <sphereGeometry args={[1.5, 64, 64]} />
          <meshStandardMaterial color="#6366f1" roughness={0.2} metalness={0.8} wireframe />
        </mesh>
      </Float>
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
    </Canvas>
  );
}
```

---

## 📊 3. 3D Data Visualizations

- **3D Bar Charts**: InstancedMesh (`THREE.InstancedMesh`) for rendering thousands of 3D data bars with individual transformations and colors efficiently.
- **Particle Systems**: `THREE.BufferGeometry` with custom Float32Array position and color attributes for data scatter plots.
- **Interactivity**: Use raycasting (`onPointerOver`, `onPointerOut`, `onClick`) on meshes to trigger data tooltips and details.

---

## ⚡ 4. WebGL Performance Optimization

- **Resource Disposal**: Dispose geometries, materials, and textures on component unmount (`geometry.dispose()`, `material.dispose()`).
- **Instancing**: Always prefer `InstancedMesh` over rendering hundreds of individual `<mesh>` nodes.
- **Frame Loop**: Use `useFrame((state, delta) => ...)` for animations rather than triggering React state re-renders every frame.
