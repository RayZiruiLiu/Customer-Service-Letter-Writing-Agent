import React from "react";
import { LetterFormData, ToneType, FormalityType, LengthType, FirmnessType } from "../types";
import {
  TONE_OPTIONS,
  FORMALITY_OPTIONS,
  LENGTH_OPTIONS,
  FIRMNESS_OPTIONS,
} from "../data/letterData";
import { ArrowLeft, ArrowRight, ShieldAlert, Scale, FileText, Check, Home } from "lucide-react";

interface Step2PreferencesProps {
  formData: LetterFormData;
  onUpdateFormData: (updates: Partial<LetterFormData>) => void;
  onBack: () => void;
  onNext: () => void;
}

export const Step2Preferences: React.FC<Step2PreferencesProps> = ({
  formData,
  onUpdateFormData,
  onBack,
  onNext,
}) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-stone-900">
          Customize Tone, Formality & Firmness
        </h2>
        <p className="text-sm text-stone-600 mt-1">
          Control how your message sounds and how much legal/escalation pressure is applied to the
          customer service recipient.
        </p>
      </div>

      {/* Level of Firmness (Critical Setting) */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-stone-100 flex items-center justify-center text-stone-800">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">Level of Firmness & Urgency</h3>
              <p className="text-xs text-stone-500">
                Dictates deadlines, statutory escalation warnings, and payment dispute notices.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.values(FIRMNESS_OPTIONS).map((opt) => {
            const isSelected = formData.firmness === opt.id;
            return (
              <button
                key={opt.id}
                id={`firmness-option-${opt.id.replace(/\s+/g, "-").toLowerCase()}`}
                type="button"
                onClick={() => onUpdateFormData({ firmness: opt.id as FirmnessType })}
                className={`text-left p-3.5 rounded-lg border transition-all relative flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? "border-stone-900 bg-stone-900 text-white shadow-sm ring-1 ring-stone-900"
                    : "border-stone-200 bg-stone-50/50 hover:bg-white hover:border-stone-300 text-stone-900"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-xs font-bold ${
                        isSelected ? "text-white" : "text-stone-900"
                      }`}
                    >
                      {opt.label}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                  </div>
                  <p
                    className={`text-xs leading-relaxed ${
                      isSelected ? "text-stone-300" : "text-stone-500"
                    }`}
                  >
                    {opt.desc}
                  </p>
                </div>
                <div
                  className={`mt-2.5 pt-2 text-[11px] border-t ${
                    isSelected ? "border-stone-800 text-stone-300" : "border-stone-200 text-stone-600"
                  }`}
                >
                  <span className="font-semibold">Effect: </span>
                  {opt.effect}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tone Selection */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-stone-100 flex items-center justify-center text-stone-800">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900">Communication Tone</h3>
            <p className="text-xs text-stone-500">
              Set the interpersonal demeanor and perspective of your correspondence.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {TONE_OPTIONS.map((opt) => {
            const isSelected = formData.tone === opt.id;
            return (
              <button
                key={opt.id}
                id={`tone-option-${opt.id.replace(/\s+/g, "-").toLowerCase()}`}
                type="button"
                onClick={() => onUpdateFormData({ tone: opt.id as ToneType })}
                className={`text-left p-3.5 rounded-lg border transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? "border-stone-900 bg-stone-900 text-white shadow-sm ring-1 ring-stone-900"
                    : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50 text-stone-900"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">{opt.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <p
                    className={`text-xs leading-relaxed ${
                      isSelected ? "text-stone-300" : "text-stone-500"
                    }`}
                  >
                    {opt.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Formality & Length Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Formality */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-stone-100 flex items-center justify-center text-stone-800">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">Formality Level</h3>
              <p className="text-xs text-stone-500">Stylistic conventions and phrasing structure.</p>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            {FORMALITY_OPTIONS.map((opt) => {
              const isSelected = formData.formality === opt.id;
              return (
                <button
                  key={opt.id}
                  id={`formality-option-${opt.id.replace(/\s+/g, "-").toLowerCase()}`}
                  type="button"
                  onClick={() => onUpdateFormData({ formality: opt.id as FormalityType })}
                  className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-200 hover:border-stone-300 bg-stone-50/40 hover:bg-white text-stone-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">{opt.label}</span>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <p
                    className={`text-xs mt-0.5 ${
                      isSelected ? "text-stone-300" : "text-stone-500"
                    }`}
                  >
                    {opt.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Length */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-stone-100 flex items-center justify-center text-stone-800">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">Document Length</h3>
              <p className="text-xs text-stone-500">Conciseness versus itemized chronological detail.</p>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            {LENGTH_OPTIONS.map((opt) => {
              const isSelected = formData.length === opt.id;
              return (
                <button
                  key={opt.id}
                  id={`length-option-${opt.id.replace(/\s+/g, "-").toLowerCase()}`}
                  type="button"
                  onClick={() => onUpdateFormData({ length: opt.id as LengthType })}
                  className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-200 hover:border-stone-300 bg-stone-50/40 hover:bg-white text-stone-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">{opt.label}</span>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <p
                    className={`text-xs mt-0.5 ${
                      isSelected ? "text-stone-300" : "text-stone-500"
                    }`}
                  >
                    {opt.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
        <button
          id="btn-back-to-issue"
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-stone-600 hover:text-stone-900 text-sm font-medium px-4 py-2 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home (Issue Selection)</span>
        </button>

        <button
          id="btn-next-to-information"
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm px-5 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <span>Continue to Case Details</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
