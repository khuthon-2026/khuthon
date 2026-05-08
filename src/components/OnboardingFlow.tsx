import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight, Compass, Map as MapIcon, Route } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  mainCategories,
  middleCategoriesByMain,
  subCategoriesByMiddle
} from "../data/tasteData";
import { useAppStore } from "../store/useAppStore";
import { OnboardingCategoryIsland } from "./OnboardingCategoryIsland";
import { OnboardingMergeCanvas, type OnboardingMergeGlbVariant } from "./OnboardingMergeStage";

/** 병합(로딩) 오버레이 ↔ GLB 연출 시간 */
const MERGE_OVERLAY_MS = 2800;

const steps = [
  {
    title: "취향 방향 선택",
    description: "취향 바다에 띄울 첫 섬 조각을 고르세요.",
    helper: "여러 조각을 동시에 선택할 수 있어요"
  },
  {
    title: "분위기 정하기",
    description: "조금 더 안쪽으로 들어가 지형을 좁혀봅니다.",
    helper: "선택한 섬들이 하나의 항로로 이어져요"
  },
  {
    title: "키워드 고르기",
    description: "섬 위에 남길 가장 선명한 표식을 고르세요.",
    helper: "이 표식들이 내 섬의 키워드가 됩니다"
  }
];

function toggleValue(list: string[], value: string) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

/** 중카테고리(step1): 큰 Y 지터 → 행·열 정렬감을 강하게 깸 */
const MIDDLE_JITTER = [0, 4.2, -3.0, 1.8, -1.8, 4.8, 2.2, 3.2, 3.6, -0.8, 5.2];

/** 하카테고리(step2): 작은 Y 지터 (항목이 많으므로 절제) */
const SUB_JITTER = [0, 1.8, -1.4, 2.6, -0.8, 2.0, 1.0, -2.0, 2.2, -0.4,
                    1.4, -2.2, 0.6, 2.4, -1.6, 1.2, -1.0, 2.8, -0.2, 1.6];

