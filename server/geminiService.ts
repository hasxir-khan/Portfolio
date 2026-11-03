import { GoogleGenAI } from '@google/genai';
import { CHATBOT_SYSTEM_INSTRUCTION } from '../src/constants/chatbotKnowledge.ts';

export interface ChatMessageInput {
  role: 'user' | 'assistant' | 'model';
  text: string;
}

export interface ChatRequestBody {
  message: string;
  history?: ChatMessageInput[];
}

export interface ChatResponseBody {
  reply: string;
  leadAction?: {
    type: 'whatsapp' | 'email' | 'contact_form';
    label: string;
    url?: string;
  };
  suggestions?: string[];
}

// In-memory sliding window rate limiter
interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitRecord>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 25; // 25 requests per minute per IP

export function checkRateLimit(clientIp: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(clientIp) || { timestamps: [] };

  // Filter timestamps within the current window
  record.timestamps = record.timestamps.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);

  if (record.timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0 };
  }

  record.timestamps.push(now);
  rateLimitMap.set(clientIp, record);

  // Periodically clean up old entries if map grows
  if (rateLimitMap.size > 10000) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (value.timestamps.length === 0 || now - value.timestamps[value.timestamps.length - 1] > RATE_LIMIT_WINDOW_MS) {
        rateLimitMap.delete(key);
      }
    }
  }

  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - record.timestamps.length };
}

/**
 * Sanitizes and validates user input
 */
export function validateChatInput(body: unknown): {
  valid: boolean;
  message?: string;
  history?: ChatMessageInput[];
  error?: string;
} {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Invalid request body.' };
  }

  const { message, history } = body as Partial<ChatRequestBody>;

  if (typeof message !== 'string') {
    return { valid: false, error: 'Message must be a string.' };
  }

  const trimmed = message.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: 'Message cannot be empty.' };
  }

  if (trimmed.length > 1000) {
    return { valid: false, error: 'Message exceeds the maximum length of 1,000 characters.' };
  }

  // Validate history if provided
  const validatedHistory: ChatMessageInput[] = [];
  if (Array.isArray(history)) {
    // Keep max last 10 messages (5 turns)
    const recentHistory = history.slice(-10);
    for (const item of recentHistory) {
      if (
        item &&
        typeof item === 'object' &&
        (item.role === 'user' || item.role === 'assistant' || item.role === 'model') &&
        typeof item.text === 'string'
      ) {
        validatedHistory.push({
          role: item.role === 'assistant' ? 'model' : item.role,
          text: item.text.slice(0, 1000)
        });
      }
    }
  }

  return { valid: true, message: trimmed, history: validatedHistory };
}

/**
 * Executes generateContent with primary model and immediate fast fallback on 503 capacity errors
 */
async function callGemini(
  ai: GoogleGenAI,
  contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>
): Promise<string> {
  const preferredModel = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';
  const modelsToTry = [
    preferredModel,
    'gemini-3.1-flash-lite',
    'gemini-3.8-flash'
  ];

  // Deduplicate list preserving order
  const uniqueModels = Array.from(new Set(modelsToTry));

  let lastError: unknown = null;

  for (const model of uniqueModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: CHATBOT_SYSTEM_INSTRUCTION
        }
      });

      if (response.text) {
        return response.text.trim();
      }
    } catch (err: unknown) {
      lastError = err;
      // If error is 503/429/404, proceed to next candidate model
      continue;
    }
  }

  throw lastError;
}

/**
 * Generates an AI response using Gemini via @google/genai
 */
export async function generateChatResponse(
  userMessage: string,
  history: ChatMessageInput[] = []
): Promise<ChatResponseBody> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      reply: "The HasDevs AI service is currently configuring its credentials. Please connect directly via WhatsApp (+923169896229) or email (hasdeves@gmail.com) for immediate assistance.",
      leadAction: {
        type: 'whatsapp',
        label: 'Chat on WhatsApp',
        url: 'https://wa.me/923169896229?text=Hello%20HasDevs%2C%20I%20would%20like%20to%20discuss%20a%20project'
      }
    };
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });

  // Convert history and current message into contents format
  const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

  for (const h of history) {
    contents.push({
      role: h.role === 'model' ? 'model' : 'user',
      parts: [{ text: h.text }]
    });
  }

  // Add the current user query
  contents.push({
    role: 'user',
    parts: [{ text: userMessage }]
  });

  try {
    const replyText = await callGemini(ai, contents);

    // Determine if we should append a direct action
    const lowerUser = userMessage.toLowerCase();
    const lowerReply = replyText.toLowerCase();

    let leadAction: ChatResponseBody['leadAction'] = undefined;

    if (
      lowerUser.includes('hire') ||
      lowerUser.includes('quote') ||
      lowerUser.includes('start a project') ||
      lowerUser.includes('price') ||
      lowerUser.includes('contact') ||
      lowerReply.includes('whatsapp') ||
      lowerReply.includes('discuss your project') ||
      lowerReply.includes('reach out')
    ) {
      const encodedMsg = encodeURIComponent(
        `Hello Hashir, I was chatting with the HasDevs Assistant and would like to discuss my project: "${userMessage.slice(0, 120)}"`
      );
      leadAction = {
        type: 'whatsapp',
        label: 'Discuss on WhatsApp',
        url: `https://wa.me/923169896229?text=${encodedMsg}`
      };
    }

    return {
      reply: replyText,
      leadAction,
      suggestions: [
        'What services do you offer?',
        'How does your development process work?',
        'Can you build an AI chatbot?',
        'How can I start a project?'
      ]
    };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Gemini API call error:', errMessage.replace(apiKey, '[REDACTED]'));

    return {
      reply: "I'm having trouble responding right now. Please try again in a moment or contact HasDevs directly via WhatsApp (+923169896229) or email (hasdeves@gmail.com).",
      leadAction: {
        type: 'whatsapp',
        label: 'Chat on WhatsApp',
        url: 'https://wa.me/923169896229?text=Hello%20HasDevs%2C%20I%20have%20an%20inquiry%20regarding%20your%20services'
      }
    };
  }
}
