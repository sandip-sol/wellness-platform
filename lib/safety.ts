// @ts-nocheck
// Enhanced AI Safety Service
// Production-grade content safety: PII detection, coercion/abuse detection, risk scoring, policy routing

// ──────────────────────────────────────────────
// PII PATTERNS (extended for Indian context)
// ──────────────────────────────────────────────
const PII_PATTERNS = [
    // Names (basic heuristic)
    { pattern: /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g, type: 'name', replacement: '[NAME REDACTED]' },
    // Email
    { pattern: /\b[\w.+-]+@[\w-]+\.[\w.]+\b/g, type: 'email', replacement: '[EMAIL REDACTED]' },
    // Indian phone numbers (with or without country code)
    { pattern: /\b(?:\+91[\s.-]?|0)?[6-9]\d{9}\b/g, type: 'phone', replacement: '[PHONE REDACTED]' },
    // International phone numbers
    { pattern: /\b\+?\d{1,4}[\s.-]?\(?\d{1,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}\b/g, type: 'phone-intl', replacement: '[PHONE REDACTED]' },
    // Aadhaar (12 digits in groups of 4)
    { pattern: /\b\d{4}\s?\d{4}\s?\d{4}\b/g, type: 'aadhaar', replacement: '[AADHAAR REDACTED]' },
    // PAN Card (ABCDE1234F pattern)
    { pattern: /\b[A-Z]{5}\d{4}[A-Z]\b/g, type: 'pan', replacement: '[PAN REDACTED]' },
    // Indian Passport
    { pattern: /\b[A-Z]\d{7}\b/g, type: 'passport', replacement: '[PASSPORT REDACTED]' },
    // IP Addresses
    { pattern: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g, type: 'ip-address', replacement: '[IP REDACTED]' },
    // Date of Birth patterns (DD/MM/YYYY, DD-MM-YYYY, etc.)
    { pattern: /\b(?:0?[1-9]|[12]\d|3[01])[\/\-.](?:0?[1-9]|1[0-2])[\/\-.]\d{4}\b/g, type: 'dob', replacement: '[DOB REDACTED]' },
    // Social media handles (@username)
    { pattern: /(?:^|\s)@[a-zA-Z_]\w{2,30}\b/g, type: 'social-handle', replacement: ' [HANDLE REDACTED]' },
    // Address patterns (Indian)
    { pattern: /\b\d{1,3}[,\s]?\w+\s(?:street|road|lane|nagar|colony|apartments?|flat|sector|block|phase|gali|mohalla)\b/gi, type: 'address', replacement: '[ADDRESS REDACTED]' },
    // PIN codes (6 digits)
    { pattern: /\b\d{6}\b/g, type: 'pincode', replacement: '[PIN REDACTED]' },
    // Credit/Debit card numbers (16 digits)
    { pattern: /\b(?:\d{4}[\s.-]?){3}\d{4}\b/g, type: 'card-number', replacement: '[CARD REDACTED]' },
];

// ──────────────────────────────────────────────
// POLICY VIOLATION TERMS
// ──────────────────────────────────────────────
const BLOCKED_TERMS = [
    'child abuse', 'minor sexual', 'underage', 'pedophil',
    'revenge porn', 'blackmail', 'extort',
    'child pornography', 'csam', 'cp links',
    'sex trafficking', 'sell virginity',
];

// ──────────────────────────────────────────────
// COERCION / GROOMING DETECTION
// ──────────────────────────────────────────────
const COERCION_PHRASES = [
    // Secrecy pressure
    "don't tell anyone", "keep this between us", "keep this secret",
    "no one needs to know", "this is our secret", "don't talk about this",
    // Obligation/guilt
    "you owe me", "if you loved me", "prove your love",
    "after everything i've done", "you made me do this",
    "it's your fault", "you asked for it",
    // Threats
    "i'll tell everyone", "i'll share your photos", "i'll ruin you",
    "no one will believe you", "nobody will help you",
    "i know where you live", "i'll hurt myself if you",
    // Isolation
    "your friends don't care", "only i understand you",
    "your family will disown you", "nobody else will want you",
    // Minimization
    "it's not a big deal", "stop overreacting", "you're being dramatic",
    "everyone does this", "it's normal",
    // Grooming patterns
    "you're mature for your age", "age is just a number",
    "don't be a child about this", "you're special",
    "i can teach you", "let me show you",
];

// ──────────────────────────────────────────────
// TOPIC ROUTING KEYWORDS
// ──────────────────────────────────────────────
const CLINICIAN_KEYWORDS = [
    'blood', 'discharge', 'pain during', 'burning', 'lump', 'sore',
    'blister', 'rash', 'symptom', 'infection', 'pregnant', 'missed period',
    'HIV', 'STI', 'STD', 'genital wart', 'herpes', 'chlamydia', 'gonorrhea',
    'irregular bleeding', 'unusual smell', 'swelling', 'itching',
];

const ABUSE_KEYWORDS = [
    'forced', "didn't consent", 'made me', 'threatened', 'abused',
    'assault', 'rape', 'molest', 'violence', 'hitting', 'hurt me',
    'beaten', 'raped', 'sexually abused', 'marital rape', 'domestic violence',
    'stalking', 'harassed', 'groped', 'touched without consent',
];

const MINOR_KEYWORDS = [
    'i am 15', 'i am 16', 'i am 14', 'i am 13', 'i am 12', 'i am 11',
    "i'm 15", "i'm 14", "i'm 13", "i'm 16", "i'm 12", "i'm 11",
    'underage', 'school student', 'class 10', 'class 9', 'class 8',
    'class 7', 'class 11', 'minor here', 'not 18 yet', 'under 18',
];

const SELF_HARM_KEYWORDS = [
    'kill myself', 'want to die', 'end my life', 'suicide',
    'self harm', 'self-harm', 'cutting myself', 'hurting myself',
    'don\'t want to live', 'no reason to live',
];

// ──────────────────────────────────────────────
// POLICY RESPONSE TEMPLATES
// ──────────────────────────────────────────────
const POLICY_TEMPLATES = {
    'abuse-risk': {
        banner: '🛡️ Your safety matters. If you are in immediate danger, please call 112 (Emergency) or Women Helpline 181.',
        message: 'It sounds like you may be experiencing abuse or a non-consensual situation. You are not alone, and it is not your fault.',
        resources: [
            { name: 'Women Helpline', number: '181', description: 'National domestic violence helpline (24/7)' },
            { name: 'Police Emergency', number: '112', description: 'All India emergency number' },
            { name: 'One Stop Centre', number: '181', description: 'Integrated support for violence survivors' },
            { name: 'NCW WhatsApp', number: '7217735372', description: 'National Commission for Women' },
        ],
        suggestedAction: 'If possible, reach a safe location. Consider speaking with a trusted person or professional counsellor.',
    },
    'see-clinician': {
        banner: '🏥 Medical attention recommended. Please consult a qualified healthcare provider.',
        message: 'Based on what you\'ve described, we recommend consulting with a doctor or sexual health clinic for proper evaluation.',
        resources: [
            { name: 'NACO Helpline', number: '1097', description: 'National AIDS Control helpline (free, confidential)' },
            { name: 'Practo / 1mg', number: 'Online', description: 'Book an online consultation with a verified doctor' },
        ],
        suggestedAction: 'Schedule an appointment with a healthcare provider. Do not self-diagnose or self-medicate.',
    },
    'mental-health': {
        banner: '🧠 Your mental wellbeing is important. Professional support is available.',
        message: 'It\'s okay to feel this way. Talking to a mental health professional can make a real difference.',
        resources: [
            { name: 'iCall', number: '9152987821', description: 'Free psychosocial counseling (Mon-Sat, 8am-10pm)' },
            { name: 'Vandrevala Foundation', number: '1860-2662-345', description: '24/7 mental health support' },
            { name: 'NIMHANS', number: '080-46110007', description: 'National Institute of Mental Health helpline' },
        ],
        suggestedAction: 'Consider reaching out to one of these helplines. You can also ask your doctor for a referral to a counsellor.',
    },
    'minor-detected': {
        banner: '⚠️ This platform is for adults 18+ only.',
        message: 'If you are under 18, please reach out to a trusted adult, school counsellor, or Childline for support.',
        resources: [
            { name: 'Childline India', number: '1098', description: '24/7 helpline for children in need (free)' },
            { name: 'Adolescent Health', number: 'RKSK Portal', description: 'Government health portal for adolescents' },
        ],
        suggestedAction: 'Please speak with a trusted adult — a parent, teacher, or school counsellor — about your concerns.',
    },
    'coercion-detected': {
        banner: '🚨 Warning signs of coercion or manipulation detected.',
        message: 'The language you\'ve described may indicate coercion, manipulation, or grooming behavior. Healthy relationships are built on mutual respect, not pressure.',
        resources: [
            { name: 'Women Helpline', number: '181', description: 'Domestic violence support (24/7)' },
            { name: 'iCall', number: '9152987821', description: 'Counseling for emotional distress' },
            { name: 'Cyber Crime Helpline', number: '1930', description: 'For online harassment or cyber abuse' },
        ],
        suggestedAction: 'If someone is pressuring or manipulating you, know that this is not okay. Consider talking to a trusted person or counsellor.',
    },
    'self-harm': {
        banner: '❤️ You matter. Immediate help is available right now.',
        message: 'If you or someone you know is in crisis, please reach out immediately. You are not alone.',
        resources: [
            { name: 'AASRA', number: '9820466726', description: '24/7 crisis intervention and suicide prevention' },
            { name: 'Vandrevala Foundation', number: '1860-2662-345', description: '24/7 mental health crisis support' },
            { name: 'iCall', number: '9152987821', description: 'Professional counseling support' },
        ],
        suggestedAction: 'Please call one of these numbers now. If you are in immediate danger, call 112.',
    },
};

// ──────────────────────────────────────────────
// CORE FUNCTIONS
// ──────────────────────────────────────────────

/**
 * Redact personally identifiable information from text
 */
export function redactPII(text: string) {
    let redacted = text;
    let piiFound: { type: string; count: number }[] = [];

    for (const { pattern, type, replacement } of PII_PATTERNS) {
        // Reset regex lastIndex for global patterns
        pattern.lastIndex = 0;
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
export function checkPolicy(text: string) {
    const lower = text.toLowerCase();
    const flags: string[] = [];

    // Check for blocked content (highest severity)
    for (const term of BLOCKED_TERMS) {
        if (lower.includes(term)) {
            return {
                allowed: false,
                reason: 'Content violates platform safety policy. If you or someone you know is in danger, please contact authorities immediately.',
                flags: ['policy-violation'],
                template: POLICY_TEMPLATES['minor-detected'], // Most blocked terms relate to CSAM
            };
        }
    }

    // Check for self-harm content
    if (SELF_HARM_KEYWORDS.some(kw => lower.includes(kw))) {
        return {
            allowed: true, // Allow the question to go through but flag it
            reason: 'Self-harm or crisis content detected.',
            flags: ['self-harm-risk'],
            template: POLICY_TEMPLATES['self-harm'],
        };
    }

    // Check for minor-related content
    if (isMinorContent(text)) {
        return {
            allowed: false,
            reason: 'This platform is for adults 18+ only. If you are under 18, please reach out to a trusted adult, school counsellor, or Childline (1098) for support.',
            flags: ['minor-detected'],
            template: POLICY_TEMPLATES['minor-detected'],
        };
    }

    // Check for coercion/grooming
    const coercionMatches = detectCoercion(text);
    if (coercionMatches.length > 0) {
        flags.push('coercion-detected');
    }

    return { allowed: true, flags };
}

/**
 * Detect coercion/grooming phrases in text
 * Returns matched phrases
 */
export function detectCoercion(text: string): string[] {
    const lower = text.toLowerCase();
    return COERCION_PHRASES.filter(phrase => lower.includes(phrase));
}

/**
 * Route content to appropriate response template
 * Returns: 'standard' | 'see-clinician' | 'abuse-risk' | 'mental-health' | 'self-harm' | 'coercion-detected'
 */
export function routeTopic(text: string, category?: string): string {
    const lower = text.toLowerCase();

    // Check for self-harm (highest priority)
    if (SELF_HARM_KEYWORDS.some(kw => lower.includes(kw))) {
        return 'self-harm';
    }

    // Check for abuse risk
    if (ABUSE_KEYWORDS.some(kw => lower.includes(kw))) {
        return 'abuse-risk';
    }

    // Check for coercion
    if (detectCoercion(text).length > 0) {
        return 'coercion-detected';
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
export function isMinorContent(text: string): boolean {
    const lower = text.toLowerCase();
    return MINOR_KEYWORDS.some(kw => lower.includes(kw));
}

/**
 * Calculate risk score (0–100) based on weighted matches
 */
export function calculateRiskScore(text: string): { score: number; breakdown: Record<string, number> } {
    const lower = text.toLowerCase();
    const breakdown: Record<string, number> = {};
    let score = 0;

    // Blocked terms: +40 each (capped at 40)
    const blockedMatches = BLOCKED_TERMS.filter(t => lower.includes(t));
    if (blockedMatches.length > 0) {
        breakdown['policy-violation'] = Math.min(40, blockedMatches.length * 40);
        score += breakdown['policy-violation'];
    }

    // Self-harm: +35
    const selfHarmMatches = SELF_HARM_KEYWORDS.filter(kw => lower.includes(kw));
    if (selfHarmMatches.length > 0) {
        breakdown['self-harm'] = 35;
        score += 35;
    }

    // Minor keywords: +30
    if (isMinorContent(text)) {
        breakdown['minor-detected'] = 30;
        score += 30;
    }

    // Abuse keywords: +20 each (capped at 30)
    const abuseMatches = ABUSE_KEYWORDS.filter(kw => lower.includes(kw));
    if (abuseMatches.length > 0) {
        breakdown['abuse-risk'] = Math.min(30, abuseMatches.length * 20);
        score += breakdown['abuse-risk'];
    }

    // Coercion phrases: +15 each (capped at 25)
    const coercionMatches = detectCoercion(text);
    if (coercionMatches.length > 0) {
        breakdown['coercion'] = Math.min(25, coercionMatches.length * 15);
        score += breakdown['coercion'];
    }

    return { score: Math.min(100, score), breakdown };
}

/**
 * Get the appropriate policy response template for a route
 */
export function getPolicyTemplate(route: string) {
    return POLICY_TEMPLATES[route as keyof typeof POLICY_TEMPLATES] || null;
}

/**
 * Full safety pipeline: PII redaction + policy check + topic routing + risk scoring
 */
export function processSafetyPipeline(text: string, category?: string) {
    // Step 1: Redact PII
    const { text: cleanText, piiFound } = redactPII(text);

    // Step 2: Policy check
    const policyResult = checkPolicy(cleanText);

    // Step 3: Topic routing
    const route = policyResult.allowed ? routeTopic(cleanText, category) : null;

    // Step 4: Risk scoring
    const riskScore = calculateRiskScore(cleanText);

    // Step 5: Get template
    const template = route ? getPolicyTemplate(route) : (policyResult as any).template || null;

    return {
        cleanText,
        piiFound,
        policyResult,
        route,
        riskScore,
        template,
        processed: true,
    };
}

/**
 * Unified entry point: sanitize, score, and get full response context
 * This is the recommended function for all content processing
 */
export function sanitizeAndScore(text: string, category?: string) {
    const result = processSafetyPipeline(text, category);

    return {
        // Cleaned text with PII redacted
        cleanText: result.cleanText,
        // Was PII found?
        hasPII: result.piiFound.length > 0,
        piiDetails: result.piiFound,
        // Is the content allowed?
        allowed: result.policyResult.allowed,
        policyFlags: result.policyResult.flags,
        policyMessage: result.policyResult.reason || null,
        // Risk assessment
        riskScore: result.riskScore.score,
        riskBreakdown: result.riskScore.breakdown,
        riskLevel: result.riskScore.score >= 60 ? 'critical' :
            result.riskScore.score >= 30 ? 'high' :
                result.riskScore.score >= 10 ? 'moderate' : 'low',
        // Routing
        route: result.route,
        // Template for UI display
        template: result.template,
    };
}
