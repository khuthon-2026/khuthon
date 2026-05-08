import { useMemo } from "react";
import { Anchor, Inbox, Mail, Sprout, Waves } from "lucide-react";
import { motion } from "framer-motion";
import { CURRENT_USER_ID } from "../data/tasteData";
import { useAppStore } from "../store/useAppStore";
import type { BottleLetter, User } from "../types";

function LetterItem({ letter, sender }: { letter: BottleLetter; sender?: User }) {
  const mediaItems = useAppStore((state) => state.mediaItems);
  const openBottleLetter = useAppStore((state) => state.openBottleLetter);
  const attached = letter.attachedMediaIds
    .map((id) => mediaItems.find((item) => item.id === id))
    .filter(Boolean);

  return (
    <article className={`letter-item ${letter.isOpened ? "opened" : ""}`}>
      <div className="letter-icon">
        <Mail size={20} />
      </div>
      <div>
        <strong>{sender?.nickname ?? "알 수 없는 섬"}에서 떠밀려온 편지</strong>
        <p>{letter.message}</p>
        <div className="tag-row">
          {attached.map((item) => (
            <small key={item!.id}>{item!.title}</small>
          ))}
        </div>
      </div>
      <button className="secondary-button" onClick={() => openBottleLetter(letter.id)}>
        {letter.isOpened ? "보낸 섬으로 이동" : "유리병 열기"}
      </button>
    </article>
  );
}

export function MyIslandPanel() {
  const users = useAppStore((state) => state.users);
  const mediaItems = useAppStore((state) => state.mediaItems);
  const likes = useAppStore((state) => state.likes);
  const letters = useAppStore((state) => state.letters);
  const currentUser = users.find((user) => user.id === CURRENT_USER_ID)!;

  const myMedia = useMemo(
    () => mediaItems.filter((item) => item.userId === CURRENT_USER_ID),
    [mediaItems]
  );
  const receivedLetters = letters.filter((letter) => letter.toUserId === CURRENT_USER_ID);
  const outgoingLikes = likes.filter((like) => like.fromUserId === CURRENT_USER_ID).length;

  return (
    <motion.aside
      className="my-panel"
      initial={{ opacity: 0, x: -36 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -36 }}
    >
      <span className="eyebrow">
        <Anchor size={16} />
        내 섬 관리
      </span>
      <h2>{currentUser.nickname}</h2>
      <p>{currentUser.tasteDescription}</p>

      <div className="keyword-row">
        {[currentUser.keyword1, currentUser.keyword2, currentUser.keyword3].map((keyword) => (
          <span key={keyword}>{keyword}</span>
        ))}
      </div>

      <section className="growth-card">
        <div>
          <span className="eyebrow">
            <Sprout size={15} />
            섬 성장 단계
          </span>
          <strong>Level {currentUser.islandLevel}</strong>
          <p>
            다른 섬의 취향 항목에 좋아요할수록 내 섬 경험치가 쌓이고, 부두·등대·조명이 자라요. 현재{" "}
            {outgoingLikes}번 연결했어요.
          </p>
        </div>
        <div className="growth-steps">
          {[1, 2, 3].map((level) => (
            <span className={level <= currentUser.islandLevel ? "active" : ""} key={level}>
              {level}
            </span>
          ))}
        </div>
      </section>

      <section className="my-media">
        <h3>내 섬 콘텐츠</h3>
        {myMedia.slice(0, 6).map((item) => (
          <article key={item.id}>
            <span className="media-thumb" style={{ background: item.thumbnail }} />
            <div>
              <strong>{item.title}</strong>
              <small>
                {item.platform} · {item.tags.slice(0, 3).join(", ")}
              </small>
            </div>
          </article>
        ))}
      </section>

      <section className="inbox-section">
        <span className="eyebrow">
          <Inbox size={15} />
          받은 유리병 편지함
        </span>
        {receivedLetters.length === 0 ? (
          <div className="empty-inbox">
            <Waves size={22} />
            아직 떠밀려온 편지가 없어요.
          </div>
        ) : (
          receivedLetters.map((letter) => (
            <LetterItem
              key={letter.id}
              letter={letter}
              sender={users.find((user) => user.id === letter.fromUserId)}
            />
          ))
        )}
      </section>
    </motion.aside>
  );
}
