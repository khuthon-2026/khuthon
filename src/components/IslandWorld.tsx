import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Line, OrbitControls, Sparkles, Stars } from "@react-three/drei";
import type { Group, Mesh } from "three";
import { Vector3 } from "three";
import { CURRENT_USER_ID, similarityScore } from "../data/tasteData";
import type { BoatTrip, BottleLetter, User } from "../types";
import { IslandModel } from "./IslandModel";

interface IslandWorldProps {
  users: User[];
  selectedUserId: string | null;
  activeBoatTrip: BoatTrip | null;
  letters: BottleLetter[];
  onSelectIsland: (userId: string | null) => void;
  onBoatComplete: () => void;
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
        <circleGeometry args={[60, 128]} />
        <meshStandardMaterial color="#052f3a" roughness={0.78} metalness={0.18} />
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
  const isBottle = trip.label.includes("유리병");

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
    const fromVector = new Vector3(from.islandPositionX, 0.28, from.islandPositionY);
    const toVector = new Vector3(to.islandPositionX, 0.28, to.islandPositionY);
    const position = fromVector.lerp(toVector, eased);
    const bob = Math.sin(elapsed * 8) * 0.08;
    groupRef.current.position.set(position.x, position.y + bob, position.z);
    groupRef.current.rotation.y = Math.atan2(
      to.islandPositionX - from.islandPositionX,
      to.islandPositionY - from.islandPositionY
    );

    if (t >= 1 && !completedRef.current) {
      completedRef.current = true;
      window.setTimeout(onComplete, 650);
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
        <group>
          <mesh castShadow>
            <boxGeometry args={[0.44, 0.14, 0.22]} />
            <meshStandardMaterial color="#fef3c7" roughness={0.45} />
          </mesh>
          <mesh position={[0, 0.24, 0]} rotation-z={-0.18} castShadow>
            <coneGeometry args={[0.18, 0.48, 3]} />
            <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={0.25} />
          </mesh>
        </group>
      )}
      <Html position={[0, 0.54, 0]} center distanceFactor={9} zIndexRange={[4, 0]}>
        <div className="boat-label">{trip.label}</div>
      </Html>
    </group>
  );
}

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

export function IslandWorld({
  users,
  selectedUserId,
  activeBoatTrip,
  letters,
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
      <color attach="background" args={["#07111f"]} />
      <fog attach="fog" args={["#07111f", 12, 34]} />
      <ambientLight intensity={1.15} />
      <directionalLight position={[5, 9, 4]} intensity={2.4} castShadow shadow-mapSize={[2048, 2048]} />
      <pointLight position={[-6, 3.2, -2]} color="#f9a8d4" intensity={16} />
      <pointLight position={[6, 2.8, 6]} color="#67e8f9" intensity={12} />
      <Stars radius={80} depth={20} count={600} factor={2.6} saturation={0.2} fade speed={0.18} />
      <Sparkles count={95} scale={18} size={1.8} speed={0.22} color="#fef3c7" />
      <OceanSurface />
      <SimilarityLines users={users} />
      <Suspense fallback={null}>
        {users.map((user) => (
          <IslandModel
            key={user.id}
            user={user}
            isCurrent={user.id === CURRENT_USER_ID}
            selected={selectedUserId === user.id}
            hasBottle={user.id === CURRENT_USER_ID && unreadBottleOnMine}
            onSelect={onSelectIsland}
          />
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
