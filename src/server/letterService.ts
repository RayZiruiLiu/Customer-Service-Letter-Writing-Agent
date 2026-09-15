import { GoogleGenAI } from "@google/genai";

export interface LetterRequestPayload {
  letterType: string;
  tone: string;
  formality: string;
  length: string;
  firmness: string;
  companyName: string;
  issueSummary: string;
  relevantDetails?: {
    orderNumber?: string;
    incidentDate?: string;
    amount?: string;
    evidence?: string;
    contactHistory?: string;
  };
  desiredResolution: string;
  majorConcern: string;
  userDescription: string;
  customerName?: string;
  customerContact?: string;
  customInstructions?: string;
  previousLetter?: string;
}

export interface LetterResponsePayload {
  subject: string;
  letter: string;
  keyPoints: string[];
  recommendedAction: string;
  warning?: string;
  modelUsed?: string;
}

/**
 * Resolves the Gemini API Key from multiple common environment variable names.
 * Priority:
 * 1. GEMINI_API_KEY (Recommended standard)
 * 2. GOOGLE_API_KEY (Google Cloud / standard GenAI alias)
 * 3. GOOGLE_GENAI_API_KEY (Official SDK fallback alias)
 */
export function getGeminiApiKey(): { key: string | null; keyName: string | null } {
  const env = process.env;
  if (env.GEMINI_API_KEY?.trim()) {
    return { key: env.GEMINI_API_KEY.trim(), keyName: "GEMINI_API_KEY" };
  }
  if (env.GOOGLE_API_KEY?.trim()) {
    return { key: env.GOOGLE_API_KEY.trim(), keyName: "GOOGLE_API_KEY" };
  }
  if (env.GOOGLE_GENAI_API_KEY?.trim()) {
    return { key: env.GOOGLE_GENAI_API_KEY.trim(), keyName: "GOOGLE_GENAI_API_KEY" };
  }
  return { key: null, keyName: null };
}

/**
 * Lazy initialization of GoogleGenAI SDK client.
 */
export function getGeminiClient(): GoogleGenAI | null {
  const { key } = getGeminiApiKey();
  if (!key) return null;

  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

/**
 * Strips accidental or automatic dates that might be placed at the top of the letter.
 */
export function cleanLeadingDate(letterText: string): string {
  if (!letterText) return "";
  return letterText
    .replace(
      /^\s*(?:Date:\s*)?(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4}\s*\n+/i,
      ""
    )
    .replace(/^\s*(?:Date:\s*)?\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\s*\n+/i, "")
    .replace(/^\s*(?:Date:\s*)?\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}\s*\n+/i, "")
    .trim();
}

/**
 * Provides a structured fallback template if no API key is provided or if network is unavailable.
 */
