import React, { useState, useEffect } from "react";
import {
  LetterFormData,
  GeneratedLetterResponse,
  SavedDraft,
  HistoryItem,
  ToneType,
  FirmnessType,
  LengthType,
} from "../types";
import { TONE_OPTIONS, FIRMNESS_OPTIONS, LENGTH_OPTIONS } from "../data/letterData";
import { VersionCompareModal, ComparableVersion } from "./VersionCompareModal";
import { SavedDraftsModal } from "./SavedDraftsModal";
import { VersionHistoryDrawer } from "./VersionHistoryDrawer";
import {
  Copy,
  Check,
  Download,
  Printer,
  Edit3,
  Eye,
  RefreshCw,
  Sparkles,
  Send,
  Clock,
  FileText,
  Sliders,
  ChevronRight,
  Shield,
  Home,
  Bookmark,
  History,
  ArrowRightLeft,
  X,
  AlertCircle,
} from "lucide-react";

interface Step4LetterPreviewProps {
  letterData: GeneratedLetterResponse;
  formData: LetterFormData;
  savedDrafts: SavedDraft[];
  history: HistoryItem[];
  activeHistoryId: string | null;
  activeDraftId: string | null;
  onUpdateFormData: (updates: Partial<LetterFormData>) => void;
  onRevise: (customPrompt?: string, currentSubject?: string, currentLetter?: string) => void;
  onSaveDraft: (subject: string, letter: string, customLabel?: string) => void;
  onRestoreHistory: (item: HistoryItem) => void;
  onRestoreDraft: (draft: SavedDraft) => void;
  onDeleteDraft: (draftId: string) => void;
  onClearHistory: () => void;
  onEditDetails: () => void;
  onGoHome: () => void;
  isGenerating: boolean;
}

function stripLeadingDate(str: string): string {
  if (!str) return "";
  return str
    .replace(/^\s*(?:Date:\s*)?(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4}\s*\n+/i, "")
    .replace(/^\s*(?:Date:\s*)?\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\s*\n+/i, "")
    .replace(/^\s*(?:Date:\s*)?\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}\s*\n+/i, "")
    .trim();
}

