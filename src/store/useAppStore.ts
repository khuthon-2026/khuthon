import { create } from "zustand";
import {
  CURRENT_USER_ID,
  deriveIslandIdentity,
  growthStateFromLevel,
  growthThresholds,
  levelFromLikes,
  randomizeIslandPositions,
  sampleMedia,
  sampleUsers
} from "../data/tasteData";
import type {
  BoatTrip,
  BottleLetter,
  CategorySelection,
  IslandLevel,
  Like,
  MediaItem,
  Screen,
  UploadPreviewItem,
  User
} from "../types";

interface AppState {
  screen: Screen;
  users: User[];
  mediaItems: MediaItem[];
  likes: Like[];
  letters: BottleLetter[];
  selection: CategorySelection;
  selectedUserId: string | null;
  activeBoatTrip: BoatTrip | null;
  pendingLikeTargetId: string | null;
  recentlyLeveledUpId: string | null;
  uploadPreview: UploadPreviewItem[];
  excludedUploadCount: number;
  login: () => void;
  goTo: (screen: Screen) => void;
  completeOnboarding: (main: string[], middle: string[], sub: string[]) => void;
  addUploadedMedia: (items: UploadPreviewItem[]) => void;
  selectIsland: (userId: string | null) => void;
  likeMedia: (toUserId: string, mediaItemId: string) => void;
  clearBoatTrip: () => void;
  clearLevelUp: () => void;
  sendBottleLetter: (toUserId: string, message: string, attachedMediaIds: string[]) => void;
  openBottleLetter: (letterId: string) => void;
  setMyIslandLevel: (level: IslandLevel) => void;
}

const initialLetters: BottleLetter[] = [
  {
    id: "letter-luna-me",
    fromUserId: "luna",
    toUserId: CURRENT_USER_ID,
    message: "당신 섬의 밤 분위기에 이 시티팝이 잘 붙을 것 같아요. 알고리즘 말고 파도 타고 왔습니다.",
    attachedMediaIds: ["luna-1", "luna-2"],
    isOpened: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  }
];

