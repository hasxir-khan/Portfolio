import test from 'node:test';
import assert from 'node:assert/strict';
import { validateChatInput, checkRateLimit } from '../../server/geminiService.ts';
import { HASDEVS_KNOWLEDGE, CHATBOT_SYSTEM_INSTRUCTION } from '../constants/chatbotKnowledge.ts';

test('validateChatInput accepts valid text message', () => {
  const result = validateChatInput({ message: 'What services does HasDevs provide?' });
  assert.equal(result.valid, true);
  assert.equal(result.message, 'What services does HasDevs provide?');
  assert.deepEqual(result.history, []);
});

test('validateChatInput rejects empty, whitespace, or invalid types', () => {
  assert.equal(validateChatInput({ message: '' }).valid, false);
  assert.equal(validateChatInput({ message: '   ' }).valid, false);
  assert.equal(validateChatInput({}).valid, false);
  assert.equal(validateChatInput(null).valid, false);
  assert.equal(validateChatInput({ message: 123 }).valid, false);
});

test('validateChatInput rejects messages longer than 1000 characters', () => {
  const longMsg = 'a'.repeat(1001);
  const result = validateChatInput({ message: longMsg });
  assert.equal(result.valid, false);
  assert.match(result.error || '', /exceeds the maximum length/);
});

test('validateChatInput bounds conversation history to last 10 messages', () => {
  const dummyHistory = Array.from({ length: 15 }, (_, i) => ({
    role: i % 2 === 0 ? ('user' as const) : ('assistant' as const),
    text: `Message ${i}`
  }));

  const result = validateChatInput({
    message: 'Hello',
    history: dummyHistory
  });

  assert.equal(result.valid, true);
  assert.equal(result.history?.length, 10);
  assert.equal(result.history?.[9].text, 'Message 14');
  assert.equal(result.history?.[9].role, 'user');
  // Verify 'assistant' at index 8 (which was Message 13) is mapped to 'model' for Gemini
  assert.equal(result.history?.[8].role, 'model');
});

test('checkRateLimit allows requests up to max threshold and throttles beyond', () => {
  const testIp = '192.168.1.99';
  let allowedCount = 0;

  for (let i = 0; i < 30; i++) {
    const res = checkRateLimit(testIp);
    if (res.allowed) {
      allowedCount++;
    }
  }

  assert.equal(allowedCount, 25);
  const blocked = checkRateLimit(testIp);
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.remaining, 0);
});

test('HASDEVS_KNOWLEDGE contains accurate studio data and strict constraints', () => {
  assert.equal(HASDEVS_KNOWLEDGE.brand, 'HasDevs');
  assert.equal(HASDEVS_KNOWLEDGE.founder.name, 'Hashir Khan');
  assert.equal(HASDEVS_KNOWLEDGE.contact.whatsappNumber, '+923169896229');
  assert.equal(HASDEVS_KNOWLEDGE.contact.email, 'hasdeves@gmail.com');
  
  // Verify strictly Supabase & Firebase (NO MongoDB)
  assert.deepEqual(HASDEVS_KNOWLEDGE.technologies.databases, ['Supabase', 'Firebase']);
  assert.equal(HASDEVS_KNOWLEDGE.technologies.databases.includes('MongoDB'), false);

  // Verify 12 core services
  assert.equal(HASDEVS_KNOWLEDGE.services.length, 12);
});

test('CHATBOT_SYSTEM_INSTRUCTION enforces conciseness, persona boundaries, and facts', () => {
  assert.match(CHATBOT_SYSTEM_INSTRUCTION, /NEVER pretend to be Hashir Khan/);
  assert.match(CHATBOT_SYSTEM_INSTRUCTION, /1 to 4 clear, punchy sentences/);
  assert.match(CHATBOT_SYSTEM_INSTRUCTION, /NEVER invent prices/);
  assert.match(CHATBOT_SYSTEM_INSTRUCTION, /NEVER promise guaranteed business results/);
  assert.match(CHATBOT_SYSTEM_INSTRUCTION, /Source-code handover is included/);
  assert.match(CHATBOT_SYSTEM_INSTRUCTION, /paid separately by the client/);
});
