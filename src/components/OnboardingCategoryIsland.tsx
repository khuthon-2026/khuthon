import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import { MathUtils, type Group } from "three";

interface OnboardingCategoryIslandProps {
  label: string;
  index: number;
  selected: boolean;
  merging: boolean;
}

type MiniPalette = {
  top: string;
  side: string;
  underside: string;
  accent: string;
  glow: string;
};

const palettes: MiniPalette[] = [
  { top: "#9fca83", side: "#6b9a82", underside: "#6a705f", accent: "#e6d89e", glow: "#f7df95" },
  { top: "#b7b982", side: "#7aa088", underside: "#715f50", accent: "#e8b0c2", glow: "#f8c2dc" },
  { top: "#87bda3", side: "#598d91", underside: "#596675", accent: "#9ed8e6", glow: "#b8edf6" },
  { top: "#c0b579", side: "#71996e", underside: "#6e6655", accent: "#f0bd75", glow: "#f5d58c" },
  { top: "#a2bf7d", side: "#699b8d", underside: "#596a67", accent: "#c7b7e8", glow: "#ded1ff" },
  { top: "#91b792", side: "#557f84", underside: "#4e6067", accent: "#e0cf97", glow: "#f3e5a5" }
];

function seededValue(input: string) {
  let hash = 0;

  for (const char of input) {
    hash = (hash * 33 + char.charCodeAt(0)) % 997;
  }

  return hash / 997;
}

function MiniTree({
  position,
  palette,
  scale = 1
}: {
  position: [number, number, number];
  palette: MiniPalette;
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.05, 0.25, 7]} />
        <meshStandardMaterial color="#7a6046" roughness={0.72} />
      </mesh>
      <mesh position={[0, 0.35, 0]} castShadow>
        <coneGeometry args={[0.16, 0.34, 9]} />
        <meshStandardMaterial color={palette.top} roughness={0.65} />
      </mesh>
    </group>
  );
}

function Marker({
  position,
  palette,
  seed
}: {
  position: [number, number, number];
  palette: MiniPalette;
  seed: number;
}) {
  const isDome = seed > 0.55;

  if (isDome) {
    return (
      <group position={position}>
        <mesh position={[0, 0.1, 0]} scale={[1, 0.58, 1]} castShadow>
          <sphereGeometry args={[0.18, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={palette.accent} roughness={0.48} />
        </mesh>
      </group>
    );
  }

  return (
    <group position={position} rotation-y={0.35}>
      <mesh position={[0, 0.13, 0]} castShadow>
        <cylinderGeometry args={[0.018, 0.024, 0.26, 6]} />
        <meshStandardMaterial color="#7a6046" roughness={0.72} />
      </mesh>
      <mesh position={[0, 0.28, 0]} castShadow>
        <boxGeometry args={[0.3, 0.14, 0.035]} />
        <meshStandardMaterial color={palette.accent} roughness={0.58} />
      </mesh>
    </group>
  );
}

function MiniIslandScene({ label, index, selected, merging }: OnboardingCategoryIslandProps) {
  const rootRef = useRef<Group>(null);
  const seed = useMemo(() => seededValue(`${label}-${index}`), [index, label]);
  const palette = palettes[index % palettes.length];
  const rotationOffset = (seed - 0.5) * 0.7;

  useFrame(({ clock }, delta) => {
    if (!rootRef.current) {
      return;
    }

    const targetScale = merging && selected ? 0.88 : selected ? 1.1 : 1;
    rootRef.current.rotation.y += delta * (selected ? 0.34 : 0.22);
    rootRef.current.scale.setScalar(MathUtils.lerp(rootRef.current.scale.x, targetScale, 0.08));
    rootRef.current.position.y = Math.sin(clock.elapsedTime * 1.8 + seed * 6) * 0.035;
  });

  return (
    <Float speed={1.15 + seed * 0.4} floatIntensity={0.16} rotationIntensity={0.06}>
      <group ref={rootRef} rotation-y={rotationOffset}>
        <mesh position={[0, 0.03, 0]} rotation-x={-Math.PI / 2}>
          <ringGeometry args={[1.1, selected ? 1.28 : 1.18, 64]} />
          <meshBasicMaterial color={selected ? palette.glow : "#f4e6b5"} transparent opacity={selected ? 0.42 : 0.18} />
        </mesh>

        <mesh position={[0, -0.4, 0]} scale={[1.06, 0.78, 0.94]} castShadow receiveShadow>
          <coneGeometry args={[0.92, 1.02, 9]} />
          <meshStandardMaterial color={palette.underside} roughness={0.76} />
        </mesh>
        <mesh position={[0, 0.02, 0]} scale={[1.1, 0.23, 0.92]} castShadow receiveShadow>
          <sphereGeometry args={[1, 24, 10]} />
          <meshStandardMaterial color={palette.side} roughness={0.72} />
        </mesh>
        <mesh position={[0, 0.17, 0]} scale={[1.02, 0.16, 0.84]} castShadow receiveShadow>
          <sphereGeometry args={[1, 24, 10]} />
          <meshStandardMaterial color={palette.top} roughness={0.66} />
        </mesh>

        <mesh position={[0.27, 0.31, -0.12]} rotation-x={-Math.PI / 2} receiveShadow>
          <circleGeometry args={[0.25, 24]} />
          <meshStandardMaterial color={palette.accent} roughness={0.45} metalness={0.03} />
        </mesh>

        <MiniTree position={[-0.42, 0.24, -0.22]} palette={palette} scale={0.95 + seed * 0.2} />
        <MiniTree position={[0.48, 0.22, 0.2]} palette={palette} scale={0.72} />
        <Marker position={[-0.1, 0.25, 0.42]} palette={palette} seed={seed} />

        <mesh position={[-0.56, 0.28, 0.3]} rotation={[0.2, 0.4, 0.1]} castShadow>
          <dodecahedronGeometry args={[0.09, 0]} />
          <meshStandardMaterial color={palette.underside} roughness={0.78} />
        </mesh>

        {selected && (
          <Sparkles count={18} scale={[1.6, 0.8, 1.6]} size={2.2} speed={0.28} color={palette.glow} position={[0, 0.58, 0]} />
        )}
      </group>
    </Float>
  );
}

export function OnboardingCategoryIsland(props: OnboardingCategoryIslandProps) {
  const [webglAvailable, setWebglAvailable] = useState(false);

  useEffect(() => {
    const canvas = document.createElement("canvas");

    try {
      setWebglAvailable(Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl")));
    } catch {
      setWebglAvailable(false);
    }
  }, []);

  if (!webglAvailable) {
    return <div className="category-island-3d category-island-3d-fallback" aria-hidden="true" />;
  }

  return (
    <div className="category-island-3d" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 2.7, 4.15], fov: 36 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
        shadows
      >
        <ambientLight intensity={1.05} />
        <directionalLight position={[3.5, 5, 3]} intensity={2.2} castShadow />
        <pointLight position={[-2.6, 2.2, 2.4]} color="#f4d690" intensity={5.2} />
        <MiniIslandScene {...props} />
      </Canvas>
    </div>
  );
}
