import type { InquiryFormData, InquiryValidationResult, ProjectType } from '../types/index.ts';

export const WHATSAPP_PHONE_NUMBER = '923169896229';
export const WHATSAPP_DISPLAY_NUMBER = '+923169896229';
export const CONTACT_EMAIL = 'hasdeves@gmail.com';
export const FACEBOOK_URL = 'https://www.facebook.com/share/1FoEqAqXhY/';

export const VALID_PROJECT_TYPES: ProjectType[] = [
  'Full-Stack Web Application',
  'Website Development',
  'AI Agent / Chatbot',
  'AI Automation',
  'Hosting & Deployment',
  'Custom Digital Solution',
  'Other',
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates the project inquiry form fields strictly.
 */
export function validateInquiryForm(data: Partial<InquiryFormData>): InquiryValidationResult {
  const errors: Partial<Record<keyof InquiryFormData, string>> = {};

  const name = (data.name || '').trim();
  if (!name) {
    errors.name = 'Please enter your name or company name.';
  } else if (name.length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  } else if (name.length > 100) {
    errors.name = 'Name cannot exceed 100 characters.';
  }

  const email = (data.email || '').trim();
  if (!email) {
    errors.email = 'Please provide an email address where I can reach you.';
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Please enter a valid email address (e.g., name@example.com).';
  }

  const projectType = data.projectType;
  if (!projectType || !VALID_PROJECT_TYPES.includes(projectType)) {
    errors.projectType = 'Please select a valid project category.';
  }

  const description = (data.description || '').trim();
  if (!description) {
    errors.description = 'Please describe your project, objectives, or requirements.';
  } else if (description.length < 15) {
    errors.description = 'Please provide at least 15 characters describing your project.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Generates a clean, human-readable inquiry message.
 */
export function formatInquiryMessage(data: InquiryFormData): string {
  const lines: string[] = [
    'Hello Hashir, I have a project inquiry for HasDevs:',
    '',
    `• Client Name: ${data.name.trim()}`,
    `• Email: ${data.email.trim()}`,
    `• Project Type: ${data.projectType}`,
  ];

  if (data.budget && data.budget.trim()) {
    lines.push(`• Estimated Budget: ${data.budget.trim()}`);
  }

  lines.push('');
  lines.push('• Project Description:');
  lines.push(data.description.trim());
  lines.push('');
  lines.push('Looking forward to your response.');

  return lines.join('\n');
}

/**
 * Constructs a direct WhatsApp URL with the pre-filled inquiry text.
 */
export function createWhatsAppUrl(data: InquiryFormData): string {
  const message = formatInquiryMessage(data);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encoded}`;
}

/**
 * Constructs a standard mailto URL with pre-filled subject and body.
 */
export function createMailtoUrl(data: InquiryFormData): string {
  const subject = `Project Inquiry: ${data.projectType} - ${data.name.trim()}`;
  const body = formatInquiryMessage(data);
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
