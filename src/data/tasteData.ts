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
  축구: ["EPL/프리미어리그", "라리가/챔피언스리그", "K리그", "풋살/스트릿 축구"],
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
    // 내 섬: 음악(힙합) × 스포츠(야구+축구) → Travis Scott, 야구, K리그 선택
    id: CURRENT_USER_ID,
    nickname: "내 섬",
    mainKeyword: "힙합",
    keyword1: "Travis Scott",
    keyword2: "K리그",
    keyword3: "야구",
    islandType: "neon-city",
    islandLevel: 1,
    likes: 1,
    affinityPoints: 1,
    growthState: "seed",
    islandPositionX: 0,
    islandPositionY: 0,
    tasteDescription: "밤 비트와 낮의 그라운드가 공존하는 스포츠×힙합 취향 섬입니다.",
    representativeContent: "Travis Scott UTOPIA 들으며 야구장 직관"
  },
  {
    // 정욱: 야구(KBO) + 힙합(드레이크) → score 0.75 (가까운 취향 해역)
    // 야구 직접 매칭 + 힙합 직접 매칭 + 힙합 패밀리 부스트
    id: "joon",
    nickname: "정욱의 그라운드",
    mainKeyword: "야구",
    keyword1: "KBO 리그",
    keyword2: "힙합",
    keyword3: "드레이크",
    islandType: "neon-city",
    islandLevel: 3,
    likes: 8,
    affinityPoints: 8,
    growthState: "garden",
    islandPositionX: 0,
    islandPositionY: 0,
    tasteDescription: "경기장 직관 후 힙합 듣는 게 공식 루틴이에요. 야구 보며 드레이크 틀면 완성.",
    representativeContent: "잠실 직관 브이로그 × 힙합 플레이리스트"
  },
  {
    // 서연: 축구(K리그+EPL+전술) → score 0.5 (가까운 취향 해역)
    // K리그 직접 매칭 + 축구 패밀리 부스트
    id: "seo",
    nickname: "서연의 축구섬",
    mainKeyword: "축구",
    keyword1: "K리그",
    keyword2: "EPL/프리미어리그",
    keyword3: "전술 분석",
    islandType: "volcanic",
    islandLevel: 2,
    likes: 5,
    affinityPoints: 5,
    growthState: "harbor",
    islandPositionX: 0,
    islandPositionY: 0,
    tasteDescription: "K리그 현장 응원과 EPL 새벽 중계를 둘 다 챙기는 축구 올인 취향이에요.",
    representativeContent: "전북 vs 울산 직관 + 시티 전술 분석"
  },
  {
    // 민혁: 힙합(켄드릭+빈지노+기리보이) → score 0.5 (가까운 취향 해역)
    // 힙합 mainKeyword 직접 매칭 + 힙합 패밀리 부스트
    id: "min",
    nickname: "민혁의 비트섬",
    mainKeyword: "힙합",
    keyword1: "켄드릭 라마",
    keyword2: "빈지노",
    keyword3: "기리보이",
    islandType: "neon-city",
    islandLevel: 2,
    likes: 4,
    affinityPoints: 4,
    growthState: "harbor",
    islandPositionX: 0,
    islandPositionY: 0,
    tasteDescription: "국힙과 외힙을 오가며 가사 한 줄에 꽂히는 취향이에요.",
    representativeContent: "빈지노 × 켄드릭 라마 교차 감상 기록"
  },
  {
    // 예진: EPL+라리가+전술 → score 0.25 (건너볼 만한 취향 거리)
    // K리그 없어서 직접 매칭 0 + 축구 패밀리 부스트만
    id: "yejin",
    nickname: "예진의 전술섬",
    mainKeyword: "축구",
    keyword1: "EPL/프리미어리그",
    keyword2: "라리가/챔피언스리그",
    keyword3: "전술 분석",
    islandType: "experimental",
    islandLevel: 4,
    likes: 11,
    affinityPoints: 11,
    growthState: "beacon",
    islandPositionX: 0,
    islandPositionY: 0,
    tasteDescription: "전술 분석 유튜브와 챔피언스리그 하이라이트로 채워진 유럽 중심 축구 취향이에요.",
    representativeContent: "맨시티 4-3 전술 해부 × UCL 8강 하이라이트"
  },
  {
    // 하린: 아이돌(NewJeans+aespa+LE SSERAFIM) → score 0 (알고리즘 바깥 먼바다)
    // 겹치는 키워드 없음, 패밀리도 없음
    id: "harin",
    nickname: "하린의 별빛섬",
    mainKeyword: "아이돌",
    keyword1: "NewJeans",
    keyword2: "aespa",
    keyword3: "LE SSERAFIM",
    islandType: "dreamy",
    islandLevel: 4,
    likes: 13,
    affinityPoints: 13,
    growthState: "beacon",
    islandPositionX: 0,
    islandPositionY: 0,
    tasteDescription: "컴백 시즌에 가장 바빠지는 4세대 아이돌 중심 취향이에요.",
    representativeContent: "NewJeans Supernatural × aespa Whiplash 비교 감상"
  },
  {
    // 지수: 에세이+일상+잔잔함 → score 0 (알고리즘 바깥 먼바다)
    // 겹치는 키워드 없음, 패밀리도 없음
    id: "jisu",
    nickname: "지수의 호수 서가",
    mainKeyword: "에세이/자기계발",
    keyword1: "일상 에세이",
    keyword2: "관계/감정 에세이",
    keyword3: "잔잔함",
    islandType: "lake",
    islandLevel: 5,
    likes: 16,
    affinityPoints: 16,
    growthState: "legend",
    islandPositionX: 0,
    islandPositionY: 0,
    tasteDescription: "느리게 읽고 오래 생각하는 에세이와 힐링 콘텐츠로 채운 조용한 서가예요.",
    representativeContent: "하루 한 챕터: 관계 에세이 독서 기록"
  }
];

