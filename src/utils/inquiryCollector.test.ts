import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateClientName,
  validateEmail,
  validateWhatsAppNumber,
  validateProjectType,
  validateProjectDescription,
  validateFullInquiry,
  formatWhatsAppInquiryMessage,
  buildWhatsAppInquiryUrl,
  buildEmailInquiryUrl,
  formatEmailSubject,
  EMAIL_RECIPIENT,
  WHATSAPP_RECIPIENT_NUMBER,
  WHATSAPP_BASE_URL,
  INQUIRY_STEPS
} from './inquiryCollector.ts';
import type { LeadInquiryData } from '../types/index.ts';

const completeLead: LeadInquiryData = {
  clientName: 'Elena Rostova',
  email: 'elena@novatech.io',
  whatsapp: '+14155552671',
  projectType: 'AI Agent / Chatbot',
  projectDescription: 'Building a customer service AI assistant with automated CRM ticket creation and WhatsApp notifications.',
  requiredFeatures: 'Gemini 2.5 Flash, Webhooks, React widget',
  estimatedBudget: '$3,000 - $5,000',
  expectedTimeline: '2 - 4 weeks',
  consentGiven: true
};

test('inquiry steps count is 8', () => {
  assert.equal(INQUIRY_STEPS.length, 8);
  assert.equal(INQUIRY_STEPS[0].id, 'clientName');
  assert.equal(INQUIRY_STEPS[7].id, 'expectedTimeline');
});

test('validateClientName rejects empty and short names', () => {
  assert.equal(validateClientName('').valid, false);
  assert.equal(validateClientName('   ').valid, false);
  assert.equal(validateClientName('A').valid, false);
  assert.equal(validateClientName('Elena').valid, true);
});

test('validateEmail requires valid email format', () => {
  assert.equal(validateEmail('').valid, false);
  assert.equal(validateEmail('not-an-email').valid, false);
  assert.equal(validateEmail('missing-domain@').valid, false);
  assert.equal(validateEmail('elena@novatech.io').valid, true);
});

test('validateWhatsAppNumber accepts optional empty or valid phone', () => {
  assert.equal(validateWhatsAppNumber('').valid, true);
  assert.equal(validateWhatsAppNumber(undefined).valid, true);
  assert.equal(validateWhatsAppNumber('123').valid, false); // too short
  assert.equal(validateWhatsAppNumber('+1 (555) 019-2834').valid, true);
  assert.equal(validateWhatsAppNumber('923169896229').valid, true);
});

test('validateProjectType requires non-empty string', () => {
  assert.equal(validateProjectType('').valid, false);
  assert.equal(validateProjectType('AI Agent / Chatbot').valid, true);
});

test('validateProjectDescription enforces minimum length of 15 chars', () => {
  assert.equal(validateProjectDescription('').valid, false);
  assert.equal(validateProjectDescription('Too short').valid, false);
  assert.equal(validateProjectDescription('This is a detailed description of my web application project.').valid, true);
});

test('validateFullInquiry requires consent and required fields', () => {
  const withoutConsent = { ...completeLead, consentGiven: false };
  const result1 = validateFullInquiry(withoutConsent);
  assert.equal(result1.valid, false);
  assert.ok(result1.errors.consent);

  const fullValid = validateFullInquiry(completeLead);
  assert.equal(fullValid.valid, true);
  assert.deepEqual(fullValid.errors, {});
});

test('formatWhatsAppInquiryMessage strictly formats required lines and headers', () => {
  const message = formatWhatsAppInquiryMessage(completeLead);
  
  assert.ok(message.startsWith('NEW HASDEVS PROJECT INQUIRY\n'));
  assert.ok(message.includes('Client Name: Elena Rostova'));
  assert.ok(message.includes('Email: elena@novatech.io'));
  assert.ok(message.includes('WhatsApp: +14155552671'));
  assert.ok(message.includes('Project Type: AI Agent / Chatbot'));
  assert.ok(message.includes('Project Description: Building a customer service AI assistant with automated CRM ticket creation and WhatsApp notifications.'));
  assert.ok(message.includes('Required Features: Gemini 2.5 Flash, Webhooks, React widget'));
  assert.ok(message.includes('Estimated Budget: $3,000 - $5,000'));
  assert.ok(message.includes('Expected Timeline: 2 - 4 weeks'));
});

test('formatWhatsAppInquiryMessage handles omitted optional fields with defaults', () => {
  const minimalLead: LeadInquiryData = {
    clientName: 'Alex Lee',
    email: 'alex@example.com',
    projectType: 'Full-Stack Web Application',
    projectDescription: 'An internal inventory management dashboard with secure authentication.',
    consentGiven: true
  };

  const message = formatWhatsAppInquiryMessage(minimalLead);
  assert.ok(message.includes('Client Name: Alex Lee'));
  assert.ok(message.includes('Email: alex@example.com'));
  assert.ok(message.includes('WhatsApp: Not provided'));
  assert.ok(message.includes('Required Features: Discuss during scoping'));
  assert.ok(message.includes('Estimated Budget: Not specified'));
  assert.ok(message.includes('Expected Timeline: Flexible'));
});

test('buildWhatsAppInquiryUrl encodes full message to wa.me/923169896229 with no plus sign in path', () => {
  const url = buildWhatsAppInquiryUrl(completeLead);
  assert.equal(url.startsWith('https://wa.me/923169896229?text='), true);
  assert.equal(url.includes('+923169896229'), false); // strictly no plus sign in URL path
  assert.ok(url.includes(encodeURIComponent('NEW HASDEVS PROJECT INQUIRY')));
  assert.ok(url.includes(encodeURIComponent('Elena Rostova')));
  assert.ok(url.includes(encodeURIComponent('elena@novatech.io')));
});

test('buildEmailInquiryUrl generates valid mailto link to hasdeves@gmail.com with subject and body', () => {
  const emailUrl = buildEmailInquiryUrl(completeLead);
  assert.ok(emailUrl.startsWith(`mailto:${EMAIL_RECIPIENT}?`));
  assert.ok(emailUrl.includes('hasdeves@gmail.com'));
  assert.ok(emailUrl.includes(encodeURIComponent(formatEmailSubject(completeLead))));
  assert.ok(emailUrl.includes(encodeURIComponent('NEW HASDEVS PROJECT INQUIRY')));
  assert.ok(emailUrl.includes(encodeURIComponent('Elena Rostova')));
});