export function generateLocalFallbackLetter(data: LetterRequestPayload): LetterResponsePayload {
  const customer = data.customerName?.trim() || "[Your Name]";
  const contact = data.customerContact?.trim() || "[Your Phone / Email]";
  const company = data.companyName?.trim() || "[Company Name]";
  const orderRef = data.relevantDetails?.orderNumber
    ? `Reference / Order #: ${data.relevantDetails.orderNumber}`
    : "Reference: Customer Account";

  const subject = `Urgent Request: ${data.letterType} Regarding ${data.issueSummary || "Recent Experience"} - ${orderRef}`;

  const firmnessStatements: Record<string, string> = {
    "Gentle / Courteous":
      "I appreciate your assistance and understanding in resolving this matter amicably at your earliest convenience.",
    "Moderate / Expectant":
      "Given the circumstances, I trust that your customer support team will promptly address this matter and provide a fair resolution within 5-7 business days.",
    "Firm / Insistent":
      "I expect a prompt resolution within 5 business days. If this matter cannot be resolved satisfactorily, I will be forced to escalate this to relevant consumer advocacy authorities and my financial institution.",
    "Escalated / Final Notice":
      "Please consider this formal notice. If an acceptable resolution is not reached within 3 business days, I will immediately submit formal complaints to the Consumer Financial Protection Bureau (CFPB), the Better Business Bureau (BBB), state attorney general consumer division, and initiate a dispute through my payment provider.",
  };

  const closingFirmness =
    firmnessStatements[data.firmness] || firmnessStatements["Moderate / Expectant"];

  const letterBody = `To the Customer Service Department
${company}

Subject: ${subject}

Dear Customer Service Team,

I am writing to formally address a matter regarding my recent experience with ${company}. Specifically, I am requesting a ${data.desiredResolution?.toLowerCase() || "prompt resolution"} due to ${data.issueSummary || "an unresolved issue"}.

${data.userDescription ? `Summary of the situation:\n${data.userDescription}\n` : ""}
Pertinent Details:
${data.relevantDetails?.orderNumber ? `• Order / Reference Number: ${data.relevantDetails.orderNumber}` : ""}
${data.relevantDetails?.incidentDate ? `• Date of Incident/Purchase: ${data.relevantDetails.incidentDate}` : ""}
${data.relevantDetails?.amount ? `• Amount in Dispute: ${data.relevantDetails.amount}` : ""}
${data.relevantDetails?.evidence ? `• Supporting Evidence: ${data.relevantDetails.evidence}` : ""}

Primary Concern:
${data.majorConcern || "Ensuring consumer satisfaction and adherence to fair service standards."}

Requested Resolution:
I request ${data.desiredResolution || "a full and complete resolution"}.

${closingFirmness}

Thank you for your prompt attention to this matter. I look forward to your written response.

Sincerely,

${customer}
${contact}`;

  return {
    subject,
    letter: letterBody.trim(),
    keyPoints: [
      `Clear subject line with reference information`,
      `Explicit desired resolution: ${data.desiredResolution || "Resolution requested"}`,
      `Documented timeline & evidence summary`,
      `Specified tone (${data.tone}) and firmness level (${data.firmness})`,
    ],
    recommendedAction: "Review all bracketed placeholders before submitting.",
    modelUsed: "local-template-fallback",
  };
}

/**
 * Core generation handler used by both Express (server.ts) and Vercel Serverless Functions (/api/generate-letter.ts).
 */