export const Step4LetterPreview: React.FC<Step4LetterPreviewProps> = ({
  letterData,
  formData,
  savedDrafts,
  history,
  activeHistoryId,
  activeDraftId,
  onUpdateFormData,
  onRevise,
  onSaveDraft,
  onRestoreHistory,
  onRestoreDraft,
  onDeleteDraft,
  onClearHistory,
  onEditDetails,
  onGoHome,
  isGenerating,
}) => {
  const [copiedLetter, setCopiedLetter] = useState(false);
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [isEditingInline, setIsEditingInline] = useState(false);
  const [editableLetter, setEditableLetter] = useState(() => stripLeadingDate(letterData.letter));
  const [editableSubject, setEditableSubject] = useState(letterData.subject);
  const [revisionPrompt, setRevisionPrompt] = useState("");

  // Modals & Panels
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [draftLabelInput, setDraftLabelInput] = useState("");
  const [showSavedDraftsModal, setShowSavedDraftsModal] = useState(false);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Sync when letterData updates
  useEffect(() => {
    setEditableLetter(stripLeadingDate(letterData.letter));
    setEditableSubject(letterData.subject);
  }, [letterData.letter, letterData.subject, activeHistoryId, activeDraftId]);

  const handleCopyLetter = async () => {
    try {
      const fullText = `Subject: ${editableSubject}\n\n${editableLetter}`;
      await navigator.clipboard.writeText(fullText);
      setCopiedLetter(true);
      setTimeout(() => setCopiedLetter(false), 2500);
    } catch (e) {
      console.error("Failed to copy", e);
    }
  };

  const handleCopySubject = async () => {
    try {
      await navigator.clipboard.writeText(editableSubject);
      setCopiedSubject(true);
      setTimeout(() => setCopiedSubject(false), 2000);
    } catch (e) {
      console.error("Failed to copy subject", e);
    }
  };

  const handleDownloadTxt = () => {
    const fullText = `Subject: ${editableSubject}\n\n${editableLetter}`;
    const blob = new Blob([fullText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Letter_${formData.companyName.replace(/\s+/g, "_") || "Customer_Service"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleQuickRevision = (instruction: string) => {
    onRevise(instruction, editableSubject, editableLetter);
  };

  const handleConfirmSaveDraft = () => {
    onSaveDraft(editableSubject, editableLetter, draftLabelInput.trim() || undefined);
    setDraftLabelInput("");
    setShowSaveModal(false);
  };

  const wordCount = editableLetter.trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.round(wordCount / 200));

  const QUICK_REVISIONS = [
    { label: "Make more firm & urgent", prompt: "Increase firmness: state a strict 3 business day deadline and mention consumer protection complaint filing." },
    { label: "More polite & cooperative", prompt: "Soften the tone: make it more appreciative, cooperative, and give benefit of the doubt while keeping clear request." },
    { label: "Shorten & make concise", prompt: "Condense this letter into 2 crisp paragraphs, ideal for a short customer support web form." },
    { label: "Add 5-day deadline", prompt: "Explicitly emphasize a requirement for written resolution within 5 business days." },
    { label: "Highlight attached evidence", prompt: "Add clear reference to attached photographic evidence, original receipts, and email correspondence." },
    { label: "Demand executive review", prompt: "Address this explicitly to the Executive Customer Relations Office and Office of the CEO." },
  ];

  // Active state badges
  const currentSavedDraft = savedDrafts.find((d) => d.id === activeDraftId);
  const isCurrentLetterSaved = Boolean(currentSavedDraft);

  // Prepare combined list for comparison
  const comparableList: ComparableVersion[] = [
    ...savedDrafts.map((d) => ({
      id: d.id,
      label: d.title,
      timestamp: d.timestamp,
      subject: d.subject,
      letter: d.letter,
      settingsSnapshot: d.settingsSnapshot,
      isSavedDraft: true,
    })),
    ...history.map((h) => ({
      id: h.id,
      label: `v${h.versionNumber}: ${h.label}`,
      timestamp: h.timestamp,
      subject: h.subject,
      letter: h.letter,
      settingsSnapshot: h.settingsSnapshot,
      isSavedDraft: false,
    })),
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <button
            id="btn-letter-back-to-home"
            type="button"
            onClick={onGoHome}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-white hover:bg-stone-100 border border-stone-300 px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-2xs"
            title="Return to Home (Issue Selection)"
          >
            <Home className="w-3.5 h-3.5 text-stone-600" />
            <span>Back to Home</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-stone-900">
                Customer Service Letter Ready
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Prepared for {formData.companyName || "recipient"} with {formData.tone} tone and{" "}
              {formData.firmness.split(" / ")[0]}.
            </p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* 1. Explicit Save Draft Button (Yellow/Amber Icon) */}
          <button
            id="btn-open-save-draft-modal"
            type="button"
            onClick={() => {
              setDraftLabelInput(
                currentSavedDraft ? `${currentSavedDraft.title} (Copy)` : `Draft - ${formData.companyName || formData.letterType}`
              );
              setShowSaveModal(true);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 px-3 py-2 rounded-lg transition-all cursor-pointer shadow-xs"
            title="Explicitly save this current letter to Saved Drafts"
          >
            <Bookmark className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
            <span>Save Draft</span>
          </button>

          {/* 2. Saved Drafts Modal Button */}
          <button
            id="btn-open-saved-drafts-list"
            type="button"
            onClick={() => setShowSavedDraftsModal(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 px-3 py-2 rounded-lg transition-colors cursor-pointer"
            title="View all manually saved drafts"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-600 fill-amber-500/30" />
            <span>Saved Drafts ({savedDrafts.length})</span>
          </button>

          {/* 3. Version History Button (Temporary recent generations) */}
          <button
            id="btn-open-version-history"
            type="button"
            onClick={() => setShowHistoryDrawer(true)}
            className="inline-flex items-center gap-1.5 text-xs font-medium bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 px-3 py-2 rounded-lg transition-colors cursor-pointer"
            title="View recent generated versions (temporary history)"
          >
            <History className="w-3.5 h-3.5 text-stone-600" />
            <span>History ({history.length})</span>
          </button>

          {/* Compare Button */}
          {comparableList.length > 1 && (
            <button
              id="btn-open-compare-modal"
              type="button"
              onClick={() => setShowCompareModal(true)}
              className="inline-flex items-center gap-1 text-xs font-medium bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 px-2.5 py-2 rounded-lg transition-colors cursor-pointer"
              title="Compare drafts and history side-by-side"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Compare</span>
            </button>
          )}

          {/* Copy Full Letter */}
          <button
            id="btn-copy-letter"
            type="button"
            onClick={handleCopyLetter}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all shadow-xs cursor-pointer ${
              copiedLetter
                ? "bg-emerald-600 text-white"
                : "bg-stone-900 hover:bg-stone-800 text-white"
            }`}
          >
            {copiedLetter ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLetter ? "Copied!" : "Copy Letter"}</span>
          </button>

          {/* Download Text */}
          <button
            id="btn-download-txt"
            type="button"
            onClick={handleDownloadTxt}
            title="Download Plain Text (.txt)"
            className="inline-flex items-center gap-1 text-xs font-medium bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 px-2.5 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Download</span>
          </button>

          {/* Print Letter */}
          <button
            id="btn-print-letter"
            type="button"
            onClick={handlePrint}
            title="Print Letter"
            className="inline-flex items-center gap-1 text-xs font-medium bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 px-2.5 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Print</span>
          </button>

          {/* Toggle Inline Edit */}
          <button
            id="btn-toggle-inline-edit"
            type="button"
            onClick={() => setIsEditingInline(!isEditingInline)}
            className={`inline-flex items-center gap-1 text-xs font-medium border px-3 py-2 rounded-lg transition-colors cursor-pointer ${
              isEditingInline
                ? "bg-amber-100 text-amber-950 border-amber-400 font-semibold"
                : "bg-white hover:bg-stone-100 text-stone-700 border-stone-300"
            }`}
          >
            {isEditingInline ? <Eye className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            <span>{isEditingInline ? "Preview View" : "Edit Text"}</span>
          </button>
        </div>
      </div>

      {/* Save Draft Dialog Modal */}
      {showSaveModal && (
        <div
          id="modal-save-draft"
          className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-2xs flex items-center justify-center p-4 animate-fadeIn"
        >
          <div className="bg-white border border-stone-300 rounded-xl shadow-xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-amber-100 flex items-center justify-center">
                  <Bookmark className="w-3.5 h-3.5 fill-amber-500 text-amber-700" />
                </div>
                <h3 className="text-sm font-bold text-stone-900">Save to Permanent Drafts</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSaveModal(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-600">
              This letter will enter your <strong>Saved Drafts</strong> and remain permanently until
              you choose to delete it.
            </p>

            <div>
              <label
                htmlFor="input-draft-label"
                className="block text-xs font-semibold text-stone-700 mb-1"
              >
                Draft Name:
              </label>
              <input
                id="input-draft-label"
                type="text"
                value={draftLabelInput}
                onChange={(e) => setDraftLabelInput(e.target.value)}
                placeholder="e.g., Refund Request - Final Formal Notice"
                className="w-full text-xs bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:border-stone-900"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setShowSaveModal(false)}
                className="text-xs text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded-md hover:bg-stone-100 transition-colors"
              >
                Cancel
              </button>
              <button
                id="btn-confirm-save-draft"
                type="button"
                onClick={handleConfirmSaveDraft}
                className="text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-stone-950 px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <Bookmark className="w-3.5 h-3.5 fill-stone-950 text-stone-950" />
                <span>Save to Drafts</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saved Drafts List Modal */}
      {showSavedDraftsModal && (
        <SavedDraftsModal
          drafts={savedDrafts}
          activeDraftId={activeDraftId}
          onClose={() => setShowSavedDraftsModal(false)}
          onRestoreDraft={onRestoreDraft}
          onDeleteDraft={onDeleteDraft}
        />
      )}

      {/* Temporary Version History Drawer */}
      {showHistoryDrawer && (
        <VersionHistoryDrawer
          history={history}
          activeVersionId={activeHistoryId}
          onClose={() => setShowHistoryDrawer(false)}
          onRestoreHistory={onRestoreHistory}
          onSaveHistoryAsDraft={(item) => onSaveDraft(item.subject, item.letter, item.label)}
          onClearHistory={onClearHistory}
        />
      )}

      {/* Compare Modal */}
      {showCompareModal && comparableList.length > 1 && (
        <VersionCompareModal
          versions={comparableList}
          activeVersionId={activeDraftId || activeHistoryId || comparableList[0]?.id}
          onClose={() => setShowCompareModal(false)}
          onRestore={(id) => {
            const foundDraft = savedDrafts.find((d) => d.id === id);
            if (foundDraft) {
              onRestoreDraft(foundDraft);
              return;
            }
            const foundHistory = history.find((h) => h.id === id);
            if (foundHistory) {
              onRestoreHistory(foundHistory);
            }
          }}
        />
      )}

      {/* Warning/Notice Banner if applicable */}
      {letterData.warning && (
        <div className="bg-amber-50 border border-amber-300 text-amber-900 rounded-xl p-3.5 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-semibold text-amber-950">Configuration Notice</div>
            <div className="text-amber-800 leading-relaxed">{letterData.warning}</div>
          </div>
        </div>
      )}

      {/* Status & Distinction Banner Directly Above Document */}
      <div className="bg-stone-100/90 border border-stone-200 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          {isCurrentLetterSaved ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-100 border border-amber-300 text-amber-950 font-bold">
              <Bookmark className="w-3.5 h-3.5 fill-amber-500 text-amber-700" />
              <span>Saved Draft: {currentSavedDraft?.title}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-stone-600">
              <span className="w-2 h-2 rounded-full bg-stone-400"></span>
              <span>Working Letter (saved in temporary Version History)</span>
            </span>
          )}

          {!isCurrentLetterSaved && (
            <button
              type="button"
              onClick={() => {
                setDraftLabelInput(`Draft - ${formData.companyName || formData.letterType}`);
                setShowSaveModal(true);
              }}
              className="text-xs font-semibold text-amber-900 hover:text-amber-950 underline underline-offset-2 ml-1 cursor-pointer"
            >
              + Save as Draft
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 text-[11px] text-stone-500">
          <button
            type="button"
            onClick={() => setShowSavedDraftsModal(true)}
            className="hover:text-stone-900 font-medium cursor-pointer flex items-center gap-1"
          >
            <Bookmark className="w-3 h-3 text-amber-600 fill-amber-500" />
            <span>Saved Drafts ({savedDrafts.length})</span>
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => setShowHistoryDrawer(true)}
            className="hover:text-stone-900 font-medium cursor-pointer flex items-center gap-1"
          >
            <History className="w-3 h-3 text-stone-500" />
            <span>Recent History ({history.length})</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Letter Document + Revision Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Document Area */}
        <div className="lg:col-span-8 space-y-4">
          {/* Subject Line Bar */}
          <div className="bg-white border border-stone-200 rounded-xl p-3.5 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                Subject Line
              </span>
              {isEditingInline ? (
                <input
                  id="editable-subject-input"
                  type="text"
                  value={editableSubject}
                  onChange={(e) => setEditableSubject(e.target.value)}
                  className="w-full text-xs font-semibold text-stone-900 bg-stone-50 border border-stone-300 rounded px-2 py-1 mt-1 focus:outline-none focus:border-stone-900"
                />
              ) : (
                <p className="text-xs font-semibold text-stone-900 truncate mt-0.5">
                  {editableSubject}
                </p>
              )}
            </div>
            <button
              id="btn-copy-subject"
              type="button"
              onClick={handleCopySubject}
              className="text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-50 border border-stone-200 hover:border-stone-300 px-2.5 py-1.5 rounded-md transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
            >
              {copiedSubject ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Subject</span>
                </>
              )}
            </button>
          </div>

          {/* Letter Document Paper (No Automatic Date!) */}
          <div
            id="letter-document-paper"
            className="bg-white border border-stone-300 rounded-xl shadow-sm p-6 sm:p-8 min-h-[500px] relative transition-all"
          >
            {isGenerating && (
              <div className="absolute inset-0 bg-white/85 backdrop-blur-xs rounded-xl flex flex-col items-center justify-center z-10 space-y-3">
                <RefreshCw className="w-6 h-6 text-stone-800 animate-spin" />
                <p className="text-sm font-semibold text-stone-800">
                  Generating new version...
                </p>
                <p className="text-xs text-stone-500">
                  Recorded to temporary history. Use "Save Draft" to keep permanently.
                </p>
              </div>
            )}

            {isEditingInline ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-stone-500 pb-2 border-b border-stone-100">
                  <span className="font-medium text-amber-800 flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5" />
                    Inline Edit Mode — Direct Text Changes
                  </span>
                  <span>{wordCount} words</span>
                </div>
                <textarea
                  id="editable-letter-textarea"
                  value={editableLetter}
                  onChange={(e) => setEditableLetter(stripLeadingDate(e.target.value))}
                  rows={20}
                  className="w-full text-stone-900 font-serif text-sm leading-relaxed p-2.5 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-900 resize-y"
                  placeholder="Letter content..."
                />
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-stone-500">
                    Click Save Draft below to preserve edits as a permanent draft.
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onSaveDraft(editableSubject, editableLetter, "Edited Draft");
                      setIsEditingInline(false);
                    }}
                    className="text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-stone-950 px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Bookmark className="w-3 h-3 fill-stone-950" />
                    <span>Save Edits to Drafts</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Meta stats inside paper */}
                <div className="flex items-center justify-between pb-4 border-b border-stone-100 text-[11px] text-stone-600 font-sans">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" /> {wordCount} words
                    </span>
                    <span className="text-stone-300">|</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> ~{readingTime} min read
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-stone-100 font-medium text-stone-700">
                      {formData.formality}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-stone-100 font-medium text-stone-700">
                      {formData.firmness.split(" / ")[0]}
                    </span>
                  </div>
                </div>

                {/* Body Content with formatted paragraphs (Clean: without arbitrary date) */}
                <div className="text-stone-900 font-serif text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4 select-text">
                  {editableLetter}
                </div>
              </div>
            )}
          </div>

          {/* Strategic Advice Card */}
          {letterData.recommendedAction && (
            <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-xl flex items-start gap-3 text-xs text-amber-900">
              <Shield className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Next Recommended Step: </span>
                <span>{letterData.recommendedAction}</span>
              </div>
            </div>
          )}

          {/* Key Persuasive Elements */}
          {letterData.keyPoints && letterData.keyPoints.length > 0 && (
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
              <div className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Persuasive Elements Incorporated
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600">
                {letterData.keyPoints.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar: Revision & Tuning Controls */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Revision Suggestions */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                1-Click Quick Revisions
              </h3>
            </div>
            <p className="text-xs text-stone-500">
              Generates a refined version and logs it in your temporary history:
            </p>

            <div className="space-y-1.5 pt-1">
              {QUICK_REVISIONS.map((item, idx) => (
                <button
                  key={idx}
                  id={`quick-revision-${idx}`}
                  type="button"
                  disabled={isGenerating}
                  onClick={() => handleQuickRevision(item.prompt)}
                  className="w-full text-left text-xs bg-stone-50 hover:bg-stone-100 border border-stone-200 hover:border-stone-300 text-stone-800 px-3 py-2 rounded-lg transition-colors flex items-center justify-between group cursor-pointer disabled:opacity-50"
                >
                  <span className="font-medium">{item.label}</span>
                  <ChevronRight className="w-3 h-3 text-stone-400 group-hover:text-stone-700 transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          </div>

          {/* Custom Revision Instruction Box */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-stone-700" />
              <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Custom Revision Prompt
              </h3>
            </div>
            <p className="text-xs text-stone-500">
              Instruct the agent on exact adjustments or added details:
            </p>

            <textarea
              id="custom-revision-prompt"
              rows={3}
              value={revisionPrompt}
              onChange={(e) => setRevisionPrompt(e.target.value)}
              placeholder="e.g., State that replacement is preferred over repair, or reference the 3 prior unanswered emails..."
              className="w-full text-xs bg-stone-50/50 border border-stone-300 rounded-lg p-2.5 text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none focus:border-stone-900 resize-none"
            />

            <button
              id="btn-apply-custom-revision"
              type="button"
              disabled={!revisionPrompt.trim() || isGenerating}
              onClick={() => {
                if (revisionPrompt.trim()) {
                  onRevise(revisionPrompt.trim(), editableSubject, editableLetter);
                  setRevisionPrompt("");
                }
              }}
              className="w-full bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-3 h-3" />
              <span>Revise Letter</span>
            </button>
          </div>

          {/* Quick Setting Adjustments & Regenerate */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              Tweak Settings & Regenerate
            </h3>

            <div className="space-y-3">
              <div>
                <label
                  htmlFor="sidebar-select-firmness"
                  className="block text-[11px] font-semibold text-stone-600 mb-1"
                >
                  Firmness Level
                </label>
                <select
                  id="sidebar-select-firmness"
                  value={formData.firmness}
                  onChange={(e) => onUpdateFormData({ firmness: e.target.value as FirmnessType })}
                  className="w-full text-xs bg-stone-50 border border-stone-300 rounded-md px-2.5 py-1.5 text-stone-900 focus:outline-none focus:border-stone-900"
                >
                  {Object.keys(FIRMNESS_OPTIONS).map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="sidebar-select-tone"
                  className="block text-[11px] font-semibold text-stone-600 mb-1"
                >
                  Tone
                </label>
                <select
                  id="sidebar-select-tone"
                  value={formData.tone}
                  onChange={(e) => onUpdateFormData({ tone: e.target.value as ToneType })}
                  className="w-full text-xs bg-stone-50 border border-stone-300 rounded-md px-2.5 py-1.5 text-stone-900 focus:outline-none focus:border-stone-900"
                >
                  {TONE_OPTIONS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.id}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="sidebar-select-length"
                  className="block text-[11px] font-semibold text-stone-600 mb-1"
                >
                  Target Length
                </label>
                <select
                  id="sidebar-select-length"
                  value={formData.length}
                  onChange={(e) => onUpdateFormData({ length: e.target.value as LengthType })}
                  className="w-full text-xs bg-stone-50 border border-stone-300 rounded-md px-2.5 py-1.5 text-stone-900 focus:outline-none focus:border-stone-900"
                >
                  {LENGTH_OPTIONS.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.id}
                    </option>
                  ))}
                </select>
              </div>

              <button
                id="btn-regenerate-settings"
                type="button"
                disabled={isGenerating}
                onClick={() =>
                  onRevise(
                    `Regenerate using updated settings: ${formData.tone} tone and ${formData.firmness}`,
                    editableSubject,
                    editableLetter
                  )
                }
                className="w-full bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-900 font-medium text-xs py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isGenerating ? "animate-spin" : ""}`} />
                <span>Regenerate Letter</span>
              </button>
            </div>
          </div>

          {/* Navigation links */}
          <div className="pt-2 flex flex-col items-center gap-2">
            <button
              id="btn-back-to-edit-case-details"
              type="button"
              onClick={onEditDetails}
              className="w-full text-center text-xs font-medium text-stone-600 hover:text-stone-900 underline underline-offset-2 py-1 cursor-pointer"
            >
              ← Edit Case Information or Evidence Details
            </button>

            <button
              id="btn-sidebar-return-home"
              type="button"
              onClick={onGoHome}
              className="text-xs font-semibold text-stone-500 hover:text-stone-800 flex items-center gap-1 py-1 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Return to Home (Start or Change Issue)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
