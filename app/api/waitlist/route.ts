
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { firstName, lastName, email, phone, countryCode } = body;

        // Basic validation
        if (!firstName || !lastName || !email || !phone || !countryCode) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Insert into Supabase
        const { error } = await supabase
            .from('waitlist')
            .insert([
                {
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    phone: phone,
                    country_code: countryCode,
                },
            ]);

        if (error) {
            console.error('Supabase error:', error);
            // Check for unique constraint violation
            if (error.code === '23505') { // unique_violation
                return NextResponse.json(
                    { error: 'This email is already on the waitlist.' },
                    { status: 400 }
                );
            }
            return NextResponse.json(
                { error: 'Failed to join waitlist. Please try again.' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: 'Successfully joined waitlist' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