export const useAppStore = create<AppState>((set, get) => ({
  screen: "login",
  users: randomizeIslandPositions(sampleUsers),
  mediaItems: sampleMedia,
  likes: [],
  letters: initialLetters,
  selection: {
    userId: CURRENT_USER_ID,
    mainCategories: [],
    middleCategories: [],
    subCategories: []
  },
  selectedUserId: null,
  activeBoatTrip: null,
  pendingLikeTargetId: null,
  recentlyLeveledUpId: null,
  uploadPreview: [],
  excludedUploadCount: 0,
  login: () => set({ screen: "onboarding" }),
  goTo: (screen) => set({ screen }),
  completeOnboarding: (mainCategoriesValue, middleCategoriesValue, subCategoriesValue) => {
    const identity = deriveIslandIdentity(
      mainCategoriesValue,
      middleCategoriesValue,
      subCategoriesValue
    );

    set((state) => ({
      screen: "keywords",
      selection: {
        userId: CURRENT_USER_ID,
        mainCategories: mainCategoriesValue,
        middleCategories: middleCategoriesValue,
        subCategories: subCategoriesValue
      },
      users: state.users.map((user) =>
        user.id === CURRENT_USER_ID
          ? {
              ...user,
              ...identity,
              islandLevel: 1,
              likes: 1,
              affinityPoints: 1,
              growthState: "seed"
            }
          : user
      )
    }));
  },
  addUploadedMedia: (items) => {
    const keptItems = items.filter((item) => item.status === "kept");
    const now = Date.now();
    const newMedia: MediaItem[] = keptItems.map((item, index) => ({
      id: `upload-${now}-${index}`,
      userId: CURRENT_USER_ID,
      type: item.type,
      title: item.title,
      creator: item.creator,
      platform: item.platform,
      thumbnail:
        item.type === "music"
          ? "linear-gradient(135deg, #0f766e, #f59e0b)"
          : "linear-gradient(135deg, #7c2d12, #38bdf8)",
      url: "#uploaded-preview",
      tags: item.tags
    }));

    set((state) => ({
      uploadPreview: items,
      excludedUploadCount: items.length - keptItems.length,
      mediaItems: [...newMedia, ...state.mediaItems]
    }));
  },
  selectIsland: (userId) => set({ selectedUserId: userId }),
  likeMedia: (toUserId, mediaItemId) => {
    const id = `like-${Date.now()}-${Math.round(Math.random() * 1000)}`;

    set((state) => {
      let leveledUpTargetId: string | null = null;
      let leveledUpMyId: string | null = null;

      const me = state.users.find((user) => user.id === CURRENT_USER_ID);
      const nextMyExp = (me?.affinityPoints ?? 0) + 1;
      const nextMyLevel = levelFromLikes(nextMyExp);
      const nextMyGrowth = growthStateFromLevel(nextMyLevel);
      if (me && nextMyLevel > me.islandLevel) {
        leveledUpMyId = CURRENT_USER_ID;
      }

      const likes = [
        ...state.likes,
        {
          id,
          fromUserId: CURRENT_USER_ID,
          toUserId,
          mediaItemId,
          createdAt: new Date().toISOString()
        }
      ];

      return {
        likes,
        users: state.users.map((user) =>
          user.id === toUserId
            ? (() => {
                // 상대방은 "좋아요"를 받아 likes만 오름.
                // 상대의 경험치/레벨/성장 상태는 절대 변경하지 않는다.
                const nextLikes = user.likes + 1;
                return {
                  ...user,
                  likes: nextLikes
                };
              })()
            : user.id === CURRENT_USER_ID
              ? {
                  ...user,
                  affinityPoints: nextMyExp,
                  islandLevel: nextMyLevel,
                  growthState: nextMyGrowth
                }
              : user
        ),
        activeBoatTrip: {
          id,
          fromUserId: CURRENT_USER_ID,
          toUserId,
          label: leveledUpMyId ? "좋아요 배 출항 · 내 섬 경험치 상승" : "좋아요 배 출항",
          kind: "like"
        },
        pendingLikeTargetId: toUserId,
        recentlyLeveledUpId: leveledUpMyId
      };
    });

    // 레벨업 연출은 짧게 보여주고 자동으로 종료
    window.setTimeout(() => {
      if (get().recentlyLeveledUpId) {
        get().clearLevelUp();
      }
    }, 2200);
  },
  clearBoatTrip: () => set({ activeBoatTrip: null, pendingLikeTargetId: null }),
  clearLevelUp: () => set({ recentlyLeveledUpId: null }),
  sendBottleLetter: (toUserId, message, attachedMediaIds) => {
    const id = `letter-${Date.now()}`;
    set((state) => ({
      letters: [
        ...state.letters,
        {
          id,
          fromUserId: CURRENT_USER_ID,
          toUserId,
          message,
          attachedMediaIds,
          isOpened: false,
          createdAt: new Date().toISOString()
        }
      ],
      activeBoatTrip: {
        id: `bottle-${id}`,
        fromUserId: CURRENT_USER_ID,
        toUserId,
        label: "유리병 편지 출항",
        kind: "letter"
      }
    }));
  },
  openBottleLetter: (letterId) => {
    const letter = get().letters.find((candidate) => candidate.id === letterId);

    set((state) => ({
      letters: state.letters.map((candidate) =>
        candidate.id === letterId
          ? {
              ...candidate,
              isOpened: true
            }
          : candidate
      ),
      selectedUserId: letter?.fromUserId ?? state.selectedUserId,
      screen: "world"
    }));
  }
  ,
  setMyIslandLevel: (level) => {
    const threshold = growthThresholds.find((t) => t.level === level);
    const likes = threshold?.minLikes ?? 0;

    set((state) => ({
      users: state.users.map((user) =>
        user.id === CURRENT_USER_ID
          ? {
              ...user,
              islandLevel: level,
              likes,
              growthState: growthStateFromLevel(level)
            }
          : user
      ),
      recentlyLeveledUpId: CURRENT_USER_ID
    }));

    window.setTimeout(() => {
      if (get().recentlyLeveledUpId === CURRENT_USER_ID) {
        get().clearLevelUp();
      }
    }, 2200);
  }
}));
