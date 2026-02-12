// Anonymous session token utilities
// No user identity — just a random token stored in localStorage

import { createHash } from 'crypto';

export function generateSessionToken() {
    const array = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
        array[i] = Math.floor(Math.random() * 256);
    }
    return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

export function hashToken(token) {
    return createHash('sha256').update(token).digest('hex');
}
