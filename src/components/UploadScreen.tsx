import { useState } from "react";
import { Link2, Link2Off, Zap, Layers, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { useAppStore } from "../store/useAppStore";
import type { Platform } from "../types";
import { PlatformAuthModal } from "./PlatformAuthModal";

const PLATFORM_META: {
  id: Platform;
  label: string;
  icon: JSX.Element;
}[] = [
  {
    id: "YouTube",
    label: "YouTube",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden>
        <rect width="48" height="48" rx="10" fill="#FF0000" />
        <polygon points="19,14 38,24 19,34" fill="white" />
      </svg>
    )
  },
  {
    id: "Spotify",
    label: "Spotify",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden>
        <circle cx="24" cy="24" r="24" fill="#1DB954" />
        <path d="M13 19c7-2.8 16-2.2 21 2" stroke="white" strokeWidth="3.2" strokeLinecap="round" fill="none" />
        <path d="M14 26c6-2.2 13-1.6 17 1.6" stroke="white" strokeWidth="3.2" strokeLinecap="round" fill="none" />
        <path d="M15 33c5-1.8 10-1.4 13.5 1.2" stroke="white" strokeWidth="3.2" strokeLinecap="round" fill="none" />
      </svg>
    )
  },
  {
    id: "Apple Music",
    label: "Apple Music",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden>
        <rect width="48" height="48" rx="10" fill="url(#amGrad)" />
        <defs>
          <linearGradient id="amGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FC3C44" />
            <stop offset="100%" stopColor="#C81228" />
          </linearGradient>
        </defs>
        <text x="24" y="32" textAnchor="middle" fontSize="24" fill="white">♫</text>
      </svg>
    )
  },
  {
    id: "Instagram",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden>
        <rect width="48" height="48" rx="10" fill="url(#igGrad)" />
        <defs>
          <radialGradient id="igGrad" cx="30%" cy="100%" r="120%">
            <stop offset="0%" stopColor="#feda75" />
            <stop offset="30%" stopColor="#fa7e1e" />
            <stop offset="55%" stopColor="#d62976" />
            <stop offset="80%" stopColor="#962fbf" />
            <stop offset="100%" stopColor="#4f5bd5" />
          </radialGradient>
        </defs>
        <rect x="13" y="13" width="22" height="22" rx="6" stroke="white" strokeWidth="2.4" fill="none" />
        <circle cx="24" cy="24" r="6" stroke="white" strokeWidth="2.4" fill="none" />
        <circle cx="33" cy="15" r="1.8" fill="white" />
      </svg>
    )
  },
  {
    id: "Netflix",
    label: "Netflix",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden>
        <rect width="48" height="48" rx="10" fill="#141414" />
        <text x="8" y="38" fontSize="34" fontWeight="900" fontFamily="Arial Black, sans-serif" fill="#E50914">N</text>
      </svg>
    )
  },
  {
    id: "TikTok",
    label: "TikTok",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden>
        <rect width="48" height="48" rx="10" fill="#010101" />
        <path
          d="M28 10v18a6 6 0 1 1-4-5.66V18a10 10 0 1 0 8 9.8V10h-4z"
          fill="white"
        />
        <path
          d="M32 10c.5 2.8 2.4 4.8 5 5.5v4a14 14 0 0 1-5-1.5V28a10 10 0 1 1-8-9.8V22a6 6 0 1 0 4 5.7V10h4z"
          fill="#69C9D0"
          opacity="0.7"
        />
      </svg>
    )
  }
];

const SYNC_BENEFITS = [
  {
    icon: <Zap size={20} />,
    title: "취향 자동 분석",
    desc: "연결된 플랫폼의 시청·청취 기록을 읽어 취향 키워드를 자동으로 추출합니다."
  },
  {
    icon: <Layers size={20} />,
    title: "섬 자동 채움",
    desc: "취향과 연결된 콘텐츠만 골라 내 취향 섬의 미디어 오브젝트로 배치합니다."
  },
  {
    icon: <RefreshCw size={20} />,
    title: "실시간 업데이트",
    desc: "새 기록이 쌓일 때마다 섬도 함께 성장해 현재 취향을 반영합니다."
  }
];

export function UploadScreen() {
  const [connectedPlatforms, setConnectedPlatforms] = useState<Set<Platform>>(new Set());
  const [authingPlatform, setAuthingPlatform] = useState<Platform | null>(null);
  const goTo = useAppStore((state) => state.goTo);

  const handleConnectClick = (platform: Platform) => {
    if (connectedPlatforms.has(platform)) {
      // 이미 연결됨 → 바로 해제
      setConnectedPlatforms((prev) => {
        const next = new Set(prev);
        next.delete(platform);
        return next;
      });
    } else {
      // 미연결 → 팝업 열기
      setAuthingPlatform(platform);
    }
  };

  const handleAuthorize = (platform: Platform) => {
    setConnectedPlatforms((prev) => new Set([...prev, platform]));
    setAuthingPlatform(null);
  };

  const connectedCount = connectedPlatforms.size;

  return (
    <main className="upload-screen">

      {/* 헤더 */}
      <section className="upload-header">
        <span className="eyebrow">
          <Link2 size={16} />
          플랫폼 연결
        </span>
        <h2>플랫폼을 연결해 섬의 컨텐츠를 채웁니다.</h2>
        <p>
          연결된 플랫폼의 기록에서 취향과 맞는 콘텐츠만 추려 섬에 올립니다.
          전체 기록이 아니라, 나다운 것들만 남깁니다.
        </p>
      </section>

      {/* 연결 현황 */}
      {connectedCount > 0 && (
        <motion.div
          className="connect-status-bar"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="connect-status-dot" />
          <span>
            <strong>{connectedCount}개 플랫폼</strong> 연결됨 —&nbsp;
            {Array.from(connectedPlatforms).join(", ")}
          </span>
        </motion.div>
      )}

      {/* 플랫폼 연결 그리드 */}
      <section className="platform-connect">
        <div className="platform-connect-grid">
          {PLATFORM_META.map((p, index) => {
            const isConnected = connectedPlatforms.has(p.id);
            return (
              <motion.div
                key={p.id}
                className={`platform-card ${isConnected ? "connected" : ""}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="platform-card-icon">{p.icon}</div>
                <span className="platform-card-label">{p.label}</span>
                {isConnected && (
                  <span className="platform-card-badge">연결됨</span>
                )}
                <button
                  className={isConnected ? "disconnect-button" : "connect-button"}
                  onClick={() => handleConnectClick(p.id)}
                >
                  {isConnected ? (
                    <><Link2Off size={13} /> 연결 해제</>
                  ) : (
                    <><Link2 size={13} /> 연결</>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 혜택 안내 */}
      <section className="sync-benefits">
        {SYNC_BENEFITS.map((item, index) => (
          <motion.div
            key={item.title}
            className="sync-benefit-card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.08 }}
          >
            <div className="sync-benefit-icon">{item.icon}</div>
            <strong>{item.title}</strong>
            <p>{item.desc}</p>
          </motion.div>
        ))}
      </section>

      <PlatformAuthModal
        platform={authingPlatform}
        onAuthorize={handleAuthorize}
        onClose={() => setAuthingPlatform(null)}
      />

      <footer className="floating-footer">
        <button className="secondary-button" onClick={() => goTo("keywords")}>
          키워드로 돌아가기
        </button>
        <button
          className="primary-button"
          onClick={() => goTo("world")}
        >
          3D 월드 항해 시작
        </button>
      </footer>
    </main>
  );
}
