import { useMemo } from "react";
import { ChevronUp } from "lucide-react";
import type { IslandLevel } from "../types";
import { useAppStore } from "../store/useAppStore";

const levels: IslandLevel[] = [1, 2, 3, 4, 5];

export function MyIslandLevelBox() {
  const currentUser = useAppStore((state) => state.users.find((user) => user.id === "me"));
  const setMyIslandLevel = useAppStore((state) => state.setMyIslandLevel);

  const currentLevel = (currentUser?.islandLevel ?? 1) as IslandLevel;
  const title = useMemo(() => `내 섬 레벨 조정`, []);

  return (
    <section className="levelup-box" aria-label={title}>
      <div className="levelup-box__header">
        <ChevronUp size={16} />
        <strong>내 섬 레벨업(임의)</strong>
      </div>
      <div className="levelup-box__body">
        <span className="levelup-box__meta">현재 Lv.{currentLevel}</span>
        <div className="levelup-box__buttons">
          {levels.map((lv) => (
            <button
              key={lv}
              type="button"
              className={lv === currentLevel ? "active" : ""}
              onClick={() => setMyIslandLevel(lv)}
            >
              Lv.{lv}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

