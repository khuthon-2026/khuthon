export type Screen =
  | "login"
  | "onboarding"
  | "keywords"
  | "upload"
  | "world"
  | "myIsland";

export type MediaType = "music" | "video";

export type Platform =
  | "YouTube"
  | "Spotify"
  | "Apple Music"
  | "Instagram"
  | "Netflix"
  | "TikTok";

export type IslandType =
  | "dreamy"
  | "volcanic"
  | "lake"
  | "neon-city"
  | "forest"
  | "experimental";

export type IslandLevel = 1 | 2 | 3 | 4 | 5;

export type GrowthState = "seed" | "harbor" | "garden" | "beacon" | "legend";

export interface IslandPosition {
  x: number;
  y: number;
}

export interface User {
  id: string;
  nickname: string;
  ownerName?: string;
  profileImage?: string;
  mainKeyword: string;
  keyword1: string;
  keyword2: string;
  keyword3: string;
  islandType: IslandType;
  islandLevel: IslandLevel;
  likes: number;
  affinityPoints: number;
  growthState: GrowthState;
  islandPositionX: number;
  islandPositionY: number;
  tasteDescription: string;
  representativeContent?: string;
}

export interface CategorySelection {
  userId: string;
  mainCategories: string[];
  middleCategories: string[];
  subCategories: string[];
}

export interface MediaItem {
  id: string;
  userId: string;
  type: MediaType;
  title: string;
  creator: string;
  platform: Platform;
  thumbnail: string;
  url: string;
  tags: string[];
}

export interface Like {
  id: string;
  fromUserId: string;
  toUserId: string;
  mediaItemId: string;
  createdAt: string;
}

export interface BottleLetter {
  id: string;
  fromUserId: string;
  toUserId: string;
  message: string;
  attachedMediaIds: string[];
  isOpened: boolean;
  createdAt: string;
}

export interface BoatTrip {
  id: string;
  fromUserId: string;
  toUserId: string;
  label: string;
  kind: "like" | "letter";
}

export interface UploadPreviewItem {
  title: string;
  creator: string;
  platform: Platform;
  type: MediaType;
  tags: string[];
  status: "kept" | "excluded";
}
