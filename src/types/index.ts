export type ProjectType =
  | 'Full-Stack Web Application'
  | 'Website Development'
  | 'AI Agent / Chatbot'
  | 'AI Automation'
  | 'Hosting & Deployment'
  | 'Custom Digital Solution'
  | 'Other';

export interface InquiryFormData {
  name: string;
  email: string;
  projectType: ProjectType;
  budget?: string;
  description: string;
}

export interface LeadInquiryData {
  clientName: string;
  email: string;
  whatsapp?: string;
  projectType: string;
  projectDescription: string;
  requiredFeatures?: string;
  estimatedBudget?: string;
  expectedTimeline?: string;
  consentGiven: boolean;
  createdAt?: string;
}

export interface InquiryValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof InquiryFormData, string>>;
}

export interface SkillCategory {
  id: string;
  category: string;
  description: string;
  items: string[];
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  summary: string;
  features: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  techStack: string[];
  status: 'In Development' | 'Client Handover' | 'Architecture Finalized';
  isPrivateClient?: boolean;
  features: string[];
  githubUrl?: string | null;
  demoUrl?: string | null;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
  deliverable: string;
}
