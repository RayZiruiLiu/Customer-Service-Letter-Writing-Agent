import {
  LetterPurpose,
  ToneType,
  FormalityType,
  LengthType,
  FirmnessType,
  SampleScenario,
  LetterFormData,
} from "../types";

export interface PurposeOption {
  id: LetterPurpose;
  title: string;
  shortLabel: string;
  description: string;
  commonResolutions: string[];
  defaultTone: ToneType;
  defaultFirmness: FirmnessType;
}

export const PURPOSE_OPTIONS: PurposeOption[] = [
  {
    id: "refund",
    title: "Refund Request",
    shortLabel: "Refund",
    description: "Request a full or partial reimbursement for defective products, cancelled services, or unmet promises.",
    commonResolutions: [
      "Full refund to original payment method",
      "Partial refund for reduced value or delay",
      "Refund plus reimbursement of incidental return fees",
      "Store credit or account balance adjustment",
    ],
    defaultTone: "Professional & Objective",
    defaultFirmness: "Firm / Insistent",
  },
  {
    id: "return",
    title: "Return / Exchange Request",
    shortLabel: "Return / Exchange",
    description: "Return an unwanted, incorrect, or damaged physical item and receive a prepaid shipping label or replacement.",
    commonResolutions: [
      "Prepaid return shipping label and replacement unit",
      "Immediate exchange for correct size/model",
      "Waiver of restocking and shipping fees",
      "Return authorization with prompt refund upon receipt",
    ],
    defaultTone: "Cooperative & Polite",
    defaultFirmness: "Moderate / Expectant",
  },
  {
    id: "warranty",
    title: "Warranty & Repair Claim",
    shortLabel: "Warranty / Repair",
    description: "Claim coverage under manufacturer or retailer warranty for device malfunctions or structural breakdown.",
    commonResolutions: [
      "Authorized free manufacturer repair under warranty",
      "Brand-new replacement unit at zero cost",
      "Full reimbursement if parts are unavailable",
      "Extension of current warranty coverage",
    ],
    defaultTone: "Professional & Objective",
    defaultFirmness: "Moderate / Expectant",
  },
  {
    id: "complaint",
    title: "Formal Complaint (Service / Quality)",
    shortLabel: "Formal Complaint",
    description: "Report unacceptable conduct, negligence, deceptive representations, or poor customer service standards.",
    commonResolutions: [
      "Formal written apology and internal corrective action",
      "Credit or goodwill voucher for future service",
      "Full refund of service fees and cancellation of balance",
      "Escalation to senior executive relations team",
    ],
    defaultTone: "Assertive & Direct",
    defaultFirmness: "Firm / Insistent",
  },
  {
    id: "billing",
    title: "Billing & Unauthorized Charge Dispute",
    shortLabel: "Billing Dispute",
    description: "Challenge hidden fees, unexpected price hikes, double charges, or unauthorized credit card deductions.",
    commonResolutions: [
      "Immediate reversal and credit of unauthorized charge",
      "Corrected itemized invoice matching agreed pricing",
      "Waiver of late penalty or processing surcharges",
      "Written confirmation that account is in good standing",
    ],
    defaultTone: "Assertive & Direct",
    defaultFirmness: "Firm / Insistent",
  },
  {
    id: "delivery",
    title: "Delivery & Damaged Package Issue",
    shortLabel: "Delivery / Shipping",
    description: "Address lost shipments, stolen packages, delayed delivery, or items received broken or damaged in transit.",
    commonResolutions: [
      "Expedited replacement shipment at no extra cost",
      "Full refund due to non-delivery or carrier loss",
      "Reimbursement for damaged contents with photos provided",
      "Trace investigation with carrier and status update",
    ],
    defaultTone: "Professional & Objective",
    defaultFirmness: "Moderate / Expectant",
  },
  {
    id: "cancellation",
    title: "Subscription / Contract Cancellation",
    shortLabel: "Cancellation",
    description: "Terminate an ongoing membership, recurring software plan, or gym contract with fee dispute.",
    commonResolutions: [
      "Immediate cancellation of membership and recurring billing",
      "Refund of any charges billed after initial cancellation attempt",
      "Written confirmation of contract termination with zero penalty",
      "Deletion of stored payment information from system",
    ],
    defaultTone: "Assertive & Direct",
    defaultFirmness: "Firm / Insistent",
  },
  {
    id: "escalation",
    title: "Executive Escalation & Final Notice",
    shortLabel: "Final Escalation",
    description: "When regular customer support failed or ignored prior tickets, demand executive-level intervention.",
    commonResolutions: [
      "Immediate supervisory review and prompt settlement",
      "Full compliance with original contract terms",
      "Resolution within specified statutory timeline prior to regulatory filing",
      "Comprehensive resolution without further delays",
    ],
    defaultTone: "Stern & Disappointed",
    defaultFirmness: "Escalated / Final Notice",
  },
  {
    id: "custom",
    title: "Custom Customer Service Matter",
    shortLabel: "Custom Matter",
    description: "Any other customer service interaction, loyalty inquiry, account reinstatement, or specific dispute.",
    commonResolutions: [
      "Fair and equitable resolution based on stated facts",
      "Direct phone or written follow-up by supervisory staff",
      "Clarification and account status adjustment",
      "Custom resolution",
    ],
    defaultTone: "Professional & Objective",
    defaultFirmness: "Moderate / Expectant",
  },
];

