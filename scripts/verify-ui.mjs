import { spawn } from "node:child_process";
import { rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { setTimeout as wait } from "node:timers/promises";

const appUrl = process.env.APP_URL ?? "http://127.0.0.1:5173";
const edgePath =
  process.env.EDGE_PATH ?? "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const remotePort = 9400 + Math.floor(Math.random() * 400);
const userDataDir = resolve(`.edge-verify-${Date.now()}`);
const screenshots = {
  login: "verification-login.png",
  onboarding: "verification-onboarding.png",
  keywords: "verification-keywords.png",
  world: "verification-world.png",
  mobile: "verification-mobile.png"
};

const browser = spawn(
  edgePath,
  [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-first-run",
    "--no-default-browser-check",
    `--remote-debugging-port=${remotePort}`,
    `--user-data-dir=${userDataDir}`,
    "--window-size=1440,1000",
    "about:blank"
  ],
  {
    stdio: ["ignore", "pipe", "pipe"]
  }
);
let browserOutput = "";
let browserClosed = false;

browser.stdout?.on("data", (chunk) => {
  browserOutput += chunk.toString();
});

browser.stderr?.on("data", (chunk) => {
  browserOutput += chunk.toString();
});

browser.on("exit", (code, signal) => {
  browserClosed = true;
  browserOutput += `\nBrowser exited with code=${code} signal=${signal}`;
});

const cleanup = () => {
  if (!browser.killed) {
    browser.kill();
  }
};

const removeProfile = async () => {
  await rm(userDataDir, { recursive: true, force: true }).catch(() => undefined);
};

process.on("exit", cleanup);
process.on("SIGINT", () => {
  cleanup();
  process.exit(130);
});

async function fetchJson(url, attempts = 80) {
  let lastError;

  for (let index = 0; index < attempts; index += 1) {
    try {
      const response = await fetch(url);

      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      lastError = error;
    }

    if (browserClosed) {
      throw new Error(`Browser closed before CDP was ready.\n${browserOutput}`);
    }

    await wait(150);
  }

  throw lastError ?? new Error(`Unable to fetch ${url}\n${browserOutput}`);
}

async function connectToPage() {
  const pages = await fetchJson(`http://127.0.0.1:${remotePort}/json/list`);
  const page = pages.find((candidate) => candidate.type === "page");

  if (!page?.webSocketDebuggerUrl) {
    throw new Error("No debuggable browser page found.");
  }

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  const pending = new Map();
  const errors = [];
  let commandId = 0;

  ws.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);

    if (message.id && pending.has(message.id)) {
      const { resolve, reject, timeout } = pending.get(message.id);
      clearTimeout(timeout);
      pending.delete(message.id);

      if (message.error) {
        reject(new Error(`${message.error.message}: ${message.error.data ?? ""}`));
        return;
      }

      resolve(message.result);
      return;
    }

    if (message.method === "Runtime.exceptionThrown") {
      errors.push(message.params.exceptionDetails?.text ?? "Runtime exception");
    }

    if (message.method === "Log.entryAdded" && message.params.entry.level === "error") {
      errors.push(message.params.entry.text);
    }

    if (message.method === "Network.loadingFailed") {
      errors.push(`Network failed: ${message.params.errorText} ${message.params.blockedReason ?? ""}`);
    }
  });

  await new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve, { once: true });
    ws.addEventListener("error", reject, { once: true });
  });

  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = (commandId += 1);
      const timeout = setTimeout(() => {
        pending.delete(id);
        reject(new Error(`CDP command timed out: ${method}`));
      }, 30_000);

      pending.set(id, { resolve, reject, timeout });
      ws.send(JSON.stringify({ id, method, params }));
    });

  return { send, errors, close: () => ws.close() };
}

function clickTextExpression(text) {
  return `(() => {
    const target = ${JSON.stringify(text)};
    const elements = Array.from(document.querySelectorAll("button, a, label"));
    const element = elements.find((candidate) =>
      ((candidate.innerText || "") + " " + (candidate.textContent || "")).includes(target)
    );
    if (!element) return false;
    element.click();
    return true;
  })()`;
}

async function evaluate(send, expression) {
  const result = await send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true
  });

  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text ?? "Runtime evaluation failed.");
  }

  return result.result.value;
}

async function assertText(send, text) {
  const found = await evaluate(
    send,
    `((document.body.innerText || "") + " " + (document.body.textContent || "")).includes(${JSON.stringify(text)})`
  );

  if (!found) {
    const pageText = await evaluate(
      send,
      `((document.body.innerText || "") + " " + (document.body.textContent || "")).slice(0, 1800)`
    );
    throw new Error(`Expected page text was not found: ${text}\nCurrent text:\n${pageText}`);
  }
}

async function click(send, text, delay = 500) {
  const clicked = await evaluate(send, clickTextExpression(text));

  if (!clicked) {
    throw new Error(`Unable to click text: ${text}`);
  }

  await wait(delay);
}

async function screenshot(send, fileName) {
  const result = await send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: false
  });

  await writeFile(fileName, result.data, "base64");
}

