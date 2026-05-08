import type { GrowthState, IslandLevel, IslandType, MediaItem, Platform, User } from "../types";

export const CURRENT_USER_ID = "me";

export const growthThresholds: Array<{
  level: IslandLevel;
  minLikes: number;
  state: GrowthState;
  title: string;
}> = [
  { level: 1, minLikes: 0, state: "seed", title: "첫 항구" },
  { level: 2, minLikes: 3, state: "harbor", title: "작은 부두" },
  { level: 3, minLikes: 6, state: "garden", title: "취향 정원" },
  { level: 4, minLikes: 10, state: "beacon", title: "빛나는 등대" },
  { level: 5, minLikes: 15, state: "legend", title: "대표 섬" }
];

export function levelFromLikes(likes: number): IslandLevel {
  return growthThresholds.reduce<IslandLevel>(
    (level, threshold) => (likes >= threshold.minLikes ? threshold.level : level),
    1
  );
}

export function growthStateFromLevel(level: IslandLevel): GrowthState {
  return growthThresholds.find((threshold) => threshold.level === level)?.state ?? "seed";
}

export function getNextLevelThreshold(level: IslandLevel) {
  return growthThresholds.find((threshold) => threshold.level === ((level + 1) as IslandLevel));
}

export function getGrowthTitle(level: IslandLevel) {
  return growthThresholds.find((threshold) => threshold.level === level)?.title ?? "취향 섬";
}

export const mainCategories = [
  "음악",
  "영화/드라마",
  "유튜브",
  "예능",
  "패션",
  "스포츠",
  "게임",
  "책",
  "애니메이션"
];

export const middleCategoriesByMain: Record<string, string[]> = {
  음악: ["힙합", "밴드/록", "아이돌", "R&B/소울", "재즈/클래식", "일렉트로닉"],
  "영화/드라마": ["한국 드라마", "해외 드라마", "한국 영화", "해외 영화", "다큐멘터리", "독립영화"],
  유튜브: ["브이로그", "먹방/쿠킹", "지식/교양", "엔터테인먼트", "뷰티/패션", "게임방송"],
  예능: ["관찰예능", "연애예능", "서바이벌/경쟁", "여행예능", "토크/버라이어티"],
  패션: ["스트릿", "미니멀/클린", "빈티지/레트로", "스포티/애슬레저", "럭셔리/하이엔드"],
  스포츠: ["축구", "야구", "농구", "e스포츠", "피트니스/러닝"],
  게임: ["RPG/어드벤처", "FPS/슈터", "인디게임", "시뮬레이션", "스포츠/레이싱"],
  책: ["소설", "에세이/자기계발", "인문/사회", "과학/기술", "시/문학"],
  애니메이션: ["일상/힐링", "액션/판타지", "SF/사이버펑크", "성장/청춘", "이세계"]
};