export const TONE_OPTIONS: { id: ToneType; label: string; desc: string }[] = [
  {
    id: "Professional & Objective",
    label: "Professional & Objective",
    desc: "Neutral, calm, and grounded in documented facts. High credibility for corporate teams.",
  },
  {
    id: "Cooperative & Polite",
    label: "Cooperative & Polite",
    desc: "Courteous, friendly, and appreciative. Assumes good faith and fosters a helpful response.",
  },
  {
    id: "Assertive & Direct",
    label: "Assertive & Direct",
    desc: "Unambiguous, focused on obligations, clear about accountability without being emotional.",
  },
  {
    id: "Empathetic & Respectful",
    label: "Empathetic & Respectful",
    desc: "Warm and constructive while articulating personal inconvenience or disappointment.",
  },
  {
    id: "Stern & Disappointed",
    label: "Stern & Disappointed",
    desc: "Strong disapproval of poor service; conveys urgency, lost trust, and strict accountability.",
  },
];

export const FORMALITY_OPTIONS: { id: FormalityType; label: string; desc: string }[] = [
  {
    id: "Standard Business",
    label: "Standard Business",
    desc: "Balanced professional email or letter standard. Suitable for 90% of support requests.",
  },
  {
    id: "Formal Legal/Executive",
    label: "Formal Legal / Executive",
    desc: "Strict formal phrasing, explicit references to terms, warranties, and official dates.",
  },
  {
    id: "Casual & Approachable",
    label: "Casual & Approachable",
    desc: "Conversational tone, best suited for live chat transcripts, social DMs, or modern startups.",
  },
];

export const LENGTH_OPTIONS: { id: LengthType; label: string; desc: string }[] = [
  {
    id: "Concise (1-2 Paragraphs)",
    label: "Concise (1-2 Paragraphs)",
    desc: "Fast, punchy, and scannable. Ideal for online contact forms and quick ticketing portals.",
  },
  {
    id: "Standard (3-4 Paragraphs)",
    label: "Standard (3-4 Paragraphs)",
    desc: "Balanced narrative: introduces the situation, details evidence, and defines clear demands.",
  },
  {
    id: "Detailed (Comprehensive & Itemized)",
    label: "Detailed (Comprehensive)",
    desc: "Thorough chronological timeline, itemized bullet breakdown, and specific terms cited.",
  },
];

export interface FirmnessOption {
  id: FirmnessType;
  label: string;
  desc: string;
  badgeColor: string;
  effect: string;
}

