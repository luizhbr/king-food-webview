/**
 * Sorteio API — residual no projeto de pedido (PWA).
 * Desligada por padrão. Sorteio oficial: projeto king-food-sorteio.
 * Ativar só com ENABLE_SORTEIO_API=true + secrets no Vercel.
 */

const GIST_ID = process.env.GIST_ID || "";
const GIST_TOKEN = process.env.GIST_TOKEN || "";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
const ENABLE = process.env.ENABLE_SORTEIO_API === "true";

const ALLOWED_ORIGINS = new Set(
  [
    "https://kingfood.online",
    "https://www.kingfood.online",
    process.env.SORTEIO_CORS_ORIGIN,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "",
  ].filter(Boolean)
);

function isAllowedOrigin(origin) {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  // Previews deste time Vercel
  try {
    const u = new URL(origin);
    if (
      u.protocol === "https:" &&
      (u.hostname.endsWith(".vercel.app") || u.hostname === "localhost")
    ) {
      return (
        u.hostname.includes("king-food") ||
        u.hostname === "localhost" ||
        u.hostname === "127.0.0.1"
      );
    }
  } catch {
    /* ignore */
  }
  return false;
}

function corsHeaders(req) {
  const origin = req.headers.get("origin") || "";
  const headers = {
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Admin-Password",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": "no-store",
  };
  if (origin && isAllowedOrigin(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  // Sem Origin (same-origin / curl): não espelha *
  return headers;
}

function jsonResponse(req, data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: Object.assign(
      { "Content-Type": "application/json; charset=utf-8" },
      corsHeaders(req)
    ),
  });
}

function timingSafeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const enc = new TextEncoder();
  const ba = enc.encode(a);
  const bb = enc.encode(b);
  if (ba.length !== bb.length) {
    // Compare against self to keep rough timing; still reject
    let x = 0;
    for (let i = 0; i < ba.length; i++) x |= ba[i] ^ ba[i];
    return false;
  }
  let out = 0;
  for (let i = 0; i < ba.length; i++) out |= ba[i] ^ bb[i];
  return out === 0;
}

function requireAdmin(req) {
  if (!ADMIN_PASSWORD || ADMIN_PASSWORD.length < 12) return false;
  const pwd = req.headers.get("X-Admin-Password") || "";
  return timingSafeEqual(pwd, ADMIN_PASSWORD);
}

async function fetchDB() {
  if (!GIST_ID || !GIST_TOKEN) throw new Error("DB not configured");
  const res = await fetch("https://api.github.com/gists/" + GIST_ID, {
    headers: {
      Authorization: "token " + GIST_TOKEN,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "king-food-webview-api",
    },
  });
  if (!res.ok) throw new Error("Gist fetch failed");
  const gist = await res.json();
  const content =
    gist.files["participants.json"]?.content || '{"participants":[]}';
  return JSON.parse(content);
}

async function saveDB(db) {
  if (!GIST_ID || !GIST_TOKEN) throw new Error("DB not configured");
  const res = await fetch("https://api.github.com/gists/" + GIST_ID, {
    method: "PATCH",
    headers: {
      Authorization: "token " + GIST_TOKEN,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
      "User-Agent": "king-food-webview-api",
    },
    body: JSON.stringify({
      files: {
        "participants.json": {
          content: JSON.stringify(db, null, 2),
        },
      },
    }),
  });
  if (!res.ok) throw new Error("Gist save failed");
}

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function generateNumber(existing) {
  const used = new Set(existing.map(function (p) {
    return p.raffle_number;
  }));
  for (let i = 0; i < 200; i++) {
    const num = String(Math.floor(Math.random() * 999) + 1).padStart(3, "0");
    if (!used.has(num)) return num;
  }
  throw new Error("Nao foi possivel gerar numero unico");
}

export default async function handler(req) {
  // Fase A: API desligada no PWA de pedido (padrão)
  if (!ENABLE) {
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(req) });
    }
    return jsonResponse(
      req,
      {
        error: "API de sorteio desativada neste projeto. Use king-food-sorteio.",
      },
      404
    );
  }

  if (req.method === "OPTIONS") {
    const origin = req.headers.get("origin") || "";
    if (origin && !isAllowedOrigin(origin)) {
      return new Response(null, { status: 403 });
    }
    return new Response(null, { status: 204, headers: corsHeaders(req) });
  }

  // Bloqueia Origin não permitida em mutações / browser
  const origin = req.headers.get("origin") || "";
  if (origin && !isAllowedOrigin(origin)) {
    return jsonResponse(req, { error: "Origin nao permitida" }, 403);
  }

  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/api/, "") || "/";

  try {
    if (path === "/register" && req.method === "POST") {
      if (!GIST_ID || !GIST_TOKEN) {
        return jsonResponse(req, { error: "Servico indisponivel" }, 503);
      }
      const body = await req.json();
      const name = body.name;
      const whatsapp = body.whatsapp;

      if (!name || name.trim().length < 2 || name.trim().length > 80) {
        return jsonResponse(req, { error: "Nome invalido" }, 400);
      }
      const cleanPhone = (whatsapp || "").replace(/\D/g, "");
      if (cleanPhone.length < 8 || cleanPhone.length > 15) {
        return jsonResponse(req, { error: "WhatsApp invalido" }, 400);
      }

      const db = await fetchDB();
      const existing = db.participants.find(function (p) {
        return p.whatsapp === cleanPhone;
      });
      if (existing) {
        return jsonResponse(req, { existingNumber: existing.raffle_number });
      }

      const raffle_number = generateNumber(db.participants);
      const participant = {
        id: uuid(),
        name: name.trim().slice(0, 80),
        whatsapp: cleanPhone,
        raffle_number: raffle_number,
        created_at: new Date().toISOString(),
      };

      db.participants.push(participant);
      await saveDB(db);

      return jsonResponse(req, { success: true, participant: participant });
    }

    if (path === "/participants" && req.method === "GET") {
      if (!requireAdmin(req)) {
        return jsonResponse(req, { error: "Nao autorizado" }, 401);
      }
      const db = await fetchDB();
      const sorted = db.participants.sort(function (a, b) {
        return b.created_at.localeCompare(a.created_at);
      });
      return jsonResponse(req, { participants: sorted });
    }

    if (
      path === "/participants" &&
      (req.method === "POST" || req.method === "DELETE")
    ) {
      if (!requireAdmin(req)) {
        return jsonResponse(req, { error: "Nao autorizado" }, 401);
      }
      let body = {};
      if (req.method === "POST") {
        body = await req.json().catch(function () {
          return {};
        });
      } else {
        body.id = url.searchParams.get("id");
      }
      const db = await fetchDB();

      if (body.action === "clear" || (req.method === "DELETE" && !body.id)) {
        db.participants = [];
        await saveDB(db);
        return jsonResponse(req, { success: true });
      }

      if ((body.action === "delete" || req.method === "DELETE") && body.id) {
        db.participants = db.participants.filter(function (p) {
          return p.id !== body.id;
        });
        await saveDB(db);
        return jsonResponse(req, { success: true });
      }

      return jsonResponse(req, { error: "Acao invalida" }, 400);
    }

    return jsonResponse(req, { error: "Endpoint nao encontrado" }, 404);
  } catch (err) {
    console.error("API error:", err && err.message ? err.message : err);
    return jsonResponse(req, { error: "Erro interno" }, 500);
  }
}
