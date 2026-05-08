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
  음악: ["힙합", "밴드", "아이돌", "클래식", "재즈", "R&B"],
  "영화/드라마": ["범죄", "로맨스", "스릴러", "SF", "독립영화", "다큐멘터리"],
  유튜브: ["브이로그", "인터뷰", "알고리즘 추천", "게임방송", "먹방", "지식콘텐츠"],
  예능: ["관찰예능", "연애예능", "코미디", "여행예능", "음악예능"],
  패션: ["스트릿", "미니멀", "빈티지", "고프코어", "디자이너"],
  스포츠: ["축구", "야구", "농구", "러닝", "e스포츠"],
  게임: ["인디게임", "RPG", "FPS", "시뮬레이션", "스토리게임"],
  책: ["소설", "에세이", "인문", "과학", "시"],
  애니메이션: ["일상", "액션", "판타지", "SF", "성장물"]
};

export const subCategoriesByMiddle: Record<string, string[]> = {
  힙합: ["켄드릭 라마", "드레이크", "타일러 더 크리에이터", "Travis Scott", "JID", "빈지노"],
  밴드: ["검정치마", "실리카겔", "Radiohead", "Oasis", "새소년"],
  아이돌: ["NewJeans", "LE SSERAFIM", "NCT", "IVE", "aespa"],
  클래식: ["드뷔시", "쇼팽", "바흐", "말러", "현대음악"],
  재즈: ["쳇 베이커", "Miles Davis", "빌 에반스", "퓨전재즈", "시티팝"],
  "R&B": ["SZA", "Frank Ocean", "Crush", "DEAN", "H.E.R."],
  범죄: ["수사물", "느와르", "프로파일링", "법정극", "실화기반"],
  로맨스: ["청춘", "현실연애", "힐링", "계절감", "로코"],
  스릴러: ["데이비드 핀처", "크리스토퍼 놀란", "블랙미러 스타일", "반전", "심리전"],
  SF: ["디스토피아", "우주", "AI", "사이버펑크", "시간여행"],
  독립영화: ["저예산 미학", "롱테이크", "도시청춘", "여백", "A24"],
  다큐멘터리: ["음악 다큐", "사회 이슈", "자연", "인물", "푸드"],
  브이로그: ["미니멀", "감성", "해외일상", "자기계발형", "도시산책"],
  인터뷰: ["롱폼", "창작자", "음악가", "영화인", "커리어"],
  "알고리즘 추천": ["밤샘 추천", "숏폼 중독", "기묘한 썸네일", "밈", "숨은 채널"],
  게임방송: ["스피드런", "종합게임", "인디게임", "e스포츠", "공략"],
  먹방: ["야식", "로컬맛집", "디저트", "해외음식", "편의점"],
  지식콘텐츠: ["철학", "과학", "경제", "역사", "테크"],
  관찰예능: ["룸메이트", "일상관찰", "여행", "반려동물", "자취"],
  연애예능: ["환승", "소개팅", "리얼리티", "설렘", "관계분석"],
  코미디: ["스케치", "풍자", "상황극", "밈", "토크"],
  여행예능: ["해외", "힐링", "로드트립", "로컬", "기차"],
  음악예능: ["경연", "밴드", "랩", "싱어송라이터", "버스킹"],
  스트릿: ["오버핏", "스니커즈", "빈티지 데님", "캡", "레이어드"],
  미니멀: ["무채색", "실루엣", "오피스", "단정함", "로우키"],
  빈티지: ["레트로", "가죽", "세컨핸드", "필름무드", "워크웨어"],
  고프코어: ["아웃도어", "테크웨어", "나일론", "트레일", "레이어"],
  디자이너: ["런웨이", "아카이브", "하이엔드", "캠페인", "실험실루엣"],
  축구: ["프리미어리그", "전술분석", "하이라이트", "국대", "풋살"],
  야구: ["KBO", "MLB", "응원문화", "데이터야구", "직관"],
  농구: ["NBA", "스트릿볼", "하이라이트", "스니커즈", "포지션"],
  러닝: ["마라톤", "회복런", "러닝크루", "기록", "새벽"],
  e스포츠: ["LoL", "Valorant", "전략분석", "하이라이트", "프로팀"],
  인디게임: ["픽셀아트", "서사", "실험적", "퍼즐", "힐링"],
  RPG: ["오픈월드", "파티", "세계관", "파밍", "엔딩"],
  FPS: ["전술", "클러치", "랭크", "에임", "팀플"],
  시뮬레이션: ["도시건설", "경영", "생활", "농장", "샌드박스"],
  스토리게임: ["선택지", "시네마틱", "감정선", "미스터리", "엔딩수집"],
  소설: ["문학", "장르소설", "청춘", "미스터리", "세계문학"],
  에세이: ["일상", "관계", "기록", "위로", "여행"],
  인문: ["철학", "사회", "심리", "비평", "도시"],
  과학: ["우주", "뇌과학", "기후", "생명", "테크"],
  시: ["이미지", "문장수집", "계절", "고요", "낭독"],
  일상: ["힐링", "학교", "요리", "반려", "느린호흡"],
  액션: ["전투", "능력자", "스포츠", "속도감", "팀"],
  판타지: ["마법", "이세계", "용사", "세계관", "모험"],
  성장물: ["청춘", "관계", "음악", "스포츠", "꿈"]
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

  return {
    mainKeyword: rule.keywords[0],
    keyword1: rule.keywords[0],
    keyword2: rule.keywords[1],
    keyword3: rule.keywords[2],
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
