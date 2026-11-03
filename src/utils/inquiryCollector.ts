import type { LeadInquiryData } from '../types/index.ts';

export const WHATSAPP_RECIPIENT_NUMBER = '923169896229';
export const WHATSAPP_DISPLAY_NUMBER = '+923169896229';
export const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_RECIPIENT_NUMBER}`;

export const PROJECT_TYPE_OPTIONS = [
  'Full-Stack Web Application',
  'AI Agent / Chatbot',
  'Website Development',
  'AI Automation & Workflows',
  'Hosting & Deployment Setup',
  'Custom Digital Solution'
] as const;

export const BUDGET_OPTIONS = [
  '< $1,000',
  '$1,000 - $3,000',
  '$3,000 - $5,000',
  '$5,000+',
  'Flexible / To be scoped'
] as const;

export const TIMELINE_OPTIONS = [
  '< 2 weeks',
  '2 - 4 weeks',
  '1 - 2 months',
  'Flexible timeline'
] as const;

export interface InquiryStepConfig {
  id: keyof LeadInquiryData | 'review' | 'submitted';
  stepNumber: number;
  totalSteps: number;
  question: string;
  fieldLabel: string;
  placeholder?: string;
  helpText?: string;
  isOptional: boolean;
  quickOptions?: readonly string[];
}

export const INQUIRY_STEPS: InquiryStepConfig[] = [
  {
    id: 'clientName',
    stepNumber: 1,
    totalSteps: 8,
    question: "What is your name or company name?",
    fieldLabel: 'Client Name',
    placeholder: 'e.g. Alex Rivera or Acme Corp',
    helpText: 'Required so Hashir knows who he is speaking with.',
    isOptional: false
  },
  {
    id: 'email',
    stepNumber: 2,
    totalSteps: 8,
    question: "What is the best email address to contact you at?",
    fieldLabel: 'Email Address',
    placeholder: 'e.g. alex@example.com',
    helpText: 'Required for sending scope documents, proposals, and updates.',
    isOptional: false
  },
  {
    id: 'whatsapp',
    stepNumber: 3,
    totalSteps: 8,
    question: "What is your WhatsApp number? (Optional)",
    fieldLabel: 'WhatsApp Number',
    placeholder: 'e.g. +1 555 123 4567 or leave blank',
    helpText: 'Optional. Helpful for quick direct coordination.',
    isOptional: true
  },
  {
    id: 'projectType',
    stepNumber: 4,
    totalSteps: 8,
    question: "What type of project would you like to build?",
    fieldLabel: 'Project Type',
    placeholder: 'Select a category below or type custom',
    helpText: 'Required. Choose the primary focus of your project.',
    isOptional: false,
    quickOptions: PROJECT_TYPE_OPTIONS
  },
  {
    id: 'projectDescription',
    stepNumber: 5,
    totalSteps: 8,
    question: "Please describe your project, goals, or core problem to solve:",
    fieldLabel: 'Project Description',
    placeholder: 'Describe your concept, target audience, or primary use cases (min 15 characters)...',
    helpText: 'Required. The more detail you share, the faster we can estimate scope.',
    isOptional: false
  },
  {
    id: 'requiredFeatures',
    stepNumber: 6,
    totalSteps: 8,
    question: "Are there specific features or integrations required? (Optional)",
    fieldLabel: 'Required Features',
    placeholder: 'e.g. User auth, Stripe payments, Gemini AI, dashboard, PDF export...',
    helpText: 'Optional. Leave blank or skip if you want to scope this together.',
    isOptional: true,
    quickOptions: ['User Auth & Roles', 'AI Chatbot / Agent', 'Payment Gateway', 'API Integrations', 'Discuss during scoping']
  },
  {
    id: 'estimatedBudget',
    stepNumber: 7,
    totalSteps: 8,
    question: "What is your estimated budget range? (Optional)",
    fieldLabel: 'Estimated Budget',
    placeholder: 'Select a range or enter custom figure',
    helpText: 'Optional. Helps tailor the technical architecture to your budget.',
    isOptional: true,
    quickOptions: BUDGET_OPTIONS
  },
  {
    id: 'expectedTimeline',
    stepNumber: 8,
    totalSteps: 8,
    question: "What is your target launch timeline? (Optional)",
    fieldLabel: 'Expected Timeline',
    placeholder: 'Select a timeline or enter specific target date',
    helpText: 'Optional. Helps schedule availability and development sprints.',
    isOptional: true,
    quickOptions: TIMELINE_OPTIONS
  }
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateClientName(name: string): { valid: boolean; error?: string } {
  const trimmed = (name || '').trim();
  if (!trimmed) {
    return { valid: false, error: 'Please enter your name or company name.' };
  }
  if (trimmed.length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters long.' };
  }
  if (trimmed.length > 100) {
    return { valid: false, error: 'Name cannot exceed 100 characters.' };
  }
  return { valid: true };
}

export function validateEmail(email: string): { valid: boolean; error?: string } {
  const trimmed = (email || '').trim();
  if (!trimmed) {
    return { valid: false, error: 'Please provide a valid email address.' };
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return { valid: false, error: 'Please enter a valid email format (e.g., name@example.com).' };
  }
  if (trimmed.length > 120) {
    return { valid: false, error: 'Email cannot exceed 120 characters.' };
  }
  return { valid: true };
}

export function validateWhatsAppNumber(phone?: string): { valid: boolean; error?: string } {
  const trimmed = (phone || '').trim();
  if (!trimmed) {
    return { valid: true }; // optional
  }
  const digitsOnly = trimmed.replace(/[^0-9]/g, '');
  if (digitsOnly.length < 7 || digitsOnly.length > 16) {
    return { valid: false, error: 'Please enter a valid phone number (7 to 16 digits) or skip.' };
  }
  return { valid: true };
}

export function validateProjectType(type: string): { valid: boolean; error?: string } {
  const trimmed = (type || '').trim();
  if (!trimmed) {
    return { valid: false, error: 'Please select or specify a project type.' };
  }
  if (trimmed.length < 3) {
    return { valid: false, error: 'Project type must be at least 3 characters.' };
  }
  return { valid: true };
}

export function validateProjectDescription(desc: string): { valid: boolean; error?: string } {
  const trimmed = (desc || '').trim();
  if (!trimmed) {
    return { valid: false, error: 'Please provide a brief description of your project.' };
  }
  if (trimmed.length < 15) {
    return { valid: false, error: 'Please provide at least 15 characters describing what you want to build.' };
  }
  if (trimmed.length > 3000) {
    return { valid: false, error: 'Description is too long (maximum 3000 characters).' };
  }
  return { valid: true };
}

/**
 * Validates the full inquiry before submission or WhatsApp link generation.
 */
export function validateFullInquiry(data: Partial<LeadInquiryData>): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  const nameCheck = validateClientName(data.clientName || '');
  if (!nameCheck.valid && nameCheck.error) errors.clientName = nameCheck.error;

  const emailCheck = validateEmail(data.email || '');
  if (!emailCheck.valid && emailCheck.error) errors.email = emailCheck.error;

  const phoneCheck = validateWhatsAppNumber(data.whatsapp);
  if (!phoneCheck.valid && phoneCheck.error) errors.whatsapp = phoneCheck.error;

  const typeCheck = validateProjectType(data.projectType || '');
  if (!typeCheck.valid && typeCheck.error) errors.projectType = typeCheck.error;

  const descCheck = validateProjectDescription(data.projectDescription || '');
  if (!descCheck.valid && descCheck.error) errors.projectDescription = descCheck.error;

  if (!data.consentGiven) {
    errors.consent = 'Explicit consent is required to submit personal contact details.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Generates the standard WhatsApp inquiry message matching the exact required format:
 *
 * NEW HASDEVS PROJECT INQUIRY
 *
 * Client Name: [Name]
 * Email: [Email]
 * WhatsApp: [WhatsApp or "Not provided"]
 * Project Type: [Project Type]
 * Project Description: [Description]
 * Required Features: [Features or "Discuss during scoping"]
 * Estimated Budget: [Budget or "Not specified"]
 * Expected Timeline: [Timeline or "Flexible"]
 */
export function formatWhatsAppInquiryMessage(data: LeadInquiryData): string {
  const clientName = (data.clientName || '').trim() || 'Not provided';
  const email = (data.email || '').trim() || 'Not provided';
  const whatsapp = (data.whatsapp || '').trim() || 'Not provided';
  const projectType = (data.projectType || '').trim() || 'Custom Project';
  const projectDescription = (data.projectDescription || '').trim() || 'To be discussed';
  const requiredFeatures = (data.requiredFeatures || '').trim() || 'Discuss during scoping';
  const estimatedBudget = (data.estimatedBudget || '').trim() || 'Not specified';
  const expectedTimeline = (data.expectedTimeline || '').trim() || 'Flexible';

  return [
    'NEW HASDEVS PROJECT INQUIRY',
    '',
    `Client Name: ${clientName}`,
    `Email: ${email}`,
    `WhatsApp: ${whatsapp}`,
    `Project Type: ${projectType}`,
    `Project Description: ${projectDescription}`,
    `Required Features: ${requiredFeatures}`,
    `Estimated Budget: ${estimatedBudget}`,
    `Expected Timeline: ${expectedTimeline}`
  ].join('\n');
}

export const EMAIL_RECIPIENT = 'hasdeves@gmail.com';

/**
 * Generates the full URL-encoded WhatsApp link for Hashir Khan (+923169896229).
 */
export function buildWhatsAppInquiryUrl(data: LeadInquiryData): string {
  const message = formatWhatsAppInquiryMessage(data);
  const encodedMessage = encodeURIComponent(message);
  return `${WHATSAPP_BASE_URL}?text=${encodedMessage}`;
}

/**
 * Generates the email subject line for the inquiry.
 */
export function formatEmailSubject(data: LeadInquiryData): string {
  const name = (data.clientName || '').trim() || 'Prospective Client';
  const type = (data.projectType || '').trim() || 'Project Inquiry';
  return `HasDevs Project Inquiry: ${type} - ${name}`;
}

/**
 * Generates a prefilled mailto: link for sending via client's default email app.
 */
export function buildEmailInquiryUrl(data: LeadInquiryData): string {
  const subject = formatEmailSubject(data);
  const body = formatWhatsAppInquiryMessage(data);
  return `mailto:${EMAIL_RECIPIENT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

