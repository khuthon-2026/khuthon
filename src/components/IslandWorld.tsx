import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Line, OrbitControls, useGLTF } from "@react-three/drei";
import type { Group, Mesh, ShaderMaterial } from "three";
import { BackSide, MathUtils, Vector3 } from "three";
import { CURRENT_USER_ID, similarityScore } from "../data/tasteData";
import type { BoatTrip, BottleLetter, User } from "../types";
import { IslandModel } from "./IslandModel";

interface IslandWorldProps {
  users: User[];
  selectedUserId: string | null;
  activeBoatTrip: BoatTrip | null;
  letters: BottleLetter[];
  recentlyLeveledUpId: string | null;
  onSelectIsland: (userId: string | null) => void;
  onBoatComplete: () => void;
}

function clampLevel(level: number) {
  return Math.min(5, Math.max(1, Math.round(level)));
}

function boatGlbUrl(level: number) {
  return `/models/boats/boat-lv${clampLevel(level)}.glb`;
}

function OceanSurface() {
  const ringRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.035;
    }
  });

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <circleGeometry args={[160, 128]} />
        <meshStandardMaterial
          color="#0b5a6a"
          roughness={0.95}
          metalness={0.02}
          transparent
          opacity={0.98}
        />
      </mesh>
      <mesh ref={ringRef} rotation-x={-Math.PI / 2} position={[0, 0.015, 0]}>
        <ringGeometry args={[7, 7.03, 120]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.23} />
      </mesh>
      {[12, 18, 27, 38].map((radius, index) => (
        <mesh key={radius} rotation-x={-Math.PI / 2} position={[0, 0.01 + index * 0.003, 0]}>
          <ringGeometry args={[radius, radius + 0.025, 128]} />
          <meshBasicMaterial color={index % 2 ? "#f9a8d4" : "#99f6e4"} transparent opacity={0.08} />
        </mesh>
      ))}
    </group>
  );
}

function LikeBoatModel({ level }: { level: number }) {
  const gltf = useGLTF(boatGlbUrl(level)) as { scene: Group };
  const ref = useRef<Group>(null);
  const clamped = clampLevel(level);
  // 조정 포인트: 배가 너무 작으면 여기서 키우면 됨 (현재 4배)
  const baseScale = (0.24 + clamped * 0.035) * 4;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    // 아주 미세한 출렁임(과장 금지)
    ref.current.position.y = Math.sin(clock.elapsedTime * 1.2 + clamped) * 0.03;
    ref.current.rotation.z = MathUtils.lerp(ref.current.rotation.z, Math.sin(clock.elapsedTime * 0.9) * 0.06, 0.06);
  });

  return (
    // 모델 기본 정면이 옆을 보는 경우가 있어, 이동 방향 기준으로 시계방향 90도 보정
    <group ref={ref} renderOrder={10} rotation-y={Math.PI - Math.PI / 2}>
      <primitive object={gltf.scene} scale={[baseScale, baseScale, baseScale]} />
    </group>
  );
}

