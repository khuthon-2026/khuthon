import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Html, Sparkles, useCursor, useGLTF } from "@react-three/drei";
import {
  Box3,
  Color,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  Vector3,
  type Group,
  type Material
} from "three";
import type { IslandType, User } from "../types";

interface IslandModelProps {
  user: User;
  isCurrent: boolean;
  selected: boolean;
  hasBottle: boolean;
  leveledUp: boolean;
  onSelect: (userId: string) => void;
}

type Palette = {
  ground: string;
  side: string;
  accent: string;
  glow: string;
  detail: string;
};

const GLB_ISLAND_URL = "/models/island.glb";

const islandPalettes: Record<IslandType, Palette> = {
  dreamy: {
    ground: "#9fd7c6",
    side: "#5f8f93",
    accent: "#f1adc8",
    glow: "#f7df95",
    detail: "#c7b9ea"
  },
  volcanic: {
    ground: "#b76c55",
    side: "#6c4035",
    accent: "#e9a15f",
    glow: "#f3c06b",
    detail: "#f5dec3"
  },
  lake: {
    ground: "#8bcfc0",
    side: "#4a8a86",
    accent: "#92c9e7",
    glow: "#c7e4ef",
    detail: "#eadf9a"
  },
  "neon-city": {
    ground: "#8593a7",
    side: "#3f5065",
    accent: "#80d7df",
    glow: "#e4a7c4",
    detail: "#edd37a"
  },
  forest: {
    ground: "#8dbd78",
    side: "#55765a",
    accent: "#c5df92",
    glow: "#f0dc8a",
    detail: "#8ecbd0"
  },
  experimental: {
    ground: "#a997d0",
    side: "#625d91",
    accent: "#8ed5cc",
    glow: "#e5b7df",
    detail: "#e9cf72"
  }
};

const islandVariations: Record<
  IslandType,
  {
    scale: [number, number, number];
    rotation: number;
  }
> = {
  dreamy: { scale: [1.08, 0.92, 1.12], rotation: -0.18 },
  volcanic: { scale: [0.98, 1.16, 0.98], rotation: 0.28 },
  lake: { scale: [1.12, 0.86, 1.02], rotation: 0.08 },
  "neon-city": { scale: [1.04, 0.98, 1.08], rotation: -0.34 },
  forest: { scale: [1.08, 1.02, 1.02], rotation: 0.2 },
  experimental: { scale: [1.12, 1.08, 0.94], rotation: 0.55 }
};

function islandSeed(id: string) {
  let hash = 0;

  for (const char of id) {
    hash = (hash * 31 + char.charCodeAt(0)) % 1000;
  }

  return hash / 1000;
}

function tintMaterial(material: Material, palette: Palette, meshName: string) {
  const cloned = material.clone();
  const materialWithColor = cloned as Material & {
    color?: Color;
    emissive?: Color;
    roughness?: number;
    metalness?: number;
    envMapIntensity?: number;
    transparent?: boolean;
    opacity?: number;
  };
  const name = `${meshName} ${material.name}`.toLowerCase();
  const target =
    name.includes("water") || name.includes("sea")
      ? new Color(palette.accent)
      : name.includes("rock") || name.includes("stone") || name.includes("cliff")
        ? new Color(palette.side)
        : name.includes("tree") || name.includes("leaf") || name.includes("grass")
          ? new Color(palette.ground)
          : new Color(palette.ground);

  if (materialWithColor.color instanceof Color) {
    materialWithColor.color.lerp(target, 0.42);
  }

  if (materialWithColor.emissive instanceof Color) {
    materialWithColor.emissive.lerp(new Color(palette.glow), 0.12);
  }

  if (cloned instanceof MeshStandardMaterial) {
    cloned.roughness = Math.max(cloned.roughness, 0.62);
    cloned.metalness = Math.min(cloned.metalness, 0.12);
    cloned.envMapIntensity = Math.max(cloned.envMapIntensity, 0.75);
  }

  if (name.includes("water") || name.includes("sea")) {
    materialWithColor.transparent = true;
    materialWithColor.opacity = Math.min(materialWithColor.opacity ?? 1, 0.78);
  }

  return cloned;
}

function cloneIslandScene(scene: Group, palette: Palette) {
  const cloned = scene.clone(true) as Group;
  const initialBox = new Box3().setFromObject(cloned);
  const size = new Vector3();
  const center = new Vector3();
  initialBox.getSize(size);
  initialBox.getCenter(center);

  cloned.position.x -= center.x;
  cloned.position.z -= center.z;
  cloned.position.y -= initialBox.min.y;

  cloned.traverse((child) => {
    if (!(child instanceof Mesh)) {
      return;
    }

    child.castShadow = true;
    child.receiveShadow = true;

    if (Array.isArray(child.material)) {
      child.material = child.material.map((material) => tintMaterial(material, palette, child.name));
      return;
    }

    child.material = tintMaterial(child.material, palette, child.name);
  });

  const maxDimension = Math.max(size.x, size.z, size.y * 0.72, 1);
  const normalizeScale = 2.42 / maxDimension;

  return {
    scene: cloned,
    normalizeScale,
    normalizedHeight: size.y * normalizeScale
  };
}