export const subCategoriesByMiddle: Record<string, string[]> = {
  // ── 음악 ──
  힙합: ["빈지노", "기리보이", "Zico", "pH-1", "켄드릭 라마", "드레이크", "Tyler, The Creator", "Travis Scott"],
  "밴드/록": ["검정치마", "실리카겔", "잔나비", "혁오", "새소년", "The 1975", "Arctic Monkeys", "Radiohead"],
  아이돌: ["NewJeans", "aespa", "LE SSERAFIM", "IVE", "BTS", "BLACKPINK", "NCT 127", "Stray Kids"],
  "R&B/소울": ["Frank Ocean", "SZA", "Crush", "DEAN", "헤이즈", "H.E.R.", "pH-1", "Brent Faiyaz"],
  "재즈/클래식": ["쳇 베이커", "Miles Davis", "드뷔시", "쇼팽", "빌 에반스", "시티팝", "보사노바"],
  일렉트로닉: ["lo-fi 힙합", "앰비언트", "테크노/클럽", "신스팝", "시티팝 일렉", "드럼앤베이스"],

  // ── 영화/드라마 ──
  "한국 드라마": ["로맨스/멜로", "스릴러/범죄", "사극/역사극", "의학/법정", "좀비/재난", "학원물"],
  "해외 드라마": ["넷플릭스 오리지널", "HBO 시리즈", "영국 드라마", "일드", "미드 클래식"],
  "한국 영화": ["느와르/범죄", "가족/드라마", "공포/호러", "로맨스 코미디", "액션 블록버스터"],
  "해외 영화": ["할리우드 블록버스터", "유럽 예술영화", "일본 영화", "SF/판타지", "A24 스타일"],
  다큐멘터리: ["자연/환경", "음악/아티스트 다큐", "사회/정치", "음식/여행", "스포츠 다큐"],
  독립영화: ["한국 독립영화", "롱테이크/느린 호흡", "도시 청춘", "실험 영화", "단편 영화"],

  // ── 유튜브 ──
  브이로그: ["일상/감성 브이로그", "해외여행 브이로그", "새벽/밤 브이로그", "미니멀 라이프", "자기계발 브이로그"],
  "먹방/쿠킹": ["야식/밤참 먹방", "로컬 맛집 탐방", "편의점 조합", "레시피/홈쿠킹", "디저트/카페"],
  "지식/교양": ["과학/우주", "역사/인문", "경제/재테크", "심리학", "철학/사유"],
  엔터테인먼트: ["코미디/개그", "반응 영상", "챌린지/밈", "팬캠/직캠", "숏폼 컬렉션"],
  "뷰티/패션": ["메이크업 튜토리얼", "스킨케어 루틴", "룩북/코디", "패션 하울", "향수/뷰티 리뷰"],
  게임방송: ["스트리밍/라이브", "공략/가이드", "e스포츠 하이라이트", "인디게임 리뷰", "게임 토크"],

  // ── 예능 ──
  관찰예능: ["직업/일상 관찰", "동거/룸메이트", "육아/가족 관찰", "반려동물", "자취생 일상"],
  연애예능: ["소개팅/썸 예능", "커플 관찰", "짝사랑/고백 리얼리티", "이별/재결합", "연애 심리"],
  "서바이벌/경쟁": ["음악 서바이벌", "오디션 프로그램", "체력 서바이벌", "요리 경쟁", "직업 서바이벌"],
  여행예능: ["해외 배낭여행", "국내 힐링 여행", "로드트립", "맛집 투어", "오지/극한 여행"],
  "토크/버라이어티": ["심야 토크쇼", "게스트 인터뷰", "공개 코미디", "유튜브 예능", "웹예능"],

  // ── 패션 ──
  스트릿: ["오버핏/루즈핏", "스니커즈 코디", "레이어드 룩", "캡/볼캡 스타일", "그래픽 티"],
  "미니멀/클린": ["무채색 베이직", "깔끔한 핏", "오피스 캐주얼", "토트백 코디", "로우키 무드"],
  "빈티지/레트로": ["구제 쇼핑", "워크웨어", "아메카지", "Y2K 무드", "레트로 프린트"],
  "스포티/애슬레저": ["애슬레저 룩", "아웃도어 고프코어", "테크웨어", "스포츠 브랜드 코디", "나일론 소재"],
  "럭셔리/하이엔드": ["명품 하울", "디자이너 브랜드", "런웨이 리뷰", "아카이브 패션", "하이엔드 코디"],

  // ── 스포츠 ──
  축구: ["EPL/프리미어리그", "라리가/챔피언스리그", "K리그", "전술 분석", "풋살/스트릿 축구"],
  야구: ["KBO 리그", "MLB 메이저리그", "직관/응원 문화", "데이터 야구", "레전드 명장면"],
  농구: ["NBA 하이라이트", "KBL", "스트릿볼", "슬램덩크 감성", "포지션/전술 분석"],
  e스포츠: ["리그 오브 레전드", "발로란트", "배틀그라운드", "오버워치", "스타크래프트"],
  "피트니스/러닝": ["홈트레이닝", "헬스/PT 루틴", "러닝/마라톤", "요가/필라테스", "크로스핏"],

  // ── 게임 ──
  "RPG/어드벤처": ["오픈월드 RPG", "소울라이크", "JRPG", "어드벤처/퍼즐", "MMORPG"],
  "FPS/슈터": ["배틀로얄", "전술 FPS", "아레나 슈터", "격투게임", "메트로배니아"],
  인디게임: ["픽셀 아트 게임", "힐링/감성 게임", "내러티브 게임", "공포 인디", "실험적 아트 게임"],
  시뮬레이션: ["도시 건설", "농장/생활 시뮬", "경영 시뮬레이션", "항공/드라이빙", "인생 시뮬"],
  "스포츠/레이싱": ["EA FC/FIFA", "NBA 2K", "야구 게임", "레이싱 게임", "스포츠 매니지먼트"],

  // ── 책 ──
  소설: ["한국 소설", "일본 소설", "SF 소설", "추리/범죄 소설", "판타지 소설", "세계 문학 클래식"],
  "에세이/자기계발": ["일상 에세이", "관계/감정 에세이", "동기부여/철학", "습관/루틴", "여행 에세이"],
  "인문/사회": ["철학", "역사", "사회학/인류학", "경제/정치", "심리학"],
  "과학/기술": ["우주/천문학", "뇌과학/인지과학", "기후/환경", "IT/테크", "수학/통계"],
  "시/문학": ["한국 현대시", "해외 시", "고전 문학", "단편 소설집", "산문/글쓰기"],

  // ── 애니메이션 ──
  "일상/힐링": ["치유 일상물", "음식 애니", "4컷 만화 원작", "반려동물 애니", "느린 호흡 일상"],
  "액션/판타지": ["소년 배틀물", "마법/능력자", "다크 판타지", "무협", "스포츠 배틀"],
  "SF/사이버펑크": ["근미래 SF", "사이버펑크 세계관", "포스트아포칼립스", "우주 SF", "AI/로봇"],
  "성장/청춘": ["학교생활 성장물", "스포츠 청춘물", "음악/밴드 청춘", "꿈을 향한 여정", "감동 성장"],
  이세계: ["이세계 전생", "게임 판타지", "마법학교물", "현대인 이세계", "역할 역전 이세계"]
};