function BoatTripModel({
  trip,
  users,
  onComplete
}: {
  trip: BoatTrip;
  users: User[];
  onComplete: () => void;
}) {
  const groupRef = useRef<Group>(null);
  const startRef = useRef<number | null>(null);
  const completedRef = useRef(false);
  const from = users.find((user) => user.id === trip.fromUserId);
  const to = users.find((user) => user.id === trip.toUserId);
  const isBottle = trip.kind === "letter";
  // 좋아요: 상대(to)의 배가 나(from)에게 옴 → 모델·출발지는 상대 섬 레벨
  const boatLevel = trip.kind === "like" ? (to?.islandLevel ?? 1) : (from?.islandLevel ?? 1);

  useFrame(({ clock }) => {
    if (!from || !to || !groupRef.current) {
      return;
    }

    if (startRef.current === null) {
      startRef.current = clock.elapsedTime;
    }

    const elapsed = clock.elapsedTime - startRef.current;
    const t = Math.min(1, elapsed / 3.2);
    const eased = 1 - Math.pow(1 - t, 3);

    const fromCenter = new Vector3(from.islandPositionX, 0.28, from.islandPositionY);
    const toCenter = new Vector3(to.islandPositionX, 0.28, to.islandPositionY);

    let startVector: Vector3;
    let endVector: Vector3;
    let faceDx: number;
    let faceDz: number;

    if (trip.kind === "like") {
      // 상대(to) 출발 → 나(from) 쪽 외곽으로 정박
      const travel = new Vector3(
        from.islandPositionX - to.islandPositionX,
        0,
        from.islandPositionY - to.islandPositionY
      );
      if (travel.lengthSq() > 0.0001) {
        travel.normalize();
      } else {
        travel.set(0, 0, 1);
      }
      const offFromThem = 1.85 + (to.islandLevel - 1) * 0.25;
      const offNearMe = 1.85 + (from.islandLevel - 1) * 0.25;
      startVector = toCenter.clone().addScaledVector(travel, offFromThem);
      endVector = fromCenter.clone().addScaledVector(travel, -offNearMe);
      faceDx = travel.x;
      faceDz = travel.z;
    } else {
      // 유리병: 내가 보내는 경로 (from → to)
      const dir = new Vector3(
        to.islandPositionX - from.islandPositionX,
        0,
        to.islandPositionY - from.islandPositionY
      );
      if (dir.lengthSq() > 0.0001) {
        dir.normalize();
      } else {
        dir.set(0, 0, 1);
      }
      const arrivalOffset = 1.85 + (to.islandLevel - 1) * 0.25;
      startVector = fromCenter.clone();
      endVector = toCenter.clone().addScaledVector(dir, -arrivalOffset);
      faceDx = to.islandPositionX - from.islandPositionX;
      faceDz = to.islandPositionY - from.islandPositionY;
    }

    const position = startVector.lerp(endVector, eased);
    const bob = Math.sin(elapsed * 8) * 0.08;
    groupRef.current.position.set(position.x, position.y + bob, position.z);
    groupRef.current.rotation.y = Math.atan2(faceDx, faceDz);

    if (t >= 1 && !completedRef.current) {
      completedRef.current = true;
      // 섬 외곽에 정박 후 1초 뒤 사라짐
      window.setTimeout(onComplete, 1000);
    }
  });

  if (!from || !to) {
    return null;
  }

  return (
    <group ref={groupRef}>
      {isBottle ? (
        <mesh rotation-z={Math.PI / 2} castShadow>
          <capsuleGeometry args={[0.12, 0.44, 8, 16]} />
          <meshStandardMaterial color="#99f6e4" transparent opacity={0.78} emissive="#2dd4bf" emissiveIntensity={0.5} />
        </mesh>
      ) : (
        <LikeBoatModel level={boatLevel} />
      )}
      <Html position={[0, 0.54, 0]} center distanceFactor={9} zIndexRange={[4, 0]}>
        <div className="boat-label">{trip.label}</div>
      </Html>
    </group>
  );
}

useGLTF.preload(boatGlbUrl(1));
useGLTF.preload(boatGlbUrl(2));
useGLTF.preload(boatGlbUrl(3));
useGLTF.preload(boatGlbUrl(4));
useGLTF.preload(boatGlbUrl(5));

function SimilarityLines({ users }: { users: User[] }) {
  const current = users.find((user) => user.id === CURRENT_USER_ID);
  const lines = useMemo(() => {
    if (!current) {
      return [];
    }

    return users
      .filter((user) => user.id !== CURRENT_USER_ID)
      .map((user) => ({
        user,
        score: similarityScore(current, user)
      }));
  }, [current, users]);

  if (!current) {
    return null;
  }

  return (
    <>
      {lines.map(({ user, score }) => (
        <Line
          key={user.id}
          points={[
            [current.islandPositionX, 0.05, current.islandPositionY],
            [user.islandPositionX, 0.05, user.islandPositionY]
          ]}
          color={score > 0.45 ? "#f9a8d4" : score > 0.22 ? "#67e8f9" : "#94a3b8"}
          transparent
          opacity={0.12 + score * 0.38}
          lineWidth={score > 0.45 ? 2.8 : 1.3}
          dashed={score < 0.25}
          dashSize={0.5}
          gapSize={0.35}
        />
      ))}
    </>
  );
}