async function canvasPixelCheck(send) {
  return evaluate(
    send,
    `(async () => {
      const canvas = document.querySelector("canvas");
      if (!canvas) return { exists: false, coloredSamples: 0, width: 0, height: 0 };
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      if (!gl) return { exists: true, hasWebgl: false, coloredSamples: 0, width: canvas.width, height: canvas.height };
      const points = [
        [0.5, 0.5], [0.35, 0.48], [0.63, 0.44], [0.44, 0.62],
        [0.55, 0.28], [0.22, 0.76], [0.76, 0.72]
      ];
      let coloredSamples = 0;
      const pixel = new Uint8Array(4);
      for (const [px, py] of points) {
        gl.readPixels(
          Math.floor(canvas.width * px),
          Math.floor(canvas.height * (1 - py)),
          1,
          1,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          pixel
        );
        if (pixel[0] + pixel[1] + pixel[2] + pixel[3] > 40) coloredSamples += 1;
      }
      return { exists: true, hasWebgl: true, coloredSamples, width: canvas.width, height: canvas.height };
    })()`
  );
}

try {
  const { send, errors, close } = await connectToPage();

  await send("Page.enable");
  await send("Runtime.enable");
  await send("Log.enable");
  await send("Network.enable");
  await send("Page.navigate", { url: appUrl });
  for (let index = 0; index < 24; index += 1) {
    const ready = await evaluate(
      send,
      `((document.body.innerText || "") + (document.body.textContent || "")).trim().length > 0`
    );

    if (ready) {
      break;
    }

    await wait(500);
  }

  const initial = await evaluate(send, `({
    title: document.title,
    hasContent: ((document.body.innerText || "") + (document.body.textContent || "")).trim().length > 0,
    hasErrorOverlay: Boolean(document.querySelector(".vite-error-overlay, #webpack-dev-server-client-overlay")),
    html: document.documentElement.outerHTML.slice(0, 1200)
  })`);

  if (!initial.hasContent || initial.hasErrorOverlay) {
    await screenshot(send, "verification-failed-initial.png");
    throw new Error(`Initial page failed: ${JSON.stringify(initial)}\n${errors.join("\n")}`);
  }

  await assertText(send, "섬 넘네");
  await screenshot(send, screenshots.login);

  await click(send, "데모 로그인", 800);
  await assertText(send, "취향 방향 선택");
  await screenshot(send, screenshots.onboarding);
  await click(send, "음악", 120);
  await click(send, "영화/드라마", 120);
  await click(send, "유튜브", 120);
  await click(send, "다음", 2800);

  await assertText(send, "분위기 정하기");
  await click(send, "힙합", 120);
  await click(send, "스릴러", 120);
  await click(send, "브이로그", 120);
  await click(send, "다음", 2800);

  await assertText(send, "키워드 고르기");
  await click(send, "켄드릭 라마", 120);
  await click(send, "타일러 더 크리에이터", 120);
  await click(send, "데이비드 핀처", 120);
  await click(send, "내 섬 생성", 2800);

  await assertText(send, "세 개의 키워드");
  await screenshot(send, screenshots.keywords);
  await click(send, "데이터 업로드로 섬 채우기", 700);
  await assertText(send, "플랫폼 기록 업로드");
  await click(send, "샘플 기록 적용", 350);
  await assertText(send, "업로드 미리보기");
  await click(send, "3D 월드 항해 시작", 1800);
  await assertText(send, "취향 거리 시각화");

  const canvasCheck = await canvasPixelCheck(send);

  if (!canvasCheck.exists || !canvasCheck.hasWebgl || canvasCheck.coloredSamples < 3) {
    throw new Error(`Canvas pixel check failed: ${JSON.stringify(canvasCheck)}`);
  }

  await screenshot(send, screenshots.world);
  await click(send, "카이 네온항구", 700);
  await assertText(send, "섬 위 콘텐츠");
  await click(send, "좋아요 배 보내기", 900);
  await assertText(send, "좋아요 배");
  await click(send, "유리병 편지 보내기", 500);
  await assertText(send, "유리병 편지 보내기");
  await click(send, "파도에 띄우기", 900);
  await assertText(send, "유리병 편지");
  await click(send, "내 섬", 700);
  await assertText(send, "받은 유리병 편지함");
  await click(send, "유리병 열기", 800);
  await assertText(send, "루나의 파도실");

  await send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true
  });
  await wait(600);
  await screenshot(send, screenshots.mobile);

  close();
  cleanup();
  await removeProfile();

  if (errors.length > 0) {
    throw new Error(`Browser console/runtime errors: ${errors.join(" | ")}`);
  }

  await new Promise((resolve) => {
    process.stdout.write(
      `${JSON.stringify(
      {
        ok: true,
        title: initial.title,
        screenshots,
        canvasCheck
      },
      null,
      2
    )}\n`,
      resolve
    );
  });
  process.exit(0);
} catch (error) {
  cleanup();
  await removeProfile();
  console.error(error);
  process.exit(1);
}
