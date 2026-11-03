// server.ts
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// server/geminiService.ts
import { GoogleGenAI } from "@google/genai";

// src/constants/chatbotKnowledge.ts
var CHATBOT_SYSTEM_INSTRUCTION = `
You are the official HasDevs Assistant \u2014 a virtual business representative for HasDevs (the development studio and brand of Hashir Khan, AI & Web Application Developer).

BRAND IDENTITY & CORE RULES:
- Brand: HasDevs
- Tagline: "Turning Ideas Into Intelligent Digital Solutions."
- You are a professional virtual assistant representing HasDevs. You must NEVER pretend to be Hashir Khan personally.
- If asked who you are or who the visitor is speaking with, respond:
  "I'm the HasDevs virtual assistant. I can help answer questions about our services, development process, and project inquiries."
- Tone: Professional, friendly, helpful, intelligent, confident, respectful, and concise.

LENGTH & CONCISENESS RULE (CRITICAL):
- Normally answer in 1 to 4 clear, punchy sentences.
- Prefer direct answers over lengthy essays.
- Use bullet points only when they genuinely improve readability.
- Do not repeat unnecessary information or use generic AI fluff ("I would be delighted to assist you today!").

LANGUAGE SUPPORT:
- Understand the visitor's language and respond in the same language when possible.
- Default to English.
- Naturally support English, conversational Urdu, and Roman Urdu with a professional demeanor.

ACCURACY & STRICT BOUNDARIES:
- Only state confirmed HasDevs information.
- NEVER invent prices or fixed pricing tiers. If asked for costs, respond:
  "Project pricing depends on your requirements, features, complexity, and integrations. Share a few details about your idea, and HasDevs can discuss a suitable estimate with you."
- NEVER invent project delivery timelines (e.g. never claim 1-day delivery for complex apps).
- NEVER promise guaranteed business results, revenue, or free lifetime hosting.
- If asked about hosting:
  "Hosting and deployment assistance are available. However, domain, hosting, database usage, premium APIs, and third-party service costs are generally paid separately by the client."
- If asked about source code ownership:
  "Yes. Source-code handover is included as part of the agreed project delivery."
- If asked for project examples or live links:
  Direct visitors to the Projects section of the portfolio. Explain that client codebases remain private under confidentiality agreements, while public open-source demonstration playgrounds are in preparation.
- If asked what database we use: Supabase and Firebase. We do NOT use MongoDB.
- Education: Hashir Khan is pursuing a BS in Computer Science with extensive independent self-taught development. Do NOT mention semesters or certifications.
- If an answer is unknown:
  "I don't have confirmed information about that yet. Please contact HasDevs directly through WhatsApp or email, and the team can assist you."

CONVERSATIONAL LEAD GENERATION:
- When a visitor expresses interest in hiring or building a project, ask clarifying questions naturally (one or two at a time):
  1. What type of project would you like to build?
  2. What core features do you need?
  3. Do you have a preferred platform or tech stack?
  4. What is your preferred timeline or optional budget?
- Once sufficient details have been shared, invite them to connect directly:
  "Would you like to discuss your project directly with HasDevs?"
  Provide direct access to WhatsApp (+923169896229 / https://wa.me/923169896229) or Email (hasdeves@gmail.com).

OFFICIAL CONTACTS:
- WhatsApp: +923169896229 (URL: https://wa.me/923169896229)
- Email: hasdeves@gmail.com
- Facebook: https://www.facebook.com/share/1FoEqAqXhY/
`.trim();