export const FIRMNESS_OPTIONS: Record<FirmnessType, FirmnessOption> = {
  "Gentle / Courteous": {
    id: "Gentle / Courteous",
    label: "Gentle / Courteous",
    desc: "Polite request. Gives the benefit of the doubt and asks kindly for assistance.",
    badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    effect: "Focuses on mutual cooperation with flexible timeline.",
  },
  "Moderate / Expectant": {
    id: "Moderate / Expectant",
    label: "Moderate / Expectant",
    desc: "Standard business expectation. Requests fair resolution within 5-7 business days.",
    badgeColor: "bg-blue-50 text-blue-800 border-blue-200",
    effect: "Specifies a standard 5-7 business day reply window.",
  },
  "Firm / Insistent": {
    id: "Firm / Insistent",
    label: "Firm / Insistent",
    desc: "Decisive and clear. Mentions escalation to management or payment provider dispute.",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    effect: "Establishes a firm 5-day deadline and cites potential financial escalation.",
  },
  "Escalated / Final Notice": {
    id: "Escalated / Final Notice",
    label: "Escalated / Final Notice",
    desc: "Formal final demand. Sets 72-hour / 3-day deadline before filing with BBB, CFPB, or legal avenues.",
    badgeColor: "bg-rose-50 text-rose-800 border-rose-200",
    effect: "Explicitly references regulatory bodies (CFPB/BBB), chargebacks, and legal remedies.",
  },
};

export const COMMON_MAJOR_CONCERNS: string[] = [
  "Financial loss and unauthorized deduction of hard-earned funds",
  "Product malfunction poses a safety, fire, or health hazard",
  "Repeated broken promises, unreturned calls, or ignored support tickets",
  "Misleading advertising or failure to honor stated return/warranty policy",
  "Significant personal/professional disruption caused by unfulfilled service",
  "Risk of wrongful negative reporting on personal credit score",
  "Unreasonable delay exceeding acceptable business standards",
];

