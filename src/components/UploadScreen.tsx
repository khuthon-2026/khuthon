import { ChangeEvent, useMemo, useState } from "react";
import { FileJson, Filter, ShipWheel } from "lucide-react";
import { motion } from "framer-motion";
import { CURRENT_USER_ID, platformGuides } from "../data/tasteData";
import { useAppStore } from "../store/useAppStore";
import type { MediaType, Platform, UploadPreviewItem } from "../types";

interface ParsedUploadRow {
  title: string;
  creator: string;
  platform: Platform;
  type: MediaType;
  tags: string[];
}

const fallbackRows: ParsedUploadRow[] = [
  {
    title: "Kendrick Tiny Desk 라이브",
    creator: "NPR Music",
    platform: "YouTube",
    type: "video",
    tags: ["외힙", "라이브", "다크무드"]
  },
  {
    title: "비 오는 날 카페 브이로그",
    creator: "soft day",
    platform: "YouTube",
    type: "video",
    tags: ["감성", "브이로그", "카페"]
  },
  {
    title: "축구 전술 분석 몰아보기",
    creator: "match room",
    platform: "YouTube",
    type: "video",
    tags: ["축구", "전술분석"]
  }
];

const platforms: Platform[] = ["YouTube", "Spotify", "Apple Music", "Instagram", "Netflix", "TikTok"];
const types: MediaType[] = ["music", "video"];

function normalizePlatform(value: string): Platform {
  return platforms.find((platform) => platform.toLowerCase() === value.toLowerCase()) ?? "YouTube";
}

function normalizeType(value: string): MediaType {
  return types.includes(value as MediaType) ? (value as MediaType) : "video";
}

function splitCsvLine(line: string) {
  return line
    .split(",")
    .map((cell) => cell.trim().replace(/^"|"$/g, ""));
}

function parseRows(text: string): ParsedUploadRow[] {
  try {
    const json = JSON.parse(text) as Array<Record<string, unknown>>;
    if (Array.isArray(json)) {
      return json.map((row) => ({
        title: String(row.title ?? row.name ?? "제목 없음"),
        creator: String(row.creator ?? row.artist ?? row.channel ?? "알 수 없음"),
        platform: normalizePlatform(String(row.platform ?? "YouTube")),
        type: normalizeType(String(row.type ?? "video")),
        tags: Array.isArray(row.tags)
          ? row.tags.map(String)
          : String(row.tags ?? "")
              .split(/[|;]/)
              .map((tag) => tag.trim())
              .filter(Boolean)
      }));
    }
  } catch {
    // CSV parsing continues below.
  }

  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return fallbackRows;
  }

  const header = splitCsvLine(lines[0]).map((cell) => cell.toLowerCase());
  return lines.slice(1).map((line) => {
    const cells = splitCsvLine(line);
    const value = (name: string) => cells[header.indexOf(name)] ?? "";

    return {
      title: value("title") || value("name") || "제목 없음",
      creator: value("creator") || value("artist") || value("channel") || "알 수 없음",
      platform: normalizePlatform(value("platform") || "YouTube"),
      type: normalizeType(value("type") || "video"),
      tags: (value("tags") || "")
        .split(/[|;]/)
        .map((tag) => tag.trim())
        .filter(Boolean)
    };
  });
}

