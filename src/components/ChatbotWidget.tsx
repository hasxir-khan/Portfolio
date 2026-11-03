import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Minus,
  Send,
  Sparkles,
  RotateCcw,
  ExternalLink,
  MessageCircle,
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileText,
  Edit2,
  Check,
  Copy
} from 'lucide-react';

import { Logo } from './Logo.tsx';
import { BRAND } from '../constants/portfolioData.ts';
import type { LeadInquiryData } from '../types/index.ts';

import {
  INQUIRY_STEPS,
  validateClientName,
  validateEmail,
  validateWhatsAppNumber,
  validateProjectType,
  validateProjectDescription,
  validateFullInquiry,
  buildWhatsAppInquiryUrl,
  buildEmailInquiryUrl,
  formatWhatsAppInquiryMessage,
  WHATSAPP_DISPLAY_NUMBER,
  EMAIL_RECIPIENT
} from '../utils/inquiryCollector.ts';


interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  leadAction?: {
    type: 'whatsapp' | 'email' | 'contact_form' | 'start_inquiry';
    label: string;
    url?: string;
  };
}

const SUGGESTED_QUESTIONS = [
  'Start Project Inquiry',
  'What services do you offer?',
  'Can you build an AI chatbot?',
  'How does your development process work?'
];

const INITIAL_WELCOME: Message = {
  id: 'welcome',
  role: 'assistant',
  text: "Hi! Welcome to HasDevs. I'm your virtual assistant. How can I help you today? You can ask any question, or start a guided project inquiry anytime.",
  timestamp: 'Just now',
  leadAction: {
    type: 'start_inquiry',
    label: 'Start Project Inquiry'
  }
};

const INITIAL_LEAD_DATA: LeadInquiryData = {
  clientName: '',
  email: '',
  whatsapp: '',
  projectType: '',
  projectDescription: '',
  requiredFeatures: '',
  estimatedBudget: '',
  expectedTimeline: '',
  consentGiven: false
};