// server/geminiService.ts
var rateLimitMap = /* @__PURE__ */ new Map();
var RATE_LIMIT_WINDOW_MS = 60 * 1e3;
var MAX_REQUESTS_PER_WINDOW = 25;
function checkRateLimit(clientIp) {
  const now = Date.now();
  const record = rateLimitMap.get(clientIp) || { timestamps: [] };
  record.timestamps = record.timestamps.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
  if (record.timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0 };
  }
  record.timestamps.push(now);
  rateLimitMap.set(clientIp, record);
  if (rateLimitMap.size > 1e4) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (value.timestamps.length === 0 || now - value.timestamps[value.timestamps.length - 1] > RATE_LIMIT_WINDOW_MS) {
        rateLimitMap.delete(key);
      }
    }
  }
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - record.timestamps.length };
}
function validateChatInput(body) {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Invalid request body." };
  }
  const { message, history } = body;
  if (typeof message !== "string") {
    return { valid: false, error: "Message must be a string." };
  }
  const trimmed = message.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: "Message cannot be empty." };
  }
  if (trimmed.length > 1e3) {
    return { valid: false, error: "Message exceeds the maximum length of 1,000 characters." };
  }
  const validatedHistory = [];
  if (Array.isArray(history)) {
    const recentHistory = history.slice(-10);
    for (const item of recentHistory) {
      if (item && typeof item === "object" && (item.role === "user" || item.role === "assistant" || item.role === "model") && typeof item.text === "string") {
        validatedHistory.push({
          role: item.role === "assistant" ? "model" : item.role,
          text: item.text.slice(0, 1e3)
        });
      }
    }
  }
  return { valid: true, message: trimmed, history: validatedHistory };
}
async function callGemini(ai, contents) {
  const preferredModel = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";
  const modelsToTry = [
    preferredModel,
    "gemini-3.1-flash-lite",
    "gemini-3.8-flash"
  ];
  const uniqueModels = Array.from(new Set(modelsToTry));
  let lastError = null;
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
    } catch (err) {
      lastError = err;
      continue;
    }
  }
  throw lastError;
}
async function generateChatResponse(userMessage, history = []) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      reply: "The HasDevs AI service is currently configuring its credentials. Please connect directly via WhatsApp (+923169896229) or email (hasdeves@gmail.com) for immediate assistance.",
      leadAction: {
        type: "whatsapp",
        label: "Chat on WhatsApp",
        url: "https://wa.me/923169896229?text=Hello%20HasDevs%2C%20I%20would%20like%20to%20discuss%20a%20project"
      }
    };
  }
  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
  const contents = [];
  for (const h of history) {
    contents.push({
      role: h.role === "model" ? "model" : "user",
      parts: [{ text: h.text }]
    });
  }
  contents.push({
    role: "user",
    parts: [{ text: userMessage }]
  });
  try {
    const replyText = await callGemini(ai, contents);
    const lowerUser = userMessage.toLowerCase();
    const lowerReply = replyText.toLowerCase();
    let leadAction = void 0;
    if (lowerUser.includes("hire") || lowerUser.includes("quote") || lowerUser.includes("start a project") || lowerUser.includes("price") || lowerUser.includes("contact") || lowerReply.includes("whatsapp") || lowerReply.includes("discuss your project") || lowerReply.includes("reach out")) {
      const encodedMsg = encodeURIComponent(
        `Hello Hashir, I was chatting with the HasDevs Assistant and would like to discuss my project: "${userMessage.slice(0, 120)}"`
      );
      leadAction = {
        type: "whatsapp",
        label: "Discuss on WhatsApp",
        url: `https://wa.me/923169896229?text=${encodedMsg}`
      };
    }
    return {
      reply: replyText,
      leadAction,
      suggestions: [
        "What services do you offer?",
        "How does your development process work?",
        "Can you build an AI chatbot?",
        "How can I start a project?"
      ]
    };
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Gemini API call error:", errMessage.replace(apiKey, "[REDACTED]"));
    return {
      reply: "I'm having trouble responding right now. Please try again in a moment or contact HasDevs directly via WhatsApp (+923169896229) or email (hasdeves@gmail.com).",
      leadAction: {
        type: "whatsapp",
        label: "Chat on WhatsApp",
        url: "https://wa.me/923169896229?text=Hello%20HasDevs%2C%20I%20have%20an%20inquiry%20regarding%20your%20services"
      }
    };
  }
}

