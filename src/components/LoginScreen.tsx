import { Anchor, Compass, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useAppStore } from "../store/useAppStore";

export function LoginScreen() {
  const login = useAppStore((state) => state.login);

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
        <h1>니 섬 쩔더라</h1>
        <p>
          콘텐츠 취향을 하나의 3D 섬으로 만들고, 다른 사람의 섬을 항해하며 취향에 좋아요를
          보내면 상대의 배가 내 섬으로 오고, 유리병 편지로도 연결되는 커뮤니티.
        </p>
        <div className="login-actions">
          <button className="primary-button" onClick={login}>
            <Anchor size={18} />
            데모 로그인
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
        <div className="diorama-water" />
        <div className="floating-island island-a">
          <span>외힙</span>
        </div>
        <div className="floating-island island-b">
          <span>몽환적</span>
        </div>
        <div className="floating-island island-c">
          <span>실험적</span>
        </div>
        <div className="boat-dot" />
        <div className="bottle-dot" />
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
    </main>
  );
}
