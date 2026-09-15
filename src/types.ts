export type StepId = "issue" | "preferences" | "information" | "letter";

export type LetterPurpose =
  | "refund"
  | "return"
  | "warranty"
  | "complaint"
  | "billing"
  | "delivery"
  | "cancellation"
  | "escalation"
  | "custom";

export type ToneType =
  | "Professional & Objective"
  | "Cooperative & Polite"
  | "Assertive & Direct"
  | "Empathetic & Respectful"
  | "Stern & Disappointed";

export type FormalityType =
  | "Standard Business"
  | "Formal Legal/Executive"
  | "Casual & Approachable";

export type LengthType =
  | "Concise (1-2 Paragraphs)"
  | "Standard (3-4 Paragraphs)"
  | "Detailed (Comprehensive & Itemized)";

export type FirmnessType =
  | "Gentle / Courteous"
  | "Moderate / Expectant"
  | "Firm / Insistent"
  | "Escalated / Final Notice";

export interface RelevantDetails {
  orderNumber: string;
  incidentDate: string;
  amount: string;
  evidence: string;
  contactHistory: string;
}

export interface LetterFormData {
  letterType: LetterPurpose;
  customLetterType?: string;
  tone: ToneType;
  formality: FormalityType;
  length: LengthType;
  firmness: FirmnessType;
  companyName: string;
  issueSummary: string;
  userDescription: string;
  desiredResolution: string;
  customDesiredResolution?: string;
  majorConcern: string;
  customMajorConcern?: string;
  relevantDetails: RelevantDetails;
  customerName: string;
  customerContact: string;
}

export interface GeneratedLetterResponse {
  subject: string;
  letter: string;
  keyPoints?: string[];
  recommendedAction?: string;
  warning?: string;
}

export interface SavedDraft {
  id: string;
  title: string;
  createdAt: number;
  timestamp: string;
  subject: string;
  letter: string;
  keyPoints?: string[];
  recommendedAction?: string;
  settingsSnapshot: {
    tone: ToneType;
    firmness: FirmnessType;
    formality: FormalityType;
    length: LengthType;
  };
  companyName?: string;
  letterType?: LetterPurpose;
}

export interface HistoryItem {
  id: string;
  versionNumber: number;
  label: string;
  generatedAt: number;
  timestamp: string;
  subject: string;
  letter: string;
  keyPoints?: string[];
  recommendedAction?: string;
  settingsSnapshot: {
    tone: ToneType;
    firmness: FirmnessType;
    formality: FormalityType;
    length: LengthType;
    revisionNote?: string;
  };
}

// Deprecated: maintained for legacy compatibility
export type LetterVersion = HistoryItem;

export interface SampleScenario {
  id: string;
  title: string;
  tag: string;
  data: Partial<LetterFormData>;
}
