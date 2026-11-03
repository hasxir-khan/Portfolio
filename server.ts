import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { checkRateLimit, validateChatInput, generateChatResponse } from './server/geminiService.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

// Basic JSON parsing with size limit
app.use(express.json({ limit: '512kb' }));

// Health Check Endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'HasDevs Assistant API',
    model: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
    hasKey: Boolean(process.env.GEMINI_API_KEY)
  });
});

// Chatbot API Endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  // Extract client IP for rate limiting
  const forwarded = req.headers['x-forwarded-for'];
  const clientIp = typeof forwarded === 'string'
    ? forwarded.split(',')[0].trim()
    : req.socket.remoteAddress || 'unknown';

  const rateCheck = checkRateLimit(clientIp);
  if (!rateCheck.allowed) {
    return res.status(429).json({
      error: 'Rate limit exceeded. Please wait a moment before sending another message.',
      reply: 'You have sent several messages quickly. Please wait a moment before continuing, or connect directly via WhatsApp at +923169896229.'
    });
  }

  // Validate Input
  const validation = validateChatInput(req.body);
  if (!validation.valid || !validation.message) {
    return res.status(400).json({
      error: validation.error || 'Invalid request body.',
      reply: validation.error || 'Please provide a valid message.'
    });
  }

  try {
    const response = await generateChatResponse(validation.message, validation.history);
    return res.json(response);
  } catch (error) {
    console.error('Unexpected error in /api/chat route:', error);
    return res.status(500).json({
      error: 'An unexpected error occurred.',
      reply: "I'm having trouble responding right now. Please try again in a moment or contact HasDevs directly via WhatsApp (+923169896229) or email (hasdeves@gmail.com)."
    });
  }
});

// Client Inquiries Endpoint (Free wa.me and mailto: link generation & in-memory logging)
import {
  validateFullInquiry,
  buildWhatsAppInquiryUrl,
  buildEmailInquiryUrl,
  formatWhatsAppInquiryMessage,
  WHATSAPP_DISPLAY_NUMBER,
  EMAIL_RECIPIENT
} from './src/utils/inquiryCollector.ts';
import type { LeadInquiryData } from './src/types/index.ts';

interface StoredLeadInquiry extends LeadInquiryData {
  id: string;
  clientIp?: string;
  createdAt: string;
}

const INQUIRIES_LOG: StoredLeadInquiry[] = [];

app.post('/api/inquiries', async (req: Request, res: Response) => {
  const forwarded = req.headers['x-forwarded-for'];
  const clientIp = typeof forwarded === 'string'
    ? forwarded.split(',')[0].trim()
    : req.socket.remoteAddress || 'unknown';

  const rawInquiry = req.body as Partial<LeadInquiryData>;
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

  const storedItem: StoredLeadInquiry = {
    ...sanitizedInquiry,
    id: `inq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt,
    clientIp
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
});

app.get('/api/inquiries', (_req: Request, res: Response) => {
  res.json({
    status: 'active',
    totalCaptured: INQUIRIES_LOG.length,
    whatsappRecipient: WHATSAPP_DISPLAY_NUMBER,
    emailRecipient: EMAIL_RECIPIENT,
    integrationType: 'Free wa.me & Mailto Direct Links'
  });
});


// Dev vs Production Setup
async function startServer() {
  if (!isProd) {
    // Development mode with Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: Serve built static files
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[HasDevs] Server running on http://0.0.0.0:${PORT} in ${isProd ? 'production' : 'development'} mode`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
