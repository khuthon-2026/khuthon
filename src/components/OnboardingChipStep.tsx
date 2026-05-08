import { type CSSProperties, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { subCategoriesByMiddle } from "../data/tasteData";

interface Props {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  relatedSelected: string[];
  onRelatedToggle: (value: string) => void;
}

const CHIP_PALETTE = [
  { bg: "rgba(44,120,110,0.14)",  border: "rgba(44,120,110,0.46)",  sel: "rgba(44,120,110,0.26)"  },
  { bg: "rgba(170,80,110,0.12)",  border: "rgba(170,80,110,0.44)",  sel: "rgba(170,80,110,0.24)"  },
  { bg: "rgba(50,130,165,0.13)",  border: "rgba(50,130,165,0.46)",  sel: "rgba(50,130,165,0.26)"  },
  { bg: "rgba(180,140,40,0.12)",  border: "rgba(180,140,40,0.44)",  sel: "rgba(180,140,40,0.24)"  },
  { bg: "rgba(195,85,95,0.12)",   border: "rgba(195,85,95,0.44)",   sel: "rgba(195,85,95,0.24)"   },
  { bg: "rgba(120,90,185,0.12)",  border: "rgba(120,90,185,0.44)",  sel: "rgba(120,90,185,0.24)"  },
];

function getRelatedForSub(chip: string): string[] {
  // 클릭한 서브의 부모 미들을 찾아 형제 서브들을 반환
  const parent = Object.entries(subCategoriesByMiddle).find(
    ([, values]) => values.includes(chip)
  );
  if (!parent) return [];
  return parent[1].filter((s) => s !== chip);
}

export function OnboardingChipStep({
  options,
  selected,
  onToggle,
  relatedSelected,
  onRelatedToggle,
}: Props) {
  const [lastClicked, setLastClicked] = useState<string | null>(null);

  // 서브 클릭 → 형제 서브 추천
  const related = useMemo(() => {
    if (!lastClicked) return [];
    return getRelatedForSub(lastClicked);
  }, [lastClicked]);

  const handleClick = (chip: string) => {
    onToggle(chip);
    setLastClicked(chip);
  };

  return (
    <div className="chip-step-stage">
      {/* 벌집 패턴 배경 */}
      <svg className="chip-hive-bg" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hive" x="0" y="0" width="56" height="48" patternUnits="userSpaceOnUse">
            <polygon
              points="28,2 54,16 54,44 28,58 2,44 2,16"
              fill="none"
              stroke="rgba(16,36,51,0.07)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hive)" />
      </svg>

      {/* 메인 칩 그리드 */}
      <div className="chip-grid">
        <AnimatePresence mode="popLayout">
          {options.map((option, i) => {
            const isSelected = selected.includes(option);
            const palette = CHIP_PALETTE[i % CHIP_PALETTE.length];
            const isLastClicked = option === lastClicked;

            return (
              <motion.button
                key={option}
                className={`chip-item ${isSelected ? "selected" : ""} ${isLastClicked ? "last-clicked" : ""}`}
                style={
                  {
                    "--chip-bg": isSelected ? palette.sel : palette.bg,
                    "--chip-border": palette.border,
                    "--i": i,
                  } as CSSProperties
                }
                onClick={() => handleClick(option)}
                layout
                initial={{ opacity: 0, scale: 0.72, y: 10 }}
                animate={{ opacity: 1, scale: isSelected ? 1.06 : 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.72 }}
                transition={{ duration: 0.3, delay: i * 0.016 }}
                whileTap={{ scale: 0.93 }}
              >
                {isSelected && (
                  <motion.span
                    className="chip-check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    ✓
                  </motion.span>
                )}
                {option}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* 추천 섹션 */}
      <AnimatePresence mode="wait">
        {lastClicked && related.length > 0 && (
          <motion.div
            key={lastClicked}
            className="chip-recommend-section"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="chip-recommend-label">
              <Sparkles size={11} />
              <strong>{lastClicked}</strong>
              {" 비슷한 취향"}
            </span>
            <div className="chip-recommend-row">
              <AnimatePresence mode="popLayout">
                {related.map((chip, i) => {
                  const isSelected =
                    relatedSelected.includes(chip) || selected.includes(chip);
                  return (
                    <motion.button
                      key={chip}
                      className={`chip-recommend-item ${isSelected ? "selected" : ""}`}
                      onClick={() => {
                        if (selected.includes(chip)) {
                          onToggle(chip);
                        } else {
                          onRelatedToggle(chip);
                        }
                      }}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.035, duration: 0.22 }}
                      whileTap={{ scale: 0.93 }}
                    >
                      {isSelected && <span className="chip-check">✓</span>}
                      {chip}
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
