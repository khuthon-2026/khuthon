import { useMemo, useState } from "react";
import { ExternalLink, Heart, MessageCircle, Music2, Play, Ship } from "lucide-react";
import { motion } from "framer-motion";
import { islandDistanceLabel, CURRENT_USER_ID } from "../data/tasteData";
import { useAppStore } from "../store/useAppStore";
import type { MediaItem, User } from "../types";
import { BottleLetterModal } from "./BottleLetterModal";

interface IslandDetailPanelProps {
  user: User;
  currentUser: User;
}

function mediaPreviewUrl(item: MediaItem) {
  // "실제로 있는 미디어"로 자연스럽게 연결: 플랫폼 홈이 아니라 검색/콘텐츠 탐색 URL 사용
  const query = encodeURIComponent(`${item.title} ${item.creator}`);
  if (item.platform === "Spotify") {
    return `https://open.spotify.com/search/${query}`;
  }
  if (item.platform === "YouTube") {
    return `https://www.youtube.com/results?search_query=${query}`;
  }
  if (item.platform === "Apple Music") {
    return `https://music.apple.com/search?term=${query}`;
  }
  if (item.platform === "Netflix") {
    return `https://www.netflix.com/search?q=${query}`;
  }
  if (item.platform === "TikTok") {
    return `https://www.tiktok.com/search?q=${query}`;
  }
  if (item.platform === "Instagram") {
    return `https://www.instagram.com/explore/search/keyword/?q=${query}`;
  }
  return item.url;
}

function PlatformBadge({ item }: { item: MediaItem }) {
  return (
    <span className="platform-badge">
      {item.type === "music" ? <Music2 size={13} /> : <Play size={13} />}
      {item.platform}
    </span>
  );
}

export function IslandDetailPanel({ user, currentUser }: IslandDetailPanelProps) {
  const mediaItems = useAppStore((state) => state.mediaItems);
  const likeMedia = useAppStore((state) => state.likeMedia);
  const likes = useAppStore((state) => state.likes);
  const [focusedMedia, setFocusedMedia] = useState<MediaItem | null>(null);
  const [isBottleOpen, setIsBottleOpen] = useState(false);

  const userMedia = useMemo(
    () => mediaItems.filter((item) => item.userId === user.id),
    [mediaItems, user.id]
  );

  const isLiked = (mediaId: string) =>
    likes.some(
      (like) =>
        like.fromUserId === CURRENT_USER_ID && like.toUserId === user.id && like.mediaItemId === mediaId
    );

  const alreadyLikedFocused = focusedMedia ? isLiked(focusedMedia.id) : false;

  const selectedMedia = focusedMedia ?? userMedia[0];

  return (
    <>
      <motion.aside
        className="detail-panel"
        initial={{ opacity: 0, x: 36 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 36 }}
      >
        <div className="panel-header">
          <span className="eyebrow">
            <Ship size={16} />
            {islandDistanceLabel(currentUser, user)}
          </span>
          <h2>{user.nickname}</h2>
          <p>{user.tasteDescription}</p>
        </div>

        <div className="keyword-row">
          {[user.keyword1, user.keyword2, user.keyword3].map((keyword) => (
            <span key={keyword}>{keyword}</span>
          ))}
        </div>

        <section className="content-viewer">
          {selectedMedia ? (
            <>
              <div className="viewer-art" style={{ background: selectedMedia.thumbnail }}>
                <PlatformBadge item={selectedMedia} />
              </div>
              <strong>{selectedMedia.title}</strong>
              <span>{selectedMedia.creator}</span>
              <div className="tag-row">
                {selectedMedia.tags.map((tag) => (
                  <small key={tag}>{tag}</small>
                ))}
              </div>
              <div className="viewer-actions">
                <a className="secondary-button" href={mediaPreviewUrl(selectedMedia)} target="_blank" rel="noreferrer">
                  <ExternalLink size={16} />
                  미리보기 열기
                </a>
                <button
                  className="primary-button"
                  onClick={() => likeMedia(user.id, selectedMedia.id)}
                  disabled={alreadyLikedFocused}
                >
                  <Heart size={17} />
                  {alreadyLikedFocused ? "좋아요함" : "좋아요"}
                </button>
              </div>
            </>
          ) : (
            <p>아직 이 섬에 공개된 콘텐츠가 없어요.</p>
          )}
        </section>

        <section className="media-list">
          <h3>섬 위 콘텐츠</h3>
          {userMedia.map((item) => {
            const liked = isLiked(item.id);
            return (
              <div
                className={`media-card ${focusedMedia?.id === item.id ? "selected" : ""}`}
                key={item.id}
              >
                <button type="button" className="media-card-main" onClick={() => setFocusedMedia(item)}>
                  <span className="media-thumb" style={{ background: item.thumbnail }} />
                  <span className="media-card-text">
                    <strong>{item.title}</strong>
                    <small>
                      {item.creator} · {item.tags.slice(0, 2).join(", ")}
                    </small>
                  </span>
                </button>
                <button
                  type="button"
                  className={`media-card-like ${liked ? "liked" : ""}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    if (!liked) {
                      likeMedia(user.id, item.id);
                    }
                  }}
                  disabled={liked}
                  title={liked ? "이미 좋아요함" : "이 취향에 좋아요"}
                >
                  <Heart size={16} fill={liked ? "currentColor" : "none"} />
                  <span>{liked ? "완료" : "좋아요"}</span>
                </button>
              </div>
            );
          })}
        </section>

        <button className="letter-button" onClick={() => setIsBottleOpen(true)}>
          <MessageCircle size={18} />
          유리병 편지 보내기
        </button>
      </motion.aside>

      {isBottleOpen && <BottleLetterModal toUser={user} onClose={() => setIsBottleOpen(false)} />}
    </>
  );
}