function SeaBackdrop() {
  const materialRef = useRef<ShaderMaterial>(null);

  return (
    <mesh scale={420}>
      <sphereGeometry args={[1, 48, 48]} />
      <shaderMaterial
        ref={materialRef}
        side={BackSide}
        uniforms={{
          uSkyTop: { value: new Vector3(0.66, 0.92, 0.98) },
          uSkyNear: { value: new Vector3(0.40, 0.82, 0.96) },
          uHorizon: { value: new Vector3(0.78, 0.96, 0.98) },
          uSeaNear: { value: new Vector3(0.05, 0.46, 0.58) },
          uSeaDeep: { value: new Vector3(0.02, 0.14, 0.20) }
        }}
        vertexShader={`
          varying vec3 vWorldDir;
          void main() {
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldDir = normalize(worldPosition.xyz - cameraPosition);
            gl_Position = projectionMatrix * viewMatrix * worldPosition;
          }
        `}
        fragmentShader={`
          precision highp float;
          varying vec3 vWorldDir;
          uniform vec3 uSkyTop;
          uniform vec3 uSkyNear;
          uniform vec3 uHorizon;
          uniform vec3 uSeaNear;
          uniform vec3 uSeaDeep;

          void main() {
            // y: -1(아래) ~ +1(위)
            float y = clamp(vWorldDir.y * 0.5 + 0.5, 0.0, 1.0);

            // 0.0(아래)~1.0(위)에서 수평선 위치
            const float horizonY = 0.58;

            // 하늘: 위쪽은 밝고, 수평선 근처는 살짝 하얀 안개
            float skyT = smoothstep(horizonY, 1.0, y);
            vec3 sky = mix(uSkyNear, uSkyTop, skyT);
            float horizonHaze = smoothstep(horizonY - 0.06, horizonY + 0.05, y) * (1.0 - smoothstep(horizonY + 0.05, horizonY + 0.16, y));
            sky = mix(sky, uHorizon, horizonHaze * 0.65);

            // 바다: 수평선 근처가 더 밝고 아래로 갈수록 깊은 톤
            float seaT = smoothstep(0.0, horizonY, y);
            vec3 sea = mix(uSeaDeep, uSeaNear, seaT);

            // 최종: 수평선 기준으로 부드럽게 블렌딩
            float mixT = smoothstep(horizonY - 0.01, horizonY + 0.06, y);
            vec3 color = mix(sea, sky, mixT);

            gl_FragColor = vec4(color, 1.0);
          }
        `}
      />
    </mesh>
  );
}

export function IslandWorld({
  users,
  selectedUserId,
  activeBoatTrip,
  letters,
  recentlyLeveledUpId,
  onSelectIsland,
  onBoatComplete
}: IslandWorldProps) {
  const unreadBottleOnMine = letters.some(
    (letter) => letter.toUserId === CURRENT_USER_ID && !letter.isOpened
  );

  return (
    <Canvas
      className="world-canvas"
      shadows
      camera={{ position: [0, 8.4, 12.5], fov: 45 }}
      onPointerMissed={() => onSelectIsland(null)}
    >
      <color attach="background" args={["#87dff5"]} />
      <fog attach="fog" args={["#0c3f4f", 18, 46]} />
      <SeaBackdrop />
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 9, 4]} intensity={2.4} castShadow shadow-mapSize={[2048, 2048]} />
      <pointLight position={[-6, 3.2, -2]} color="#f9a8d4" intensity={16} />
      <pointLight position={[6, 2.8, 6]} color="#67e8f9" intensity={12} />
      <OceanSurface />
      <SimilarityLines users={users} />
      <Suspense fallback={null}>
        {users.map((user) => (
          <group key={user.id}>
            <IslandModel
              user={user}
              isCurrent={user.id === CURRENT_USER_ID}
              selected={selectedUserId === user.id}
              hasBottle={user.id === CURRENT_USER_ID && unreadBottleOnMine}
              leveledUp={user.id === recentlyLeveledUpId}
              onSelect={onSelectIsland}
            />
          </group>
        ))}
      </Suspense>
      {activeBoatTrip && (
        <BoatTripModel key={activeBoatTrip.id} trip={activeBoatTrip} users={users} onComplete={onBoatComplete} />
      )}
      <OrbitControls
        makeDefault
        target={[0, 0, 0]}
        minDistance={5}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2.25}
        enableDamping
        dampingFactor={0.07}
      />
    </Canvas>
  );
}
