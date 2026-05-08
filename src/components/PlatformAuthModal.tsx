import { motion, AnimatePresence } from "framer-motion";
import type { Platform } from "../types";

interface Props {
  platform: Platform | null;
  onAuthorize: (platform: Platform) => void;
  onClose: () => void;
}

/* ─────────────────────────────────────────
   Google OAuth (YouTube)
───────────────────────────────────────── */
function GoogleAuth({ onAllow, onCancel }: { onAllow: () => void; onCancel: () => void }) {
  return (
    <div style={{
      width: 400,
      background: "#fff",
      borderRadius: 12,
      overflow: "hidden",
      fontFamily: "'Google Sans', Roboto, Arial, sans-serif",
      color: "#202124",
      boxShadow: "0 8px 40px rgba(0,0,0,0.22)",
    }}>
      {/* 상단 주소창 */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "10px 16px",
        background: "#f1f3f4",
        fontSize: 12, color: "#5f6368",
        borderBottom: "1px solid #e0e0e0"
      }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="#5f6368">
          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
        </svg>
        accounts.google.com
      </div>

      <div style={{ padding: "28px 40px 24px" }}>
        {/* Google 로고 */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <svg width="75" height="24" viewBox="0 0 272 92">
            <path fill="#EA4335" d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
            <path fill="#FBBC05" d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
            <path fill="#4285F4" d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"/>
            <path fill="#34A853" d="M225 3v65h-9.5V3h9.5z"/>
            <path fill="#EA4335" d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"/>
            <path fill="#4285F4" d="M35.29 41.41V32h31.syndromic that we go the right direction42c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.29.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.48.01z"/>
          </svg>
        </div>

        <h2 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 400, textAlign: "center" }}>로그인</h2>
        <p style={{ margin: "0 0 20px", fontSize: 14, color: "#5f6368", textAlign: "center" }}>
          niSeom 앱에 계속하기
        </p>

        {/* 계정 선택 */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          border: "1px solid #dadce0", borderRadius: 8,
          padding: "12px 16px", marginBottom: 20, cursor: "pointer"
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "linear-gradient(135deg, #4285F4, #34A853)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontWeight: 700, fontSize: 15, flexShrink: 0
          }}>G</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>내 Google 계정</div>
            <div style={{ fontSize: 12, color: "#5f6368" }}>user@gmail.com</div>
          </div>
          <svg style={{ marginLeft: "auto" }} width="18" height="18" viewBox="0 0 24 24" fill="#5f6368">
            <path d="M7 10l5 5 5-5z"/>
          </svg>
        </div>

        {/* 권한 목록 */}
        <div style={{
          border: "1px solid #dadce0", borderRadius: 8,
          padding: "12px 16px", marginBottom: 24, fontSize: 13
        }}>
          <p style={{ margin: "0 0 10px", color: "#5f6368", fontWeight: 500 }}>
            niSeom이(가) 다음에 액세스하려 합니다
          </p>
          {[
            "YouTube 시청 기록 보기",
            "YouTube 좋아요 목록 보기",
            "YouTube 재생목록 읽기"
          ].map(perm => (
            <div key={perm} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#1a73e8">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span style={{ color: "#202124" }}>{perm}</span>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 11, color: "#5f6368", margin: "0 0 20px", lineHeight: 1.5 }}>
          앱이 이 정보를 어떻게 사용하는지 확인하고
          언제든지 액세스를 취소할 수 있습니다.
        </p>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={onCancel} style={{
            padding: "10px 20px", borderRadius: 4, border: "none",
            background: "transparent", color: "#1a73e8",
            fontSize: 14, fontWeight: 500, cursor: "pointer"
          }}>취소</button>
          <button onClick={onAllow} style={{
            padding: "10px 24px", borderRadius: 4, border: "none",
            background: "#1a73e8", color: "white",
            fontSize: 14, fontWeight: 500, cursor: "pointer"
          }}>허용</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Spotify
───────────────────────────────────────── */
function SpotifyAuth({ onAllow, onCancel }: { onAllow: () => void; onCancel: () => void }) {
  return (
    <div style={{
      width: 380,
      background: "#121212",
      borderRadius: 12,
      padding: "40px 40px 32px",
      fontFamily: "'Circular Std', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      color: "#fff",
      boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
    }}>
      {/* Spotify 로고 */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
        <svg width="130" height="40" viewBox="0 0 1134 340">
          <path fill="#1DB954" d="M167 0C74.7 0 0 74.7 0 167s74.7 167 167 167 167-74.7 167-167S259.3 0 167 0zm76.6 240.8c-3 4.9-9.4 6.4-14.3 3.4-39.2-24-88.5-29.4-146.6-16.1-5.6 1.3-11.2-2.2-12.5-7.8-1.3-5.6 2.1-11.2 7.8-12.5 63.6-14.5 118.2-8.3 162.2 18.7 4.9 3 6.5 9.4 3.4 14.3zm20.4-45.5c-3.8 6.1-11.8 8.1-17.9 4.3-44.9-27.6-113.3-35.6-166.4-19.5-6.9 2.1-14.1-1.8-16.2-8.6-2.1-6.9 1.8-14.2 8.6-16.2 60.8-18.5 136.4-9.5 188.1 22.2 6.1 3.8 8.1 11.8 3.8 17.8zm1.8-47.3c-53.9-32-142.8-34.9-194.2-19.3-8.3 2.5-17-2.1-19.5-10.4-2.5-8.3 2.1-17 10.4-19.5 59.1-17.9 157.4-14.5 219.6 22.3 7.5 4.4 9.9 14.1 5.5 21.5-4.4 7.4-14.1 9.9-21.8 5.4z"/>
          <path fill="#fff" d="M434.6 138.7c-24.8-5.9-29.2-10-29.2-18.7 0-8.2 7.7-13.7 19.2-13.7 11.1 0 22.1 4.2 33.6 12.8 .4.3.9.4 1.4.3.5-.1.9-.4 1.2-.8l14.3-20.2c.6-.9.4-2.1-.4-2.8C460.2 84.3 445 79 428 79c-27.2 0-46.1 16.3-46.1 39.7 0 25.1 16.4 33.9 44.3 40.8 23.6 5.4 27.6 9.9 27.6 18.1 0 9-8 14.7-20.9 14.7-14.3 0-26-4.8-39.2-16.1-.4-.3-.8-.5-1.3-.5-.5 0-1 .3-1.3.7L377 196.8c-.7.8-.6 2.1.2 2.8 15.2 13.3 34 20.4 54.3 20.4 29 0 47.9-16.1 47.9-40.9-.1-21.1-12.6-33.1-44.8-40.4zM540.5 106c-11.6 0-21.1 4.1-28.9 12.5V110c0-1.1-.9-2-2-2H482c-1.1 0-2 .9-2 2v158.9c0 1.1.9 2 2 2h27.7c1.1 0 2-.9 2-2v-50.1c7.9 7.9 17.4 11.7 28.8 11.7 21.5 0 43.3-16.5 43.3-62.1-.1-45.6-21.8-62.4-43.3-62.4zm15.2 62.4c0 22.8-9.1 36.3-24.3 36.3-14.7 0-24.8-14.1-24.8-36.3 0-22.8 10.5-36.3 24.8-36.3 14.6 0 24.3 13.8 24.3 36.3zm82-62.4c-35.6 0-63.3 27.1-63.3 62.2 0 34.6 27.5 61.4 63 61.4 35.7 0 63.5-27 63.5-61.9-.1-34.7-27.6-61.7-63.2-61.7zm0 97.3c-19 0-33.2-15.8-33.2-35.4 0-19.7 13.8-35.1 32.9-35.1 19.1 0 33.4 15.8 33.4 35.4 0 19.8-13.8 35.1-33.1 35.1zm111.5-97.3c-11.6 0-21.1 4.1-28.9 12.5V110c0-1.1-.9-2-2-2h-27.7c-1.1 0-2 .9-2 2v108c0 1.1.9 2 2 2H718c1.1 0 2-.9 2-2v-50.1c7.9 7.9 17.4 11.7 28.8 11.7 21.5 0 43.3-16.5 43.3-62.1 0-45.6-21.7-62.4-43.4-62.4zm15.2 62.4c0 22.8-9.1 36.3-24.3 36.3-14.7 0-24.8-14.1-24.8-36.3 0-22.8 10.5-36.3 24.8-36.3 14.7 0 24.3 13.8 24.3 36.3zm74.2-105.2h-27.7c-1.1 0-2 .9-2 2v172.7c0 1.1.9 2 2 2H839c1.1 0 2-.9 2-2V65.2c0-1.1-.9-2.2-2-2.2zm76.9 43.2c-35.6 0-62.1 28.1-62.1 65.2 0 32.9 21.8 59.2 62.1 59.2 35.6 0 62.1-28.1 62.1-65.2-.1-32.8-21.8-59.2-62.1-59.2zm0 96.8c-19.6 0-33.2-15.8-33.2-37.8 0-22.1 13.2-37.7 33.2-37.7 19.6 0 33.2 15.8 33.2 37.8 0 22.1-13.2 37.7-33.2 37.7zm142.9-97.6c-9.6 0-19.5 2.7-27.9 8.9V110c0-1.1-.9-2-2-2h-27.7c-1.1 0-2 .9-2 2v108c0 1.1.9 2 2 2h27.7c1.1 0 2-.9 2-2v-54.6c0-19.3 10.5-29.5 23.5-29.5 13 0 21 9.3 21 29.5V218c0 1.1.9 2 2 2h27.7c1.1 0 2-.9 2-2v-64.4c0-33.8-18.7-51.1-48.3-51.1z"/>
        </svg>
      </div>

      <h2 style={{ textAlign: "center", fontSize: 22, fontWeight: 700, margin: "0 0 24px" }}>
        Spotify에 로그인
      </h2>

      {/* 입력 필드 */}
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6, color: "#fff" }}>
          이메일 또는 사용자 이름
        </label>
        <div style={{
          background: "#2a2a2a", border: "1px solid #535353",
          borderRadius: 4, padding: "14px 16px", color: "#a7a7a7", fontSize: 15
        }}>
          user@email.com
        </div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6, color: "#fff" }}>
          비밀번호
        </label>
        <div style={{
          background: "#2a2a2a", border: "1px solid #535353",
          borderRadius: 4, padding: "14px 16px", color: "#a7a7a7", fontSize: 15
        }}>
          ••••••••
        </div>
      </div>

      {/* 로그인 버튼 */}
      <button onClick={onAllow} style={{
        width: "100%", padding: "15px", borderRadius: 999,
        background: "#1DB954", border: "none",
        color: "#000", fontSize: 15, fontWeight: 700,
        cursor: "pointer", letterSpacing: 1, marginBottom: 20
      }}>
        로그인
      </button>

      {/* 구분선 */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1, height: 1, background: "#535353" }} />
        <span style={{ color: "#a7a7a7", fontSize: 13 }}>또는</span>
        <div style={{ flex: 1, height: 1, background: "#535353" }} />
      </div>

      {/* 소셜 로그인 */}
      {[
        { label: "Google로 계속하기", color: "#4285F4", letter: "G" },
        { label: "Facebook으로 계속하기", color: "#1877F2", letter: "f" },
        { label: "Apple로 계속하기", color: "#fff", letter: "🍎" },
      ].map(({ label, color, letter }) => (
        <button key={label} onClick={onAllow} style={{
          width: "100%", display: "flex", alignItems: "center", gap: 12,
          padding: "12px 16px", borderRadius: 999, border: "1px solid #535353",
          background: "transparent", color: "#fff", fontSize: 14,
          fontWeight: 600, cursor: "pointer", marginBottom: 10
        }}>
          <span style={{
            width: 22, height: 22, borderRadius: "50%",
            background: color, color: color === "#fff" ? "#000" : "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 900, flexShrink: 0
          }}>{letter}</span>
          {label}
        </button>
      ))}

      <button onClick={onCancel} style={{
        background: "none", border: "none", color: "#a7a7a7",
        fontSize: 13, cursor: "pointer", width: "100%",
        textAlign: "center", marginTop: 8, padding: 8
      }}>
        취소
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────
   Apple Music
───────────────────────────────────────── */
function AppleMusicAuth({ onAllow, onCancel }: { onAllow: () => void; onCancel: () => void }) {
  return (
    <div style={{
      width: 360,
      background: "#f5f5f7",
      borderRadius: 18,
      overflow: "hidden",
      fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
      color: "#1d1d1f",
      boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    }}>
      {/* 헤더 */}
      <div style={{
        background: "linear-gradient(180deg, #1c1c1e 0%, #2c2c2e 100%)",
        padding: "28px 28px 20px",
        textAlign: "center"
      }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🍎</div>
        <h2 style={{ margin: 0, color: "#fff", fontSize: 20, fontWeight: 600 }}>
          Apple ID로 로그인
        </h2>
        <p style={{ margin: "6px 0 0", color: "#98989d", fontSize: 13 }}>
          niSeom에서 Apple Music 접근 허용
        </p>
      </div>

      <div style={{ padding: "24px 28px" }}>
        {/* 권한 안내 */}
        <div style={{
          background: "#fff", borderRadius: 12,
          padding: "14px 16px", marginBottom: 20,
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
        }}>
          <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 600, color: "#1d1d1f" }}>
            niSeom이 다음에 접근합니다
          </p>
          {["Apple Music 보관함", "최근 재생 항목", "좋아하는 곡 목록"].map(item => (
            <div key={item} style={{
              display: "flex", alignItems: "center", gap: 8,
              fontSize: 13, color: "#3a3a3c", paddingTop: 6
            }}>
              <span style={{ color: "#ff375f", fontSize: 16 }}>♪</span>
              {item}
            </div>
          ))}
        </div>

        {/* Apple ID 입력 */}
        <div style={{
          background: "#fff", borderRadius: 12,
          overflow: "hidden", marginBottom: 16,
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
        }}>
          <div style={{
            padding: "12px 16px", borderBottom: "1px solid #e5e5ea",
            display: "flex", justifyContent: "space-between", alignItems: "center"
          }}>
            <span style={{ fontSize: 14, color: "#1d1d1f" }}>Apple ID</span>
            <span style={{ fontSize: 14, color: "#aeaeb2" }}>user@icloud.com</span>
          </div>
          <div style={{
            padding: "12px 16px",
            display: "flex", justifyContent: "space-between", alignItems: "center"
          }}>
            <span style={{ fontSize: 14, color: "#1d1d1f" }}>암호</span>
            <span style={{ fontSize: 14, color: "#aeaeb2" }}>••••••••</span>
          </div>
        </div>

        {/* Face ID 안내 */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          justifyContent: "center", marginBottom: 20,
          color: "#636366", fontSize: 13
        }}>
          <span style={{ fontSize: 20 }}>󾱦</span>
          <span>Face ID로 로그인 가능</span>
        </div>

        {/* 버튼 */}
        <button onClick={onAllow} style={{
          width: "100%", padding: "14px",
          borderRadius: 12, border: "none",
          background: "#0071e3", color: "#fff",
          fontSize: 16, fontWeight: 600,
          cursor: "pointer", marginBottom: 10
        }}>
          계속
        </button>
        <button onClick={onCancel} style={{
          width: "100%", padding: "14px",
          borderRadius: 12, border: "none",
          background: "#e5e5ea", color: "#1d1d1f",
          fontSize: 16, fontWeight: 600,
          cursor: "pointer"
        }}>
          취소
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Instagram
───────────────────────────────────────── */
function InstagramAuth({ onAllow, onCancel }: { onAllow: () => void; onCancel: () => void }) {
  return (
    <div style={{
      width: 360,
      background: "#fff",
      borderRadius: 12,
      overflow: "hidden",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      color: "#262626",
      boxShadow: "0 8px 40px rgba(0,0,0,0.22)",
    }}>
      {/* 그라디언트 헤더 */}
      <div style={{
        background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
        padding: "28px 24px",
        textAlign: "center"
      }}>
        <svg width="120" height="40" viewBox="0 0 200 50" fill="white">
          <text x="0" y="38" fontSize="38" fontWeight="700"
            fontFamily="'Billabong', 'Grand Hotel', cursive, sans-serif"
            letterSpacing="-1">Instagram</text>
        </svg>
      </div>

      <div style={{ padding: "24px" }}>
        <p style={{ margin: "0 0 16px", fontSize: 14, textAlign: "center", color: "#8e8e8e" }}>
          <strong style={{ color: "#262626" }}>niSeom</strong>이(가) 귀하의 Instagram 계정에 접근하려 합니다
        </p>

        {/* 권한 */}
        <div style={{
          background: "#fafafa", border: "1px solid #efefef",
          borderRadius: 8, padding: "12px 14px", marginBottom: 16, fontSize: 13
        }}>
          {["프로필 정보 및 팔로워 수", "저장된 게시물 목록", "릴스 시청 기록"].map(item => (
            <div key={item} style={{
              display: "flex", alignItems: "center", gap: 8, marginBottom: 6
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#0095f6">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              {item}
            </div>
          ))}
        </div>

        {/* 아이디 입력 */}
        <input placeholder="전화번호, 사용자 이름 또는 이메일" readOnly style={{
          width: "100%", padding: "10px 14px",
          border: "1px solid #dbdbdb", borderRadius: 6,
          fontSize: 14, color: "#262626", background: "#fafafa",
          marginBottom: 8, boxSizing: "border-box"
        }} />
        <input placeholder="비밀번호" type="password" readOnly style={{
          width: "100%", padding: "10px 14px",
          border: "1px solid #dbdbdb", borderRadius: 6,
          fontSize: 14, color: "#262626", background: "#fafafa",
          marginBottom: 14, boxSizing: "border-box"
        }} />

        {/* 버튼 */}
        <button onClick={onAllow} style={{
          width: "100%", padding: "10px",
          borderRadius: 8, border: "none",
          background: "#0095f6", color: "#fff",
          fontSize: 14, fontWeight: 700,
          cursor: "pointer", marginBottom: 12
        }}>
          Instagram으로 계속하기
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1, height: 1, background: "#dbdbdb" }} />
          <span style={{ color: "#8e8e8e", fontSize: 13, fontWeight: 600 }}>또는</span>
          <div style={{ flex: 1, height: 1, background: "#dbdbdb" }} />
        </div>

        <button onClick={onAllow} style={{
          width: "100%", padding: "10px",
          borderRadius: 8, border: "1px solid #dbdbdb",
          background: "#fff", color: "#1877f2",
          fontSize: 14, fontWeight: 700,
          cursor: "pointer", display: "flex",
          alignItems: "center", justifyContent: "center", gap: 8
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877f2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Facebook으로 로그인
        </button>

        <button onClick={onCancel} style={{
          background: "none", border: "none", color: "#8e8e8e",
          fontSize: 13, cursor: "pointer", width: "100%",
          textAlign: "center", marginTop: 12, padding: 4
        }}>
          취소
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Netflix
───────────────────────────────────────── */
function NetflixAuth({ onAllow, onCancel }: { onAllow: () => void; onCancel: () => void }) {
  return (
    <div style={{
      width: 370,
      background: "#141414",
      borderRadius: 8,
      padding: "48px 56px 36px",
      fontFamily: "'Netflix Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      color: "#fff",
      boxShadow: "0 8px 60px rgba(0,0,0,0.8)",
    }}>
      {/* Netflix 로고 */}
      <div style={{ marginBottom: 28, textAlign: "center" }}>
        <svg width="90" height="28" viewBox="0 0 111 30">
          <path fill="#E50914"
            d="M105.062 14.28L111 30c-1.75-.25-3.499-.563-5.28-.845l-3.345-8.686-3.437 7.969c-1.687-.282-3.344-.376-5.031-.595l6.031-13.75L94.468 0h5.063l3.062 7.874L105.875 0h5.124l-5.937 14.28zM90.47 0h-4.594v27.25c1.5.094 3.062.156 4.594.343V0zm-8.563 26.937c-1.656-.234-3.312-.328-5.03-.468V0h5.03v26.937zM64.25 10.657v3.625H56.97V30h-5.064V0h13.656v4.782h-8.594v5.875h7.282zm-17.406-5.875H39.78V30h-5.063V4.782h-7.062V0h19.187v4.782zm-24.812 16.5l-6-21.282h-5.5L16.5 21.72l-5.53-21.72H5.875l-5.563 30c1.75.406 3.532.656 5.313.968L9 14.28l5.719 16.5c1.75.25 3.5.407 5.25.657L25.75 14.25l3.719 17.157c1.718.344 3.5.592 5.25.875L28.032 0h-5.5l-6 21.282z"/>
        </svg>
      </div>

      <h2 style={{ margin: "0 0 28px", fontSize: 28, fontWeight: 700 }}>로그인</h2>

      {/* 입력 필드 */}
      <div style={{ marginBottom: 16 }}>
        <div style={{
          background: "#333",
          borderRadius: 4, padding: "18px 16px 6px",
          position: "relative", marginBottom: 12
        }}>
          <span style={{ position: "absolute", top: 8, left: 16, fontSize: 11, color: "#8c8c8c" }}>
            이메일 주소
          </span>
          <div style={{ fontSize: 16, color: "#fff", paddingTop: 8 }}>user@email.com</div>
        </div>
        <div style={{
          background: "#333",
          borderRadius: 4, padding: "18px 16px 6px",
          position: "relative"
        }}>
          <span style={{ position: "absolute", top: 8, left: 16, fontSize: 11, color: "#8c8c8c" }}>
            비밀번호
          </span>
          <div style={{ fontSize: 16, color: "#fff", paddingTop: 8 }}>••••••••</div>
        </div>
      </div>

      <button onClick={onAllow} style={{
        width: "100%", padding: "16px",
        borderRadius: 4, border: "none",
        background: "#E50914", color: "#fff",
        fontSize: 16, fontWeight: 700,
        cursor: "pointer", marginBottom: 20
      }}>
        로그인
      </button>

      {/* 안내 텍스트 */}
      <div style={{
        borderTop: "1px solid #333", paddingTop: 16,
        fontSize: 12, color: "#737373", lineHeight: 1.6
      }}>
        <p style={{ margin: 0 }}>
          niSeom 서비스는 귀하의 시청 기록에 접근하여
          취향 분석에 활용합니다. 언제든지 연결을 해제할 수 있습니다.
        </p>
      </div>

      <button onClick={onCancel} style={{
        background: "none", border: "none", color: "#737373",
        fontSize: 13, cursor: "pointer", width: "100%",
        textAlign: "center", marginTop: 16
      }}>
        취소
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────
   TikTok
───────────────────────────────────────── */
function TikTokAuth({ onAllow, onCancel }: { onAllow: () => void; onCancel: () => void }) {
  return (
    <div style={{
      width: 360,
      background: "#000",
      borderRadius: 12,
      overflow: "hidden",
      fontFamily: "'TikTok Sans', 'ProximaNova', Arial, sans-serif",
      color: "#fff",
      boxShadow: "0 8px 40px rgba(0,0,0,0.7)",
    }}>
      {/* 상단 헤더 */}
      <div style={{ padding: "24px 24px 0", textAlign: "center" }}>
        {/* TikTok 로고 */}
        <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}>
          <svg width="36" height="40" viewBox="0 0 48 48">
            <path d="M28 10v18a6 6 0 1 1-4-5.66V18a10 10 0 1 0 8 9.8V10h-4z" fill="white"/>
            <path d="M32 10c.5 2.8 2.4 4.8 5 5.5v4a14 14 0 0 1-5-1.5V28a10 10 0 1 1-8-9.8V22a6 6 0 1 0 4 5.7V10h4z" fill="#69C9D0" opacity="0.9"/>
          </svg>
        </div>
        <h2 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 700 }}>TikTok으로 계속하기</h2>
        <p style={{ margin: "0 0 24px", fontSize: 13, color: "#888" }}>
          niSeom이 귀하의 TikTok 계정에 접근하려 합니다
        </p>
      </div>

      {/* QR 코드 영역 */}
      <div style={{ padding: "0 24px 20px" }}>
        <div style={{
          background: "#fff",
          borderRadius: 12, padding: 16,
          display: "flex", flexDirection: "column", alignItems: "center",
          marginBottom: 16
        }}>
          {/* QR 코드 패턴 (SVG) */}
          <svg width="140" height="140" viewBox="0 0 140 140">
            {/* QR 코드 패턴 시뮬레이션 */}
            {[...Array(14)].map((_, row) =>
              [...Array(14)].map((_, col) => {
                const isCorner = (row < 4 && col < 4) || (row < 4 && col > 9) || (row > 9 && col < 4);
                const isRandom = Math.sin(row * 13 + col * 7) > 0.1;
                const fill = isCorner || isRandom ? "#000" : "#fff";
                return (
                  <rect
                    key={`${row}-${col}`}
                    x={row * 10}
                    y={col * 10}
                    width={9}
                    height={9}
                    fill={fill}
                    rx={isCorner ? 1 : 0}
                  />
                );
              })
            )}
            {/* 중앙 TikTok 로고 */}
            <rect x={52} y={52} width={36} height={36} fill="#fff" rx={4}/>
            <text x={70} y={76} textAnchor="middle" fontSize={20}>🎵</text>
          </svg>
          <p style={{ margin: "12px 0 0", fontSize: 12, color: "#333", textAlign: "center" }}>
            TikTok 앱으로 QR 코드를 스캔하세요
          </p>
        </div>

        {/* 구분선 */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ flex: 1, height: 1, background: "#222" }} />
          <span style={{ color: "#555", fontSize: 12 }}>또는</span>
          <div style={{ flex: 1, height: 1, background: "#222" }} />
        </div>

        {/* 버튼들 */}
        <button onClick={onAllow} style={{
          width: "100%", padding: "12px",
          borderRadius: 8, border: "1px solid #333",
          background: "#111", color: "#fff",
          fontSize: 14, fontWeight: 600,
          cursor: "pointer", marginBottom: 8,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8
        }}>
          <span>📱</span> 휴대폰 / 이메일로 계속하기
        </button>

        <button onClick={onAllow} style={{
          width: "100%", padding: "12px",
          borderRadius: 8, border: "1px solid #333",
          background: "#111", color: "#fff",
          fontSize: 14, fontWeight: 600,
          cursor: "pointer", marginBottom: 16,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8
        }}>
          <span style={{ color: "#FEE500", fontSize: 16 }}>●</span> 카카오로 계속하기
        </button>

        {/* 권한 안내 */}
        <p style={{ fontSize: 11, color: "#555", textAlign: "center", lineHeight: 1.6, margin: "0 0 12px" }}>
          로그인 시 TikTok의&nbsp;
          <span style={{ color: "#69C9D0" }}>서비스 약관</span>
          &nbsp;및&nbsp;
          <span style={{ color: "#69C9D0" }}>개인정보 처리방침</span>에 동의합니다
        </p>

        <button onClick={onCancel} style={{
          background: "none", border: "none", color: "#555",
          fontSize: 13, cursor: "pointer", width: "100%",
          textAlign: "center", paddingBottom: 8
        }}>
          취소
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   메인 모달
───────────────────────────────────────── */
export function PlatformAuthModal({ platform, onAuthorize, onClose }: Props) {
  const handleAllow = () => {
    if (platform) onAuthorize(platform);
  };

  const authContent = () => {
    switch (platform) {
      case "YouTube":
        return <GoogleAuth onAllow={handleAllow} onCancel={onClose} />;
      case "Spotify":
        return <SpotifyAuth onAllow={handleAllow} onCancel={onClose} />;
      case "Apple Music":
        return <AppleMusicAuth onAllow={handleAllow} onCancel={onClose} />;
      case "Instagram":
        return <InstagramAuth onAllow={handleAllow} onCancel={onClose} />;
      case "Netflix":
        return <NetflixAuth onAllow={handleAllow} onCancel={onClose} />;
      case "TikTok":
        return <TikTokAuth onAllow={handleAllow} onCancel={onClose} />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {platform && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
          >
            {authContent()}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
