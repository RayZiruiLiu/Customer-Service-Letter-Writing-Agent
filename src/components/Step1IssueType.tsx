import React from "react";
import { LetterPurpose, LetterFormData, SampleScenario } from "../types";
import { PURPOSE_OPTIONS, SAMPLE_SCENARIOS } from "../data/letterData";
import {
  RotateCcw,
  RefreshCw,
  ShieldCheck,
  AlertCircle,
  CreditCard,
  PackageX,
  FileX2,
  Flame,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Check,
} from "lucide-react";

interface Step1IssueTypeProps {
  formData: LetterFormData;
  onChangePurpose: (purpose: LetterPurpose, defaultTone?: any, defaultFirmness?: any) => void;
  onUpdateFormData: (updates: Partial<LetterFormData>) => void;
  onApplyScenario: (scenario: SampleScenario) => void;
  onNext: () => void;
}

const ICONS_MAP: Record<LetterPurpose, React.ComponentType<{ className?: string }>> = {
  refund: RefreshCw,
  return: RotateCcw,
  warranty: ShieldCheck,
  complaint: AlertCircle,
  billing: CreditCard,
  delivery: PackageX,
  cancellation: FileX2,
  escalation: Flame,
  custom: HelpCircle,
};

export const Step1IssueType: React.FC<Step1IssueTypeProps> = ({
  formData,
  onChangePurpose,
  onUpdateFormData,
  onApplyScenario,
  onNext,
}) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-stone-900">
              Select the Purpose of Your Letter
            </h2>
            <p className="text-sm text-stone-600 mt-1">
              Choose the primary customer service objective. The agent will adapt the legal framing,
              demands, and evidence requirements accordingly.
            </p>
          </div>
        </div>

        {/* Quick sample scenarios banner */}
        <div className="mt-4 p-3.5 bg-stone-100/80 border border-stone-200 rounded-xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Or load a real-world scenario to test immediately:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_SCENARIOS.map((scenario) => (
              <button
                key={scenario.id}
                id={`sample-scenario-btn-${scenario.id}`}
                type="button"
                onClick={() => onApplyScenario(scenario)}
                className="text-xs bg-white hover:bg-stone-50 border border-stone-200 hover:border-stone-300 text-stone-700 font-medium py-1.5 px-2.5 rounded-md transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400"></span>
                <span>{scenario.title}</span>
                <span className="text-[10px] text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded">
                  {scenario.tag}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {PURPOSE_OPTIONS.map((option) => {
          const isSelected = formData.letterType === option.id;
          const Icon = ICONS_MAP[option.id] || HelpCircle;

          return (
            <button
              key={option.id}
              id={`purpose-card-${option.id}`}
              type="button"
              onClick={() => onChangePurpose(option.id, option.defaultTone, option.defaultFirmness)}
              className={`text-left p-4 rounded-xl border transition-all duration-150 flex flex-col justify-between h-full relative cursor-pointer ${
                isSelected
                  ? "border-stone-900 bg-stone-900 text-white shadow-md ring-1 ring-stone-900"
                  : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/70 text-stone-900 shadow-2xs"
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                      isSelected ? "bg-white/15 text-white" : "bg-stone-100 text-stone-700"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-white text-stone-950 flex items-center justify-center text-xs font-bold">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <h3 className="font-semibold text-sm leading-snug">{option.title}</h3>
                <p
                  className={`text-xs mt-1.5 leading-relaxed ${
                    isSelected ? "text-stone-300" : "text-stone-500"
                  }`}
                >
                  {option.description}
                </p>
              </div>

              <div
                className={`mt-3 pt-2.5 border-t text-[11px] font-medium flex items-center justify-between ${
                  isSelected ? "border-stone-800 text-stone-300" : "border-stone-100 text-stone-600"
                }`}
              >
                <span>Suggested: {option.defaultFirmness.split(" / ")[0]}</span>
                <span className="underline underline-offset-2">Select</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom purpose text if selected */}
      {formData.letterType === "custom" && (
        <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
          <label
            htmlFor="custom-letter-type"
            className="block text-xs font-semibold text-stone-700 uppercase tracking-wider"
          >
            Specify your custom letter matter:
          </label>
          <input
            id="custom-letter-type"
            type="text"
            value={formData.customLetterType || ""}
            onChange={(e) => onUpdateFormData({ customLetterType: e.target.value })}
            placeholder="e.g., Insurance policy cancellation refund dispute, Warranty transfer request..."
            className="w-full text-sm bg-white border border-stone-300 rounded-lg px-3.5 py-2.5 text-stone-900 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
          />
        </div>
      )}

      {/* Next button */}
      <div className="pt-4 border-t border-stone-200 flex justify-end">
        <button
          id="btn-next-to-preferences"
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm px-5 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <span>Continue to Preferences</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