export const SAMPLE_SCENARIOS: SampleScenario[] = [
  {
    id: "airline-delay",
    title: "Airline Cancelled Flight & Refused Cash Refund",
    tag: "Refund Request",
    data: {
      letterType: "refund",
      tone: "Assertive & Direct",
      formality: "Formal Legal/Executive",
      length: "Standard (3-4 Paragraphs)",
      firmness: "Firm / Insistent",
      companyName: "Skyline Airlines",
      issueSummary: "Flight cancellation due to airline scheduling; voucher offered instead of cash refund",
      userDescription:
        "My flight from Chicago to Seattle (Flight SK-492) was abruptly cancelled by Skyline Airlines 3 hours prior to departure due to crew scheduling. An agent told me they could only give a travel credit valid for 1 year. Under Department of Transportation rules, passengers are legally entitled to a full cash refund to the original payment method when the airline cancels a flight.",
      desiredResolution: "Full cash refund of $485.50 to original credit card",
      majorConcern: "Financial loss and non-compliance with DOT federal passenger refund regulations",
      relevantDetails: {
        orderNumber: "PNR: #SK9482X",
        incidentDate: "October 14, 2025",
        amount: "$485.50 USD",
        evidence: "Booking receipt, official cancellation SMS, flight schedule alert",
        contactHistory: "Spoke with airport gate agent; submitted online ticket #884192 on Oct 15",
      },
      customerName: "Alex Morgan",
      customerContact: "alex.morgan@example.com | (555) 349-8821",
    },
  },
  {
    id: "defective-appliance",
    title: "Brand New Refrigerator Compressor Failure Under Warranty",
    tag: "Warranty Claim",
    data: {
      letterType: "warranty",
      tone: "Professional & Objective",
      formality: "Standard Business",
      length: "Standard (3-4 Paragraphs)",
      firmness: "Moderate / Expectant",
      companyName: "Apex Home Appliances",
      issueSummary: "Refrigerator stopped cooling 4 weeks after purchase; compressor humming loudly",
      userDescription:
        "I purchased an Apex French-Door Refrigerator model AF-900 less than a month ago. Two days ago, the refrigerator and freezer compartments stopped cooling completely, spoiling over $250 worth of groceries. When I called your certified service hotline, I was told a technician cannot visit for another 3 weeks. A refrigerator is an essential household necessity.",
      desiredResolution: "Urgent warranty repair within 48 hours or complete unit replacement plus grocery loss credit",
      majorConcern: "Product failure of essential appliance and unreasonable service delay causing health and food spoilage",
      relevantDetails: {
        orderNumber: "INV-2025-99381 (Serial: #APX-488210)",
        incidentDate: "November 2, 2025",
        amount: "$1,499.00 purchase price + $250 spoiled food",
        evidence: "Store receipt, serial number photo, photos of spoiled food items",
        contactHistory: "Called support line twice; ticket #TCK-48190 opened on Nov 3",
      },
      customerName: "Taylor Chen",
      customerContact: "taylor.chen@example.com | (555) 712-4091",
    },
  },
  {
    id: "unauthorized-gym-charge",
    title: "Recurring Gym Membership Billed After Cancellation",
    tag: "Billing Dispute",
    data: {
      letterType: "billing",
      tone: "Stern & Disappointed",
      formality: "Formal Legal/Executive",
      length: "Concise (1-2 Paragraphs)",
      firmness: "Escalated / Final Notice",
      companyName: "FitCore Health Clubs",
      issueSummary: "Charged monthly dues of $89.00 two months after certified cancellation was acknowledged",
      userDescription:
        "I cancelled my FitCore membership in person and by signed certified letter on August 15, paying the final pro-rated month as agreed. The club manager confirmed my cancellation in writing. Despite this, my card was charged $89.00 on September 1 and again on October 1. The local front desk refuses to issue a refund and claimed the cancellation was 'lost in the system'.",
      desiredResolution: "Immediate refund of $178.00 (two unauthorized $89 charges) and permanent deletion of card details",
      majorConcern: "Unauthorized recurring financial charges and refusal to honor confirmed cancellation contract",
      relevantDetails: {
        orderNumber: "Member ID: #FC-772910",
        incidentDate: "September 1 & October 1, 2025",
        amount: "$178.00 ($89 x 2 charges)",
        evidence: "Signed cancellation receipt dated Aug 15, email confirmation from manager, bank statements",
        contactHistory: "Visited branch on Sept 5; emailed billing@fitcore.com on Sept 18 with no response",
      },
      customerName: "Jordan Bailey",
      customerContact: "jordan.b@example.com | (555) 830-1922",
    },
  },
  {
    id: "damaged-package",
    title: "Cracked Ceramic Dinnerware Set Delivered Damaged",
    tag: "Return / Exchange",
    data: {
      letterType: "return",
      tone: "Cooperative & Polite",
      formality: "Standard Business",
      length: "Concise (1-2 Paragraphs)",
      firmness: "Moderate / Expectant",
      companyName: "Artisan Living Goods",
      issueSummary: "16-piece dinnerware set arrived with 4 shattered plates and torn exterior packaging",
      userDescription:
        "My order of the 16-Piece Stoneware Dinnerware Set arrived yesterday. The exterior delivery box was crushed on one side with inadequate protective bubble wrap, resulting in four dinner plates completely shattered into sharp shards. The remaining items are in good condition.",
      desiredResolution: "Prepaid replacement of the 4 broken plates or an exchange for an unbroken set with extra padding",
      majorConcern: "Damaged fragile merchandise delivered due to insufficient shipping packaging",
      relevantDetails: {
        orderNumber: "Order #ALG-8392104",
        incidentDate: "December 8, 2025",
        amount: "$165.00 total order value",
        evidence: "Photographs of damaged exterior box, cracked plates, and shipping label attached",
        contactHistory: "First contact via this correspondence",
      },
      customerName: "Sam Rivera",
      customerContact: "sam.rivera@example.com | (555) 441-2098",
    },
  },
];

export const INITIAL_FORM_DATA: LetterFormData = {
  letterType: "refund",
  tone: "Professional & Objective",
  formality: "Standard Business",
  length: "Standard (3-4 Paragraphs)",
  firmness: "Moderate / Expectant",
  companyName: "",
  issueSummary: "",
  userDescription: "",
  desiredResolution: "",
  majorConcern: "",
  relevantDetails: {
    orderNumber: "",
    incidentDate: "",
    amount: "",
    evidence: "",
    contactHistory: "",
  },
  customerName: "",
  customerContact: "",
};
