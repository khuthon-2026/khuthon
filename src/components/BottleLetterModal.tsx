import { useMemo, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { motion } from "framer-motion";
import { CURRENT_USER_ID } from "../data/tasteData";
import { useAppStore } from "../store/useAppStore";
import type { User } from "../types";

interface BottleLetterModalProps {
  toUser: User;
  onClose: () => void;
}

export function BottleLetterModal({ toUser, onClose }: BottleLetterModalProps) {
  const mediaItems = useAppStore((state) => state.mediaItems);
  const sendBottleLetter = useAppStore((state) => state.sendBottleLetter);
  const [message, setMessage] = useState("당신 섬 분위기 좋아서 이 콘텐츠도 어울릴 것 같아요.");
  const [selectedMediaIds, setSelectedMediaIds] = useState<string[]>([]);

  const myMedia = useMemo(
    () => mediaItems.filter((item) => item.userId === CURRENT_USER_ID).slice(0, 6),
    [mediaItems]
  );

  const toggleMedia = (mediaId: string) => {
    setSelectedMediaIds((current) => {
      if (current.includes(mediaId)) {
        return current.filter((id) => id !== mediaId);
      }

      if (current.length >= 3) {
        return current;
      }

      return [...current, mediaId];
    });
  };

  const handleSend = () => {
    sendBottleLetter(toUser.id, message, selectedMediaIds);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <motion.section
        className="bottle-modal"
        initial={{ opacity: 0, y: 34, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
      >
        <button className="icon-button close-button" onClick={onClose} aria-label="닫기">
          <X size={18} />
        </button>
        <span className="eyebrow">
          <MessageCircle size={16} />
          유리병 편지 보내기
        </span>
        <h3>{toUser.nickname}에 콘텐츠 추천을 담아 보냅니다.</h3>
        <p>내 섬 콘텐츠 중 최대 3개까지 편지에 넣을 수 있어요.</p>

        <div className="letter-media-picker">
          {myMedia.map((item) => (
            <button
              className={`letter-media ${selectedMediaIds.includes(item.id) ? "selected" : ""}`}
              key={item.id}
              onClick={() => toggleMedia(item.id)}
            >
              <span style={{ background: item.thumbnail }} />
              <strong>{item.title}</strong>
              <small>{item.platform}</small>
            </button>
          ))}
        </div>

        <textarea
          value={message}
          maxLength={120}
          onChange={(event) => setMessage(event.target.value)}
          aria-label="편지 메시지"
        />

        <div className="modal-actions">
          <span>{selectedMediaIds.length}/3개 선택</span>
          <button className="primary-button" onClick={handleSend} disabled={!message.trim()}>
            <Send size={18} />
            파도에 띄우기
          </button>
        </div>
      </motion.section>
    </div>
  );
}
