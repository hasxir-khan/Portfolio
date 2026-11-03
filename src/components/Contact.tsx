import React, { useState, useEffect } from 'react';
import { BRAND } from '../constants/portfolioData.ts';
import { InquiryFormData, ProjectType } from '../types/index.ts';
import {
  validateInquiryForm,
  createWhatsAppUrl,
  createMailtoUrl,
  formatInquiryMessage,
  VALID_PROJECT_TYPES,
  WHATSAPP_DISPLAY_NUMBER,
  CONTACT_EMAIL,
  FACEBOOK_URL,
} from '../utils/inquiry.ts';
import {
  MessageSquare,
  Mail,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
  Phone,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState<InquiryFormData>({
    name: '',
    email: '',
    projectType: 'Full-Stack Web Application',
    budget: '',
    description: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof InquiryFormData, string>>>({});
  const [copied, setCopied] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  useEffect(() => {
    const handleServiceSelect = (e: Event) => {
      const customEvent = e as CustomEvent<{ service: string }>;
      const title = customEvent.detail?.service;
      if (!title) return;

      if (title.includes('Full-Stack')) {
        setFormData((prev) => ({ ...prev, projectType: 'Full-Stack Web Application' }));
      } else if (title.includes('AI Development')) {
        setFormData((prev) => ({ ...prev, projectType: 'AI Agent / Chatbot' }));
      } else if (title.includes('Hosting')) {
        setFormData((prev) => ({ ...prev, projectType: 'Hosting & Deployment' }));
      } else if (title.includes('Custom')) {
        setFormData((prev) => ({ ...prev, projectType: 'Custom Digital Solution' }));
      }
    };

    window.addEventListener('select-service', handleServiceSelect);
    return () => window.removeEventListener('select-service', handleServiceSelect);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof InquiryFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    setAttemptedSubmit(true);
    const result = validateInquiryForm(formData);
    setErrors(result.errors);
    return result.isValid;
  };

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const url = createWhatsAppUrl(formData);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const url = createMailtoUrl(formData);
    window.location.href = url;
  };

  const handleCopyInquiry = async () => {
    if (!validate()) return;
    const text = formatInquiryMessage(formData);
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        throw new Error('Clipboard API unavailable');
      }
    } catch {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      } catch {
        // Safe silent recovery
      }
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="contact" className="py-20 sm:py-28 border-b border-[#242424] bg-[#090909]">
      <div className="site-container">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-12 pb-5 border-b border-[#1A1A1A]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#888888] font-heading">
              Initiate Project Discussion
            </span>
            <h2 className="mt-1.5 text-[clamp(2rem,3vw,2.5rem)] font-semibold font-heading text-white tracking-tight">
              Have a Project in Mind?
            </h2>
          </div>
          <div className="text-xs text-[#737373] font-medium font-heading">
            Direct Response &bull; WhatsApp &amp; Email
          </div>
        </div>

        <p className="text-[16px] sm:text-[17px] text-[#A3A3A3] max-w-3xl mb-10 leading-[1.7] font-normal">
          Let&apos;s discuss your idea and explore how we can turn it into a functional digital solution. Fill out the project parameters below to dispatch directly via WhatsApp or Email.
        </p>

        {/* Split Studio Form & Direct Channels Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Studio Inquiry Form */}
          <div className="lg:col-span-7 bg-[#111111] border border-[#202020] rounded-lg p-7 sm:p-8">
            <div className="pb-4 mb-6 border-b border-[#1A1A1A]">
              <h3 className="text-base font-semibold font-heading text-white">
                Project Inquiry Parameters
              </h3>
              <p className="text-xs text-[#737373] mt-1 font-normal">
                All inquiries reviewed personally by Hashir Khan
              </p>
            </div>

            <form noValidate className="space-y-5">
              
              {/* Name Field */}
              <div>
                <label
                  htmlFor="inquiry-name"
                  className="block text-xs font-medium uppercase tracking-wider text-[#A3A3A3] mb-1.5"
                >
                  Client / Company Name <span className="text-red-400">*</span>
                </label>
                <input
                  id="inquiry-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Alex Walker or Studio Inc."
                  className={`w-full px-4 py-2.5 bg-[#0C0C0C] border rounded-md text-sm text-white placeholder-[#444444] focus:outline-none focus:ring-1 transition-colors ${
                    errors.name
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-[#242424] focus:border-[#555555] focus:ring-[#555555]'
                  }`}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="inquiry-email"
                  className="block text-xs font-medium uppercase tracking-wider text-[#A3A3A3] mb-1.5"
                >
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  id="inquiry-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g., alex@example.com"
                  className={`w-full px-4 py-2.5 bg-[#0C0C0C] border rounded-md text-sm text-white placeholder-[#444444] focus:outline-none focus:ring-1 transition-colors ${
                    errors.email
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-[#242424] focus:border-[#555555] focus:ring-[#555555]'
                  }`}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* Project Type & Budget Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="inquiry-projectType"
                    className="block text-xs font-medium uppercase tracking-wider text-[#A3A3A3] mb-1.5"
                  >
                    Project Type <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="inquiry-projectType"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-[#0C0C0C] border border-[#242424] rounded-md text-sm text-white focus:outline-none focus:border-[#555555] focus:ring-1 focus:ring-[#555555] transition-colors"
                  >
                    {VALID_PROJECT_TYPES.map((type) => (
                      <option key={type} value={type} className="bg-[#151515] text-white">
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="inquiry-budget"
                    className="block text-xs font-medium uppercase tracking-wider text-[#A3A3A3] mb-1.5"
                  >
                    Estimated Budget <span className="text-[#555555] font-normal">(Optional)</span>
                  </label>
                  <input
                    id="inquiry-budget"
                    type="text"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="e.g., $1,000 - $3,000 USD"
                    className="w-full px-4 py-2.5 bg-[#0C0C0C] border border-[#242424] rounded-md text-sm text-white placeholder-[#444444] focus:outline-none focus:border-[#555555] focus:ring-1 focus:ring-[#555555] transition-colors"
                  />
                </div>
              </div>

              {/* Description Field */}
              <div>
                <label
                  htmlFor="inquiry-description"
                  className="block text-xs font-medium uppercase tracking-wider text-[#A3A3A3] mb-1.5"
                >
                  Project Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="inquiry-description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Outline your application goals, target features, timelines, or specific API integrations..."
                  className={`w-full px-4 py-2.5 bg-[#0C0C0C] border rounded-md text-sm text-white placeholder-[#444444] focus:outline-none focus:ring-1 transition-colors ${
                    errors.description
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-[#242424] focus:border-[#555555] focus:ring-[#555555]'
                  }`}
                  aria-invalid={!!errors.description}
                  aria-describedby={errors.description ? 'desc-error' : undefined}
                />
                {errors.description && (
                  <p id="desc-error" className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.description}</span>
                  </p>
                )}
              </div>

              {/* Error Summary Banner */}
              {attemptedSubmit && Object.keys(errors).length > 0 && (
                <div className="p-3 bg-red-950/40 border border-red-900/60 rounded text-xs text-red-300">
                  Please correct the highlighted fields above before dispatching your inquiry.
                </div>
              )}

              {/* Dual Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleSendWhatsApp}
                  className="group flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-black bg-[#E5E5E5] hover:bg-white hover:shadow-lg hover:shadow-white/10 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111] transition-all duration-200 ease-out rounded-md font-heading cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600 transition-transform duration-200 ease-out group-hover:scale-110" />
                  <span>Send via WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendEmail}
                  className="group flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-[#E5E5E5] bg-[#161616] hover:bg-[#1E1E1E] hover:border-[#404040] hover:text-white hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111] border border-[#282828] transition-all duration-200 ease-out rounded-md font-heading cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-white transition-transform duration-200 ease-out group-hover:scale-110" />
                  <span>Send via Email</span>
                </button>
              </div>

              {/* Copy Inquiry Action */}
              <div className="pt-2 flex items-center justify-between text-xs text-[#666666]">
                <span>Prefers direct message copy?</span>
                <button
                  type="button"
                  onClick={handleCopyInquiry}
                  className="group inline-flex items-center gap-1.5 text-xs text-[#A3A3A3] hover:text-white hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 ease-out cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 rounded"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Inquiry Copied to Clipboard</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 transition-transform duration-200 ease-out group-hover:rotate-6" />
                      <span>Copy Formatted Inquiry</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* Right Column: Direct Studio Channels */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-[#111111] border border-[#202020] rounded-lg p-7 sm:p-8 space-y-5">
              <div className="pb-4 border-b border-[#1A1A1A]">
                <h3 className="text-base font-semibold font-heading text-white">
                  Direct Studio Communications
                </h3>
                <p className="text-xs text-[#737373] mt-1 font-normal">
                  Official HasDevs channels
                </p>
              </div>

              <div className="space-y-3">
                {/* WhatsApp Direct */}
                <a
                  href={BRAND.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-md bg-[#161616] hover:bg-[#1A1A1A] border border-[#242424] hover:border-[#404040] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] flex items-center justify-between group transition-all duration-200 ease-out block cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-[#0E0E0E] text-emerald-400 group-hover:scale-105 transition-transform duration-200">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-[#666666] font-medium">
                        Direct WhatsApp
                      </div>
                      <div className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                        {WHATSAPP_DISPLAY_NUMBER}
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[#555555] group-hover:text-white transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>

                {/* Email Direct */}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="p-4 rounded-md bg-[#161616] hover:bg-[#1A1A1A] border border-[#242424] hover:border-[#404040] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] flex items-center justify-between group transition-all duration-200 ease-out block cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-[#0E0E0E] text-[#E5E5E5] group-hover:scale-105 transition-transform duration-200">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-[#666666] font-medium">
                        Direct Email
                      </div>
                      <div className="text-sm font-semibold text-white group-hover:text-white transition-colors">
                        {CONTACT_EMAIL}
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[#555555] group-hover:text-white transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>

                {/* Facebook Profile */}
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-md bg-[#161616] hover:bg-[#1A1A1A] border border-[#242424] hover:border-[#404040] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] flex items-center justify-between group transition-all duration-200 ease-out block cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-[#0E0E0E] text-[#A3A3A3] group-hover:scale-105 transition-transform duration-200">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-[#666666] font-medium">
                        Official Social Page
                      </div>
                      <div className="text-sm font-semibold text-white group-hover:text-white transition-colors">
                        Facebook Profile
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[#555555] group-hover:text-white transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>

            {/* Confidentiality & Direct Response Guarantee */}
            <div className="bg-[#111111] border border-[#202020] rounded-lg p-5 text-xs text-[#888888] space-y-2">
              <div className="flex items-center gap-2 text-white font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-heading">Confidentiality &amp; Direct Engagement</span>
              </div>
              <p className="leading-relaxed font-normal">
                Project inquiries receive an individual response directly from Hashir Khan. All shared concepts, architectural specs, and client requirements remain strictly confidential under professional non-disclosure standards.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
