import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getGeminiApiKey } from "../src/server/letterService.js";

function setCorsHeaders(res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { key, keyName } = getGeminiApiKey();

  return res.status(200).json({
    status: "ok",
    hasApiKey: Boolean(key),
    keySource: keyName || null,
    environment: process.env.VERCEL ? "vercel-serverless" : "node",
  });
}