function IslandLabel({
  user,
  height,
  isCurrent,
  selected
}: {
  user: User;
  height: number;
  isCurrent: boolean;
  selected: boolean;
}) {
  return (
    <Html
      position={[0, height, 0]}
      center
      zIndexRange={[4, 0]}
    >
      <div className={`world-island-label ${isCurrent ? "current" : ""} ${selected ? "selected" : ""}`}>
        <div className="world-keyword-row">
          {[user.keyword1, user.keyword2, user.keyword3].map((keyword) => (
            <span key={keyword}>{keyword}</span>
          ))}
        </div>
        <div className="world-nameplate">
          <strong>{isCurrent ? "내 섬" : user.nickname}</strong>
          <span>Lv.{user.islandLevel}</span>
        </div>
      </div>
    </Html>
  );
}

function Pebble({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <mesh position={position} rotation={[0.2, 0.4, 0.1]} castShadow>
      <dodecahedronGeometry args={[0.11, 0]} />
      <meshStandardMaterial color={color} roughness={0.76} />
    </mesh>
  );
}

function GrassTuft({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      {[0, 1, 2].map((index) => (
        <mesh
          key={index}
          position={[(index - 1) * 0.045, 0.12, Math.abs(index - 1) * 0.02]}
          rotation-z={(index - 1) * 0.24}
          castShadow
        >
          <coneGeometry args={[0.045, 0.24, 6]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function MiniTree({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.13, 0]} castShadow>
        <cylinderGeometry args={[0.026, 0.038, 0.26, 7]} />
        <meshStandardMaterial color="#8a6848" roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.36, 0]} castShadow>
        <coneGeometry args={[0.16, 0.34, 10]} />
        <meshStandardMaterial color={color} roughness={0.66} />
      </mesh>
    </group>
  );
}

function TasteSign({ position, palette }: { position: [number, number, number]; palette: Palette }) {
  return (
    <group position={position} rotation-y={-0.28}>
      <mesh position={[0, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.018, 0.024, 0.26, 6]} />
        <meshStandardMaterial color="#7c684f" roughness={0.72} />
      </mesh>
      <mesh position={[0, 0.27, 0]} castShadow>
        <boxGeometry args={[0.34, 0.16, 0.035]} />
        <meshStandardMaterial color={palette.detail} roughness={0.62} />
      </mesh>
      <mesh position={[0, 0.275, 0.022]} castShadow>
        <boxGeometry args={[0.2, 0.018, 0.012]} />
        <meshStandardMaterial color={palette.side} roughness={0.7} />
      </mesh>
    </group>
  );
}

function TinyDome({ position, palette }: { position: [number, number, number]; palette: Palette }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.12, 0]} scale={[1, 0.62, 1]} castShadow>
        <sphereGeometry args={[0.18, 18, 9, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={palette.accent} roughness={0.48} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.03, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.19, 24]} />
        <meshStandardMaterial color={palette.side} roughness={0.7} />
      </mesh>
    </group>
  );
}

function Lighthouse({ position, palette }: { position: [number, number, number]; palette: Palette }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.24, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.085, 0.48, 10]} />
        <meshStandardMaterial color="#f4efe1" roughness={0.52} />
      </mesh>
      <mesh position={[0, 0.52, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.08, 0.1, 10]} />
        <meshStandardMaterial color={palette.accent} roughness={0.42} />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <sphereGeometry args={[0.065, 16, 8]} />
        <meshStandardMaterial color={palette.glow} emissive={palette.glow} emissiveIntensity={1.1} />
      </mesh>
    </group>
  );
}

function ArchMarker({ position, palette }: { position: [number, number, number]; palette: Palette }) {
  return (
    <group position={position} rotation-y={0.35}>
      <mesh position={[-0.14, 0.17, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.035, 0.34, 8]} />
        <meshStandardMaterial color={palette.side} roughness={0.65} />
      </mesh>
      <mesh position={[0.14, 0.17, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.035, 0.34, 8]} />
        <meshStandardMaterial color={palette.side} roughness={0.65} />
      </mesh>
      <mesh position={[0, 0.35, 0]} rotation-z={Math.PI / 2} castShadow>
        <torusGeometry args={[0.14, 0.025, 8, 18, Math.PI]} />
        <meshStandardMaterial color={palette.accent} roughness={0.55} />
      </mesh>
    </group>
  );
}

