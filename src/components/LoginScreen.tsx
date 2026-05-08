import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Box3, Mesh, Vector3, type Group } from "three";
import { Anchor, Compass, Sparkles, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../store/useAppStore";
import { SocialLoginModal, type SocialProvider } from "./SocialLoginModal";

const LOGIN_ISLAND_GLB = "/models/island-lv1.glb";

function prepareLoginIslandScene(scene: Group) {
  const cloned = scene.clone(true) as Group;
  const initialBox = new Box3().setFromObject(cloned);
  const size = new Vector3();
  const center = new Vector3();
  initialBox.getSize(size);
  initialBox.getCenter(center);

  cloned.position.x -= center.x;
  cloned.position.y -= center.y;
  cloned.position.z -= center.z;

  cloned.traverse((child) => {
    if (!(child instanceof Mesh)) return;
    child.castShadow = true;
    child.receiveShadow = true;
  });

  const maxDimension = Math.max(size.x, size.z, size.y * 0.72, 1);
  const normalizeScale = 2.42 / maxDimension;
  return { scene: cloned, normalizeScale };
}

const LOGIN_ISLAND_YAW_IDLE = Math.PI + -0.48;
const LOGIN_ISLAND_SPIN = 2 * Math.PI / 40;
const LOGIN_ISLAND_SCREEN_SCALE = 1.45;
const LOGIN_ISLAND_FRAMING_Y = -0.16;

function LoginIslandModel() {
  const gltf = useGLTF(LOGIN_ISLAND_GLB) as { scene: Group };
  const prepared = useMemo(() => prepareLoginIslandScene(gltf.scene), [gltf.scene]);
  const rootRef = useRef<Group>(null);

  useFrame((state) => {
    if (!rootRef.current) return;
    rootRef.current.rotation.y = LOGIN_ISLAND_YAW_IDLE + state.clock.elapsedTime * LOGIN_ISLAND_SPIN;
  });

  return (
    <group position={[0, LOGIN_ISLAND_FRAMING_Y, 0]}>
      <group ref={rootRef}>
        <primitive object={prepared.scene} scale={prepared.normalizeScale * LOGIN_ISLAND_SCREEN_SCALE} />
      </group>
    </group>
  );
}

/* 소셜 로그인 선택 화면 */
const SOCIAL_BUTTONS: {
  provider: SocialProvider;
  label: string;
  bg: string;
  color: string;
  border?: string;
  logo: JSX.Element;
}[] = [
  {
    provider: "google",
    label: "Google로 계속하기",
    bg: "#fff",
    color: "#3c4043",
    border: "1px solid #dadce0",
    logo: (
      <svg width="18" height="18" viewBox="0 0 74 24">
        <path d="M24.9 12.2c0-.8-.1-1.6-.2-2.4H12.7v4.6h6.8c-.3 1.6-1.2 2.9-2.6 3.8v3.1h4.2c2.4-2.3 3.8-5.6 3.8-9.1z" fill="#4285F4" />
        <path d="M12.7 24c3.4 0 6.3-1.1 8.4-3l-4.2-3.2c-1.1.8-2.6 1.2-4.2 1.2-3.2 0-6-2.2-7-5.1H1.5v3.3C3.5 21.3 7.8 24 12.7 24z" fill="#34A853" />
        <path d="M5.7 13.9c-.3-.8-.4-1.6-.4-2.4s.1-1.6.4-2.4V5.8H1.5C.5 7.7 0 9.8 0 12s.5 4.3 1.5 6.2l4.2-3.3z" fill="#FBBC05" />
        <path d="M12.7 4.8c1.8 0 3.4.6 4.7 1.8l3.5-3.5C18.9 1.1 16 0 12.7 0 7.8 0 3.5 2.7 1.5 6.7l4.2 3.3c1-2.9 3.7-5.2 7-5.2z" fill="#EA4335" />
      </svg>
    ),
  },
  {
    provider: "kakao",
    label: "카카오로 계속하기",
    bg: "#FEE500",
    color: "#3c1e1e",
    logo: (
      <svg width="18" height="16" viewBox="0 0 56 52" fill="none">
        <ellipse cx="28" cy="24" rx="28" ry="24" fill="#3c1e1e" />
        <ellipse cx="19" cy="38" rx="7" ry="5" fill="#3c1e1e" transform="rotate(-30 19 38)" />
        <ellipse cx="16" cy="20" rx="3" ry="4" fill="#FEE500" />
        <ellipse cx="28" cy="20" rx="3" ry="4" fill="#FEE500" />
        <ellipse cx="40" cy="20" rx="3" ry="4" fill="#FEE500" />
      </svg>
    ),
  },
  {
    provider: "apple",
    label: "Apple로 계속하기",
    bg: "#000",
    color: "#fff",
    logo: (
      <svg width="16" height="18" viewBox="0 0 24 24" fill="white">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
    ),
  },
  {
    provider: "facebook",
    label: "Facebook으로 계속하기",
    bg: "#1877F2",
    color: "#fff",
    logo: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

function SocialLoginSheet({
  onSelect,
  onBack,
}: {
  onSelect: (p: SocialProvider) => void;
  onBack: () => void;
}) {
  return (
    <motion.div
      className="social-login-sheet"
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={{ type: "spring", stiffness: 280, damping: 30 }}
    >
      {/* 배경 블러 레이어 */}
      <div className="social-login-sheet-bg" />

      <div className="social-login-sheet-content">
        <button className="social-sheet-back" onClick={onBack}>
          <ArrowLeft size={18} />
        </button>

        {/* 브랜딩 */}
        <div className="social-sheet-brand">
          <span className="eyebrow">
            <Compass size={14} />
            niSeom
          </span>
          <h2>로그인</h2>
          <p>소셜 계정으로 빠르게 시작하세요.</p>
        </div>

        {/* 소셜 버튼 목록 */}
        <div className="social-sheet-buttons">
          {SOCIAL_BUTTONS.map(({ provider, label, bg, color, border, logo }) => (
            <motion.button
              key={provider}
              className="social-login-btn"
              style={{ background: bg, color, border: border ?? "1px solid transparent" }}
              onClick={() => onSelect(provider)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {logo}
              {label}
            </motion.button>
          ))}
        </div>

        <p className="social-sheet-terms">
          로그인 시 niSeom의 서비스 약관 및 개인정보처리방침에 동의합니다.
        </p>
      </div>
    </motion.div>
  );
}

export function LoginScreen() {
  const login = useAppStore((state) => state.login);
  const [showSocialSheet, setShowSocialSheet] = useState(false);
  const [activeProvider, setActiveProvider] = useState<SocialProvider | null>(null);

  return (
    <main className="login-screen">
      <div className="sea-aurora" />

      <motion.section
        className="login-copy"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <span className="eyebrow">
          <Compass size={16} />
          알고리즘 바깥 취향 탐험
        </span>
        <h1>섬 넘네</h1>
        <p>
          콘텐츠 취향을 하나의 3D 섬으로 만들고, 다른 사람의 섬을 항해하며 취향에 좋아요를
          보내면 상대의 배가 내 섬으로 오고, 유리병 편지로도 연결되는 커뮤니티.
        </p>
        <div className="login-actions">
          <button className="primary-button" onClick={() => setShowSocialSheet(true)}>
            <Anchor size={18} />
            로그인
          </button>
          <span className="microcopy">
            3분 안에 내 취향 섬을 만들고 바로 항해합니다.
          </span>
        </div>
      </motion.section>

      <motion.div
        className="login-diorama"
        initial={{ opacity: 0, scale: 0.92, rotateX: 12 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        transition={{ duration: 1, delay: 0.15, ease: "easeOut" }}
      >
        <div className="login-island-canvas-wrap" aria-hidden>
          <Canvas
            shadows
            dpr={[1, 2]}
            gl={{ alpha: true, antialias: true }}
            camera={{ position: [3.2, 2.05, 3.95], fov: 41, near: 0.12, far: 48 }}
            onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
          >
            <Suspense fallback={null}>
              <hemisphereLight args={["#c8dcff", "#063042", 0.4]} />
              <ambientLight intensity={0.68} />
              <directionalLight
                castShadow
                position={[7, 11, 6]}
                intensity={1.08}
                shadow-mapSize={[1024, 1024]}
                shadow-camera-near={0.8}
                shadow-camera-far={22}
                shadow-camera-left={-5}
                shadow-camera-right={5}
                shadow-camera-top={5}
                shadow-camera-bottom={-5}
              />
              <directionalLight position={[-4.5, 3.6, -2.8]} intensity={0.32} />
              <LoginIslandModel />
            </Suspense>
          </Canvas>
        </div>
      </motion.div>

      <div className="login-stats" aria-label="서비스 핵심 가치">
        <div>
          <strong>3-step</strong>
          <span>취향 온보딩</span>
        </div>
        <div>
          <strong>3D map</strong>
          <span>섬 월드 탐험</span>
        </div>
        <div>
          <strong>letters</strong>
          <span>추천이 대화가 됨</span>
        </div>
        <div>
          <strong>
            <Sparkles size={16} />
            growth
          </strong>
          <span>좋아요로 섬 성장</span>
        </div>
      </div>

      {/* 소셜 로그인 선택 시트 */}
      <AnimatePresence>
        {showSocialSheet && !activeProvider && (
          <SocialLoginSheet
            onSelect={(p) => setActiveProvider(p)}
            onBack={() => setShowSocialSheet(false)}
          />
        )}
      </AnimatePresence>

      {/* 플랫폼별 로그인 팝업 */}
      <SocialLoginModal
        provider={activeProvider}
        onLogin={() => {
          setActiveProvider(null);
          setShowSocialSheet(false);
          login();
        }}
        onClose={() => setActiveProvider(null)}
      />
    </main>
  );
}

useGLTF.preload(LOGIN_ISLAND_GLB);
