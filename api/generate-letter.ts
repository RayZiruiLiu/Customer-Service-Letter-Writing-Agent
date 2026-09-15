import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  generateLetterWithGemini,
  generateLocalFallbackLetter,
  getGeminiApiKey,
  LetterRequestPayload,
} from "../src/server/letterService.js";

function setCorsHeaders(res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    let body: LetterRequestPayload;
    if (typeof req.body === "string") {
      body = JSON.parse(req.body);
    } else {
      body = req.body || {};
    }

    if (!body.companyName && !body.issueSummary && !body.userDescription) {
      return res.status(400).json({
        error: "Please provide at least a company name, issue summary, or description.",
      });
    }

    const result = await generateLetterWithGemini(body);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Vercel Serverless Function - Error generating letter:", error);

    const errorMessage = error?.message || "Unknown error occurred during generation.";
    const { keyName } = getGeminiApiKey();

    let safeBody: LetterRequestPayload;
    try {
      safeBody = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    } catch {
      safeBody = {} as LetterRequestPayload;
    }

    const fallback = generateLocalFallbackLetter(safeBody);

    return res.status(200).json({
      ...fallback,
      warning: `AI generation encountered an issue (${errorMessage}). A structured template was generated instead. Please verify that ${keyName || "GEMINI_API_KEY"} in Vercel environment variables is valid and has active quota.`,
    });
  }
}
