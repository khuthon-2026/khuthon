import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight, Compass, Layers3, Map as MapIcon, Route } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  mainCategories,
  middleCategoriesByMain,
  subCategoriesByMiddle
} from "../data/tasteData";
import { useAppStore } from "../store/useAppStore";
import { OnboardingCategoryIsland } from "./OnboardingCategoryIsland";

const steps = [
  {
    title: "대카테고리 선택",
    description: "취향 바다에 띄울 첫 섬 조각을 고르세요.",
    helper: "여러 항로를 동시에 열 수 있어요"
  },
  {
    title: "중카테고리 선택",
    description: "조금 더 안쪽으로 들어가 지형을 좁혀봅니다.",
    helper: "선택한 섬들이 하나의 항로로 이어져요"
  },
  {
    title: "소카테고리 선택",
    description: "섬 위에 남길 가장 선명한 표식을 고르세요.",
    helper: "이 표식들이 내 섬의 키워드가 됩니다"
  }
];

function toggleValue(list: string[], value: string) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export function OnboardingFlow() {
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedMain, setSelectedMain] = useState<string[]>([]);
  const [selectedMiddle, setSelectedMiddle] = useState<string[]>([]);
  const [selectedSub, setSelectedSub] = useState<string[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const mergeTimerRef = useRef<number | null>(null);

  const middleOptions = useMemo(
    () =>
      Array.from(
        new Set(selectedMain.flatMap((category) => middleCategoriesByMain[category] ?? []))
      ),
    [selectedMain]
  );
  const subOptions = useMemo(
    () =>
      Array.from(
        new Set(selectedMiddle.flatMap((category) => subCategoriesByMiddle[category] ?? []))
      ),
    [selectedMiddle]
  );

  const options = stepIndex === 0 ? mainCategories : stepIndex === 1 ? middleOptions : subOptions;
  const activeSelection =
    stepIndex === 0 ? selectedMain : stepIndex === 1 ? selectedMiddle : selectedSub;
  const canProceed = activeSelection.length > 0;

  const handleToggle = (value: string) => {
    if (stepIndex === 0) {
      setSelectedMain((current) => toggleValue(current, value));
      setSelectedMiddle([]);
      setSelectedSub([]);
      return;
    }

    if (stepIndex === 1) {
      setSelectedMiddle((current) => toggleValue(current, value));
      setSelectedSub([]);
      return;
    }

    setSelectedSub((current) => toggleValue(current, value));
  };

  const handleNext = () => {
    if (!canProceed || isMerging) {
      return;
    }

    setIsMerging(true);
    mergeTimerRef.current = window.setTimeout(() => {
      setIsMerging(false);
      if (stepIndex < 2) {
        setStepIndex((current) => current + 1);
        return;
      }

      completeOnboarding(selectedMain, selectedMiddle, selectedSub);
    }, 1080);
  };

  useEffect(
    () => () => {
      if (mergeTimerRef.current) {
        window.clearTimeout(mergeTimerRef.current);
      }
    },
    []
  );

  return (
    <main className="onboarding-screen">
      <div className="onboarding-ocean" aria-hidden="true">
        <svg className="cartography-lines" viewBox="0 0 1200 760" preserveAspectRatio="none">
          <path d="M84 494 C236 348 405 330 572 424 S871 528 1118 356" />
          <path d="M168 234 C346 144 514 196 677 276 S922 352 1090 214" />
          <path d="M252 650 C438 552 592 596 736 648 S974 700 1160 590" />
          <circle cx="720" cy="386" r="196" />
          <circle cx="720" cy="386" r="292" />
        </svg>
        <div className="mist-bank mist-a" />
        <div className="mist-bank mist-b" />
        <div className="map-depth depth-a" />
        <div className="map-depth depth-b" />
      </div>
      <section className="onboarding-panel">
        <div className="progress-meta">
          <span>0{stepIndex + 1}/03</span>
          <small>taste route</small>
        </div>
        <div className="progress-row" aria-label="온보딩 단계">
          {steps.map((step, index) => (
            <div
              className={`progress-dot ${index <= stepIndex ? "is-active" : ""}`}
              key={step.title}
            >
              <span>{index + 1}</span>
            </div>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.35 }}
          >
            <span className="eyebrow">
              {stepIndex === 0 ? (
                <MapIcon size={16} />
              ) : stepIndex === 1 ? (
                <Route size={16} />
              ) : (
                <Compass size={16} />
              )}
              Taste map
            </span>
            <h2>{steps[stepIndex].title}</h2>
            <p>{steps[stepIndex].description}</p>
            <span className="helper-line">{steps[stepIndex].helper}</span>
          </motion.div>
        </AnimatePresence>

        <div className={`selected-strip ${activeSelection.length === 0 ? "is-empty" : ""}`}>
          {activeSelection.length === 0 ? (
            <span>지도 위 섬을 선택하면 항로가 생깁니다</span>
          ) : (
            activeSelection.slice(-8).map((item) => <span key={item}>{item}</span>)
          )}
        </div>
      </section>

      <div className={`route-to-center ${activeSelection.length > 0 ? "has-selection" : ""}`} />
      <section className={`shard-stage ${isMerging ? "is-merging" : ""}`}>
        <AnimatePresence mode="popLayout">
          {options.map((option, index) => {
            const selected = activeSelection.includes(option);

            return (
              <motion.button
                className={`taste-shard shard-${index % 6} map-position-${index % 9} ${
                  selected ? "selected" : ""
                }`}
                key={option}
                layout
                style={{ "--i": index } as CSSProperties}
                onClick={() => handleToggle(option)}
                initial={{ opacity: 0, scale: 0.72, y: 34, rotate: index % 2 ? 2 : -2 }}
                animate={{
                  opacity: 1,
                  scale: selected && isMerging ? 0.58 : selected ? 1.04 : 1,
                  rotate: selected && isMerging ? 0 : index % 2 ? 1.5 : -1.5,
                  x: selected && isMerging ? 0 : undefined,
                  y: selected && isMerging ? 0 : undefined
                }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{
                  duration: 0.65,
                  delay: index * 0.025,
                  layout: { duration: 0.92, ease: [0.22, 1, 0.36, 1] }
                }}
              >
                <OnboardingCategoryIsland
                  label={option}
                  index={index}
                  selected={selected}
                  merging={isMerging}
                />
                <i className="terrain-line terrain-one" />
                <i className="terrain-line terrain-two" />
                <span>{option}</span>
              </motion.button>
            );
          })}
        </AnimatePresence>
        <AnimatePresence>
          {isMerging && (
            <motion.div
              className="merge-core"
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.22 }}
              transition={{ duration: 0.88, ease: [0.22, 1, 0.36, 1] }}
            >
              <Layers3 size={26} />
              <span>새 지형을 그리는 중</span>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <footer className="floating-footer">
        <button className="secondary-button" onClick={() => setStepIndex((index) => Math.max(0, index - 1))}>
          이전
        </button>
        <button className="primary-button" disabled={!canProceed} onClick={handleNext}>
          {stepIndex === 2 ? "내 섬 생성" : "다음"}
          <ChevronRight size={18} />
        </button>
      </footer>
    </main>
  );
}
