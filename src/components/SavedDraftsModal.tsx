import React from "react";
import { SavedDraft } from "../types";
import { Bookmark, X, Trash2, ArrowUpRight, Copy, Check, FileText } from "lucide-react";

interface SavedDraftsModalProps {
  drafts: SavedDraft[];
  activeDraftId?: string | null;
  onClose: () => void;
  onRestoreDraft: (draft: SavedDraft) => void;
  onDeleteDraft: (draftId: string) => void;
}

export const SavedDraftsModal: React.FC<SavedDraftsModalProps> = ({
  drafts,
  activeDraftId,
  onClose,
  onRestoreDraft,
  onDeleteDraft,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = async (draft: SavedDraft) => {
    try {
      const full = `Subject: ${draft.subject}\n\n${draft.letter}`;
      await navigator.clipboard.writeText(full);
      setCopiedId(draft.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      console.error("Failed to copy", e);
    }
  };

  return (
    <div
      id="saved-drafts-modal-backdrop"
      className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white border border-stone-300 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-amber-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Bookmark className="w-4 h-4 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-stone-900 leading-tight">
                  Saved Drafts
                </h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  {drafts.length} {drafts.length === 1 ? "Draft" : "Drafts"}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Permanently saved by you. Kept in storage until you choose to delete them.
              </p>
            </div>
          </div>
          <button
            id="btn-close-saved-drafts"
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-200/60 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drafts List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3.5 bg-stone-50/60">
          {drafts.length === 0 ? (
            <div className="text-center py-12 px-4 bg-white border border-dashed border-stone-300 rounded-xl space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
                <Bookmark className="w-6 h-6 fill-amber-500/20" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-stone-800">No saved drafts yet</p>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  When you generate a letter you like, click <strong>"Save Draft"</strong> to save it
                  here permanently before making further revisions.
                </p>
              </div>
            </div>
          ) : (
            drafts.map((draft) => {
              const isActive = draft.id === activeDraftId;
              const wordCount = draft.letter.trim().split(/\s+/).filter(Boolean).length;
              return (
                <div
                  key={draft.id}
                  id={`saved-draft-card-${draft.id}`}
                  className={`bg-white border rounded-xl p-4 transition-all shadow-xs space-y-3 ${
                    isActive
                      ? "border-amber-400 ring-2 ring-amber-400/20 bg-amber-50/20"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                        <Bookmark className="w-3.5 h-3.5 fill-amber-500 text-amber-700" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-stone-900 leading-snug">
                            {draft.title}
                          </h4>
                          {isActive && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                              Currently Active
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Saved on {draft.timestamp} • {wordCount} words
                          {draft.companyName ? ` • For ${draft.companyName}` : ""}
                        </p>
                      </div>
                    </div>

                    {/* Delete Draft Button */}
                    <button
                      type="button"
                      onClick={() => onDeleteDraft(draft.id)}
                      className="text-stone-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-md transition-colors cursor-pointer"
                      title="Delete this saved draft"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Subject and Preview */}
                  <div className="bg-stone-50 rounded-lg p-2.5 border border-stone-150 text-xs space-y-1">
                    <div className="font-semibold text-stone-800 truncate">
                      Subject: {draft.subject}
                    </div>
                    <p className="text-stone-600 line-clamp-2 font-serif text-[11px] leading-relaxed">
                      {draft.letter}
                    </p>
                  </div>

                  {/* Settings snapshot badge & Action Buttons */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                      <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-medium">
                        {draft.settingsSnapshot.tone}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-medium">
                        {draft.settingsSnapshot.firmness.split(" / ")[0]}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopy(draft)}
                        className="text-stone-600 hover:text-stone-900 text-xs font-medium px-2.5 py-1.5 rounded-md hover:bg-stone-100 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        {copiedId === draft.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onRestoreDraft(draft);
                          onClose();
                        }}
                        className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                      >
                        <span>Load Draft</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-200 bg-white flex items-center justify-between text-xs text-stone-500">
          <span>Saved drafts are kept permanently until deleted.</span>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold px-4 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
