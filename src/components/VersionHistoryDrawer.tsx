import React from "react";
import { HistoryItem } from "../types";
import { History, X, Clock, Bookmark, ArrowUpRight, Trash2 } from "lucide-react";

interface VersionHistoryDrawerProps {
  history: HistoryItem[];
  activeVersionId: string | null;
  onClose: () => void;
  onRestoreHistory: (item: HistoryItem) => void;
  onSaveHistoryAsDraft: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

export const VersionHistoryDrawer: React.FC<VersionHistoryDrawerProps> = ({
  history,
  activeVersionId,
  onClose,
  onRestoreHistory,
  onSaveHistoryAsDraft,
  onClearHistory,
}) => {
  return (
    <div
      id="version-history-drawer-backdrop"
      className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-2xs flex items-center justify-end animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white border-l border-stone-300 w-full max-w-lg h-full flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-stone-800 text-white flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 leading-tight">
                Version History (Recent)
              </h3>
              <p className="text-xs text-stone-500">
                Temporary log of recent generations. Older versions expire automatically.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-200/70 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Temporary Notice */}
        <div className="px-5 py-2.5 bg-stone-100/70 border-b border-stone-200 text-[11px] text-stone-600 flex items-center justify-between">
          <span>Keeps up to the 10 most recent generated versions.</span>
          {history.length > 0 && (
            <button
              type="button"
              onClick={onClearHistory}
              className="text-stone-500 hover:text-rose-600 font-medium transition-colors cursor-pointer"
            >
              Clear History
            </button>
          )}
        </div>

        {/* List of Recent Generations */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-stone-50/40">
          {history.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white border border-dashed border-stone-200 rounded-xl space-y-2">
              <Clock className="w-8 h-8 text-stone-400 mx-auto" />
              <p className="text-xs font-semibold text-stone-700">No version history yet</p>
              <p className="text-[11px] text-stone-400">
                Generated and revised letters will temporarily appear here.
              </p>
            </div>
          ) : (
            history.map((item) => {
              const isActive = item.id === activeVersionId;
              const wordCount = item.letter.trim().split(/\s+/).filter(Boolean).length;

              return (
                <div
                  key={item.id}
                  id={`history-card-${item.id}`}
                  className={`bg-white border rounded-xl p-3.5 transition-all shadow-2xs space-y-2.5 ${
                    isActive
                      ? "border-stone-800 ring-2 ring-stone-800/10"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                          isActive
                            ? "bg-stone-900 text-white"
                            : "bg-stone-100 text-stone-800"
                        }`}
                      >
                        v{item.versionNumber}
                      </span>
                      <span className="text-xs font-semibold text-stone-900 truncate max-w-[200px]">
                        {item.label}
                      </span>
                    </div>

                    <span className="text-[11px] text-stone-400 font-mono">
                      {item.timestamp}
                    </span>
                  </div>

                  {/* Subject & snippet */}
                  <div className="text-xs space-y-1">
                    <p className="font-medium text-stone-800 truncate">{item.subject}</p>
                    <p className="text-stone-500 line-clamp-2 text-[11px] font-serif leading-relaxed">
                      {item.letter}
                    </p>
                  </div>

                  {/* Settings tags & actions */}
                  <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-[11px]">
                    <span className="text-stone-400 text-[10px]">
                      {wordCount} words • {item.settingsSnapshot.tone}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {/* Save to permanent drafts button */}
                      <button
                        type="button"
                        onClick={() => onSaveHistoryAsDraft(item)}
                        className="text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-xs font-medium px-2 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer"
                        title="Save this historical version to permanent Saved Drafts"
                      >
                        <Bookmark className="w-3 h-3 fill-amber-500 text-amber-700" />
                        <span>Save Draft</span>
                      </button>

                      {/* Restore into viewer */}
                      <button
                        type="button"
                        disabled={isActive}
                        onClick={() => {
                          onRestoreHistory(item);
                          onClose();
                        }}
                        className={`text-xs font-semibold px-2.5 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer ${
                          isActive
                            ? "bg-stone-100 text-stone-400 cursor-default"
                            : "bg-stone-900 hover:bg-stone-800 text-white"
                        }`}
                      >
                        <span>{isActive ? "Viewing" : "Restore"}</span>
                        {!isActive && <ArrowUpRight className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-stone-200 bg-white flex items-center justify-end">
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
