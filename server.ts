import express from "express";
import path from "path";
import dotenv from "dotenv";
import {
  generateLetterWithGemini,
  generateLocalFallbackLetter,
  getGeminiApiKey,
  LetterRequestPayload,
} from "./src/server/letterService.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/api/health", (_req, res) => {
  const { key, keyName } = getGeminiApiKey();
  res.json({
    status: "ok",
    hasApiKey: Boolean(key),
    keySource: keyName,
    environment: "express-server",
  });
});

app.post("/api/generate-letter", async (req, res) => {
  try {
    const data: LetterRequestPayload = req.body;

    if (!data.companyName && !data.issueSummary && !data.userDescription) {
      return res.status(400).json({
        error: "Please provide at least a company name, issue summary, or description.",
      });
    }

    const result = await generateLetterWithGemini(data);
    return res.json(result);
  } catch (err: any) {
    console.error("Error generating letter:", err);
    const data: LetterRequestPayload = req.body;
    const fallback = generateLocalFallbackLetter(data);
    const { keyName } = getGeminiApiKey();
    return res.json({
      ...fallback,
      warning: `AI generation encountered an issue (${err?.message || "Internal error"}). A structured template was generated instead. Key configured: ${keyName || "None"}.`,
    });
  }
});

// Vite middleware or production static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Customer Service Letter-Writing Agent running on http://localhost:${PORT}`);
  });
}

startServer();
