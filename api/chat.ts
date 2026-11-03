import type { IncomingMessage, ServerResponse } from 'http';
import { checkRateLimit, validateChatInput, generateChatResponse } from '../server/geminiService.ts';

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const forwarded = req.headers['x-forwarded-for'];
  const clientIp = typeof forwarded === 'string'
    ? forwarded.split(',')[0].trim()
    : req.socket.remoteAddress || 'unknown';

  const rateCheck = checkRateLimit(clientIp);
  if (!rateCheck.allowed) {
    return res.status(429).json({
      error: 'Rate limit exceeded.',
      reply: 'You have sent several messages quickly. Please wait a moment before continuing, or connect directly via WhatsApp at +923169896229.'
    });
  }

  const validation = validateChatInput(req.body);
  if (!validation.valid || !validation.message) {
    return res.status(400).json({
      error: validation.error || 'Invalid request body.',
      reply: validation.error || 'Please provide a valid message.'
    });
  }

  try {
    const response = await generateChatResponse(validation.message, validation.history);
    return res.status(200).json(response);
  } catch (error) {
    console.error('Vercel handler error:', error);
    return res.status(500).json({
      error: 'An unexpected error occurred.',
      reply: "I'm having trouble responding right now. Please try again in a moment or contact HasDevs directly via WhatsApp (+923169896229) or email (hasdeves@gmail.com)."
    });
  }
}
