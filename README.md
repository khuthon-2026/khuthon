# 섬 넘네

취향을 **3D 섬**으로 표현하고, 다른 사람의 섬을 탐험하는 웹 프로토타입입니다. 로그인·온보딩·키워드 공개·미디어 업로드·월드(섬 맵) 흐름으로 구성되어 있으며, Three.js 기반 3D와 클라이언트 상태(Zustand)로 동작합니다.

## 기술 스택

| 영역 | 사용 |
|------|------|
| UI | React 18, TypeScript |
| 빌드 | Vite 6 |
| 3D | Three.js, React Three Fiber, Drei |
| 애니메이션 | Framer Motion |
| 상태 | Zustand |
| 아이콘 | Lucide React |

## 사전 요구 사항

- [Node.js](https://nodejs.org/) 18 이상 권장
- 패키지 매니저: npm(기본), 또는 호환되는 도구

## 설치 및 실행

```bash
npm install
npm run dev
```

개발 서버는 기본적으로 `http://127.0.0.1:5173` 에서 열립니다. (`vite.config.ts` 및 `package.json`의 `--host` 설정과 동일)

### 프로덕션 빌드

```bash
npm run build
npm run preview
```

`preview` 역시 `127.0.0.1`에 바인딩됩니다.

## npm 스크립트

| 명령 | 설명 |
|------|------|
| `npm run dev` | 개발 서버 (HMR) |
| `npm run build` | TypeScript 검사 후 Vite 프로덕션 빌드 |
| `npm run preview` | 빌드 결과 미리보기 서버 |
| `npm run verify:ui` | Headless Edge로 주요 화면 스크린샷 검증 (선택) |

### UI 검증 스크립트 (`verify:ui`)

Microsoft Edge가 설치된 환경에서, 원격 디버깅 포트로 브라우저를 띄워 로그인·온보딩·키워드·월드·모바일 뷰포트 등의 스크린샷을 생성합니다.

- `APP_URL`: 검증 대상 URL (기본: `http://127.0.0.1:5173`)
- `EDGE_PATH`: Edge 실행 파일 경로 (Windows 기본값이 내장되어 있음; macOS/Linux에서는 로컬 Edge 경로로 지정)

실행 전에 개발 서버를 띄운 뒤 같은 머신에서 스크립트를 실행하는 것이 일반적입니다.

## 프로젝트 구조 (요약)

```
src/
  App.tsx              # 화면 분기 (로그인 / 온보딩 / 키워드 / 업로드 / 월드)
  main.tsx             # 엔트리
  components/          # 화면·3D·모달 등 UI
  data/tasteData.ts    # 샘플 사용자·미디어·섬 배치 등 목업 데이터
  store/useAppStore.ts # 전역 상태 및 액션
  types.ts             # 공용 타입
  styles.css           # 전역 스타일
public/
  models/              # GLB 등 3D 에셋
scripts/
  verify-ui.mjs        # UI 스크린샷 검증
```

백엔드 API 없이 **클라이언트 목업 데이터**로 동작하는 프론트엔드 데모에 가깝습니다.

## 라이선스

`package.json`의 `private: true` 설정과 같이 비공개 프로젝트로 두었습니다. 외부 공개 시 라이선스 문구를 별도로 정하면 됩니다.