export const platformGuides = [
  {
    platform: "YouTube" as Platform,
    title: "유튜브",
    guide: "Google 계정 > 내 데이터 다운로드"
  },
  {
    platform: "Spotify" as Platform,
    title: "스포티파이",
    guide: "스포티파이 웹사이트 로그인 > 계정 페이지 > 개인정보 설정 > 데이터 다운로드 요청"
  },
  {
    platform: "Apple Music" as Platform,
    title: "애플뮤직",
    guide: "privacy.apple.com 로그인 > 데이터 복사본 요청 > Apple 미디어 서비스 정보 선택"
  },
  {
    platform: "Instagram" as Platform,
    title: "인스타그램",
    guide: "설정 및 개인정보 > 내 활동 > 내 정보 다운로드"
  },
  {
    platform: "Netflix" as Platform,
    title: "Netflix",
    guide: "Viewing activity CSV를 사용자가 직접 내려받아 업로드"
  },
  {
    platform: "TikTok" as Platform,
    title: "틱톡",
    guide: "프로필 > 설정 및 개인정보 > 계정 > 내 데이터 다운로드"
  }
];

export const sampleUsers: User[] = [
  {
    id: CURRENT_USER_ID,
    nickname: "내 섬",
    mainKeyword: "외힙",
    keyword1: "외힙",
    keyword2: "다크무드",
    keyword3: "감각편집",
    islandType: "neon-city",
    islandLevel: 1,
    likes: 1,
    affinityPoints: 1,
    growthState: "seed",
    islandPositionX: 0,
    islandPositionY: 0,
    tasteDescription: "밤에 듣는 베이스, 선명한 편집, 도시적인 텐션을 좋아해요.",
    representativeContent: "FEEL THE NIGHT BUS"
  },
  {
    id: "luna",
    nickname: "루나의 파도실",
    mainKeyword: "몽환적",
    keyword1: "몽환적",
    keyword2: "시티팝",
    keyword3: "필름무드",
    islandType: "dreamy",
    islandLevel: 2,
    likes: 4,
    affinityPoints: 4,
    growthState: "harbor",
    islandPositionX: -3.8,
    islandPositionY: 2.4,
    tasteDescription: "밤 산책, 흐린 신스, 오래된 필름 같은 콘텐츠를 모아요.",
    representativeContent: "Midnight City Pop"
  },
  {
    id: "nero",
    nickname: "네로 화산섬",
    mainKeyword: "강렬함",
    keyword1: "강렬함",
    keyword2: "스릴러",
    keyword3: "반전",
    islandType: "volcanic",
    islandLevel: 2,
    likes: 5,
    affinityPoints: 5,
    growthState: "harbor",
    islandPositionX: 4.6,
    islandPositionY: -1.7,
    tasteDescription: "조용히 시작해서 마지막에 폭발하는 이야기에 약합니다.",
    representativeContent: "핀처식 반전 구조 해부"
  },
  {
    id: "mora",
    nickname: "모라의 호수",
    mainKeyword: "잔잔함",
    keyword1: "잔잔함",
    keyword2: "다큐감성",
    keyword3: "사유형",
    islandType: "lake",
    islandLevel: 1,
    likes: 2,
    affinityPoints: 2,
    growthState: "seed",
    islandPositionX: -7.5,
    islandPositionY: -4.8,
    tasteDescription: "느린 화면, 긴 호흡, 보고 나서 생각이 남는 기록을 좋아해요.",
    representativeContent: "느린 자연 다큐"
  },
  {
    id: "kai",
    nickname: "카이 네온항구",
    mainKeyword: "외힙",
    keyword1: "외힙",
    keyword2: "실험적",
    keyword3: "스트릿",
    islandType: "neon-city",
    islandLevel: 3,
    likes: 8,
    affinityPoints: 8,
    growthState: "garden",
    islandPositionX: 2.8,
    islandPositionY: 3.8,
    tasteDescription: "비트가 이상할수록 좋고, 영상은 컷이 빠를수록 좋아요.",
    representativeContent: "Off-grid Rap Texture"
  },
  {
    id: "sora",
    nickname: "소라 숲섬",
    mainKeyword: "자연친화",
    keyword1: "자연친화",
    keyword2: "힐링",
    keyword3: "브이로그",
    islandType: "forest",
    islandLevel: 4,
    likes: 11,
    affinityPoints: 11,
    growthState: "beacon",
    islandPositionX: 7.9,
    islandPositionY: 5.5,
    tasteDescription: "조용한 일상 브이로그와 자연 다큐 사이를 자주 건너요.",
    representativeContent: "숲에서 보내는 세 시간 브이로그"
  },
  {
    id: "zero",
    nickname: "제로 실험군도",
    mainKeyword: "실험적",
    keyword1: "실험적",
    keyword2: "인디게임",
    keyword3: "기묘함",
    islandType: "experimental",
    islandLevel: 5,
    likes: 16,
    affinityPoints: 16,
    growthState: "legend",
    islandPositionX: -8.8,
    islandPositionY: 4.7,
    tasteDescription: "규칙이 살짝 어긋난 게임, 영상, 음악을 수집합니다.",
    representativeContent: "엔딩이 없는 인디게임의 매력"
  }
];

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function distanceSquared(ax: number, ay: number, bx: number, by: number) {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
}