/** 인덱스별 회전(deg) — ±로 다양하게 */
const ROTATIONS = [-2.2, 2.8, -1.6, 3.4, -3.0, 1.8, -3.8, 2.2, -1.0, 3.2,
                   -2.5, 1.5, -3.2, 2.6, -1.8, 3.8, -2.0, 3.0, -1.2, 2.4];

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
  // 스텝 1에서도 추천칩(서브)만 골라도 진행 가능하도록
  const canProceed =
    stepIndex === 1
      ? selectedMiddle.length > 0
      : stepIndex === 2
        ? selectedSub.length > 0
        : selectedMain.length > 0;

  const mergeGlbVariant: OnboardingMergeGlbVariant =
    stepIndex === 0 ? "main" : stepIndex === 1 ? "middle" : "sub";

  const mergeDetailCopy =
    stepIndex === 0
      ? "취향 방향에 맞춰 대륙의 실루엣을 새깁니다."
      : stepIndex === 1
        ? "분위기에 맞게 지형 디테일을 다듬습니다."
        : "키워드를 새기며 섬의 표면을 완성합니다.";

  const handleToggle = (value: string) => {
    if (stepIndex === 0) {
      setSelectedMain((current) => toggleValue(current, value));
      setSelectedMiddle([]);
      setSelectedSub([]);
      return;
    }

    if (stepIndex === 1) {
      setSelectedMiddle((current) => {
        const isRemoving = current.includes(value);
        const next = toggleValue(current, value);
        if (isRemoving) {
          // 제거된 미들에 속한 서브만 정리
          const subsOfRemoved = subCategoriesByMiddle[value] ?? [];
          setSelectedSub((subs) => subs.filter((s) => !subsOfRemoved.includes(s)));
        }
        return next;
      });
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
    }, MERGE_OVERLAY_MS);
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

      <div className={`route-to-center ${stepIndex === 0 && activeSelection.length > 0 ? "has-selection" : ""}`} />

      {/* 스텝 0: 섬 카드(기존 shard-stage) */}
      {stepIndex === 0 && (
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
                  layout={!isMerging}
                  style={{ "--i": index } as CSSProperties}
                  onClick={() => handleToggle(option)}
                  initial={{ opacity: 0, scale: 0.72, y: 34, rotate: index % 2 ? 2 : -2 }}
                  animate={{
                    opacity: 1,
                    scale: selected && isMerging ? 0.58 : selected ? 1.04 : 1,
                    rotate: selected && isMerging ? 0 : index % 2 ? 1.5 : -1.5,
                    x: selected && isMerging ? "-50%" : undefined,
                    y: selected && isMerging ? "-50%" : undefined
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
                role="status"
                aria-live="polite"
                aria-label="취향 지형 합성 중"
              >
                <div className="merge-core-canvas-wrap" aria-hidden="true">
                  <OnboardingMergeCanvas
                    key={`${mergeGlbVariant}-${stepIndex}`}
                    variant={mergeGlbVariant}
                  />
                </div>
                <div className="merge-core-inner">
                  <span className="merge-core-eyebrow">Topography synthesis</span>
                  <p className="merge-core-headline">새 지형을 그리는 중</p>
                  <p className="merge-core-detail">{mergeDetailCopy}</p>
                  <div className="merge-core-meter" aria-hidden>
                    <span className="merge-core-meter-fill" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      )}

      {/* 스텝 1·2: 섬 군도 (flex-wrap + 행 지터로 자연스럽게) */}
      {(stepIndex === 1 || stepIndex === 2) && (
        <>
          <section className={`island-scatter-stage island-scatter-step${stepIndex} ${isMerging ? "is-merging" : ""}`}>
            <AnimatePresence mode="popLayout">
              {options.map((option, index) => {
                const selected = activeSelection.includes(option);
                const jitterArr = stepIndex === 1 ? MIDDLE_JITTER : SUB_JITTER;
                const jitter = jitterArr[index % jitterArr.length];
                const rot = ROTATIONS[index % ROTATIONS.length];
                return (
                  <motion.button
                    className={`taste-shard shard-${index % 6} ${selected ? "selected" : ""}`}
                    key={option}
                    style={{ "--i": index } as CSSProperties}
                    onClick={() => handleToggle(option)}
                    initial={{ opacity: 0, scale: 0.68, y: jitter * 4 }}
                    animate={{
                      opacity: 1,
                      scale: selected ? 1.05 : 1,
                      y: `${jitter}rem`,
                      rotate: rot,
                    }}
                    exit={{ opacity: 0, scale: 0.68 }}
                    transition={{ duration: 0.48, delay: index * 0.03 }}
                    whileTap={{ scale: 0.92 }}
                  >
                    <OnboardingCategoryIsland
                      label={option}
                      index={index}
                      selected={selected}
                      merging={false}
                    />
                    <i className="terrain-line terrain-one" />
                    <i className="terrain-line terrain-two" />
                    <span>{option}</span>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </section>
          <AnimatePresence>
            {isMerging && (
              <div className="merge-overlay-center">
                <motion.div
                  className="merge-core"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
                  role="status"
                  aria-live="polite"
                  aria-label="취향 지형 합성 중"
                >
                  <div className="merge-core-canvas-wrap" aria-hidden="true">
                    <OnboardingMergeCanvas
                      key={`${mergeGlbVariant}-${stepIndex}`}
                      variant={mergeGlbVariant}
                    />
                  </div>
                  <div className="merge-core-inner">
                    <span className="merge-core-eyebrow">Topography synthesis</span>
                    <p className="merge-core-headline">새 지형을 그리는 중</p>
                    <p className="merge-core-detail">{mergeDetailCopy}</p>
                    <div className="merge-core-meter" aria-hidden>
                      <span className="merge-core-meter-fill" />
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </>
      )}

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
