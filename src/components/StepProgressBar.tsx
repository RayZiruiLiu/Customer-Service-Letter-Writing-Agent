import React from "react";
import { StepId } from "../types";
import { CheckCircle2, ChevronRight, Home, Sliders, Info, Send } from "lucide-react";

interface StepProgressBarProps {
  currentStep: StepId;
  onSelectStep: (step: StepId) => void;
  hasLetter: boolean;
  canProceedToInfo: boolean;
}

const STEPS: { id: StepId; label: string; sub: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "issue", label: "1. Home (Issue)", sub: "Purpose & Nature", icon: Home },
  { id: "preferences", label: "2. Preferences", sub: "Tone & Firmness", icon: Sliders },
  { id: "information", label: "3. Information", sub: "Case Details & Needs", icon: Info },
  { id: "letter", label: "4. Generated Letter", sub: "Drafts & History", icon: Send },
];

export const StepProgressBar: React.FC<StepProgressBarProps> = ({
  currentStep,
  onSelectStep,
  hasLetter,
  canProceedToInfo,
}) => {
  const stepOrder: StepId[] = ["issue", "preferences", "information", "letter"];
  const currentIndex = stepOrder.indexOf(currentStep);

  return (
    <nav
      id="step-progress-nav"
      aria-label="Letter creation progress"
      className="w-full bg-stone-50 border-b border-stone-200 px-4 py-3 sm:px-6"
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar gap-2 sm:gap-4">
        {STEPS.map((step, idx) => {
          const isCurrent = step.id === currentStep;
          const isPassed = idx < currentIndex;
          const isLetterStep = step.id === "letter";
          const isInfoStep = step.id === "information";
          const isPreferencesStep = step.id === "preferences";
          const isHomeStep = step.id === "issue";

          // Home step is always clickable; other steps follow flow
          const isClickable =
            isHomeStep ||
            isPassed ||
            isCurrent ||
            (isLetterStep && hasLetter) ||
            (isInfoStep && canProceedToInfo) ||
            isPreferencesStep;

          const Icon = step.icon;

          return (
            <React.Fragment key={step.id}>
              <button
                id={`step-button-${step.id}`}
                type="button"
                onClick={() => isClickable && onSelectStep(step.id)}
                disabled={!isClickable}
                className={`group flex items-center gap-2.5 py-2 px-3 rounded-lg text-left transition-all shrink-0 ${
                  isCurrent
                    ? "bg-white border border-stone-300 shadow-xs ring-2 ring-stone-900/5 text-stone-900"
                    : isPassed
                    ? "text-stone-700 hover:bg-stone-100 cursor-pointer"
                    : isClickable
                    ? "text-stone-500 hover:text-stone-800 hover:bg-stone-100 cursor-pointer"
                    : "text-stone-400 opacity-60 cursor-not-allowed"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold transition-colors ${
                    isCurrent
                      ? "bg-stone-900 text-white"
                      : isPassed
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-stone-200 text-stone-600"
                  }`}
                >
                  {isPassed ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
                </div>

                <div className="hidden sm:block leading-tight">
                  <div className={`text-xs font-semibold ${isCurrent ? "text-stone-900" : "text-stone-700"}`}>
                    {step.label}
                  </div>
                  <div className="text-[11px] text-stone-600 truncate">{step.sub}</div>
                </div>

                <div className="sm:hidden text-xs font-medium">{step.label.split(". ")[1]}</div>
              </button>

              {idx < STEPS.length - 1 && (
                <ChevronRight className="w-4 h-4 text-stone-300 shrink-0 mx-0.5 hidden sm:block" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
};
