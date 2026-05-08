import { motion, AnimatePresence } from "framer-motion";

export type SocialProvider = "google" | "facebook" | "apple" | "kakao";

interface Props {
  provider: SocialProvider | null;
  onLogin: () => void;
  onClose: () => void;
}

/* ─────────────────────────────────────────
   Google
───────────────────────────────────────── */
function GoogleLogin({ onLogin, onClose }: { onLogin: () => void; onClose: () => void }) {
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
      {/* 주소창 */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "10px 16px", background: "#f1f3f4",
        fontSize: 12, color: "#5f6368",
        borderBottom: "1px solid #e0e0e0"
      }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="#5f6368">
          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
        </svg>
        accounts.google.com
      </div>

      <div style={{ padding: "32px 40px 28px" }}>
        {/* Google 로고 */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <svg height="24" viewBox="0 0 74 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M24.9 12.2c0-.8-.1-1.6-.2-2.4H12.7v4.6h6.8c-.3 1.6-1.2 2.9-2.6 3.8v3.1h4.2c2.4-2.3 3.8-5.6 3.8-9.1z" fill="#4285F4" />
            <path d="M12.7 24c3.4 0 6.3-1.1 8.4-3l-4.2-3.2c-1.1.8-2.6 1.2-4.2 1.2-3.2 0-6-2.2-7-5.1H1.5v3.3C3.5 21.3 7.8 24 12.7 24z" fill="#34A853" />
            <path d="M5.7 13.9c-.3-.8-.4-1.6-.4-2.4s.1-1.6.4-2.4V5.8H1.5C.5 7.7 0 9.8 0 12s.5 4.3 1.5 6.2l4.2-3.3z" fill="#FBBC05" />
            <path d="M12.7 4.8c1.8 0 3.4.6 4.7 1.8l3.5-3.5C18.9 1.1 16 0 12.7 0 7.8 0 3.5 2.7 1.5 6.7l4.2 3.3c1-2.9 3.7-5.2 7-5.2z" fill="#EA4335" />
          </svg>
          <span style={{ marginLeft: 8, fontSize: 22, fontWeight: 400, color: "#5f6368" }}>Google</span>
        </div>

        <h2 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 400, textAlign: "center" }}>로그인</h2>
        <p style={{ margin: "0 0 24px", fontSize: 14, color: "#5f6368", textAlign: "center" }}>
          niSeom 앱에 계속하기
        </p>

        {/* 계정 선택 */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          border: "1px solid #dadce0", borderRadius: 8,
          padding: "12px 16px", marginBottom: 20, cursor: "pointer",
          transition: "background 150ms"
        }}
          onMouseEnter={e => (e.currentTarget.style.background = "#f8f9fa")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            background: "linear-gradient(135deg, #4285F4, #34A853)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontWeight: 700, fontSize: 16, flexShrink: 0
          }}>U</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: "#202124" }}>내 Google 계정</div>
            <div style={{ fontSize: 12, color: "#5f6368" }}>user@gmail.com</div>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#5f6368">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
        </div>

        {/* 권한 목록 */}
        <div style={{
          border: "1px solid #dadce0", borderRadius: 8,
          padding: "14px 16px", marginBottom: 24
        }}>
          <p style={{ margin: "0 0 10px", fontSize: 12, color: "#5f6368", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            niSeom이 요청하는 권한
          </p>
          {["프로필 정보 (이름, 프로필 사진)", "이메일 주소"].map(perm => (
            <div key={perm} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#1a73e8">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              <span style={{ fontSize: 13, color: "#202124" }}>{perm}</span>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 11, color: "#5f6368", margin: "0 0 24px", lineHeight: 1.6 }}>
          계속 진행하면 Google의 서비스 약관 및 개인정보처리방침에 동의하는 것입니다.
        </p>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={onClose} style={{
            padding: "10px 20px", borderRadius: 4, border: "none",
            background: "transparent", color: "#1a73e8",
            fontSize: 14, fontWeight: 500, cursor: "pointer"
          }}>취소</button>
          <button onClick={onLogin} style={{
            padding: "10px 24px", borderRadius: 4, border: "none",
            background: "#1a73e8", color: "white",
            fontSize: 14, fontWeight: 500, cursor: "pointer"
          }}>계속</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Facebook
───────────────────────────────────────── */
function FacebookLogin({ onLogin, onClose }: { onLogin: () => void; onClose: () => void }) {
  return (
    <div style={{
      width: 400,
      background: "#fff",
      borderRadius: 12,
      overflow: "hidden",
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      color: "#1c1e21",
      boxShadow: "0 8px 40px rgba(0,0,0,0.22)",
    }}>
      {/* 상단 헤더 */}
      <div style={{
        background: "#1877F2", padding: "20px 24px",
        display: "flex", alignItems: "center", gap: 12
      }}>
        <svg width="40" height="40" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="20" fill="white" />
          <path d="M23.5 20h-2.5v8.5h-3.5V20H15v-3h2.5v-2c0-2.5 1.5-4 4-4 1 0 2.5.2 2.5.2V14h-1.5c-1.5 0-2 .8-2 1.8V17H24l-.5 3z" fill="#1877F2" />
        </svg>
        <div>
          <div style={{ color: "white", fontSize: 20, fontWeight: 700 }}>facebook</div>
          <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>niSeom에 로그인</div>
        </div>
      </div>

      <div style={{ padding: "24px" }}>
        <p style={{ margin: "0 0 16px", fontSize: 14, color: "#606770", lineHeight: 1.5 }}>
          <strong style={{ color: "#1c1e21" }}>niSeom</strong>이 Facebook 계정에 접근할 수 있도록 권한을 요청합니다.
        </p>

        {/* 권한 목록 */}
        <div style={{
          background: "#f0f2f5", borderRadius: 8,
          padding: "12px 16px", marginBottom: 20
        }}>
          {[
            { icon: "👤", text: "공개 프로필 (이름, 프로필 사진)" },
            { icon: "✉️", text: "이메일 주소" },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 18 }}>{icon}</span>
              <span style={{ fontSize: 13, color: "#1c1e21" }}>{text}</span>
            </div>
          ))}
        </div>

        {/* 입력 필드 */}
        <input readOnly placeholder="이메일 또는 휴대폰 번호" style={{
          width: "100%", padding: "12px 14px",
          border: "1px solid #dddfe2", borderRadius: 6,
          fontSize: 16, marginBottom: 10, boxSizing: "border-box",
          color: "#1c1e21", background: "#f5f6f7"
        }} />
        <input readOnly type="password" placeholder="비밀번호" style={{
          width: "100%", padding: "12px 14px",
          border: "1px solid #dddfe2", borderRadius: 6,
          fontSize: 16, marginBottom: 16, boxSizing: "border-box",
          color: "#1c1e21", background: "#f5f6f7"
        }} />

        {/* 로그인 버튼 */}
        <button onClick={onLogin} style={{
          width: "100%", padding: "14px",
          borderRadius: 6, border: "none",
          background: "#1877F2", color: "#fff",
          fontSize: 16, fontWeight: 700,
          cursor: "pointer", marginBottom: 12
        }}>
          로그인
        </button>

        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 13, color: "#1877F2", cursor: "pointer" }}>비밀번호를 잊으셨나요?</span>
        </div>

        <div style={{ borderTop: "1px solid #dadde1", paddingTop: 14, textAlign: "center" }}>
          <button onClick={onClose} style={{
            padding: "10px 24px", borderRadius: 6,
            border: "1px solid #dadde1", background: "#fff",
            color: "#606770", fontSize: 14, cursor: "pointer"
          }}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Apple
───────────────────────────────────────── */
function AppleLogin({ onLogin, onClose }: { onLogin: () => void; onClose: () => void }) {
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
      {/* 다크 헤더 */}
      <div style={{
        background: "linear-gradient(180deg, #1c1c1e 0%, #2c2c2e 100%)",
        padding: "32px 28px 24px", textAlign: "center"
      }}>
        <svg width="42" height="42" viewBox="0 0 24 24" fill="white" style={{ marginBottom: 12 }}>
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
        </svg>
        <h2 style={{ margin: 0, color: "#fff", fontSize: 20, fontWeight: 600 }}>Apple ID로 계속하기</h2>
        <p style={{ margin: "6px 0 0", color: "#98989d", fontSize: 13 }}>
          niSeom에서 Apple 계정으로 로그인
        </p>
      </div>

      <div style={{ padding: "24px 28px" }}>
        {/* 안내 */}
        <div style={{
          background: "#fff", borderRadius: 12, padding: "14px 16px",
          marginBottom: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
        }}>
          <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 600 }}>niSeom이 공유받는 정보</p>
          {["이름", "이메일 주소"].map(item => (
            <div key={item} style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", paddingTop: 8,
              borderTop: "1px solid #f2f2f7", marginTop: 6
            }}>
              <span style={{ fontSize: 13, color: "#1d1d1f" }}>{item}</span>
              <span style={{ fontSize: 12, color: "#aeaeb2" }}>공유됨</span>
            </div>
          ))}
        </div>

        {/* Apple ID 입력 */}
        <div style={{
          background: "#fff", borderRadius: 12, overflow: "hidden",
          marginBottom: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
        }}>
          <div style={{
            padding: "12px 16px", borderBottom: "1px solid #e5e5ea",
            display: "flex", justifyContent: "space-between", alignItems: "center"
          }}>
            <span style={{ fontSize: 14 }}>Apple ID</span>
            <span style={{ fontSize: 14, color: "#aeaeb2" }}>user@icloud.com</span>
          </div>
          <div style={{
            padding: "12px 16px",
            display: "flex", justifyContent: "space-between", alignItems: "center"
          }}>
            <span style={{ fontSize: 14 }}>암호</span>
            <span style={{ fontSize: 18, color: "#aeaeb2", letterSpacing: 3 }}>••••••</span>
          </div>
        </div>

        {/* Face ID */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 8, marginBottom: 20, color: "#636366", fontSize: 13
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#636366" strokeWidth="1.5">
            <rect x="2" y="2" width="8" height="6" rx="1" />
            <rect x="14" y="2" width="8" height="6" rx="1" />
            <rect x="2" y="16" width="8" height="6" rx="1" />
            <rect x="14" y="16" width="8" height="6" rx="1" />
            <path d="M9 12c0 1.66 1.34 3 3 3s3-1.34 3-3" />
            <line x1="9" y1="9" x2="9" y2="9.5" strokeLinecap="round" />
            <line x1="15" y1="9" x2="15" y2="9.5" strokeLinecap="round" />
          </svg>
          Face ID로 로그인 가능
        </div>

        <button onClick={onLogin} style={{
          width: "100%", padding: "14px", borderRadius: 12, border: "none",
          background: "#0071e3", color: "#fff",
          fontSize: 16, fontWeight: 600, cursor: "pointer", marginBottom: 10
        }}>
          계속
        </button>
        <button onClick={onClose} style={{
          width: "100%", padding: "14px", borderRadius: 12, border: "none",
          background: "#e5e5ea", color: "#1d1d1f",
          fontSize: 16, fontWeight: 600, cursor: "pointer"
        }}>
          취소
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   KakaoTalk
───────────────────────────────────────── */
function KakaoLogin({ onLogin, onClose }: { onLogin: () => void; onClose: () => void }) {
  return (
    <div style={{
      width: 380,
      background: "#fff",
      borderRadius: 12,
      overflow: "hidden",
      fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', 'Noto Sans KR', sans-serif",
      color: "#3c1e1e",
      boxShadow: "0 8px 40px rgba(0,0,0,0.22)",
    }}>
      {/* 카카오 노란 헤더 */}
      <div style={{
        background: "#FEE500", padding: "28px 24px 20px", textAlign: "center"
      }}>
        {/* 카카오 말풍선 로고 */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
          <svg width="56" height="52" viewBox="0 0 56 52" fill="none">
            <ellipse cx="28" cy="24" rx="28" ry="24" fill="#3c1e1e" />
            <ellipse cx="19" cy="38" rx="7" ry="5" fill="#3c1e1e" transform="rotate(-30 19 38)" />
            <ellipse cx="16" cy="20" rx="3" ry="4" fill="#FEE500" />
            <ellipse cx="28" cy="20" rx="3" ry="4" fill="#FEE500" />
            <ellipse cx="40" cy="20" rx="3" ry="4" fill="#FEE500" />
          </svg>
        </div>
        <div style={{ fontSize: 22, fontWeight: 900, color: "#3c1e1e", letterSpacing: "-0.5px" }}>
          카카오계정으로 로그인
        </div>
        <div style={{ fontSize: 13, color: "rgba(60,30,30,0.6)", marginTop: 4 }}>
          niSeom 서비스 이용을 위해 로그인해주세요
        </div>
      </div>

      <div style={{ padding: "24px" }}>
        {/* 이메일 / 전화번호 입력 */}
        <div style={{ marginBottom: 10 }}>
          <input readOnly placeholder="카카오계정 (이메일 또는 전화번호)" style={{
            width: "100%", padding: "13px 14px",
            border: "1px solid #e0e0e0", borderRadius: 6,
            fontSize: 15, boxSizing: "border-box",
            color: "#3c1e1e", background: "#fafafa", outline: "none"
          }} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <input readOnly type="password" placeholder="비밀번호" style={{
            width: "100%", padding: "13px 14px",
            border: "1px solid #e0e0e0", borderRadius: 6,
            fontSize: 15, boxSizing: "border-box",
            color: "#3c1e1e", background: "#fafafa", outline: "none"
          }} />
        </div>

        {/* 로그인 버튼 */}
        <button onClick={onLogin} style={{
          width: "100%", padding: "14px",
          borderRadius: 6, border: "none",
          background: "#FEE500", color: "#3c1e1e",
          fontSize: 16, fontWeight: 700,
          cursor: "pointer", marginBottom: 12,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8
        }}>
          <svg width="20" height="18" viewBox="0 0 56 52" fill="none">
            <ellipse cx="28" cy="24" rx="28" ry="24" fill="#3c1e1e" />
            <ellipse cx="19" cy="38" rx="7" ry="5" fill="#3c1e1e" transform="rotate(-30 19 38)" />
            <ellipse cx="16" cy="20" rx="3" ry="4" fill="#FEE500" />
            <ellipse cx="28" cy="20" rx="3" ry="4" fill="#FEE500" />
            <ellipse cx="40" cy="20" rx="3" ry="4" fill="#FEE500" />
          </svg>
          카카오계정으로 로그인
        </button>

        {/* 구분선 */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ flex: 1, height: 1, background: "#e8e8e8" }} />
          <span style={{ fontSize: 12, color: "#aaa" }}>또는</span>
          <div style={{ flex: 1, height: 1, background: "#e8e8e8" }} />
        </div>

        {/* QR 로그인 */}
        <button onClick={onLogin} style={{
          width: "100%", padding: "12px",
          borderRadius: 6, border: "1px solid #e0e0e0",
          background: "#fff", color: "#3c1e1e",
          fontSize: 14, fontWeight: 600, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          marginBottom: 16
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3c1e1e" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="3" height="3" />
            <rect x="18" y="14" width="3" height="3" />
            <rect x="14" y="18" width="3" height="3" />
            <rect x="18" y="18" width="3" height="3" />
          </svg>
          QR 코드로 로그인
        </button>

        <div style={{
          display: "flex", justifyContent: "center", gap: 16,
          fontSize: 12, color: "#aaa", marginBottom: 16
        }}>
          <span style={{ cursor: "pointer" }}>이메일 찾기</span>
          <span>|</span>
          <span style={{ cursor: "pointer" }}>비밀번호 찾기</span>
          <span>|</span>
          <span style={{ cursor: "pointer" }}>회원가입</span>
        </div>

        <button onClick={onClose} style={{
          background: "none", border: "none", color: "#aaa",
          fontSize: 13, cursor: "pointer", width: "100%", textAlign: "center"
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
export function SocialLoginModal({ provider, onLogin, onClose }: Props) {
  const content = () => {
    switch (provider) {
      case "google":   return <GoogleLogin onLogin={onLogin} onClose={onClose} />;
      case "facebook": return <FacebookLogin onLogin={onLogin} onClose={onClose} />;
      case "apple":    return <AppleLogin onLogin={onLogin} onClose={onClose} />;
      case "kakao":    return <KakaoLogin onLogin={onLogin} onClose={onClose} />;
      default:         return null;
    }
  };

  return (
    <AnimatePresence>
      {provider && (
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
            {content()}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