export function randomizeIslandPositions(users: User[]) {
  const minDistance = 4.2;
  const minDistanceSq = minDistance * minDistance;
  const minRadius = 2.0;
  const maxRadius = 10.0;

  const placed: Array<{ id: string; x: number; y: number }> = [];

  return users.map((user, index) => {
    if (index === 0) {
      const x = 0;
      const y = 0;
      placed.push({ id: user.id, x, y });
      return { ...user, islandPositionX: x, islandPositionY: y };
    }

    let x = user.islandPositionX;
    let y = user.islandPositionY;

    for (let attempt = 0; attempt < 250; attempt += 1) {
      const angle = randomBetween(0, Math.PI * 2);
      const radius = randomBetween(minRadius, maxRadius);
      const candidateX = Math.cos(angle) * radius;
      const candidateY = Math.sin(angle) * radius;

      const ok = placed.every(
        (prev) => distanceSquared(prev.x, prev.y, candidateX, candidateY) >= minDistanceSq
      );

      if (ok) {
        x = candidateX;
        y = candidateY;
        break;
      }
    }

    placed.push({ id: user.id, x, y });
    return { ...user, islandPositionX: x, islandPositionY: y };
  });
}

export const sampleMedia: MediaItem[] = [
  {
    id: "me-1",
    userId: CURRENT_USER_ID,
    type: "music",
    title: "FEEL THE NIGHT BUS",
    creator: "Kendrick Route",
    platform: "Spotify",
    thumbnail: "linear-gradient(135deg, #1e1b4b, #22d3ee)",
    url: "https://open.spotify.com",
    tags: ["외힙", "다크무드", "베이스"]
  },
  {
    id: "me-2",
    userId: CURRENT_USER_ID,
    type: "video",
    title: "도시 야경을 12컷으로 자르는 법",
    creator: "Edit Pier",
    platform: "YouTube",
    thumbnail: "linear-gradient(135deg, #0f172a, #f472b6)",
    url: "https://youtube.com",
    tags: ["감각편집", "유튜브", "밤"]
  },
  {
    id: "me-3",
    userId: CURRENT_USER_ID,
    type: "music",
    title: "Tyler-like Garden Synth",
    creator: "Odd Coast",
    platform: "Apple Music",
    thumbnail: "linear-gradient(135deg, #064e3b, #facc15)",
    url: "https://music.apple.com",
    tags: ["타일러 더 크리에이터", "실험적", "외힙"]
  },
  {
    id: "luna-1",
    userId: "luna",
    type: "music",
    title: "Midnight City Pop",
    creator: "Neon Laundry",
    platform: "Spotify",
    thumbnail: "linear-gradient(135deg, #155e75, #f9a8d4)",
    url: "https://open.spotify.com",
    tags: ["몽환적", "시티팝", "밤산책"]
  },
  {
    id: "luna-2",
    userId: "luna",
    type: "video",
    title: "도쿄 필름 브이로그: 비 오는 목요일",
    creator: "Luma Frames",
    platform: "YouTube",
    thumbnail: "linear-gradient(135deg, #334155, #a7f3d0)",
    url: "https://youtube.com",
    tags: ["필름무드", "브이로그", "감성"]
  },
  {
    id: "nero-1",
    userId: "nero",
    type: "video",
    title: "핀처식 반전 구조 해부",
    creator: "Dark Cut Lab",
    platform: "YouTube",
    thumbnail: "linear-gradient(135deg, #450a0a, #f97316)",
    url: "https://youtube.com",
    tags: ["데이비드 핀처", "스릴러", "반전"]
  },
  {
    id: "nero-2",
    userId: "nero",
    type: "video",
    title: "Black Mirror 같은 단편 5선",
    creator: "Episode Zero",
    platform: "Netflix",
    thumbnail: "linear-gradient(135deg, #111827, #ef4444)",
    url: "https://netflix.com",
    tags: ["블랙미러 스타일", "SF", "불안"]
  },
  {
    id: "mora-1",
    userId: "mora",
    type: "video",
    title: "느린 자연 다큐: 빛이 숲을 지나는 시간",
    creator: "Quiet Planet",
    platform: "YouTube",
    thumbnail: "linear-gradient(135deg, #164e63, #bef264)",
    url: "https://youtube.com",
    tags: ["다큐멘터리", "잔잔함", "자연"]
  },
  {
    id: "kai-1",
    userId: "kai",
    type: "music",
    title: "Off-grid Rap Texture",
    creator: "JID Archive",
    platform: "Spotify",
    thumbnail: "linear-gradient(135deg, #312e81, #fb7185)",
    url: "https://open.spotify.com",
    tags: ["외힙", "실험적", "JID"]
  },
  {
    id: "kai-2",
    userId: "kai",
    type: "video",
    title: "스트릿 룩북인데 편집이 미쳤다",
    creator: "Street Render",
    platform: "TikTok",
    thumbnail: "linear-gradient(135deg, #020617, #67e8f9)",
    url: "https://tiktok.com",
    tags: ["스트릿", "감각편집", "패션"]
  },
  {
    id: "sora-1",
    userId: "sora",
    type: "video",
    title: "숲에서 보내는 세 시간 브이로그",
    creator: "Green Room",
    platform: "YouTube",
    thumbnail: "linear-gradient(135deg, #14532d, #fde68a)",
    url: "https://youtube.com",
    tags: ["자연친화", "힐링", "브이로그"]
  },
  {
    id: "zero-1",
    userId: "zero",
    type: "video",
    title: "엔딩이 없는 인디게임의 매력",
    creator: "Strange Loop",
    platform: "YouTube",
    thumbnail: "linear-gradient(135deg, #581c87, #2dd4bf)",
    url: "https://youtube.com",
    tags: ["실험적", "인디게임", "기묘함"]
  }
];

