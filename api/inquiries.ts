import type { IncomingMessage, ServerResponse } from 'http';
import {
  validateFullInquiry,
  buildWhatsAppInquiryUrl,
  buildEmailInquiryUrl,
  formatWhatsAppInquiryMessage,
  WHATSAPP_DISPLAY_NUMBER,
  EMAIL_RECIPIENT
} from '../src/utils/inquiryCollector.ts';
import type { LeadInquiryData } from '../src/types/index.ts';

interface VercelRequest extends IncomingMessage {
  body: unknown;
  query: Record<string, string | string[]>;
  cookies: Record<string, string>;
}

interface VercelResponse extends ServerResponse {
  status: (statusCode: number) => VercelResponse;
  json: (data: unknown) => VercelResponse;
  send: (data: unknown) => VercelResponse;
}

const INQUIRIES_LOG: Array<LeadInquiryData & { id: string; clientIp?: string; createdAt: string }> = [];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'active',
      totalCaptured: INQUIRIES_LOG.length,
      whatsappRecipient: WHATSAPP_DISPLAY_NUMBER,
      emailRecipient: EMAIL_RECIPIENT,
      integrationType: 'Free wa.me & Mailto Direct Links'
    });
  }

  if (req.method === 'POST') {
    const rawInquiry = ((req.body || {}) as Record<string, unknown>) as Partial<LeadInquiryData>;
    const validation = validateFullInquiry(rawInquiry);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: 'Please review and correct the required inquiry fields.',
        errors: validation.errors
      });
    }

    const createdAt = new Date().toISOString();
    const sanitizedInquiry: LeadInquiryData = {
      clientName: (rawInquiry.clientName || '').trim(),
      email: (rawInquiry.email || '').trim().toLowerCase(),
      whatsapp: (rawInquiry.whatsapp || '').trim() || undefined,
      projectType: (rawInquiry.projectType || '').trim(),
      projectDescription: (rawInquiry.projectDescription || '').trim(),
      requiredFeatures: (rawInquiry.requiredFeatures || '').trim() || undefined,
      estimatedBudget: (rawInquiry.estimatedBudget || '').trim() || undefined,
      expectedTimeline: (rawInquiry.expectedTimeline || '').trim() || undefined,
      consentGiven: Boolean(rawInquiry.consentGiven),
      createdAt
    };

    const storedItem = {
      ...sanitizedInquiry,
      id: `inq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt
    };

    INQUIRIES_LOG.push(storedItem);

    const whatsappUrl = buildWhatsAppInquiryUrl(sanitizedInquiry);
    const emailUrl = buildEmailInquiryUrl(sanitizedInquiry);
    const formattedMessage = formatWhatsAppInquiryMessage(sanitizedInquiry);

    return res.status(201).json({
      success: true,
      message: 'Your project inquiry is compiled and ready. WhatsApp will open with your details prefilled so you can review and press Send.',
      whatsappUrl,
      emailUrl,
      formattedMessage,
      inquiryId: storedItem.id
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
