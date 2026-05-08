import { AnimatePresence, motion } from "framer-motion";
import { Compass, Database, Home, Map, RotateCcw, Ship, UploadCloud } from "lucide-react";
import { CURRENT_USER_ID, islandDistanceLabel, similarityScore } from "../data/tasteData";
import { useAppStore } from "../store/useAppStore";
import { IslandDetailPanel } from "./IslandDetailPanel";
import { IslandWorld } from "./IslandWorld";
import { MyIslandLevelBox } from "./MyIslandLevelBox";
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
  const nearestUsers = users
    .filter((user) => user.id !== CURRENT_USER_ID)
    .map((user) => ({
      user,
      score: similarityScore(currentUser, user),
      label: islandDistanceLabel(currentUser, user),
      media: mediaItems.find((item) => item.userId === user.id) ?? null
    }))
    .sort((a, b) => b.score - a.score)
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

      <MyIslandLevelBox />

      <header className="world-topbar">
        <button className="brand-pill" onClick={() => goTo("world")}>
          <Compass size={18} />
          니 섬 쩔더라
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
          <Database size={15} />
          취향 거리 시각화
        </span>
        {nearestUsers.map(({ user, score, label, media }) => (
          <button key={user.id} onClick={() => handleSelectIsland(user.id)}>
            <strong>{user.nickname}</strong>
            <span>
              {media ? `${media.platform} · ${media.title}` : label}
            </span>
            <meter min={0} max={1} value={score} />
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
          <span>가까운 섬일수록 키워드 유사도가 높고, 먼 섬일수록 알고리즘 바깥의 발견입니다.</span>
        </section>
      )}
    </main>
  );
}
