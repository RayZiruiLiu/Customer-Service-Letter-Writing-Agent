import React, { useState } from "react";
import { LetterFormData } from "../types";
import { PURPOSE_OPTIONS, COMMON_MAJOR_CONCERNS } from "../data/letterData";
import {
  Building2,
  AlertTriangle,
  MessageSquare,
  Target,
  FileCheck,
  User,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowLeft,
  Loader2,
  Home,
} from "lucide-react";

interface Step3InformationProps {
  formData: LetterFormData;
  onUpdateFormData: (updates: Partial<LetterFormData>) => void;
  onBack: () => void;
  onGoHome?: () => void;
  onSubmitGenerate: () => void;
  isGenerating: boolean;
}

export const Step3Information: React.FC<Step3InformationProps> = ({
  formData,
  onUpdateFormData,
  onBack,
  onGoHome,
  onSubmitGenerate,
  isGenerating,
}) => {
  const [showAdvancedDetails, setShowAdvancedDetails] = useState<boolean>(
    Boolean(
      formData.relevantDetails.orderNumber ||
        formData.relevantDetails.incidentDate ||
        formData.relevantDetails.amount ||
        formData.relevantDetails.evidence
    )
  );

  const selectedPurpose = PURPOSE_OPTIONS.find((p) => p.id === formData.letterType);
  const resolutionSuggestions = selectedPurpose ? selectedPurpose.commonResolutions : [];

  const handleUpdateRelevantDetails = (field: string, val: string) => {
    onUpdateFormData({
      relevantDetails: {
        ...formData.relevantDetails,
        [field]: val,
      },
    });
  };

  const isFormValid =
    formData.companyName.trim().length > 0 &&
    (formData.issueSummary.trim().length > 0 || formData.userDescription.trim().length > 0);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-stone-900">
          Provide Essential Case Information
        </h2>
        <p className="text-sm text-stone-600 mt-1">
          Enter the specific facts and desired outcome. The agent will transform these details into
          a persuasive, well-structured business letter.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Company & Core Issue */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="input-company-name"
                  className="flex items-center gap-1.5 text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5"
                >
                  <Building2 className="w-3.5 h-3.5 text-stone-500" />
                  <span>Company or Service Name *</span>
                </label>
                <input
                  id="input-company-name"
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => onUpdateFormData({ companyName: e.target.value })}
                  placeholder="e.g., Delta Airlines, Amazon, Samsung Electronics"
                  className="w-full text-sm bg-white border border-stone-300 rounded-lg px-3 py-2.5 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div>
                <label
                  htmlFor="input-issue-summary"
                  className="flex items-center gap-1.5 text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-stone-500" />
                  <span>Core Issue Summary *</span>
                </label>
                <input
                  id="input-issue-summary"
                  type="text"
                  required
                  value={formData.issueSummary}
                  onChange={(e) => onUpdateFormData({ issueSummary: e.target.value })}
                  placeholder="e.g., Unannounced flight cancellation with refusal to refund cash"
                  className="w-full text-sm bg-white border border-stone-300 rounded-lg px-3 py-2.5 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                />
              </div>
            </div>

            {/* Simple text field: Describe situation in own words (Explicit Prompt Requirement) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="input-user-description"
                  className="flex items-center gap-1.5 text-xs font-bold text-stone-800 uppercase tracking-wider"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-stone-500" />
                  <span>Describe the situation in your own words</span>
                </label>
                <span className="text-[11px] text-stone-600">Tell your story naturally</span>
              </div>
              <textarea
                id="input-user-description"
                rows={5}
                value={formData.userDescription}
                onChange={(e) => onUpdateFormData({ userDescription: e.target.value })}
                placeholder="Explain what happened chronologically: what you purchased, when the issue occurred, what customer support told you, and why it was unsatisfactory..."
                className="w-full text-sm bg-white border border-stone-300 rounded-lg p-3 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 resize-y leading-relaxed"
              />
              <p className="text-[11px] text-stone-600 mt-1">
                Don't worry about corporate phrasing or grammar—our AI will translate your story
                into polished, professional correspondence.
              </p>
            </div>
          </div>

          {/* Desired Resolution (Explicit Requirement) */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-stone-100 flex items-center justify-center text-stone-700">
                <Target className="w-3.5 h-3.5" />
              </div>
              <div>
                <label
                  htmlFor="input-desired-resolution"
                  className="text-xs font-bold text-stone-800 uppercase tracking-wider"
                >
                  Desired Resolution *
                </label>
                <p className="text-xs text-stone-500">
                  What specific remedy or outcome are you demanding?
                </p>
              </div>
            </div>

            {/* Quick resolution suggestions */}
            {resolutionSuggestions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {resolutionSuggestions.map((resOption, i) => {
                  const isChosen = formData.desiredResolution === resOption;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => onUpdateFormData({ desiredResolution: resOption })}
                      className={`text-xs px-2.5 py-1 rounded-md border transition-colors text-left cursor-pointer ${
                        isChosen
                          ? "bg-stone-900 text-white border-stone-900"
                          : "bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200"
                      }`}
                    >
                      {resOption}
                    </button>
                  );
                })}
              </div>
            )}

            <input
              id="input-desired-resolution"
              type="text"
              value={formData.desiredResolution}
              onChange={(e) => onUpdateFormData({ desiredResolution: e.target.value })}
              placeholder="e.g., Full refund of $349.99 to original credit card within 5 business days"
              className="w-full text-sm bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
            />
          </div>

          {/* Major Concern (Explicit Requirement) */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-stone-100 flex items-center justify-center text-stone-700">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
              <div>
                <label
                  htmlFor="input-major-concern"
                  className="text-xs font-bold text-stone-800 uppercase tracking-wider"
                >
                  Major Concern or Key Hardship
                </label>
                <p className="text-xs text-stone-500">
                  Why is this particularly unacceptable or harmful to you?
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {COMMON_MAJOR_CONCERNS.slice(0, 4).map((concern, i) => {
                const isChosen = formData.majorConcern === concern;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onUpdateFormData({ majorConcern: concern })}
                    className={`text-xs px-2.5 py-1 rounded-md border transition-colors text-left cursor-pointer ${
                      isChosen
                        ? "bg-stone-900 text-white border-stone-900"
                        : "bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200"
                    }`}
                  >
                    {concern}
                  </button>
                );
              })}
            </div>

            <input
              id="input-major-concern"
              type="text"
              value={formData.majorConcern}
              onChange={(e) => onUpdateFormData({ majorConcern: e.target.value })}
              placeholder="e.g., Unfair financial deduction and breach of written warranty terms"
              className="w-full text-sm bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
            />
          </div>

          {/* Relevant Details Accordion (Order #, Date, Amount, Evidence) */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-2xs space-y-3">
            <button
              id="toggle-advanced-details"
              type="button"
              onClick={() => setShowAdvancedDetails(!showAdvancedDetails)}
              className="w-full flex items-center justify-between text-left cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-stone-600" />
                <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                  Relevant Details & Records (Order #, Evidence, Dates)
                </span>
              </div>
              {showAdvancedDetails ? (
                <ChevronUp className="w-4 h-4 text-stone-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-stone-500" />
              )}
            </button>

            {showAdvancedDetails && (
              <div className="pt-3 border-t border-stone-100 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                <div>
                  <label
                    htmlFor="input-order-number"
                    className="block text-xs font-semibold text-stone-700 mb-1"
                  >
                    Order / Account / PNR / Tracking #
                  </label>
                  <input
                    id="input-order-number"
                    type="text"
                    value={formData.relevantDetails.orderNumber}
                    onChange={(e) => handleUpdateRelevantDetails("orderNumber", e.target.value)}
                    placeholder="e.g., #ORD-98214 or Account #482910"
                    className="w-full text-xs bg-stone-50/50 border border-stone-300 rounded-md px-2.5 py-2 text-stone-900 focus:bg-white focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label
                    htmlFor="input-incident-date"
                    className="block text-xs font-semibold text-stone-700 mb-1"
                  >
                    Date of Purchase / Incident
                  </label>
                  <input
                    id="input-incident-date"
                    type="text"
                    value={formData.relevantDetails.incidentDate}
                    onChange={(e) => handleUpdateRelevantDetails("incidentDate", e.target.value)}
                    placeholder="e.g., October 12, 2025"
                    className="w-full text-xs bg-stone-50/50 border border-stone-300 rounded-md px-2.5 py-2 text-stone-900 focus:bg-white focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label
                    htmlFor="input-amount"
                    className="block text-xs font-semibold text-stone-700 mb-1"
                  >
                    Amount Disputed / Paid
                  </label>
                  <input
                    id="input-amount"
                    type="text"
                    value={formData.relevantDetails.amount}
                    onChange={(e) => handleUpdateRelevantDetails("amount", e.target.value)}
                    placeholder="e.g., $189.50 USD"
                    className="w-full text-xs bg-stone-50/50 border border-stone-300 rounded-md px-2.5 py-2 text-stone-900 focus:bg-white focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label
                    htmlFor="input-evidence"
                    className="block text-xs font-semibold text-stone-700 mb-1"
                  >
                    Evidence / Attached Documentation
                  </label>
                  <input
                    id="input-evidence"
                    type="text"
                    value={formData.relevantDetails.evidence}
                    onChange={(e) => handleUpdateRelevantDetails("evidence", e.target.value)}
                    placeholder="e.g., Photos of broken seal, bank statement, chat transcript"
                    className="w-full text-xs bg-stone-50/50 border border-stone-300 rounded-md px-2.5 py-2 text-stone-900 focus:bg-white focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="input-contact-history"
                    className="block text-xs font-semibold text-stone-700 mb-1"
                  >
                    Previous Support Contact Attempts
                  </label>
                  <input
                    id="input-contact-history"
                    type="text"
                    value={formData.relevantDetails.contactHistory}
                    onChange={(e) => handleUpdateRelevantDetails("contactHistory", e.target.value)}
                    placeholder="e.g., Called support on Oct 14 (Ticket #78291); agent promised call within 24 hours"
                    className="w-full text-xs bg-stone-50/50 border border-stone-300 rounded-md px-2.5 py-2 text-stone-900 focus:bg-white focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Summary & Sign-off Details */}
        <div className="lg:col-span-4 space-y-6">
          {/* Customer Signature info */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-stone-700" />
              <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Sign-off Details (Optional)
              </h3>
            </div>
            <p className="text-xs text-stone-500">
              Adds your formal signature block so the letter is ready to send.
            </p>

            <div className="space-y-3 pt-1">
              <div>
                <label
                  htmlFor="input-customer-name"
                  className="block text-xs font-semibold text-stone-700 mb-1"
                >
                  Your Name
                </label>
                <input
                  id="input-customer-name"
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => onUpdateFormData({ customerName: e.target.value })}
                  placeholder="e.g., Jane Doe"
                  className="w-full text-xs bg-stone-50/50 border border-stone-300 rounded-md px-2.5 py-2 text-stone-900 focus:bg-white focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label
                  htmlFor="input-customer-contact"
                  className="block text-xs font-semibold text-stone-700 mb-1"
                >
                  Phone / Email / Address
                </label>
                <input
                  id="input-customer-contact"
                  type="text"
                  value={formData.customerContact}
                  onChange={(e) => onUpdateFormData({ customerContact: e.target.value })}
                  placeholder="e.g., jane@example.com | (555) 234-5678"
                  className="w-full text-xs bg-stone-50/50 border border-stone-300 rounded-md px-2.5 py-2 text-stone-900 focus:bg-white focus:outline-none focus:border-stone-900"
                />
              </div>
            </div>
          </div>

          {/* Active Settings Summary Card */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Selected Configuration
            </h4>

            <div className="space-y-2 text-xs text-stone-600">
              <div className="flex justify-between py-1 border-b border-stone-200">
                <span className="text-stone-600">Letter Purpose:</span>
                <span className="font-semibold text-stone-900 capitalize">
                  {formData.letterType}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-200">
                <span className="text-stone-600">Tone:</span>
                <span className="font-semibold text-stone-900">{formData.tone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-200">
                <span className="text-stone-600">Firmness:</span>
                <span className="font-semibold text-stone-900">{formData.firmness}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-200">
                <span className="text-stone-600">Formality:</span>
                <span className="font-semibold text-stone-900">{formData.formality}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-stone-600">Target Length:</span>
                <span className="font-semibold text-stone-900">{formData.length.split(" ")[0]}</span>
              </div>
            </div>

            <p className="text-[11px] text-stone-600 pt-2 border-t border-stone-200">
              You can adjust these settings at any time or request targeted revisions after the draft
              is created.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {onGoHome && (
            <button
              id="btn-info-back-to-home"
              type="button"
              onClick={onGoHome}
              disabled={isGenerating}
              className="inline-flex items-center gap-1.5 text-stone-600 hover:text-stone-900 text-sm font-medium px-3.5 py-2 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer disabled:opacity-50"
              title="Return to Home page"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>
          )}

          <button
            id="btn-back-to-preferences"
            type="button"
            onClick={onBack}
            disabled={isGenerating}
            className="inline-flex items-center gap-1.5 text-stone-600 hover:text-stone-900 text-sm font-medium px-4 py-2 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Preferences</span>
          </button>
        </div>

        <button
          id="btn-submit-generate-letter"
          type="button"
          onClick={onSubmitGenerate}
          disabled={!isFormValid || isGenerating}
          className={`inline-flex items-center gap-2 font-medium text-sm px-6 py-3 rounded-lg shadow-sm transition-all cursor-pointer ${
            isFormValid && !isGenerating
              ? "bg-stone-900 hover:bg-stone-800 text-white"
              : "bg-stone-200 text-stone-400 cursor-not-allowed"
          }`}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Drafting Your Letter...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate Customer Service Letter</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