export const sampleMedia: MediaItem[] = [
  // ── 내 섬 (Travis Scott × 야구 × K리그) ──
  {
    id: "me-1",
    userId: CURRENT_USER_ID,
    type: "music",
    title: "UTOPIA – Travis Scott",
    creator: "Travis Scott",
    platform: "Spotify",
    thumbnail: "linear-gradient(135deg, #1c0533, #f97316)",
    url: "https://open.spotify.com",
    tags: ["Travis Scott", "힙합", "앨범"]
  },
  {
    id: "me-2",
    userId: CURRENT_USER_ID,
    type: "video",
    title: "잠실 야구장 직관 브이로그 – 비 오는 날 더블헤더",
    creator: "그라운드 로그",
    platform: "YouTube",
    thumbnail: "linear-gradient(135deg, #0c1a2e, #2563eb)",
    url: "https://youtube.com",
    tags: ["KBO 리그", "야구", "직관"]
  },
  {
    id: "me-3",
    userId: CURRENT_USER_ID,
    type: "video",
    title: "K리그 이번 주 베스트골 5 – 전북 vs 울산",
    creator: "K리그 공식",
    platform: "YouTube",
    thumbnail: "linear-gradient(135deg, #0a2416, #22c55e)",
    url: "https://youtube.com",
    tags: ["K리그", "축구", "골"]
  },

  // ── 정욱 (KBO + 힙합, score 0.75) ──
  {
    id: "joon-1",
    userId: "joon",
    type: "video",
    title: "류현진 10K 모든 투구 다시보기 풀버전 (04. 07.)",
    creator: "Eagles TV",
    platform: "YouTube",
    thumbnail: "linear-gradient(135deg, #1e1b4b, #60a5fa)",
    url: "https://www.youtube.com/watch?v=zovARbX2B2g",
    tags: ["KBO 리그", "야구", "레전드"]
  },
  {
    id: "joon-2",
    userId: "joon",
    type: "music",
    title: "One Dance – Drake",
    creator: "Drake",
    platform: "Spotify",
    thumbnail: "linear-gradient(135deg, #1a0a2e, #facc15)",
    url: "https://open.spotify.com",
    tags: ["드레이크", "힙합", "R&B"]
  },

  // ── 서연 (K리그 + EPL + 전술, score 0.5) ──
  {
    id: "seo-1",
    userId: "seo",
    type: "video",
    title: "K리그 2024 시즌 결산 – 전북의 부활",
    creator: "풋볼리스트",
    platform: "YouTube",
    thumbnail: "linear-gradient(135deg, #0c2340, #16a34a)",
    url: "https://youtube.com",
    tags: ["K리그", "축구", "전북"]
  },
  {
    id: "seo-2",
    userId: "seo",
    type: "video",
    title: "맨시티 4-3 고전 전술 해부 – 펩의 선택",
    creator: "축구 전술 TV",
    platform: "YouTube",
    thumbnail: "linear-gradient(135deg, #0a1628, #38bdf8)",
    url: "https://youtube.com",
    tags: ["EPL/프리미어리그", "전술 분석", "맨시티"]
  },

  // ── 민혁 (힙합 국힙+외힙, score 0.5) ──
  {
    id: "min-1",
    userId: "min",
    type: "music",
    title: "Not Like Us – Kendrick Lamar",
    creator: "Kendrick Lamar",
    platform: "Spotify",
    thumbnail: "linear-gradient(135deg, #1a0a0a, #ef4444)",
    url: "https://open.spotify.com",
    tags: ["켄드릭 라마", "힙합", "디스"]
  },
  {
    id: "min-2",
    userId: "min",
    type: "music",
    title: "Dimes – 빈지노",
    creator: "빈지노",
    platform: "Apple Music",
    thumbnail: "linear-gradient(135deg, #0f172a, #a78bfa)",
    url: "https://music.apple.com",
    tags: ["빈지노", "힙합", "국힙"]
  },

  // ── 예진 (EPL+라리가+전술, score 0.25) ──
  {
    id: "yejin-1",
    userId: "yejin",
    type: "video",
    title: "UCL 8강 하이라이트 – 이번 시즌 최고의 경기",
    creator: "UEFA 공식",
    platform: "YouTube",
    thumbnail: "linear-gradient(135deg, #0b0a1e, #7c3aed)",
    url: "https://youtube.com",
    tags: ["라리가/챔피언스리그", "축구", "UCL"]
  },
  {
    id: "yejin-2",
    userId: "yejin",
    type: "video",
    title: "아스날 하이프레스 전술 완벽 분석",
    creator: "Tactics Board KR",
    platform: "YouTube",
    thumbnail: "linear-gradient(135deg, #1c0a0a, #f97316)",
    url: "https://youtube.com",
    tags: ["EPL/프리미어리그", "전술 분석", "아스날"]
  },

  // ── 하린 (아이돌, score 0) ──
  {
    id: "harin-1",
    userId: "harin",
    type: "music",
    title: "Supernatural – NewJeans",
    creator: "NewJeans",
    platform: "Spotify",
    thumbnail: "linear-gradient(135deg, #0a1a2e, #f472b6)",
    url: "https://open.spotify.com",
    tags: ["NewJeans", "아이돌", "팝"]
  },
  {
    id: "harin-2",
    userId: "harin",
    type: "video",
    title: "aespa Whiplash 직캠 – 에스파 4K 풀캠",
    creator: "팬캠 아카이브",
    platform: "YouTube",
    thumbnail: "linear-gradient(135deg, #0e0221, #a78bfa)",
    url: "https://youtube.com",
    tags: ["aespa", "아이돌", "직캠"]
  },

  // ── 지수 (에세이+힐링, score 0) ──
  {
    id: "jisu-1",
    userId: "jisu",
    type: "video",
    title: "하루 한 챕터: 관계 에세이 독서 기록",
    creator: "조용한 서가",
    platform: "YouTube",
    thumbnail: "linear-gradient(135deg, #0f1f2e, #94a3b8)",
    url: "https://youtube.com",
    tags: ["일상 에세이", "독서", "힐링"]
  },
  {
    id: "jisu-2",
    userId: "jisu",
    type: "video",
    title: "새벽 2시 감정 에세이: 혼자여서 괜찮은 것들",
    creator: "밤의 서재",
    platform: "YouTube",
    thumbnail: "linear-gradient(135deg, #1a1a2e, #c7d2fe)",
    url: "https://youtube.com",
    tags: ["관계/감정 에세이", "잔잔함", "새벽"]
  }
];