const keywordRules: Array<{
  match: string[];
  keywords: [string, string, string];
  islandType: IslandType;
  description: string;
}> = [
  {
    match: ["힙합", "켄드릭 라마", "드레이크", "타일러 더 크리에이터", "Travis Scott", "JID", "스트릿"],
    keywords: ["외힙", "다크무드", "감각편집"],
    islandType: "neon-city",
    description: "비트, 컷, 야간 무드가 촘촘하게 이어지는 도시형 취향 섬입니다."
  },
  {
    match: ["스릴러", "데이비드 핀처", "크리스토퍼 놀란", "블랙미러 스타일", "반전", "범죄"],
    keywords: ["서사중심", "다크무드", "몰입형"],
    islandType: "volcanic",
    description: "천천히 끓다가 마지막에 터지는 이야기 중심의 화산섬입니다."
  },
  {
    match: ["브이로그", "감성", "시티팝", "필름무드", "해외일상", "로맨스"],
    keywords: ["몽환적", "감성적", "도시산책"],
    islandType: "dreamy",
    description: "느슨한 리듬과 부드러운 색이 떠다니는 몽환형 취향 섬입니다."
  },
  {
    match: ["다큐멘터리", "책", "에세이", "인문", "과학", "클래식", "잔잔함"],
    keywords: ["잔잔함", "사유형", "다큐감성"],
    islandType: "lake",
    description: "생각이 오래 남는 콘텐츠가 호수처럼 고이는 조용한 섬입니다."
  },
  {
    match: ["자연", "힐링", "러닝", "여행예능", "일상", "고프코어"],
    keywords: ["자연친화", "힐링", "느린호흡"],
    islandType: "forest",
    description: "속도를 낮추고 오래 머무르는 숲형 취향 섬입니다."
  },
  {
    match: ["인디게임", "실험적", "현대음악", "A24", "사이버펑크", "기묘한 썸네일"],
    keywords: ["실험적", "비정형", "기묘함"],
    islandType: "experimental",
    description: "규칙을 살짝 비틀어 새 길을 만드는 비정형 취향 섬입니다."
  }
];

