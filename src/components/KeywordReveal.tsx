import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls, Sparkles } from "@react-three/drei";
import { motion } from "framer-motion";
import { UploadCloud, Waves } from "lucide-react";
import { CURRENT_USER_ID } from "../data/tasteData";
import { useAppStore } from "../store/useAppStore";
import { IslandModel } from "./IslandModel";

export function KeywordReveal() {
  const goTo = useAppStore((state) => state.goTo);
  const currentUser = useAppStore((state) =>
    state.users.find((user) => user.id === CURRENT_USER_ID)
  );

  if (!currentUser) {
    return null;
  }

  const keywords = [currentUser.keyword1, currentUser.keyword2, currentUser.keyword3];

  return (
    <main className="keyword-screen">
      <section className="keyword-copy">
        <motion.span
          className="eyebrow"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Waves size={16} />
          내 취향 섬 생성 완료
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          세 개의 키워드가 섬 위에 떠올랐어요.
        </motion.h2>
        <div className="keyword-stack">
          {keywords.map((keyword, index) => (
            <motion.div
              className="keyword-token"
              key={keyword}
              initial={{ opacity: 0, y: 34, scale: 0.88 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.25 + index * 0.16, type: "spring", stiffness: 180 }}
            >
              <span>0{index + 1}</span>
              {keyword}
            </motion.div>
          ))}
        </div>
        <p className="identity-copy">
          대표 키워드 <strong>{currentUser.mainKeyword}</strong>를 기준으로{" "}
          <strong>{currentUser.islandType}</strong> 형태의 섬을 만들었습니다.{" "}
          {currentUser.tasteDescription}
        </p>
        <div className="keyword-actions">
          <button className="primary-button" onClick={() => goTo("upload")}>
            <UploadCloud size={18} />
            데이터 업로드로 섬 채우기
          </button>
          <button className="secondary-button" onClick={() => goTo("world")}>
            샘플 월드 바로 항해
          </button>
        </div>
      </section>

      <section className="island-preview-card">
        <Canvas shadows camera={{ position: [0, 4.8, 6.8], fov: 42 }}>
          <color attach="background" args={["#07111f"]} />
          <fog attach="fog" args={["#07111f", 8, 18]} />
          <ambientLight intensity={1.3} />
          <directionalLight position={[3, 6, 4]} intensity={2.2} castShadow />
          <pointLight position={[-4, 2, -2]} color="#67e8f9" intensity={8} />
          <Sparkles count={80} scale={7} size={2.5} speed={0.25} color="#fef3c7" />
          <Suspense fallback={null}>
            <Float floatIntensity={0.35} rotationIntensity={0.25}>
              <IslandModel
                user={currentUser}
                isCurrent
                selected
                hasBottle={false}
                leveledUp={false}
                onSelect={() => undefined}
              />
            </Float>
          </Suspense>
          <OrbitControls enablePan={false} minDistance={4.5} maxDistance={8} autoRotate autoRotateSpeed={0.85} />
        </Canvas>
        <div className="preview-caption">
          <strong>대표 키워드가 섬 형태를 결정합니다.</strong>
          <span>외힙은 네온 항구, 몽환적은 둥근 구름섬, 실험적은 비정형 군도로 변합니다.</span>
        </div>
      </section>
    </main>
  );
}
