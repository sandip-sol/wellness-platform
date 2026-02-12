// AI Safety Service Stub
// In production, this would use an AI model for content analysis

// PII Patterns (basic regex-based)
const PII_PATTERNS = [
    { pattern: /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g, type: 'name', replacement: '[NAME REDACTED]' },
    { pattern: /\b[\w.+-]+@[\w-]+\.[\w.]+\b/g, type: 'email', replacement: '[EMAIL REDACTED]' },
    { pattern: /\b(?:\+91|0)?[6-9]\d{9}\b/g, type: 'phone', replacement: '[PHONE REDACTED]' },
    { pattern: /\b\d{4}\s?\d{4}\s?\d{4}\b/g, type: 'aadhaar', replacement: '[ID REDACTED]' },
    { pattern: /\b\d{1,3}[,\s]?\w+\s(?:street|road|lane|nagar|colony|apartments?|flat)\b/gi, type: 'address', replacement: '[ADDRESS REDACTED]' }
];

// Policy violation keywords
const BLOCKED_TERMS = [
    'child abuse', 'minor sexual', 'underage', 'pedophil',
    'revenge porn', 'blackmail', 'extort'
];

const EXPLICIT_TERMS = [
    // Would contain explicit terms in production
];

// Topic routing keywords
const CLINICIAN_KEYWORDS = ['blood', 'discharge', 'pain during', 'burning', 'lump', 'sore', 'blister', 'rash', 'symptom', 'infection', 'pregnant', 'missed period', 'HIV', 'STI', 'STD'];
const ABUSE_KEYWORDS = ['forced', 'didn\'t consent', 'made me', 'threatened', 'abused', 'assault', 'rape', 'molest', 'violence', 'hitting', 'hurt me'];
const MINOR_KEYWORDS = ['i am 15', 'i am 16', 'i am 14', 'i am 13', 'i\'m 15', 'i\'m 14', 'i\'m 13', 'i\'m 16', 'underage', 'school student', 'class 10', 'class 9', 'class 8'];

/**
 * Redact personally identifiable information from text
 */
export function redactPII(text) {
    let redacted = text;
    let piiFound = [];

    for (const { pattern, type, replacement } of PII_PATTERNS) {
        const matches = text.match(pattern);
        if (matches) {
            piiFound.push({ type, count: matches.length });
            redacted = redacted.replace(pattern, replacement);
        }
    }

    return { text: redacted, piiFound };
}

/**
 * Check content against platform policies
 * Returns: { allowed: boolean, reason?: string, flags: string[] }
 */
export function checkPolicy(text) {
    const lower = text.toLowerCase();
    const flags = [];

    // Check for blocked content
    for (const term of BLOCKED_TERMS) {
        if (lower.includes(term)) {
            return {
                allowed: false,
                reason: 'Content violates platform safety policy. If you or someone you know is in danger, please contact authorities immediately.',
                flags: ['policy-violation']
            };
        }
    }

    // Check for minor-related content
    if (isMinorContent(text)) {
        return {
            allowed: false,
            reason: 'This platform is for adults 18+ only. If you are under 18, please reach out to a trusted adult, school counsellor, or Childline (1098) for support.',
            flags: ['minor-detected']
        };
    }

    return { allowed: true, flags };
}

/**
 * Route content to appropriate response template
 * Returns: 'standard' | 'see-clinician' | 'abuse-risk' | 'mental-health'
 */
export function routeTopic(text, category) {
    const lower = text.toLowerCase();

    // Check for abuse risk (highest priority)
    if (ABUSE_KEYWORDS.some(kw => lower.includes(kw))) {
        return 'abuse-risk';
    }

    // Check for clinical routing
    if (CLINICIAN_KEYWORDS.some(kw => lower.includes(kw))) {
        return 'see-clinician';
    }

    // Category-based routing
    if (category === 'mental-wellbeing') {
        return 'mental-health';
    }

    return 'standard';
}

/**
 * Detect minor-related content
 */
export function isMinorContent(text) {
    const lower = text.toLowerCase();
    return MINOR_KEYWORDS.some(kw => lower.includes(kw));
}

/**
 * Full safety pipeline: PII redaction + policy check + topic routing
 */
export function processSafetyPipeline(text, category) {
    // Step 1: Redact PII
    const { text: cleanText, piiFound } = redactPII(text);

    // Step 2: Policy check
    const policyResult = checkPolicy(cleanText);

    // Step 3: Topic routing
    const route = policyResult.allowed ? routeTopic(cleanText, category) : null;

    return {
        cleanText,
        piiFound,
        policyResult,
        route,
        processed: true
    };
}
