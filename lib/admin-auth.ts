// Admin authentication helpers
// Uses HMAC-SHA256 signed JWT tokens — no external dependencies

import { createHmac } from 'crypto';

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'dev-secret-change-in-production';
const TOKEN_EXPIRY_HOURS = 24;
const COOKIE_NAME = 'admin_token';

// ---- JWT helpers (minimal, no dependencies) ----

function base64url(str: string): string {
    return Buffer.from(str).toString('base64url');
}

function base64urlDecode(str: string): string {
    return Buffer.from(str, 'base64url').toString('utf-8');
}

export function signAdminToken(): string {
    const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const now = Math.floor(Date.now() / 1000);
    const payload = base64url(JSON.stringify({
        role: 'admin',
        iat: now,
        exp: now + TOKEN_EXPIRY_HOURS * 3600,
    }));
    const signature = createHmac('sha256', JWT_SECRET)
        .update(`${header}.${payload}`)
        .digest('base64url');
    return `${header}.${payload}.${signature}`;
}

export function verifyAdminToken(token: string): boolean {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return false;

        const [header, payload, signature] = parts;

        // Verify signature
        const expectedSig = createHmac('sha256', JWT_SECRET)
            .update(`${header}.${payload}`)
            .digest('base64url');
        if (signature !== expectedSig) return false;

        // Check expiry
        const data = JSON.parse(base64urlDecode(payload));
        if (!data.exp || data.exp < Math.floor(Date.now() / 1000)) return false;
        if (data.role !== 'admin') return false;

        return true;
    } catch {
        return false;
    }
}

export function verifyAdminRequest(request: Request): boolean {
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`));
    if (!match) return false;
    return verifyAdminToken(match[1]);
}

export function getAdminPassword(): string {
    return process.env.ADMIN_PASSWORD || '';
}

export { COOKIE_NAME };