export function UploadScreen() {
  const [isParsing, setIsParsing] = useState(false);
  const addUploadedMedia = useAppStore((state) => state.addUploadedMedia);
  const goTo = useAppStore((state) => state.goTo);
  const selection = useAppStore((state) => state.selection);
  const uploadPreview = useAppStore((state) => state.uploadPreview);
  const excludedUploadCount = useAppStore((state) => state.excludedUploadCount);
  const currentUser = useAppStore((state) =>
    state.users.find((user) => user.id === CURRENT_USER_ID)
  );

  const filterTokens = useMemo(
    () =>
      new Set(
        [
          ...selection.mainCategories,
          ...selection.middleCategories,
          ...selection.subCategories,
          currentUser?.keyword1,
          currentUser?.keyword2,
          currentUser?.keyword3
        ]
          .filter(Boolean)
          .map((token) => token!.toLowerCase())
      ),
    [currentUser, selection]
  );

  const convertRows = (rows: ReturnType<typeof parseRows>): UploadPreviewItem[] =>
    rows.map((row) => {
      const text = [row.title, row.creator, ...row.tags].join(" ").toLowerCase();
      const isRelevant = Array.from(filterTokens).some((token) => text.includes(token));

      return {
        ...row,
        status: isRelevant ? "kept" : "excluded"
      };
    });

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (!file) {
      return;
    }

    setIsParsing(true);
    const reader = new FileReader();
    reader.onload = () => {
      const rows = parseRows(String(reader.result ?? ""));
      addUploadedMedia(convertRows(rows));
      setIsParsing(false);
    };
    reader.readAsText(file);
  };

  const applySample = () => {
    addUploadedMedia(convertRows(fallbackRows));
  };

  return (
    <main className="upload-screen">
      <section className="upload-header">
        <span className="eyebrow">
          <FileJson size={16} />
          플랫폼 기록 업로드
        </span>
        <h2>전체 기록을 다 붓지 않고, 내 취향과 연결된 콘텐츠만 섬 위에 올립니다.</h2>
        <p>
          MVP에서는 API 연동 대신 CSV/JSON 업로드로 구현했습니다. title, creator, platform, type,
          tags 컬럼을 읽고 온보딩 취향과 관련 없는 항목은 제외합니다.
        </p>
      </section>

      <section className="upload-grid">
        <div className="upload-dropzone">
          <input id="taste-file" type="file" accept=".csv,.json,.txt" onChange={handleFile} />
          <label htmlFor="taste-file">
            <ShipWheel size={36} />
            <strong>{isParsing ? "파싱 중..." : "CSV 또는 JSON을 여기에 업로드"}</strong>
            <span>관련 콘텐츠만 섬의 미디어 오브젝트로 변환됩니다.</span>
          </label>
          <button className="secondary-button" onClick={applySample}>
            샘플 기록 적용
          </button>
        </div>

        <div className="filter-card">
          <div className="filter-title">
            <Filter size={18} />
            취향 필터
          </div>
          <div className="selected-strip">
            {Array.from(filterTokens).slice(0, 14).map((token) => (
              <span key={token}>{token}</span>
            ))}
          </div>
          <p>
            업로드 기록의 제목, 제작자, 태그 중 위 토큰과 연결되는 항목만 남깁니다. 예를 들어
            축구 기록은 외힙 섬에는 올라오지 않습니다.
          </p>
        </div>
      </section>

      <section className="platform-guide">
        {platformGuides.map((guide, index) => (
          <motion.article
            key={guide.platform}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
          >
            <strong>{guide.title}</strong>
            <span>{guide.guide}</span>
          </motion.article>
        ))}
      </section>

      {uploadPreview.length > 0 && (
        <section className="upload-preview">
          <div>
            <h3>업로드 미리보기</h3>
            <p>{excludedUploadCount}개 항목은 현재 섬 취향과 멀어서 제외했습니다.</p>
          </div>
          <div className="preview-list">
            {uploadPreview.map((item) => (
              <article className={`preview-row ${item.status}`} key={`${item.title}-${item.creator}`}>
                <span>{item.status === "kept" ? "반영" : "제외"}</span>
                <strong>{item.title}</strong>
                <small>
                  {item.creator} · {item.platform} · {item.tags.join(", ")}
                </small>
              </article>
            ))}
          </div>
        </section>
      )}

      <footer className="floating-footer">
        <button className="secondary-button" onClick={() => goTo("keywords")}>
          키워드로 돌아가기
        </button>
        <button className="primary-button" onClick={() => goTo("world")}>
          3D 월드 항해 시작
        </button>
      </footer>
    </main>
  );
}
