import React, { useState, useEffect } from "react";
import {
  StepId,
  LetterPurpose,
  LetterFormData,
  GeneratedLetterResponse,
  SampleScenario,
  ToneType,
  FirmnessType,
  SavedDraft,
  HistoryItem,
} from "./types";
import { INITIAL_FORM_DATA } from "./data/letterData";
import { StepProgressBar } from "./components/StepProgressBar";
import { Step1IssueType } from "./components/Step1IssueType";
import { Step2Preferences } from "./components/Step2Preferences";
import { Step3Information } from "./components/Step3Information";
import { Step4LetterPreview } from "./components/Step4LetterPreview";
import { SavedDraftsModal } from "./components/SavedDraftsModal";
import { VersionHistoryDrawer } from "./components/VersionHistoryDrawer";
import {
  FileCheck2,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Home,
  History,
  Bookmark,
} from "lucide-react";

const STORAGE_KEY_FORM = "cs_letter_agent_form_v3";
const STORAGE_KEY_RESULT = "cs_letter_agent_result_v3";
const STORAGE_KEY_SAVED_DRAFTS = "cs_letter_saved_drafts_v3";
const STORAGE_KEY_HISTORY = "cs_letter_history_v3";

const MAX_HISTORY_ITEMS = 10;
const HISTORY_EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 hours

function cleanLeadingDate(letterText: string): string {
  if (!letterText) return "";
  return letterText
    .replace(/^\s*(?:Date:\s*)?(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4}\s*\n+/i, "")
    .replace(/^\s*(?:Date:\s*)?\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\s*\n+/i, "")
    .replace(/^\s*(?:Date:\s*)?\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}\s*\n+/i, "")
    .trim();
}