const keywordRules: Array<{
  match: string[];
  keywords: [string, string, string];
  islandType: IslandType;
  description: string;
}> = [
  {
    match: ["힙합", "Travis Scott", "켄드릭 라마", "드레이크", "Tyler, The Creator", "빈지노", "기리보이", "Zico"],
    keywords: ["힙합", "비트", "야간 무드"],
    islandType: "neon-city",
    description: "비트와 야간 텐션이 촘촘하게 이어지는 도시형 취향 섬입니다."
  },
  {
    match: ["야구", "KBO 리그", "MLB 메이저리그", "직관/응원 문화", "데이터 야구", "레전드 명장면"],
    keywords: ["야구", "그라운드", "직관"],
    islandType: "volcanic",
    description: "경기 흐름이 폭발하는 순간에 심장이 뛰는 야구 취향 섬입니다."
  },
  {
    match: ["축구", "K리그", "EPL/프리미어리그", "라리가/챔피언스리그", "전술 분석"],
    keywords: ["축구", "전술", "현장감"],
    islandType: "forest",
    description: "전술 분석부터 현장 응원까지 풀코스 축구 취향 섬입니다."
  },
  {
    match: ["일상/감성 브이로그", "새벽/밤 브이로그", "시티팝", "필름무드", "몽환적", "감성적"],
    keywords: ["몽환적", "감성적", "도시산책"],
    islandType: "dreamy",
    description: "느슨한 리듬과 부드러운 색이 떠다니는 몽환형 취향 섬입니다."
  },
  {
    match: ["일상 에세이", "관계/감정 에세이", "잔잔함", "힐링", "자연친화", "다큐멘터리"],
    keywords: ["잔잔함", "사유형", "힐링"],
    islandType: "lake",
    description: "생각이 오래 남는 콘텐츠가 호수처럼 고이는 조용한 섬입니다."
  },
  {
    match: ["인디게임", "소울라이크", "A24 스타일", "SF/사이버펑크", "실험 영화", "실험적 아트 게임"],
    keywords: ["실험적", "비정형", "기묘함"],
    islandType: "experimental",
    description: "규칙을 살짝 비틀어 새 길을 만드는 비정형 취향 섬입니다."
  },
  {
    match: ["아이돌", "NewJeans", "aespa", "LE SSERAFIM", "IVE", "BTS", "BLACKPINK"],
    keywords: ["아이돌", "컴백", "팬심"],
    islandType: "dreamy",
    description: "컴백 시즌마다 새롭게 채워지는 아이돌 중심 취향 섬입니다."
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
    // 힙합 클러스터 (국힙·외힙 공통)
    ["힙합", "Travis Scott", "켄드릭 라마", "드레이크", "Tyler, The Creator", "빈지노", "기리보이", "pH-1", "Zico"],
    // 야구 클러스터
    ["야구", "KBO 리그", "MLB 메이저리그", "직관/응원 문화", "데이터 야구", "레전드 명장면"],
    // 축구 클러스터 (K리그·유럽 공통)
    ["축구", "K리그", "EPL/프리미어리그", "라리가/챔피언스리그", "전술 분석", "풋살/스트릿 축구"],
    // 밴드/인디 클러스터
    ["밴드/록", "검정치마", "실리카겔", "잔나비", "혁오", "새소년", "The 1975", "Arctic Monkeys", "Radiohead"],
    // 아이돌 클러스터
    ["아이돌", "NewJeans", "aespa", "LE SSERAFIM", "IVE", "BTS", "BLACKPINK", "NCT 127", "Stray Kids"],
    // 감성 무드 클러스터 (브이로그·시티팝)
    ["몽환적", "감성적", "시티팝", "필름무드", "일상/감성 브이로그", "새벽/밤 브이로그"],
    // 힐링·조용 클러스터
    ["잔잔함", "사유형", "다큐감성", "자연친화", "힐링", "느린호흡", "일상 에세이", "관계/감정 에세이"]
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

function stableJitter01(id: string) {
  let h = 2166136261;

  for (let i = 0; i < id.length; i += 1) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }

  return ((h >>> 0) % 10007) / 10007;
}

function distanceSquared(ax: number, ay: number, bx: number, by: number) {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
}

/**
 * 내 섬(0,0) 기준 취향 유사도가 높을수록 가깝게, 낮을수록 먼 링에 배치합니다.
 */
export function layoutIslandsByTasteDistance(users: User[]): User[] {
  const me = users.find((u) => u.id === CURRENT_USER_ID);
  if (!me) {
    return users;
  }

  const minSep = 5.5;
  const minSepSq = minSep * minSep;
  const minRadius = 2.2;
  const maxRadius = 17.0;

  const others = users.filter((u) => u.id !== CURRENT_USER_ID);
  const ranked = others
    .map((u) => ({ u, score: similarityScore(me, u) }))
    .sort((a, b) => b.score - a.score);

  const placed: Array<{ x: number; y: number }> = [{ x: 0, y: 0 }];

  const positioned = new Map<string, User>();

  ranked.forEach(({ u, score }, index) => {
    const gap = maxRadius - minRadius;
    const targetRadius = minRadius + (1 - score) * gap;
    const baseAngle = (index / Math.max(ranked.length, 1)) * Math.PI * 2 + stableJitter01(u.id) * 0.35;

    let bestX = Math.cos(baseAngle) * targetRadius;
    let bestY = Math.sin(baseAngle) * targetRadius;

    for (let attempt = 0; attempt < 140; attempt += 1) {
      const ring = targetRadius + (attempt % 9) * 0.65;
      const twist = baseAngle + (attempt * 0.41) % (Math.PI / 2);
      const cx = Math.cos(twist) * ring;
      const cy = Math.sin(twist) * ring;

      const ok = placed.every((p) => distanceSquared(p.x, p.y, cx, cy) >= minSepSq);

      if (ok) {
        bestX = cx;
        bestY = cy;
        placed.push({ x: cx, y: cy });
        positioned.set(u.id, { ...u, islandPositionX: cx, islandPositionY: cy });
        return;
      }
    }

    placed.push({ x: bestX, y: bestY });
    positioned.set(u.id, { ...u, islandPositionX: bestX, islandPositionY: bestY });
  });

  return users.map((user) => {
    if (user.id === CURRENT_USER_ID) {
      return { ...user, islandPositionX: 0, islandPositionY: 0 };
    }

    return positioned.get(user.id) ?? user;
  });
}

/** @deprecated 레이아웃은 취향 거리 기준을 사용하세요 (`layoutIslandsByTasteDistance`). */
export const randomizeIslandPositions = layoutIslandsByTasteDistance;

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
