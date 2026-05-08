import { useEffect, useMemo, useRef, useState } from "react";

type BgmPlayerProps = {
  src?: string;
  volume?: number;
};

export function BgmPlayer({ src = "/audio/bgm.mp3", volume = 0.35 }: BgmPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [blocked, setBlocked] = useState(false);

  const startLabel = useMemo(() => "배경음악 재생", []);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = Math.min(1, Math.max(0, volume));
    audio.preload = "auto";
    audioRef.current = audio;

    const tryPlay = async () => {
      try {
        await audio.play();
        setBlocked(false);
      } catch {
        // 브라우저 자동재생 정책으로 막히면, 첫 사용자 제스처에서 재생
        setBlocked(true);
      }
    };

    void tryPlay();

    const handleGesture = () => {
      if (!audioRef.current) return;
      void audioRef.current.play().then(
        () => setBlocked(false),
        () => setBlocked(true)
      );
    };

    window.addEventListener("pointerdown", handleGesture, { once: true });
    window.addEventListener("keydown", handleGesture, { once: true });

    return () => {
      window.removeEventListener("pointerdown", handleGesture);
      window.removeEventListener("keydown", handleGesture);
      audio.pause();
      audioRef.current = null;
    };
  }, [src, volume]);

  // blocked=true면 개발자가 확인할 수 있도록 최소한의 접근성 텍스트만 제공(레이아웃 영향 최소)
  return (
    <span
      aria-label={blocked ? `${startLabel} (탭/클릭 필요)` : startLabel}
      style={{
        position: "fixed",
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        border: 0
      }}
    />
  );
}

