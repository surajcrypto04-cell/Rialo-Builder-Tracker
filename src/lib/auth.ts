import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET || process.env.ADMIN_PIN || 'default-secret-key-change-me'
);

export async function signAdminToken() {
    const token = await new SignJWT({ role: 'admin' })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(SECRET_KEY);
    return token;
}

export async function verifyAdminToken(req: NextRequest) {
    const token = req.cookies.get('admin_token')?.value;

    if (!token) return false;

    try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        return payload.role === 'admin';
    } catch (error) {
        return false;
    }
}
