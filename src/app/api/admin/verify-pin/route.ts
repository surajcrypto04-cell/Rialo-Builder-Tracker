import { NextResponse } from 'next/server';
import { signAdminToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const { pin } = await req.json();
        const adminPin = process.env.ADMIN_PIN;

        if (!adminPin) {
            return NextResponse.json({ error: 'Admin PIN not configured' }, { status: 500 });
        }

        if (pin === adminPin) {
            const token = await signAdminToken();
            const cookieStore = await cookies();

            cookieStore.set('admin_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24, // 1 day
                path: '/',
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 });
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
