/**
 * Policy Engine for the AI Navigation Assistant.
 * Implements Structural and Semantic Gating to prevent PII leakage and prompt injections,
 * inspired by the Vibe Coding Agent Security whitepaper.
 */

export interface PolicyCheckResult {
  allowed: boolean;
  reason?: string;
}

export interface NavigationParams {
  origin: string;
  appType: string;
}

/**
 * Structural Check: Validates that the tool arguments match the expected schema.
 */
export function validateNavigationParams(params: any): params is NavigationParams {
  if (!params || typeof params !== 'object') {
    return false;
  }
  
  const { origin, appType } = params;
  
  if (typeof origin !== 'string' || origin.trim().length === 0) {
    return false;
  }
  
  if (typeof appType !== 'string' || !['Google Maps', 'Waze', 'Parkopedia'].includes(appType)) {
    return false;
  }
  
  return true;
}

/**
 * Semantic Check: Scans natural language inputs and parameters for security violations.
 * Detects PII (emails, phone numbers) and potential prompt injections.
 */
export function checkSemanticPolicy(input: string): PolicyCheckResult {
  const normalizedInput = input.toLowerCase().trim();

  // 1. Email pattern detection (PII)
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  if (emailRegex.test(normalizedInput)) {
    return {
      allowed: false,
      reason: 'Detecție date cu caracter personal (PII): Adresele de e-mail nu sunt permise din motive de securitate.'
    };
  }

  // 2. Phone number pattern detection (PII) - Romanian/Moldovan or general format
  // Ex: +373 78 123 456, 068123456, +40 721 123 456
  const phoneRegex = /(?:\+?[\d\s-]{8,15}\d)/;
  // Match digits with spaces/hyphens, filter to make sure it contains a sequence that looks like a phone number
  const digitCount = (normalizedInput.match(/\d/g) || []).length;
  if (digitCount >= 8 && phoneRegex.test(normalizedInput)) {
    return {
      allowed: false,
      reason: 'Detecție date cu caracter personal (PII): Numerele de telefon nu sunt permise din motive de securitate.'
    };
  }

  // 3. Prompt Injection patterns
  const injectionPatterns = [
    'ignore previous instructions',
    'system prompt',
    'system rule',
    'always do',
    'never do',
    'forget everything',
    'you must bypass',
    'instructiuni anterioare',
    'ignora instructiunile',
    'comanda de sistem'
  ];

  for (const pattern of injectionPatterns) {
    if (normalizedInput.includes(pattern)) {
      return {
        allowed: false,
        reason: 'Detecție tentativă de manipulare prompt (Prompt Injection).'
      };
    }
  }

  return {
    allowed: true
  };
}