export const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'chat' | 'inquiry'>('chat');
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([INITIAL_WELCOME]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isBackendOnline, setIsBackendOnline] = useState<boolean | null>(null);
  const [hasPromptBadge, setHasPromptBadge] = useState(true);
  const [logoError, setLogoError] = useState(false);


  // Guided Inquiry state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [leadData, setLeadData] = useState<LeadInquiryData>(INITIAL_LEAD_DATA);
  const [stepInputValue, setStepInputValue] = useState('');
  const [stepError, setStepError] = useState<string | null>(null);
  const [inquirySubStage, setInquirySubStage] = useState<'collecting' | 'review' | 'submitted'>('collecting');
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);
  const [hasCopiedText, setHasCopiedText] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    whatsappUrl: string;
    emailUrl: string;
    formattedMessage: string;
    message: string;
  } | null>(null);


  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const stepInputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Check backend availability on mount
  useEffect(() => {
    let isMounted = true;
    fetch('/api/health')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Health check failed');
      })
      .then((data) => {
        if (isMounted) {
          setIsBackendOnline(data.status === 'ok');
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsBackendOnline(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Scroll to bottom when messages update in chat mode
  useEffect(() => {
    if (isOpen && mode === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen, mode]);

  // Focus input when opened or when step changes
  useEffect(() => {
    if (isOpen) {
      setHasPromptBadge(false);
      const timer = setTimeout(() => {
        if (mode === 'chat') {
          inputRef.current?.focus();
        } else if (inquirySubStage === 'collecting') {
          stepInputRef.current?.focus();
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen, mode, currentStepIndex, inquirySubStage]);

  // Sync step input value whenever active step changes
  useEffect(() => {
    if (mode === 'inquiry' && inquirySubStage === 'collecting') {
      const step = INQUIRY_STEPS[currentStepIndex];
      if (step) {
        const val = leadData[step.id as keyof LeadInquiryData];
        setStepInputValue(typeof val === 'string' ? val : '');
        setStepError(null);
      }
    }
  }, [currentStepIndex, mode, inquirySubStage]);

  // Handle freeform AI chat message
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    // Check if user specifically requested starting an inquiry
    const lower = text.toLowerCase();
    if (
      lower === 'start project inquiry' ||
      lower === 'start inquiry' ||
      lower === 'start a project' ||
      lower.includes('hire hasdevs') ||
      lower.includes('hire hashir')
    ) {
      startInquiryFlow();
      setInputText('');
      return;
    }

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const historyPayload = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.role,
          text: m.text
        }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: text,
          history: historyPayload
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.reply || errorData.error || 'Server error occurred.');
      }

      const data = await response.json();

      const assistantMsg: Message = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        leadAction: data.leadAction
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        text: "I'm having trouble responding right now. Please try again in a moment, start our guided project inquiry, or connect directly via WhatsApp.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        leadAction: {
          type: 'start_inquiry',
          label: 'Start Project Inquiry'
        }
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([INITIAL_WELCOME]);
  };

  const handleInquiryFormJump = () => {
    setIsOpen(false);
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Switch to Inquiry Flow
  const startInquiryFlow = (editField?: keyof LeadInquiryData) => {
    setMode('inquiry');
    if (editField) {
      const index = INQUIRY_STEPS.findIndex((s) => s.id === editField);
      if (index !== -1) {
        setCurrentStepIndex(index);
        setInquirySubStage('collecting');
        return;
      }
    }
    setInquirySubStage('collecting');
    setCurrentStepIndex(0);
    setStepError(null);
  };

  // Step advancement validation
  const handleStepSubmit = (overrideValue?: string) => {
    const step = INQUIRY_STEPS[currentStepIndex];
    if (!step) return;

    const val = (overrideValue !== undefined ? overrideValue : stepInputValue).trim();

    // Validate step based on ID
    if (step.id === 'clientName') {
      const check = validateClientName(val);
      if (!check.valid) {
        setStepError(check.error || 'Please enter your name.');
        return;
      }
    } else if (step.id === 'email') {
      const check = validateEmail(val);
      if (!check.valid) {
        setStepError(check.error || 'Please enter a valid email address.');
        return;
      }
    } else if (step.id === 'whatsapp') {
      const check = validateWhatsAppNumber(val);
      if (!check.valid) {
        setStepError(check.error || 'Please enter a valid phone number or skip.');
        return;
      }
    } else if (step.id === 'projectType') {
      const check = validateProjectType(val);
      if (!check.valid) {
        setStepError(check.error || 'Please select a project type.');
        return;
      }
    } else if (step.id === 'projectDescription') {
      const check = validateProjectDescription(val);
      if (!check.valid) {
        setStepError(check.error || 'Please enter at least 15 characters describing your project.');
        return;
      }
    }

    // Save field value
    setLeadData((prev) => ({
      ...prev,
      [step.id]: val
    }));
    setStepError(null);

    // If at final step, proceed to review
    if (currentStepIndex >= INQUIRY_STEPS.length - 1) {
      setInquirySubStage('review');
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleStepSkip = () => {
    const step = INQUIRY_STEPS[currentStepIndex];
    if (!step || !step.isOptional) return;

    setLeadData((prev) => ({
      ...prev,
      [step.id]: ''
    }));
    setStepError(null);

    if (currentStepIndex >= INQUIRY_STEPS.length - 1) {
      setInquirySubStage('review');
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleStepBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setStepError(null);
    } else {
      setMode('chat');
    }
  };

  const handleCancelInquiry = () => {
    setMode('chat');
    setInquirySubStage('collecting');
    setLeadData(INITIAL_LEAD_DATA);
  };

  const handleCopyInquiryText = async () => {
    if (!submissionResult?.formattedMessage) return;
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(submissionResult.formattedMessage);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = submissionResult.formattedMessage;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setHasCopiedText(true);
      setTimeout(() => setHasCopiedText(false), 2200);
    } catch {
      // Ignore copy error
    }
  };

  const handleConfirmSubmission = async () => {
    const validation = validateFullInquiry(leadData);
    if (!validation.valid) {
      setStepError(validation.errors.consent || 'Please fill in all required fields.');
      return;
    }

    setIsSubmittingInquiry(true);
    setStepError(null);

    const whatsappUrl = buildWhatsAppInquiryUrl(leadData);
    const emailUrl = buildEmailInquiryUrl(leadData);
    const formattedMessage = formatWhatsAppInquiryMessage(leadData);

    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      });
    } catch {
      // Purely client-side generation works reliably even if server is unreachable
    } finally {
      setIsSubmittingInquiry(false);
      setSubmissionResult({
        whatsappUrl,
        emailUrl,
        formattedMessage,
        message: 'Your project inquiry is ready. WhatsApp will open with your message prefilled. Review the details and press Send to contact HasDevs.'
      });
      setInquirySubStage('submitted');
    }
  };


  const currentStep = INQUIRY_STEPS[currentStepIndex];

  return (
    <aside aria-label="HasDevs AI Assistant Widget">
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex items-center gap-3">
          {hasPromptBadge && (
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141414] hover:bg-[#1A1A1A] border border-[#2B2B2B] hover:border-emerald-500/50 hover:scale-[1.02] active:scale-[0.98] text-xs text-white shadow-xl transition-all duration-200 ease-out cursor-pointer font-heading"
            >
              <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>Ask HasDevs AI &bull; Project Inquiries</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#111111] hover:bg-[#161616] border border-[#2A2A2A] hover:border-emerald-500/60 hover:scale-105 active:scale-95 shadow-2xl transition-all duration-200 ease-out cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            aria-label="Open HasDevs AI Assistant"
            aria-expanded={isOpen}
          >
            <span className="absolute inset-0 rounded-full bg-emerald-500/10 scale-95 group-hover:scale-105 transition-transform duration-300"></span>
            <MessageSquare className="w-6 h-6 text-white group-hover:text-emerald-400 transition-colors" />

            {/* Availability Dot */}
            {isBackendOnline !== false && (
              <span
                className="absolute top-1 right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#090909]"
                title="HasDevs Assistant Online"
              />
            )}
          </button>
        </div>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="HasDevs Assistant Chat Window"
          aria-modal="false"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[430px] h-[600px] max-h-[88vh] bg-[#0C0C0C] border border-[#262626] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 font-sans"
        >
          {/* Header with 3 cleanly separated, non-overlapping flex zones */}
          <div className="px-3.5 sm:px-4 py-2.5 sm:py-3 bg-[#111111] border-b border-[#202020] flex items-center justify-between gap-2.5 sm:gap-3 shrink-0 select-none">
            {/* Left & Center Flex Area */}
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
              {/* Left: Dedicated Logo Container */}
              <div
                className="flex-shrink-0 flex items-center justify-center h-7 sm:h-8"
                aria-label="HasDevs Logo"
              >
                {!logoError ? (
                  <img
                    src={BRAND.logoAssetPath}
                    alt="HasDevs Logo"
                    className="h-6 sm:h-7 w-auto max-w-[95px] sm:max-w-[110px] object-contain select-none"
                    onError={() => setLogoError(true)}
                    loading="eager"
                  />
                ) : (
                  <span className="font-heading font-bold text-sm text-white tracking-tight select-none">
                    Has<span className="text-emerald-500">Devs</span>
                  </span>
                )}
              </div>

              {/* Center / Next to logo: Title and Status with clean vertical divider */}
              <div className="min-w-0 flex-1 flex flex-col justify-center border-l border-[#242424] pl-2.5 sm:pl-3">
                <div className="flex items-center min-w-0">
                  <span className="text-[13px] sm:text-sm font-semibold font-heading text-white tracking-tight truncate">
                    HasDevs Assistant
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] min-w-0 mt-0.5">
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-mono font-medium shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Online
                  </span>
                  {mode === 'inquiry' && (
                    <>
                      <span className="text-[#3E3E3E] shrink-0">•</span>
                      <span className="text-[#888888] truncate font-sans">
                        Inquiry Wizard
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Actions Container */}
            <div className="flex-shrink-0 flex items-center gap-1">
              {mode === 'inquiry' && inquirySubStage !== 'submitted' && (
                <button
                  type="button"
                  onClick={handleCancelInquiry}
                  className="px-2.5 py-1 text-[11px] text-[#A0A0A0] hover:text-white hover:bg-[#1C1C1C] border border-transparent hover:border-[#333333] rounded-md transition-all duration-200 ease-out cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400"
                >
                  Exit
                </button>
              )}

              {mode === 'chat' && (
                <button
                  type="button"
                  onClick={handleClearChat}
                  title="Reset conversation"
                  className="p-1.5 text-[#888888] hover:text-white hover:bg-[#1C1C1C] border border-transparent hover:border-[#333333] rounded-md transition-all duration-200 ease-out cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400"
                  aria-label="Clear chat"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Minimize chat"
                className="p-1.5 text-[#888888] hover:text-white hover:bg-[#1C1C1C] border border-transparent hover:border-[#333333] rounded-md transition-all duration-200 ease-out cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400"
                aria-label="Minimize chat"
              >
                <Minus className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 text-[#888888] hover:text-white hover:bg-[#1C1C1C] border border-transparent hover:border-[#333333] rounded-md transition-all duration-200 ease-out cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>


          {/* Mode Switcher Banner (allows instant toggle between AI Chat and Guided Inquiry) */}
          {mode === 'chat' && (
            <div className="px-4 py-2 bg-[#141414] border-b border-[#1E1E1E] flex items-center justify-between text-xs">
              <span className="text-[#888888] text-[11px] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                Planning a new project?
              </span>
              <button
                type="button"
                onClick={() => startInquiryFlow()}
                className="px-2.5 py-1 rounded bg-[#1F1F1F] hover:bg-emerald-600/20 border border-[#333333] hover:border-emerald-500/50 text-white hover:text-emerald-300 text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1"
              >
                <span>Start Inquiry</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* BODY: Mode 1 - Chat */}
          {mode === 'chat' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans flex flex-col justify-between">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.role === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-3.5 py-2.5 leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-[#1C1C1C] border border-[#2B2B2B] text-white'
                          : 'bg-[#131313] border border-[#222222] text-[#D8D8D8]'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>

                      {/* Interactive Actions */}
                      {msg.leadAction && (
                        <div className="mt-2.5 pt-2 border-t border-[#222222] flex flex-wrap gap-2">
                          {msg.leadAction.type === 'start_inquiry' && (
                            <button
                              type="button"
                              onClick={() => startInquiryFlow()}
                              className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 hover:shadow-md hover:shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] text-white font-medium text-[11px] transition-all duration-200 ease-out cursor-pointer"
                            >
                              <FileText className="w-3 h-3" />
                              <span>{msg.leadAction.label}</span>
                              <ArrowRight className="w-2.5 h-2.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
                            </button>
                          )}

                          {msg.leadAction.type === 'whatsapp' && (
                            <a
                              href={msg.leadAction.url || `https://wa.me/923169896229`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 hover:shadow-md hover:shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] text-white font-medium text-[11px] transition-all duration-200 ease-out"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>{msg.leadAction.label}</span>
                              <ExternalLink className="w-2.5 h-2.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={handleInquiryFormJump}
                            className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1F1F1F] hover:bg-[#282828] hover:border-[#404040] hover:text-white hover:scale-[1.02] active:scale-[0.98] text-[#CCCCCC] font-medium text-[11px] border border-[#2F2F2F] transition-all duration-200 ease-out cursor-pointer"
                          >
                            <Mail className="w-3 h-3 transition-transform duration-200 ease-out group-hover:scale-110" />
                            <span>Website Form</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <span className="text-[9px] text-[#555555] mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isLoading && (
                  <div className="flex items-start">
                    <div className="bg-[#131313] border border-[#222222] rounded-lg px-3 py-2 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce"></span>
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce"
                        style={{ animationDelay: '150ms' }}
                      ></span>
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce"
                        style={{ animationDelay: '300ms' }}
                      ></span>
                      <span className="text-[10px] text-[#737373] ml-1 font-mono">
                        HasDevs AI thinking...
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Suggested Questions (shown at conversation start) */}
              {messages.length === 1 && !isLoading && (
                <div className="pt-2 space-y-1.5 mt-auto">
                  <span className="text-[10px] uppercase font-mono text-[#666666] tracking-wider block">
                    Suggested Actions:
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {SUGGESTED_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => {
                          if (q === 'Start Project Inquiry') {
                            startInquiryFlow();
                          } else {
                            handleSendMessage(q);
                          }
                        }}
                        className="text-left px-3 py-2 text-[11px] rounded-md bg-[#131313] hover:bg-[#1C1C1C] border border-[#202020] hover:border-[#383838] text-[#A3A3A3] hover:text-white hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200 ease-out flex items-center justify-between group cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400"
                      >
                        <span className={q === 'Start Project Inquiry' ? 'text-emerald-400 font-medium' : ''}>
                          {q}
                        </span>
                        <ArrowRight className="w-3 h-3 text-[#555555] group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all duration-200 ease-out" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Chat Footer Input */}
          {mode === 'chat' && (
            <div className="p-3 bg-[#111111] border-t border-[#202020] shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question or type 'Start Project Inquiry'..."
                  disabled={isLoading}
                  maxLength={1000}
                  className="flex-1 bg-[#161616] hover:bg-[#181818] border border-[#262626] hover:border-[#383838] focus:border-emerald-500/70 focus:bg-[#161616] rounded-md px-3 py-2 text-xs text-white placeholder-[#666666] focus:outline-none focus:ring-1 focus:ring-emerald-500/40 disabled:opacity-50 transition-all duration-200 ease-out"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isLoading}
                  className="p-2 rounded-md bg-emerald-600 hover:bg-emerald-500 hover:shadow-md hover:shadow-emerald-600/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 text-white disabled:bg-[#1E1E1E] disabled:text-[#555555] disabled:translate-y-0 disabled:shadow-none transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 cursor-pointer disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <Send className="w-3.5 h-3.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
                </button>
              </form>

              <div className="mt-2 flex items-center justify-between text-[9px] text-[#555555]">
                <span>HasDevs Assistant &bull; Virtual Representative</span>
                <span>WhatsApp: {WHATSAPP_DISPLAY_NUMBER}</span>
              </div>
            </div>
          )}

          {/* BODY: Mode 2 - Guided Inquiry Workflow */}
          {mode === 'inquiry' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-[#0C0C0C]">
              {/* SUBSTAGE 1: Step-by-Step Collection */}
              {inquirySubStage === 'collecting' && currentStep && (
                <div className="flex-1 flex flex-col justify-between p-4 overflow-y-auto">
                  <div>
                    {/* Progress Bar & Header */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-[11px] text-[#888888] font-mono mb-1.5">
                        <span className="text-emerald-400 font-semibold">
                          Step {currentStep.stepNumber} of {currentStep.totalSteps}
                        </span>
                        <span>{currentStep.isOptional ? 'Optional' : 'Required'}</span>
                      </div>
                      <div className="w-full h-1 bg-[#1A1A1A] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 transition-all duration-300"
                          style={{
                            width: `${(currentStep.stepNumber / currentStep.totalSteps) * 100}%`
                          }}
                        />
                      </div>
                    </div>

                    {/* Question Card */}
                    <div className="bg-[#121212] border border-[#222222] rounded-lg p-4 space-y-3">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#666666]">
                        {currentStep.fieldLabel}
                      </span>
                      <h3 className="text-sm font-medium text-white leading-snug">
                        {currentStep.question}
                      </h3>
                      {currentStep.helpText && (
                        <p className="text-[11px] text-[#737373] leading-relaxed">
                          {currentStep.helpText}
                        </p>
                      )}

                      {/* Error Alert */}
                      {stepError && (
                        <div className="flex items-center gap-1.5 p-2 rounded bg-rose-950/30 border border-rose-900/50 text-rose-300 text-[11px]">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{stepError}</span>
                        </div>
                      )}

                      {/* Input Field: Textarea for Description, Text for others */}
                      {currentStep.id === 'projectDescription' ? (
                        <div className="space-y-1">
                          <textarea
                            ref={stepInputRef as React.RefObject<HTMLTextAreaElement>}
                            rows={4}
                            value={stepInputValue}
                            onChange={(e) => {
                              setStepInputValue(e.target.value);
                              if (stepError) setStepError(null);
                            }}
                            placeholder={currentStep.placeholder}
                            maxLength={3000}
                            className="w-full bg-[#181818] border border-[#2C2C2C] focus:border-emerald-500/60 rounded-md p-2.5 text-xs text-white placeholder-[#555555] focus:outline-none focus:ring-1 focus:ring-emerald-500/50 resize-none"
                          />
                          <div className="flex justify-between text-[10px] text-[#666666]">
                            <span>Minimum 15 characters</span>
                            <span>{stepInputValue.length} / 3000</span>
                          </div>
                        </div>
                      ) : (
                        <input
                          ref={stepInputRef as React.RefObject<HTMLInputElement>}
                          type={currentStep.id === 'email' ? 'email' : 'text'}
                          value={stepInputValue}
                          onChange={(e) => {
                            setStepInputValue(e.target.value);
                            if (stepError) setStepError(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleStepSubmit();
                            }
                          }}
                          placeholder={currentStep.placeholder}
                          className="w-full bg-[#181818] border border-[#2C2C2C] focus:border-emerald-500/60 rounded-md p-2.5 text-xs text-white placeholder-[#555555] focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                        />
                      )}

                      {/* Quick Choice Chips */}
                      {currentStep.quickOptions && currentStep.quickOptions.length > 0 && (
                        <div className="pt-2">
                          <span className="text-[10px] text-[#666666] block mb-1.5 font-mono">
                            Suggested options:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {currentStep.quickOptions.map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => {
                                  setStepInputValue(opt);
                                  handleStepSubmit(opt);
                                }}
                                className="px-2.5 py-1 text-[11px] rounded bg-[#1B1B1B] hover:bg-[#252525] border border-[#2E2E2E] hover:border-emerald-500/50 text-[#C4C4C4] hover:text-white transition-all cursor-pointer"
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Navigation Actions */}
                  <div className="pt-3 border-t border-[#1C1C1C] flex items-center justify-between gap-2 mt-4">
                    <button
                      type="button"
                      onClick={handleStepBack}
                      className="group px-3 py-2 text-xs rounded bg-[#161616] hover:bg-[#202020] text-[#A0A0A0] hover:text-white border border-[#282828] hover:border-[#383838] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 transition-all duration-200 ease-out flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 ease-out group-hover:-translate-x-0.5" />
                      <span>{currentStepIndex === 0 ? 'Back to Chat' : 'Back'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {currentStep.isOptional && (
                        <button
                          type="button"
                          onClick={handleStepSkip}
                          className="px-3 py-2 text-xs rounded text-[#888888] hover:text-white hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400"
                        >
                          Skip
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleStepSubmit()}
                        className="group px-4 py-2 text-xs rounded font-medium bg-emerald-600 hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-600/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 text-white transition-all duration-200 ease-out flex items-center gap-1.5 cursor-pointer shadow-lg"
                      >
                        <span>{currentStepIndex === INQUIRY_STEPS.length - 1 ? 'Review Inquiry' : 'Continue'}</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBSTAGE 2: Clean Review & Explicit Consent */}
              {inquirySubStage === 'review' && (
                <div className="flex-1 flex flex-col justify-between p-4 overflow-y-auto space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-semibold text-white font-heading">
                          Review Project Inquiry
                        </h3>
                        <p className="text-[11px] text-[#737373]">
                          Verify details before confirmation and WhatsApp handoff.
                        </p>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/40 text-emerald-400">
                        Ready to Review
                      </span>
                    </div>

                    {/* Summary Card */}
                    <div className="bg-[#121212] border border-[#242424] rounded-lg divide-y divide-[#1D1D1D] text-xs">
                      {/* Name */}
                      <div className="p-2.5 flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-mono text-[#666666] block">Client Name</span>
                          <span className="text-white font-medium">{leadData.clientName || 'Not provided'}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => startInquiryFlow('clientName')}
                          className="p-1 text-[#777777] hover:text-white"
                          title="Edit Name"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Email */}
                      <div className="p-2.5 flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-mono text-[#666666] block">Email</span>
                          <span className="text-white">{leadData.email || 'Not provided'}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => startInquiryFlow('email')}
                          className="p-1 text-[#777777] hover:text-white"
                          title="Edit Email"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>

                      {/* WhatsApp */}
                      <div className="p-2.5 flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-mono text-[#666666] block">WhatsApp</span>
                          <span className="text-[#C4C4C4]">{leadData.whatsapp || 'Not provided'}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => startInquiryFlow('whatsapp')}
                          className="p-1 text-[#777777] hover:text-white"
                          title="Edit WhatsApp"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Project Type */}
                      <div className="p-2.5 flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-mono text-[#666666] block">Project Type</span>
                          <span className="text-emerald-400 font-medium">{leadData.projectType}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => startInquiryFlow('projectType')}
                          className="p-1 text-[#777777] hover:text-white"
                          title="Edit Project Type"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Description */}
                      <div className="p-2.5 flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <span className="text-[10px] font-mono text-[#666666] block">Description</span>
                          <p className="text-[#D0D0D0] text-[11px] leading-relaxed line-clamp-3">
                            {leadData.projectDescription}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => startInquiryFlow('projectDescription')}
                          className="p-1 text-[#777777] hover:text-white"
                          title="Edit Description"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Features, Budget, Timeline */}
                      <div className="p-2.5 grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-[10px] font-mono text-[#666666] block">Features</span>
                          <span className="text-[#A3A3A3]">{leadData.requiredFeatures || 'Discuss during scoping'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-[#666666] block">Budget</span>
                          <span className="text-[#A3A3A3]">{leadData.estimatedBudget || 'Not specified'}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-[10px] font-mono text-[#666666] block">Timeline</span>
                          <span className="text-[#A3A3A3]">{leadData.expectedTimeline || 'Flexible'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Explicit Consent Requirement */}
                    <div className="mt-4 p-3 rounded-lg bg-[#141414] border border-[#242424]">
                      <label className="flex items-start gap-2.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={leadData.consentGiven}
                          onChange={(e) => {
                            setLeadData((prev) => ({ ...prev, consentGiven: e.target.checked }));
                            if (stepError) setStepError(null);
                          }}
                          className="mt-0.5 rounded border-[#333333] bg-[#1E1E1E] text-emerald-500 focus:ring-emerald-500 cursor-pointer w-4 h-4"
                        />
                        <span className="text-[11px] text-[#A0A0A0] leading-snug">
                          I consent to HasDevs processing my details solely to evaluate and contact me regarding this project inquiry.
                        </span>
                      </label>
                    </div>

                    {stepError && (
                      <div className="mt-2 flex items-center gap-1.5 p-2 rounded bg-rose-950/30 border border-rose-900/50 text-rose-300 text-[11px]">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{stepError}</span>
                      </div>
                    )}
                  </div>

                  {/* Review Actions */}
                  <div className="pt-3 border-t border-[#1C1C1C] flex items-center justify-between gap-2 mt-auto">
                    <button
                      type="button"
                      onClick={handleCancelInquiry}
                      className="px-3 py-2 text-xs text-[#888888] hover:text-white transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      disabled={!leadData.consentGiven || isSubmittingInquiry}
                      onClick={handleConfirmSubmission}
                      className="group px-4 py-2 text-xs rounded font-medium bg-emerald-600 hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-600/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:bg-[#202020] disabled:text-[#666666] disabled:translate-y-0 disabled:shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 text-white transition-all duration-200 ease-out flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed shadow-lg"
                    >
                      {isSubmittingInquiry ? (
                        <span>Compiling...</span>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5 transition-transform duration-200 ease-out group-hover:scale-110" />
                          <span>Confirm & Prepare WhatsApp</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* SUBSTAGE 3: Confirmed & WhatsApp Dispatch */}
              {inquirySubStage === 'submitted' && submissionResult && (
                <div className="flex-1 flex flex-col justify-between p-4 sm:p-5 overflow-y-auto text-center space-y-4">
                  <div className="space-y-3.5 my-auto">
                    <div className="w-11 h-11 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>

                    <div>
                      <h3 className="text-base font-semibold text-white font-heading">
                        Inquiry Ready for Delivery
                      </h3>
                      <p className="text-xs text-[#A0A0A0] mt-1.5 max-w-xs mx-auto leading-relaxed">
                        {submissionResult.message}
                      </p>
                    </div>

                    {/* Pre-formatted Message Preview */}
                    <div className="bg-[#111111] border border-[#222222] rounded-lg p-2.5 text-left text-[11px] font-mono text-[#CCCCCC] space-y-2">
                      <div className="flex items-center justify-between border-b border-[#1E1E1E] pb-1.5 text-[10px] text-[#777777]">
                        <span>Prefilled Message Preview</span>
                        <span className="text-emerald-400">Direct Delivery</span>
                      </div>
                      <pre className="max-h-24 overflow-y-auto whitespace-pre-wrap font-mono text-[10.5px] leading-tight text-[#B8B8B8] pr-1">
                        {submissionResult.formattedMessage}
                      </pre>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 pt-1">
                      {/* Primary: Open in WhatsApp */}
                      <a
                        href={submissionResult.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-600/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 text-white font-medium text-xs transition-all duration-200 ease-out shadow-lg cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4 transition-transform duration-200 ease-out group-hover:scale-110" />
                        <span>Open in WhatsApp</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-80 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>

                      {/* Secondary: Email & Copy Actions */}
                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href={submissionResult.emailUrl}
                          className="group inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#181818] hover:bg-[#222222] border border-[#2E2E2E] hover:border-[#404040] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 text-[#D4D4D4] hover:text-white text-xs font-medium transition-all duration-200 ease-out cursor-pointer"
                          title="Send prefilled email via your default email client"
                        >
                          <Mail className="w-3.5 h-3.5 text-emerald-400 transition-transform duration-200 ease-out group-hover:scale-110" />
                          <span>Send via Email</span>
                        </a>

                        <button
                          type="button"
                          onClick={handleCopyInquiryText}
                          className="group inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#181818] hover:bg-[#222222] border border-[#2E2E2E] hover:border-[#404040] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 text-[#D4D4D4] hover:text-white text-xs font-medium transition-all duration-200 ease-out cursor-pointer"
                          title="Copy formatted message to clipboard"
                        >
                          {hasCopiedText ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-[#888888] transition-transform duration-200 ease-out group-hover:rotate-6" />
                              <span>Copy Text</span>
                            </>
                          )}
                        </button>
                      </div>

                      <p className="text-[10px] text-[#666666] pt-1 leading-normal">
                        WhatsApp will open with your details ready. Simply tap send in WhatsApp to deliver your inquiry to Hashir Khan ({WHATSAPP_DISPLAY_NUMBER}).
                      </p>
                    </div>
                  </div>

                  {/* Return to Chat */}
                  <div className="pt-3 border-t border-[#1C1C1C] flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setMode('chat');
                        setInquirySubStage('collecting');
                        setLeadData(INITIAL_LEAD_DATA);
                      }}
                      className="text-xs text-[#888888] hover:text-white transition-colors cursor-pointer"
                    >
                      Return to AI Chat
                    </button>
                    <span className="text-[#333333]">•</span>
                    <button
                      type="button"
                      onClick={() => startInquiryFlow()}
                      className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                    >
                      Start Another Inquiry
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      )}
    </aside>
  );
};
