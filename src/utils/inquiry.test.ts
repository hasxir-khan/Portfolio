import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateInquiryForm,
  formatInquiryMessage,
  createWhatsAppUrl,
  createMailtoUrl,
  WHATSAPP_PHONE_NUMBER,
  CONTACT_EMAIL,
} from './inquiry.ts';
import type { InquiryFormData } from '../types/index.ts';

const validData: InquiryFormData = {
  name: 'Sarah Connor',
  email: 'sarah@example.com',
  projectType: 'Full-Stack Web Application',
  budget: '$2,000 - $4,000',
  description: 'Looking to build a custom responsive SaaS dashboard with AI agent integration.',
};

test('validateInquiryForm accepts valid complete data', () => {
  const result = validateInquiryForm(validData);
  assert.equal(result.isValid, true);
  assert.deepEqual(result.errors, {});
});

test('validateInquiryForm accepts valid data without optional budget', () => {
  const result = validateInquiryForm({
    ...validData,
    budget: '',
  });
  assert.equal(result.isValid, true);
  assert.deepEqual(result.errors, {});
});

test('validateInquiryForm rejects empty or missing name', () => {
  const result = validateInquiryForm({
    ...validData,
    name: '   ',
  });
  assert.equal(result.isValid, false);
  assert.ok(result.errors.name);
});

test('validateInquiryForm rejects invalid email address', () => {
  const result = validateInquiryForm({
    ...validData,
    email: 'not-an-email',
  });
  assert.equal(result.isValid, false);
  assert.ok(result.errors.email);
});

test('validateInquiryForm rejects invalid or missing project type', () => {
  const result = validateInquiryForm({
    ...validData,
    // @ts-expect-error testing invalid type
    projectType: 'Cryptocurrency Token',
  });
  assert.equal(result.isValid, false);
  assert.ok(result.errors.projectType);
});

test('validateInquiryForm rejects descriptions that are too short', () => {
  const result = validateInquiryForm({
    ...validData,
    description: 'too short',
  });
  assert.equal(result.isValid, false);
  assert.ok(result.errors.description);
});

test('formatInquiryMessage properly formats all fields', () => {
  const message = formatInquiryMessage(validData);
  assert.ok(message.includes('Client Name: Sarah Connor'));
  assert.ok(message.includes('Email: sarah@example.com'));
  assert.ok(message.includes('Project Type: Full-Stack Web Application'));
  assert.ok(message.includes('Estimated Budget: $2,000 - $4,000'));
  assert.ok(message.includes('Looking to build a custom responsive SaaS'));
});

test('createWhatsAppUrl creates valid wa.me link with encoded message', () => {
  const url = createWhatsAppUrl(validData);
  assert.ok(url.startsWith(`https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=`));
  assert.ok(url.includes(encodeURIComponent('Sarah Connor')));
  assert.ok(url.includes(encodeURIComponent('sarah@example.com')));
});

test('createMailtoUrl creates valid mailto link to hasdeves@gmail.com', () => {
  const url = createMailtoUrl(validData);
  assert.ok(url.startsWith(`mailto:${CONTACT_EMAIL}?subject=`));
  assert.ok(url.includes(encodeURIComponent('Full-Stack Web Application')));
  assert.ok(url.includes(encodeURIComponent('Sarah Connor')));
});