export function deriveIslandIdentity(
  mainCategoriesValue: string[],
  middleCategoriesValue: string[],
  subCategoriesValue: string[]
) {
  const selected = [...mainCategoriesValue, ...middleCategoriesValue, ...subCategoriesValue];
  const rule =
    keywordRules.find((candidate) => candidate.match.some((token) => selected.includes(token))) ??
    keywordRules[0];

  // 실제 선택값을 키워드로 사용: 서브카테고리(3단계) → 미들(2단계) → 메인(1단계) 순으로 우선
  const pool = [...subCategoriesValue, ...middleCategoriesValue, ...mainCategoriesValue];
  const keyword1 = pool[0] ?? rule.keywords[0];
  const keyword2 = pool[1] ?? rule.keywords[1];
  const keyword3 = pool[2] ?? rule.keywords[2];

  return {
    mainKeyword: middleCategoriesValue[0] ?? rule.keywords[0],
    keyword1,
    keyword2,
    keyword3,
    islandType: rule.islandType,
    tasteDescription: rule.description
  };
}

export function similarityScore(a: User, b: User) {
  const left = new Set([a.mainKeyword, a.keyword1, a.keyword2, a.keyword3]);
  const right = [b.mainKeyword, b.keyword1, b.keyword2, b.keyword3];
  const matches = right.filter((keyword) => left.has(keyword)).length;
  const closeFamilies = [
    ["외힙", "다크무드", "감각편집", "실험적", "스트릿"],
    ["몽환적", "감성적", "필름무드", "도시산책", "시티팝"],
    ["잔잔함", "사유형", "다큐감성", "자연친화", "힐링"]
  ];
  const familyBoost = closeFamilies.some(
    (family) =>
      [a.keyword1, a.keyword2, a.keyword3].some((keyword) => family.includes(keyword)) &&
      [b.keyword1, b.keyword2, b.keyword3].some((keyword) => family.includes(keyword))
  )
    ? 1
    : 0;

  return Math.min(1, (matches + familyBoost) / 4);
}

export function islandDistanceLabel(current: User, target: User) {
  const score = similarityScore(current, target);

  if (score >= 0.5) {
    return "가까운 취향 해역";
  }

  if (score >= 0.25) {
    return "건너볼 만한 취향 거리";
  }

  return "알고리즘 바깥 먼바다";
}