function IslandDecorations({
  type,
  level,
  palette,
  seed
}: {
  type: IslandType;
  level: number;
  palette: Palette;
  seed: number;
}) {
  return (
    <group>
      <Pebble position={[-0.6, 0.08, 0.28]} color={palette.side} />
      <GrassTuft position={[0.42, 0, -0.46]} color={palette.ground} />
      {level >= 2 && <TasteSign position={[-0.22, 0, 0.7]} palette={palette} />}
      {level >= 3 && <TinyDome position={[0.44, 0, 0.28]} palette={palette} />}
      {level >= 3 && <MiniTree position={[-0.58, 0, -0.36]} color={palette.ground} />}
      {level >= 4 && <Lighthouse position={[0.78, 0, -0.42]} palette={palette} />}
      {level >= 5 && <ArchMarker position={[0.02, 0, -0.78]} palette={palette} />}
      {level >= 5 && (
        <Sparkles
          count={14}
          scale={[1.5, 0.7, 1.5]}
          size={2.1}
          speed={0.18}
          color={palette.glow}
          position={[0, 0.65, 0]}
        />
      )}
      {type === "volcanic" && <Pebble position={[0.12, 0.12, -0.12]} color="#7a4c42" />}
      {type === "lake" && <TinyDome position={[-0.34, 0, -0.1]} palette={palette} />}
      {type === "forest" && <MiniTree position={[0.18, 0, -0.64]} color={palette.ground} />}
      {type === "dreamy" && <ArchMarker position={[0.55, 0, 0.0]} palette={palette} />}
      {type === "experimental" && <ArchMarker position={[-0.44, 0, 0.18]} palette={palette} />}
      {type === "neon-city" && <TinyDome position={[-0.42, 0, -0.18]} palette={palette} />}
    </group>
  );
}

export function IslandModel({
  user,
  isCurrent,
  selected,
  hasBottle,
  leveledUp,
  onSelect
}: IslandModelProps) {
  const [hovered, setHovered] = useState(false);
  const rootRef = useRef<Group>(null);
  const gltf = useGLTF(GLB_ISLAND_URL) as { scene: Group };
  const palette = islandPalettes[user.islandType];
  const seed = islandSeed(user.id);
  const variation = islandVariations[user.islandType];
  const { scene, normalizeScale, normalizedHeight } = useMemo(
    () => cloneIslandScene(gltf.scene, palette),
    [gltf.scene, palette]
  );
  const levelScale = 1 + (user.islandLevel - 1) * 0.07;
  const currentScale = isCurrent ? 1.16 : 1;
  const seedScale = 0.96 + seed * 0.08;
  const modelScale = normalizeScale * levelScale * currentScale * seedScale;
  const labelHeight = Math.max(1.34, normalizedHeight * levelScale * currentScale + 0.62);
  const surfaceY = Math.max(0.56, normalizedHeight * levelScale * currentScale * 0.72);
  const rotationY = variation.rotation + (seed - 0.5) * 0.7;

  useCursor(hovered);
  useFrame((state) => {
    if (!rootRef.current) {
      return;
    }

    const pulse = Math.sin(state.clock.elapsedTime * 1.7 + user.islandPositionX) * 0.025;
    const levelPop = leveledUp ? Math.sin(state.clock.elapsedTime * 8) * 0.035 : 0;
    const target = selected ? 1.13 : hovered ? 1.07 : isCurrent ? 1.03 : 1;
    rootRef.current.scale.setScalar(MathUtils.lerp(rootRef.current.scale.x, target + pulse + levelPop, 0.08));
  });

  return (
    <group
      ref={rootRef}
      position={[user.islandPositionX, 0.02, user.islandPositionY]}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(user.id);
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      <Float speed={1.2} floatIntensity={0.14} rotationIntensity={0.06}>
        <group>
          <mesh position={[0, 0.035, 0]} rotation-x={-Math.PI / 2}>
            <ringGeometry args={[1.26, leveledUp ? 1.42 : 1.32, 96]} />
            <meshBasicMaterial
              color={leveledUp ? palette.glow : palette.accent}
              transparent
              opacity={leveledUp ? 0.6 : selected || isCurrent ? 0.42 : 0.16}
            />
          </mesh>
          {leveledUp && (
            <Sparkles
              count={34}
              scale={[2.7, 1.45, 2.7]}
              size={3}
              speed={0.45}
              color={palette.glow}
              position={[0, 1.1, 0]}
            />
          )}

          <group rotation-y={rotationY}>
            <primitive
              object={scene}
              scale={[
                modelScale * variation.scale[0],
                modelScale * variation.scale[1],
                modelScale * variation.scale[2]
              ]}
            />

            <group position={[0, surfaceY, 0]} scale={0.92 + user.islandLevel * 0.06}>
              <IslandDecorations
                type={user.islandType}
                level={user.islandLevel}
                palette={palette}
                seed={seed}
              />
            </group>

            {hasBottle && (
              <group position={[-1.08, surfaceY + 0.12, 0.66]} rotation-z={0.6}>
                <mesh>
                  <capsuleGeometry args={[0.08, 0.22, 6, 12]} />
                  <meshStandardMaterial
                    color="#a7f3d0"
                    transparent
                    opacity={0.72}
                    emissive="#2dd4bf"
                    emissiveIntensity={0.25}
                  />
                </mesh>
              </group>
            )}
          </group>

          <IslandLabel user={user} height={labelHeight} isCurrent={isCurrent} selected={selected} />
        </group>
      </Float>
    </group>
  );
}

useGLTF.preload(GLB_ISLAND_URL);
