import type { IncomingMessage, ServerResponse } from 'http';

interface VercelRequest extends IncomingMessage {
  query: Record<string, string | string[]>;
}

interface VercelResponse extends ServerResponse {
  status: (statusCode: number) => VercelResponse;
  json: (data: unknown) => VercelResponse;
}

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    status: 'ok',
    service: 'HasDevs Assistant API',
    model: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
    hasKey: Boolean(process.env.GEMINI_API_KEY)
  });
}