// src/utils/inquiryCollector.ts
var WHATSAPP_RECIPIENT_NUMBER = "923169896229";
var WHATSAPP_DISPLAY_NUMBER = "+923169896229";
var WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_RECIPIENT_NUMBER}`;
var EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function validateClientName(name) {
  const trimmed = (name || "").trim();
  if (!trimmed) {
    return { valid: false, error: "Please enter your name or company name." };
  }
  if (trimmed.length < 2) {
    return { valid: false, error: "Name must be at least 2 characters long." };
  }
  if (trimmed.length > 100) {
    return { valid: false, error: "Name cannot exceed 100 characters." };
  }
  return { valid: true };
}
function validateEmail(email) {
  const trimmed = (email || "").trim();
  if (!trimmed) {
    return { valid: false, error: "Please provide a valid email address." };
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return { valid: false, error: "Please enter a valid email format (e.g., name@example.com)." };
  }
  if (trimmed.length > 120) {
    return { valid: false, error: "Email cannot exceed 120 characters." };
  }
  return { valid: true };
}
function validateWhatsAppNumber(phone) {
  const trimmed = (phone || "").trim();
  if (!trimmed) {
    return { valid: true };
  }
  const digitsOnly = trimmed.replace(/[^0-9]/g, "");
  if (digitsOnly.length < 7 || digitsOnly.length > 16) {
    return { valid: false, error: "Please enter a valid phone number (7 to 16 digits) or skip." };
  }
  return { valid: true };
}
function validateProjectType(type) {
  const trimmed = (type || "").trim();
  if (!trimmed) {
    return { valid: false, error: "Please select or specify a project type." };
  }
  if (trimmed.length < 3) {
    return { valid: false, error: "Project type must be at least 3 characters." };
  }
  return { valid: true };
}
function validateProjectDescription(desc) {
  const trimmed = (desc || "").trim();
  if (!trimmed) {
    return { valid: false, error: "Please provide a brief description of your project." };
  }
  if (trimmed.length < 15) {
    return { valid: false, error: "Please provide at least 15 characters describing what you want to build." };
  }
  if (trimmed.length > 3e3) {
    return { valid: false, error: "Description is too long (maximum 3000 characters)." };
  }
  return { valid: true };
}
function validateFullInquiry(data) {
  const errors = {};
  const nameCheck = validateClientName(data.clientName || "");
  if (!nameCheck.valid && nameCheck.error) errors.clientName = nameCheck.error;
  const emailCheck = validateEmail(data.email || "");
  if (!emailCheck.valid && emailCheck.error) errors.email = emailCheck.error;
  const phoneCheck = validateWhatsAppNumber(data.whatsapp);
  if (!phoneCheck.valid && phoneCheck.error) errors.whatsapp = phoneCheck.error;
  const typeCheck = validateProjectType(data.projectType || "");
  if (!typeCheck.valid && typeCheck.error) errors.projectType = typeCheck.error;
  const descCheck = validateProjectDescription(data.projectDescription || "");
  if (!descCheck.valid && descCheck.error) errors.projectDescription = descCheck.error;
  if (!data.consentGiven) {
    errors.consent = "Explicit consent is required to submit personal contact details.";
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}
function formatWhatsAppInquiryMessage(data) {
  const clientName = (data.clientName || "").trim() || "Not provided";
  const email = (data.email || "").trim() || "Not provided";
  const whatsapp = (data.whatsapp || "").trim() || "Not provided";
  const projectType = (data.projectType || "").trim() || "Custom Project";
  const projectDescription = (data.projectDescription || "").trim() || "To be discussed";
  const requiredFeatures = (data.requiredFeatures || "").trim() || "Discuss during scoping";
  const estimatedBudget = (data.estimatedBudget || "").trim() || "Not specified";
  const expectedTimeline = (data.expectedTimeline || "").trim() || "Flexible";
  return [
    "NEW HASDEVS PROJECT INQUIRY",
    "",
    `Client Name: ${clientName}`,
    `Email: ${email}`,
    `WhatsApp: ${whatsapp}`,
    `Project Type: ${projectType}`,
    `Project Description: ${projectDescription}`,
    `Required Features: ${requiredFeatures}`,
    `Estimated Budget: ${estimatedBudget}`,
    `Expected Timeline: ${expectedTimeline}`
  ].join("\n");
}
var EMAIL_RECIPIENT = "hasdeves@gmail.com";
function buildWhatsAppInquiryUrl(data) {
  const message = formatWhatsAppInquiryMessage(data);
  const encodedMessage = encodeURIComponent(message);
  return `${WHATSAPP_BASE_URL}?text=${encodedMessage}`;
}
function formatEmailSubject(data) {
  const name = (data.clientName || "").trim() || "Prospective Client";
  const type = (data.projectType || "").trim() || "Project Inquiry";
  return `HasDevs Project Inquiry: ${type} - ${name}`;
}
function buildEmailInquiryUrl(data) {
  const subject = formatEmailSubject(data);
  const body = formatWhatsAppInquiryMessage(data);
  return `mailto:${EMAIL_RECIPIENT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// server.ts
dotenv.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
var PORT = parseInt(process.env.PORT || "3000", 10);
var isProd = process.env.NODE_ENV === "production";
app.use(express.json({ limit: "512kb" }));
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "HasDevs Assistant API",
    model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
    hasKey: Boolean(process.env.GEMINI_API_KEY)
  });
});
app.post("/api/chat", async (req, res) => {
  const forwarded = req.headers["x-forwarded-for"];
  const clientIp = typeof forwarded === "string" ? forwarded.split(",")[0].trim() : req.socket.remoteAddress || "unknown";
  const rateCheck = checkRateLimit(clientIp);
  if (!rateCheck.allowed) {
    return res.status(429).json({
      error: "Rate limit exceeded. Please wait a moment before sending another message.",
      reply: "You have sent several messages quickly. Please wait a moment before continuing, or connect directly via WhatsApp at +923169896229."
    });
  }
  const validation = validateChatInput(req.body);
  if (!validation.valid || !validation.message) {
    return res.status(400).json({
      error: validation.error || "Invalid request body.",
      reply: validation.error || "Please provide a valid message."
    });
  }
  try {
    const response = await generateChatResponse(validation.message, validation.history);
    return res.json(response);
  } catch (error) {
    console.error("Unexpected error in /api/chat route:", error);
    return res.status(500).json({
      error: "An unexpected error occurred.",
      reply: "I'm having trouble responding right now. Please try again in a moment or contact HasDevs directly via WhatsApp (+923169896229) or email (hasdeves@gmail.com)."
    });
  }
});
var INQUIRIES_LOG = [];
app.post("/api/inquiries", async (req, res) => {
  const forwarded = req.headers["x-forwarded-for"];
  const clientIp = typeof forwarded === "string" ? forwarded.split(",")[0].trim() : req.socket.remoteAddress || "unknown";
  const rawInquiry = req.body;
  const validation = validateFullInquiry(rawInquiry);
  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      message: "Please review and correct the required inquiry fields.",
      errors: validation.errors
    });
  }
  const createdAt = (/* @__PURE__ */ new Date()).toISOString();
  const sanitizedInquiry = {
    clientName: (rawInquiry.clientName || "").trim(),
    email: (rawInquiry.email || "").trim().toLowerCase(),
    whatsapp: (rawInquiry.whatsapp || "").trim() || void 0,
    projectType: (rawInquiry.projectType || "").trim(),
    projectDescription: (rawInquiry.projectDescription || "").trim(),
    requiredFeatures: (rawInquiry.requiredFeatures || "").trim() || void 0,
    estimatedBudget: (rawInquiry.estimatedBudget || "").trim() || void 0,
    expectedTimeline: (rawInquiry.expectedTimeline || "").trim() || void 0,
    consentGiven: Boolean(rawInquiry.consentGiven),
    createdAt
  };
  const storedItem = {
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
    message: "Your project inquiry is compiled and ready. WhatsApp will open with your details prefilled so you can review and press Send.",
    whatsappUrl,
    emailUrl,
    formattedMessage,
    inquiryId: storedItem.id
  });
});
app.get("/api/inquiries", (_req, res) => {
  res.json({
    status: "active",
    totalCaptured: INQUIRIES_LOG.length,
    whatsappRecipient: WHATSAPP_DISPLAY_NUMBER,
    emailRecipient: EMAIL_RECIPIENT,
    integrationType: "Free wa.me & Mailto Direct Links"
  });
});
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[HasDevs] Server running on http://0.0.0.0:${PORT} in ${isProd ? "production" : "development"} mode`);
  });
}
startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
