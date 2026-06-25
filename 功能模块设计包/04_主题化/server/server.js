/**
 * 主题色配置原型服务：GET/PUT /api/theme/active
 * 仅读写 primaryColor（HEX），不支持多套主题切换。
 * 启动：在本目录执行 npm start（默认端口 3751）
 */
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT) || 3751;
const STATE_FILE = path.join(__dirname, "theme-state.json");
const DEFAULT_PRIMARY = "#165dff";

const PRESET_COLORS = [
  { id: "default", name: "平台默认蓝", color: "#165dff" },
  { id: "brand-red", name: "品牌红", color: "#f53f3f" },
  { id: "brand-orange", name: "活力橙", color: "#ff7d00" },
  { id: "brand-green", name: "成功绿", color: "#00b42a" },
  { id: "brand-purple", name: "紫罗兰", color: "#722ed1" },
];

function isValidHex(color) {
  return typeof color === "string" && /^#[0-9A-Fa-f]{6}$/.test(color);
}

function normalizeHex(color) {
  if (!isValidHex(color)) return DEFAULT_PRIMARY;
  return color.toLowerCase();
}

function readState() {
  try {
    const raw = fs.readFileSync(STATE_FILE, "utf8");
    const data = JSON.parse(raw);
    if (data.primaryColor && isValidHex(data.primaryColor)) {
      return { primaryColor: normalizeHex(data.primaryColor) };
    }
    if (data.activeThemeId) {
      return { primaryColor: legacyThemeToColor(data.activeThemeId) };
    }
    return { primaryColor: DEFAULT_PRIMARY };
  } catch {
    return { primaryColor: DEFAULT_PRIMARY };
  }
}

function legacyThemeToColor(themeId) {
  const map = {
    default: "#165dff",
    "spring-festival": "#c41e3a",
    "new-year": "#3b5bdb",
    "national-day": "#de2910",
  };
  return map[themeId] || DEFAULT_PRIMARY;
}

function writeState(state) {
  fs.writeFileSync(
    STATE_FILE,
    JSON.stringify({ primaryColor: state.primaryColor }, null, 2),
    "utf8"
  );
}

function sendJson(res, status, body) {
  const data = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(data),
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(data);
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let buf = "";
    req.on("data", (c) => {
      buf += c;
      if (buf.length > 1e6) reject(new Error("payload too large"));
    });
    req.on("end", () => {
      if (!buf) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(buf));
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  const url = new URL(req.url || "/", `http://127.0.0.1:${PORT}`);

  if (req.method === "GET" && url.pathname === "/api/theme/active") {
    const state = readState();
    sendJson(res, 200, {
      primaryColor: state.primaryColor,
      defaultPrimaryColor: DEFAULT_PRIMARY,
      presetColors: PRESET_COLORS,
    });
    return;
  }

  if (req.method === "PUT" && url.pathname === "/api/theme/active") {
    try {
      const body = await parseBody(req);
      let raw = body.primaryColor;
      if (!raw && body.themeId) raw = legacyThemeToColor(body.themeId);
      if (!raw || !isValidHex(raw)) {
        sendJson(res, 400, {
          error: "invalid_primaryColor",
          message: "primaryColor 须为 #RRGGBB 格式 HEX",
        });
        return;
      }
      const primaryColor = normalizeHex(raw);
      writeState({ primaryColor });
      sendJson(res, 200, {
        ok: true,
        primaryColor,
        defaultPrimaryColor: DEFAULT_PRIMARY,
        presetColors: PRESET_COLORS,
      });
    } catch {
      sendJson(res, 400, { error: "bad_json", message: "请求体需为 JSON" });
    }
    return;
  }

  sendJson(res, 404, { error: "not_found" });
});

server.listen(PORT, () => {
  console.log(`Theme color API listening on http://127.0.0.1:${PORT}`);
  console.log("  GET  /api/theme/active");
  console.log('  PUT  /api/theme/active  body: {"primaryColor":"#165dff"}');
});