export async function generateLetterWithGemini(
  data: LetterRequestPayload
): Promise<LetterResponsePayload> {
  const { key, keyName } = getGeminiApiKey();

  if (!key) {
    const fallback = generateLocalFallbackLetter(data);
    return {
      ...fallback,
      warning:
        "No Gemini API key detected in environment. Please set GEMINI_API_KEY in your deployment environment variables.",
    };
  }

  const ai = getGeminiClient();
  if (!ai) {
    const fallback = generateLocalFallbackLetter(data);
    return {
      ...fallback,
      warning: "Could not initialize Gemini client.",
    };
  }

  const systemInstruction = `You are an elite, highly effective consumer advocacy and customer service correspondence expert.
Your mission is to draft compelling, legally grounded, clear, and perfectly formatted customer service letters, emails, or escalation notices for users.

Guidelines:
1. Always generate a structured, professional letter with:
   - Recipient (Company Name & Appropriate Department)
   - Subject Line (clear, informative, containing reference numbers if provided)
   - Formal salutation
   - Clear opening stating the exact purpose and reference details
   - Concise chronological or factual narrative of the issue without emotional venting
   - Clear presentation of evidence/records (formatted neatly with bullet points if applicable)
   - Explicit statement of the Major Concern
   - Unambiguous Desired Resolution (what specific action is required)
   - Concrete deadline for response/action matching the requested firmness
   - Professional sign-off and placeholder/provided customer signature
2. NO AUTOMATIC DATE: Do NOT include an automatic or arbitrary date at the top of the letter or message. Since many of these letters will be used as emails, claims, online contact form submissions, or customer-service tickets, omitting any generated date prevents incorrect or random date stamps. Begin directly with the recipient, subject line, or salutation.
3. Strictly calibrate to user preferences:
   - Tone: "${data.tone}"
   - Formality: "${data.formality}"
   - Length: "${data.length}" (Concise = 2-3 crisp paragraphs; Standard = balanced 3-4 paragraphs; Detailed = thorough chronological sequence with itemized points and explicit clauses)
   - Firmness: "${data.firmness}"
     * Gentle / Courteous: Polite, appreciative of past positive experience, assumes good faith.
     * Moderate / Expectant: Balanced, businesslike, professional expectation of standard remedies.
     * Firm / Insistent: Direct, assertive, sets clear deadlines (e.g. 5-7 business days), mentions escalating to supervisory management or payment provider.
     * Escalated / Final Notice: Stern formal notice, sets a tight deadline (e.g. 3-5 business days), explicitly cites consumer protection rights, potential disputes/chargebacks, and regulatory filings (e.g., BBB, CFPB, FTC, State Attorney General, or Small Claims) without being abusive.
4. If custom instructions or revision notes are provided, incorporate them seamlessly.
5. Output your response in valid JSON matching the requested schema.`;

  const userPrompt = `Draft a customer service letter with the following details:
- Type of Letter: ${data.letterType}
- Target Company/Service: ${data.companyName}
- Issue Summary: ${data.issueSummary}
- User's Situation in their own words: "${data.userDescription}"
- DO NOT include an automatic date at the top of the letter.
- Relevant Details:
  * Order/Account/Ticket Number: ${data.relevantDetails?.orderNumber || "N/A"}
  * Date of Purchase/Incident: ${data.relevantDetails?.incidentDate || "N/A"}
  * Amount Disputed/Involved: ${data.relevantDetails?.amount || "N/A"}
  * Evidence/Documentation available: ${data.relevantDetails?.evidence || "N/A"}
  * Previous Contact/History: ${data.relevantDetails?.contactHistory || "N/A"}
- Desired Resolution: ${data.desiredResolution}
- Major Concern: ${data.majorConcern}
- Customer Name: ${data.customerName || "[Your Name]"}
- Customer Contact Info: ${data.customerContact || "[Your Contact Info]"}
${data.customInstructions ? `- Revision / Special Guidance: "${data.customInstructions}"` : ""}
${data.previousLetter ? `\n- Previous Draft to refine/revise:\n"""${data.previousLetter}"""` : ""}

Return a JSON response with:
{
  "subject": "Clear, compelling subject line",
  "letter": "The complete, ready-to-send formatted letter with salutation and sign-off",
  "keyPoints": ["3-4 bullet points summarizing why this letter is persuasive and what remedies were requested"],
  "recommendedAction": "A 1-sentence tip on sending this (e.g. send via certified mail / save copies of confirmation)"
}`;

  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: userPrompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      temperature: 0.4,
    },
  });

  const responseText = response.text || "";
  try {
    const parsed = JSON.parse(responseText);
    const rawLetter = parsed.letter || responseText;
    return {
      subject: parsed.subject || `Formal Notice regarding ${data.issueSummary}`,
      letter: cleanLeadingDate(rawLetter),
      keyPoints: parsed.keyPoints || [
        `Targeted resolution: ${data.desiredResolution}`,
        `Firmness: ${data.firmness}`,
        `Tone: ${data.tone}`,
      ],
      recommendedAction:
        parsed.recommendedAction ||
        "Keep a copy of this correspondence and any delivery receipts for your records.",
      modelUsed: "gemini-3.8-flash",
    };
  } catch (jsonErr) {
    return {
      subject: `Correspondence regarding ${data.issueSummary || data.letterType}`,
      letter: cleanLeadingDate(responseText),
      keyPoints: ["Generated according to your requested tone and firmness."],
      recommendedAction: "Review all bracketed placeholders before submitting.",
      modelUsed: "gemini-3.8-flash",
    };
  }
}