export default function App() {
  // 1. Form state
  const [formData, setFormData] = useState<LetterFormData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FORM);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return INITIAL_FORM_DATA;
  });

  const [currentStep, setCurrentStep] = useState<StepId>("issue");

  // 2. Active generated letter
  const [generatedLetter, setGeneratedLetter] = useState<GeneratedLetterResponse | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RESULT);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          letter: cleanLeadingDate(parsed.letter),
        };
      }
    } catch (e) {
      // ignore
    }
    return null;
  });

  // 3. Saved Drafts: ONLY populated when explicitly clicked "Save Draft", kept permanently
  const [savedDrafts, setSavedDrafts] = useState<SavedDraft[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SAVED_DRAFTS);
      if (saved) {
        const parsed: SavedDraft[] = JSON.parse(saved);
        return parsed.map((d) => ({
          ...d,
          letter: cleanLeadingDate(d.letter),
        }));
      }
    } catch (e) {
      // ignore
    }
    return [];
  });

  // 4. Version History: Automatically records recent versions, temporary (max 10, expires after 24h)
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) {
        const parsed: HistoryItem[] = JSON.parse(saved);
        const now = Date.now();
        // Filter out expired items (> 24 hours) and limit to MAX_HISTORY_ITEMS
        const valid = parsed
          .filter((item) => now - item.generatedAt < HISTORY_EXPIRATION_MS)
          .slice(0, MAX_HISTORY_ITEMS)
          .map((h) => ({
            ...h,
            letter: cleanLeadingDate(h.letter),
          }));
        return valid;
      }
    } catch (e) {
      // ignore
    }
    return [];
  });

  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);

  // Global modals
  const [showGlobalDraftsModal, setShowGlobalDraftsModal] = useState(false);
  const [showGlobalHistoryDrawer, setShowGlobalHistoryDrawer] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FORM, JSON.stringify(formData));
    } catch (e) {
      // ignore
    }
  }, [formData]);

  useEffect(() => {
    try {
      if (generatedLetter) {
        localStorage.setItem(STORAGE_KEY_RESULT, JSON.stringify(generatedLetter));
      } else {
        localStorage.removeItem(STORAGE_KEY_RESULT);
      }
    } catch (e) {
      // ignore
    }
  }, [generatedLetter]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SAVED_DRAFTS, JSON.stringify(savedDrafts));
    } catch (e) {
      // ignore
    }
  }, [savedDrafts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    } catch (e) {
      // ignore
    }
  }, [history]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleGoHome = () => {
    setCurrentStep("issue");
  };

  const handleUpdateFormData = (updates: Partial<LetterFormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const handleChangePurpose = (
    purpose: LetterPurpose,
    defaultTone?: ToneType,
    defaultFirmness?: FirmnessType
  ) => {
    setFormData((prev) => ({
      ...prev,
      letterType: purpose,
      tone: defaultTone || prev.tone,
      firmness: defaultFirmness || prev.firmness,
    }));
  };

  const handleApplyScenario = (scenario: SampleScenario) => {
    setFormData((prev) => ({
      ...prev,
      ...scenario.data,
      relevantDetails: {
        ...prev.relevantDetails,
        ...(scenario.data.relevantDetails || {}),
      },
    }));
    showToast(`Loaded scenario: "${scenario.title}"`);
    setCurrentStep("information");
  };

  const handleResetForm = () => {
    if (
      window.confirm(
        "Start a new letter session? Current form inputs and temporary history will be reset. Your Saved Drafts will remain safely stored."
      )
    ) {
      setFormData(INITIAL_FORM_DATA);
      setGeneratedLetter(null);
      setHistory([]);
      setActiveDraftId(null);
      setActiveHistoryId(null);
      localStorage.removeItem(STORAGE_KEY_FORM);
      localStorage.removeItem(STORAGE_KEY_RESULT);
      localStorage.removeItem(STORAGE_KEY_HISTORY);
      setCurrentStep("issue");
      showToast("Started fresh letter session");
    }
  };

  // Explicit Save Draft: ONLY runs when user clicks "Save Draft"
  const handleSaveDraft = (subject: string, letter: string, customLabel?: string) => {
    const cleaned = cleanLeadingDate(letter);
    const newDraftId = `draft_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const title =
      customLabel?.trim() ||
      `Draft: ${formData.companyName || formData.letterType} (${formData.tone})`;

    const newDraft: SavedDraft = {
      id: newDraftId,
      title,
      createdAt: Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      subject: subject.trim(),
      letter: cleaned,
      keyPoints: generatedLetter?.keyPoints,
      recommendedAction: generatedLetter?.recommendedAction,
      settingsSnapshot: {
        tone: formData.tone,
        firmness: formData.firmness,
        formality: formData.formality,
        length: formData.length,
      },
      companyName: formData.companyName,
      letterType: formData.letterType,
    };

    setSavedDrafts((prev) => [newDraft, ...prev]);
    setActiveDraftId(newDraftId);
    showToast(`Draft "${title}" saved to Saved Drafts!`);
  };

  // Delete a saved draft
  const handleDeleteDraft = (draftId: string) => {
    setSavedDrafts((prev) => prev.filter((d) => d.id !== draftId));
    if (activeDraftId === draftId) {
      setActiveDraftId(null);
    }
    showToast("Draft deleted from Saved Drafts.");
  };

  // Restore a saved draft
  const handleRestoreDraft = (draft: SavedDraft) => {
    setActiveDraftId(draft.id);
    setActiveHistoryId(null);
    setGeneratedLetter({
      subject: draft.subject,
      letter: draft.letter,
      keyPoints: draft.keyPoints,
      recommendedAction: draft.recommendedAction,
    });

    if (draft.settingsSnapshot) {
      setFormData((prev) => ({
        ...prev,
        tone: draft.settingsSnapshot.tone,
        firmness: draft.settingsSnapshot.firmness,
        formality: draft.settingsSnapshot.formality,
        length: draft.settingsSnapshot.length,
        companyName: draft.companyName || prev.companyName,
        letterType: draft.letterType || prev.letterType,
      }));
    }

    setCurrentStep("letter");
    showToast(`Loaded saved draft: "${draft.title}"`);
  };

  // Restore from temporary history
  const handleRestoreHistory = (item: HistoryItem) => {
    setActiveHistoryId(item.id);
    setActiveDraftId(null);
    setGeneratedLetter({
      subject: item.subject,
      letter: item.letter,
      keyPoints: item.keyPoints,
      recommendedAction: item.recommendedAction,
    });

    if (item.settingsSnapshot) {
      setFormData((prev) => ({
        ...prev,
        tone: item.settingsSnapshot.tone,
        firmness: item.settingsSnapshot.firmness,
        formality: item.settingsSnapshot.formality,
        length: item.settingsSnapshot.length,
      }));
    }

    setCurrentStep("letter");
    showToast(`Restored version: ${item.label}`);
  };

  // Clear temporary history
  const handleClearHistory = () => {
    setHistory([]);
    setActiveHistoryId(null);
    localStorage.removeItem(STORAGE_KEY_HISTORY);
    showToast("Version history cleared.");
  };

  // Generate Letter or Revise
  const handleGenerateLetter = async (
    revisionInstruction?: string,
    currentSubject?: string,
    currentLetter?: string
  ) => {
    setIsGenerating(true);
    setErrorMessage(null);

    const previousLetterText = currentLetter || generatedLetter?.letter;

    const payload = {
      ...formData,
      desiredResolution: formData.desiredResolution.trim() || "Full refund and formal resolution",
      majorConcern: formData.majorConcern.trim() || "Ensuring fair consumer standards",
      customInstructions: revisionInstruction,
      previousLetter: revisionInstruction ? previousLetterText : undefined,
    };

    try {
      const res = await fetch("/api/generate-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with status ${res.status}`);
      }

      const data: GeneratedLetterResponse = await res.json();
      const cleanedLetter = cleanLeadingDate(data.letter);

      // Automatically add to temporary Version History (NOT Saved Drafts)
      const newHistoryNumber = history.length + 1;
      const newHistoryId = `hist_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      let label = `Version ${newHistoryNumber}`;

      if (revisionInstruction) {
        const short =
          revisionInstruction.length > 28
            ? revisionInstruction.substring(0, 26) + "..."
            : revisionInstruction;
        label = `Revision: ${short}`;
      } else if (history.length === 0) {
        label = "Initial generation";
      }

      const newHistoryItem: HistoryItem = {
        id: newHistoryId,
        versionNumber: newHistoryNumber,
        label,
        generatedAt: Date.now(),
        timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
        subject: data.subject,
        letter: cleanedLetter,
        keyPoints: data.keyPoints,
        recommendedAction: data.recommendedAction,
        settingsSnapshot: {
          tone: formData.tone,
          firmness: formData.firmness,
          formality: formData.formality,
          length: formData.length,
          revisionNote: revisionInstruction,
        },
      };

      // Cap temporary history to MAX_HISTORY_ITEMS
      setHistory((prev) => [newHistoryItem, ...prev].slice(0, MAX_HISTORY_ITEMS));
      setActiveHistoryId(newHistoryId);
      setActiveDraftId(null); // Freshly generated letter is not a saved draft yet until explicitly clicked

      setGeneratedLetter({
        ...data,
        letter: cleanedLetter,
      });

      setCurrentStep("letter");
      if (revisionInstruction) {
        showToast("Letter revised (added to Version History)");
      } else {
        showToast("Letter generated (added to Version History)");
      }
    } catch (err: any) {
      console.error("Letter generation error:", err);
      setErrorMessage(
        err.message || "Failed to generate letter. Please check connection and try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const canProceedToInfo = Boolean(formData.companyName || formData.issueSummary);

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 font-sans flex flex-col selection:bg-stone-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-900 text-white text-xs font-medium px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 border border-stone-800 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Header */}
      <header
        id="app-header"
        className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-2xs"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Clickable Logo & Title Returning to Home */}
          <button
            id="btn-nav-logo-home"
            type="button"
            onClick={handleGoHome}
            className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 rounded-lg p-1 -m-1 transition-opacity hover:opacity-90"
            title="Return to Home (Issue Selection)"
          >
            <div className="w-9 h-9 rounded-lg bg-stone-900 text-white flex items-center justify-center font-bold shadow-xs group-hover:bg-stone-800 transition-colors">
              <FileCheck2 className="w-5 h-5 text-stone-100" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-bold text-stone-900 tracking-tight leading-tight group-hover:text-stone-700 transition-colors">
                  Customer Service Letter-Writing Agent
                </h1>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block">
                Refunds, returns, claims, disputes & formal escalation
              </p>
            </div>
          </button>

          {/* Right Header Navigation & Actions */}
          <div className="flex items-center gap-2">
            {/* Dedicated Home Button */}
            <button
              id="btn-header-home"
              type="button"
              onClick={handleGoHome}
              className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                currentStep === "issue"
                  ? "bg-stone-900 text-white font-semibold"
                  : "text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200"
              }`}
              title="Return to Home page (Issue Selection)"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>

            {/* Saved Drafts Button with Yellow/Amber Icon */}
            <button
              id="btn-header-saved-drafts"
              type="button"
              onClick={() => setShowGlobalDraftsModal(true)}
              className="text-xs font-semibold px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 shadow-2xs"
              title="View all manually saved drafts"
            >
              <Bookmark className="w-3.5 h-3.5 fill-amber-500 text-amber-700" />
              <span>Saved Drafts ({savedDrafts.length})</span>
            </button>

            {/* Version History Button (Temporary) */}
            <button
              id="btn-header-history"
              type="button"
              onClick={() => setShowGlobalHistoryDrawer(true)}
              className="text-xs font-medium px-2.5 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200"
              title="View temporary version history of recent generations"
            >
              <History className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden sm:inline">History ({history.length})</span>
            </button>

            {/* View Current Working Letter */}
            {generatedLetter && (
              <button
                id="btn-view-current-draft"
                type="button"
                onClick={() => setCurrentStep("letter")}
                className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                  currentStep === "letter"
                    ? "bg-stone-200 text-stone-900 font-semibold"
                    : "text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200"
                }`}
                title="View currently loaded letter document"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden md:inline">View Letter</span>
              </button>
            )}

            {/* Reset / New Letter */}
            <button
              id="btn-start-new-letter"
              type="button"
              onClick={handleResetForm}
              className="text-xs font-medium text-stone-600 hover:text-stone-900 border border-stone-300 hover:border-stone-400 bg-white px-2.5 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1"
              title="Clear session and start fresh"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </header>

      {/* Step Progress Stepper Bar */}
      <StepProgressBar
        currentStep={currentStep}
        onSelectStep={(step) => setCurrentStep(step)}
        hasLetter={Boolean(generatedLetter)}
        canProceedToInfo={canProceedToInfo}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Error Alert if any */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start justify-between gap-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Unable to process request</p>
                <p className="mt-0.5">{errorMessage}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-rose-600 hover:text-rose-900 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Step 1: Issue Purpose */}
        {currentStep === "issue" && (
          <Step1IssueType
            formData={formData}
            onChangePurpose={handleChangePurpose}
            onUpdateFormData={handleUpdateFormData}
            onApplyScenario={handleApplyScenario}
            onNext={() => setCurrentStep("preferences")}
          />
        )}

        {/* Step 2: Preferences */}
        {currentStep === "preferences" && (
          <Step2Preferences
            formData={formData}
            onUpdateFormData={handleUpdateFormData}
            onBack={() => setCurrentStep("issue")}
            onNext={() => setCurrentStep("information")}
          />
        )}

        {/* Step 3: Information */}
        {currentStep === "information" && (
          <Step3Information
            formData={formData}
            onUpdateFormData={handleUpdateFormData}
            onBack={() => setCurrentStep("preferences")}
            onGoHome={handleGoHome}
            onSubmitGenerate={() => handleGenerateLetter()}
            isGenerating={isGenerating}
          />
        )}

        {/* Step 4: Generated Letter with Draft Saving & Version Management */}
        {currentStep === "letter" && generatedLetter && (
          <Step4LetterPreview
            letterData={generatedLetter}
            formData={formData}
            savedDrafts={savedDrafts}
            history={history}
            activeHistoryId={activeHistoryId}
            activeDraftId={activeDraftId}
            onUpdateFormData={handleUpdateFormData}
            onRevise={(customPrompt, currentSubject, currentLetter) =>
              handleGenerateLetter(customPrompt, currentSubject, currentLetter)
            }
            onSaveDraft={handleSaveDraft}
            onRestoreHistory={handleRestoreHistory}
            onRestoreDraft={handleRestoreDraft}
            onDeleteDraft={handleDeleteDraft}
            onClearHistory={handleClearHistory}
            onEditDetails={() => setCurrentStep("information")}
            onGoHome={handleGoHome}
            isGenerating={isGenerating}
          />
        )}
      </main>

      {/* Global Saved Drafts Modal (Accessible from anywhere) */}
      {showGlobalDraftsModal && (
        <SavedDraftsModal
          drafts={savedDrafts}
          activeDraftId={activeDraftId}
          onClose={() => setShowGlobalDraftsModal(false)}
          onRestoreDraft={(draft) => {
            handleRestoreDraft(draft);
            setShowGlobalDraftsModal(false);
          }}
          onDeleteDraft={handleDeleteDraft}
        />
      )}

      {/* Global Version History Drawer (Accessible from anywhere) */}
      {showGlobalHistoryDrawer && (
        <VersionHistoryDrawer
          history={history}
          activeVersionId={activeHistoryId}
          onClose={() => setShowGlobalHistoryDrawer(false)}
          onRestoreHistory={(item) => {
            handleRestoreHistory(item);
            setShowGlobalHistoryDrawer(false);
          }}
          onSaveHistoryAsDraft={(item) => {
            handleSaveDraft(item.subject, item.letter, item.label);
          }}
          onClearHistory={handleClearHistory}
        />
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-4 px-4 sm:px-6 text-center text-xs text-stone-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Customer Service Letter-Writing Agent • Issue → Preferences → Information → Draft
          </span>
          <span className="text-stone-400">
            Powered by Gemini 3.8 Flash • Clear separation between Saved Drafts & Temporary History
          </span>
        </div>
      </footer>
    </div>
  );
}
