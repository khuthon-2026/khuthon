import { AnimatePresence, motion } from "framer-motion";
import { Compass, Home, Map, RotateCcw, Ship, Telescope, UploadCloud } from "lucide-react";
import { CURRENT_USER_ID, islandDistanceLabel, similarityScore } from "../data/tasteData";
import { useAppStore } from "../store/useAppStore";
import { IslandDetailPanel } from "./IslandDetailPanel";
import { IslandWorld } from "./IslandWorld";
import { MyIslandPanel } from "./MyIslandPanel";

export function WorldScreen({ mode }: { mode: "world" | "myIsland" }) {
  const users = useAppStore((state) => state.users);
  const mediaItems = useAppStore((state) => state.mediaItems);
  const selectedUserId = useAppStore((state) => state.selectedUserId);
  const activeBoatTrip = useAppStore((state) => state.activeBoatTrip);
  const letters = useAppStore((state) => state.letters);
  const recentlyLeveledUpId = useAppStore((state) => state.recentlyLeveledUpId);
  const selectIsland = useAppStore((state) => state.selectIsland);
  const clearBoatTrip = useAppStore((state) => state.clearBoatTrip);
  const goTo = useAppStore((state) => state.goTo);
  const currentUser = users.find((user) => user.id === CURRENT_USER_ID)!;
  const selectedUser = users.find((user) => user.id === selectedUserId) ?? null;
  const showDetail = selectedUser && selectedUser.id !== CURRENT_USER_ID && mode === "world";
  /** 유사도가 낮은 순(먼 섬부터) 최대 3명 — 알고리즘 밖 콘텐츠 탐색용 */
  const farthestIslandPreviews = users
    .filter((user) => user.id !== CURRENT_USER_ID)
    .map((user) => ({
      user,
      score: similarityScore(currentUser, user),
      label: islandDistanceLabel(currentUser, user),
      media: mediaItems.find((item) => item.userId === user.id) ?? null
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  const handleSelectIsland = (userId: string | null) => {
    if (!userId) {
      selectIsland(null);
      return;
    }

    if (userId === CURRENT_USER_ID) {
      selectIsland(null);
      goTo("myIsland");
      return;
    }

    selectIsland(userId);
    if (mode === "myIsland") {
      goTo("world");
    }
  };

  return (
    <main className="world-screen">
      <IslandWorld
        users={users}
        selectedUserId={selectedUserId}
        activeBoatTrip={activeBoatTrip}
        letters={letters}
        recentlyLeveledUpId={recentlyLeveledUpId}
        onSelectIsland={handleSelectIsland}
        onBoatComplete={clearBoatTrip}
      />


      <header className="world-topbar">
        <button className="brand-pill" onClick={() => goTo("world")}>
          <Compass size={18} />
          섬 넘네
        </button>
        <nav>
          <button className={mode === "world" ? "active" : ""} onClick={() => goTo("world")}>
            <Map size={16} />
            월드맵
          </button>
          <button className={mode === "myIsland" ? "active" : ""} onClick={() => goTo("myIsland")}>
            <Home size={16} />
            내 섬
          </button>
          <button onClick={() => goTo("upload")}>
            <UploadCloud size={16} />
            업로드
          </button>
          <button onClick={() => goTo("onboarding")}>
            <RotateCcw size={16} />
            다시 만들기
          </button>
        </nav>
      </header>

      <aside className="world-legend">
        <span className="eyebrow">
          <Telescope size={15} />
          나랑 먼 섬의 컨텐츠 살펴보기
        </span>
        {farthestIslandPreviews.map(({ user, score, label, media }) => (
          <button key={user.id} type="button" onClick={() => handleSelectIsland(user.id)}>
            <strong className="world-legend-nickname" title={user.nickname}>
              {user.nickname}
            </strong>
            <span className="world-legend-preview">
              {media ? `${media.platform} · ${media.title}` : label}
            </span>
            <meter
              min={0}
              max={1}
              value={1 - score}
              title={`내 취향과의 거리감(${islandDistanceLabel(currentUser, user)})`}
            />
          </button>
        ))}
      </aside>

      <AnimatePresence>
        {activeBoatTrip && (
          <motion.div
            className="connection-toast"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
          >
            <Ship size={18} />
            {activeBoatTrip.label}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDetail && <IslandDetailPanel key={selectedUser.id} user={selectedUser} currentUser={currentUser} />}
      </AnimatePresence>

      <AnimatePresence>{mode === "myIsland" && <MyIslandPanel key="my-panel" />}</AnimatePresence>

      {mode === "world" && !showDetail && (
        <section className="world-hint">
          <strong>섬을 클릭해 취향을 탐험하세요.</strong>
          <span>
            지도에서는 가까운 섬일수록 취향이 비슷합니다. 좌측 패널은 반대로, 나와 가장 먼 섬에서
            흘러든 콘텐츠만 골라 보여 줍니다.
          </span>
        </section>
      )}
    </main>
  );
}
