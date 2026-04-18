import { NextResponse } from "next/server";
import { sendEnquiryNotificationEmail } from "@/lib/mail";
import { supabaseAdmin } from "@/lib/commerce";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const phone = String(body?.phone ?? "").trim();
    const message = String(body?.message ?? "").trim();

    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: "Name, email, phone, and message are required." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("enquiries")
      .insert([
        {
          name,
          email,
          phone,
          message,
        },
      ]);

    if (error) {
      console.error("[Enquiries] Supabase insert failed:", error);
      return NextResponse.json(
        { error: "We couldn't save your enquiry. Please try again." },
        { status: 500 }
      );
    }

    await sendEnquiryNotificationEmail({
      name,
      email,
      phone,
      message,
    });

    return NextResponse.json(
      { message: "Enquiry received." },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Enquiries] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
