import React, { useState } from "react";
import { X, ArrowRightLeft, Bookmark } from "lucide-react";

export interface ComparableVersion {
  id: string;
  label: string;
  timestamp: string;
  subject: string;
  letter: string;
  settingsSnapshot: {
    tone: string;
    firmness: string;
    formality?: string;
  };
  isSavedDraft?: boolean;
}

interface VersionCompareModalProps {
  versions: ComparableVersion[];
  activeVersionId: string;
  onClose: () => void;
  onRestore: (versionId: string) => void;
}

export const VersionCompareModal: React.FC<VersionCompareModalProps> = ({
  versions,
  activeVersionId,
  onClose,
  onRestore,
}) => {
  const [versionAId, setVersionAId] = useState<string>(() => {
    const activeIdx = versions.findIndex((v) => v.id === activeVersionId);
    if (activeIdx > 0) return versions[activeIdx - 1].id;
    return versions[0]?.id || "";
  });

  const [versionBId, setVersionBId] = useState<string>(activeVersionId);

  const verA = versions.find((v) => v.id === versionAId) || versions[0];
  const verB = versions.find((v) => v.id === versionBId) || versions[versions.length - 1];

  if (!verA || !verB) return null;

  const wordCountA = verA.letter.trim().split(/\s+/).filter(Boolean).length;
  const wordCountB = verB.letter.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div
      id="version-compare-modal-backdrop"
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white border border-stone-300 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center font-bold">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 leading-tight">
                Compare Letter Versions
              </h3>
              <p className="text-xs text-stone-500">
                Inspect how phrasing, firmness, and tone changed across generations and drafts.
              </p>
            </div>
          </div>
          <button
            id="btn-close-compare-modal"
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200/70 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selector Bar */}
        <div className="px-6 py-3 border-b border-stone-200 bg-white grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Version A Selector */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                Left Column (Baseline)
              </span>
              <span className="text-xs text-stone-500">{wordCountA} words</span>
            </div>
            <select
              id="select-version-a"
              value={versionAId}
              onChange={(e) => setVersionAId(e.target.value)}
              className="w-full text-xs font-medium bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:border-stone-900"
            >
              {versions.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.isSavedDraft ? "★ [Saved Draft] " : "[History] "}
                  {v.label} ({v.timestamp})
                </option>
              ))}
            </select>
          </div>

          {/* Version B Selector */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                Right Column (Comparison)
              </span>
              <span className="text-xs text-stone-500">{wordCountB} words</span>
            </div>
            <select
              id="select-version-b"
              value={versionBId}
              onChange={(e) => setVersionBId(e.target.value)}
              className="w-full text-xs font-medium bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:border-stone-900"
            >
              {versions.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.isSavedDraft ? "★ [Saved Draft] " : "[History] "}
                  {v.label} ({v.timestamp})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Split Content Area */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-stone-100/50">
          {/* Version A Card */}
          <div className="bg-white border border-stone-300 rounded-xl p-5 shadow-xs flex flex-col space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-stone-900 truncate max-w-[220px]">
                  {verA.label}
                </span>
                {verA.isSavedDraft && (
                  <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                    <Bookmark className="w-3 h-3 fill-amber-500 text-amber-600" />
                    Saved
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  onRestore(verA.id);
                  onClose();
                }}
                className="text-xs text-stone-700 hover:text-stone-900 font-semibold px-2.5 py-1 rounded border border-stone-300 hover:bg-stone-50 transition-colors cursor-pointer"
              >
                Use This
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="font-bold text-stone-500 uppercase tracking-wider text-[10px] block">
                  Subject Line
                </span>
                <p className="font-semibold text-stone-900">{verA.subject}</p>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-stone-500 pt-1">
                <span>{verA.settingsSnapshot.tone}</span>
                <span>•</span>
                <span>{verA.settingsSnapshot.firmness}</span>
              </div>
            </div>

            <div className="flex-1 font-serif text-xs leading-relaxed text-stone-800 whitespace-pre-line border-t border-stone-100 pt-3 max-h-[400px] overflow-y-auto">
              {verA.letter}
            </div>
          </div>

          {/* Version B Card */}
          <div className="bg-white border border-stone-300 rounded-xl p-5 shadow-xs flex flex-col space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-stone-900 truncate max-w-[220px]">
                  {verB.label}
                </span>
                {verB.isSavedDraft && (
                  <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                    <Bookmark className="w-3 h-3 fill-amber-500 text-amber-600" />
                    Saved
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  onRestore(verB.id);
                  onClose();
                }}
                className="text-xs text-white bg-stone-900 hover:bg-stone-800 font-semibold px-2.5 py-1 rounded transition-colors cursor-pointer"
              >
                Use This
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="font-bold text-stone-500 uppercase tracking-wider text-[10px] block">
                  Subject Line
                </span>
                <p className="font-semibold text-stone-900">{verB.subject}</p>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-stone-500 pt-1">
                <span>{verB.settingsSnapshot.tone}</span>
                <span>•</span>
                <span>{verB.settingsSnapshot.firmness}</span>
              </div>
            </div>

            <div className="flex-1 font-serif text-xs leading-relaxed text-stone-800 whitespace-pre-line border-t border-stone-100 pt-3 max-h-[400px] overflow-y-auto">
              {verB.letter}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-200 bg-white flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors cursor-pointer"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
