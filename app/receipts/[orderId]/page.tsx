import { supabaseAdmin } from "@/lib/commerce";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Printer, ArrowLeft } from "lucide-react";
import React from "react";

import { Metadata } from "next";

// Client component for the print button
import { PrintButton } from "./print-button";

export const metadata: Metadata = {
    title: "Payment Receipt | Recovery Compass",
    robots: { index: false, follow: false }
};

export default async function ReceiptPage(props: { params: Promise<{ orderId: string }> }) {
    const params = await props.params;
    const { orderId } = params;

    const { data: txn, error } = await supabaseAdmin
        .from("transactions")
        .select("*")
        .eq("provider_order_id", orderId)
        .single();

    if (error || !txn) {
        return notFound();
    }

    const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("display_name, email")
        .eq("id", txn.user_id)
        .maybeSingle();

    const customerName = profile?.display_name || "Seeker";
    const customerEmail = profile?.email || "";

    const amountInr = (txn.amount / 100).toFixed(2);
    const amountFormatted = `₹${amountInr}`;
    
    // items is a JSONB array, fallback to default if missing
    const items = Array.isArray(txn.items) ? txn.items : [];
    
    // Format date
    const datePaid = txn.created_at ? new Date(txn.created_at).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : new Date().toLocaleDateString('en-IN');

    return (
        <div className="min-h-screen bg-neutral-50 p-4 sm:p-8 print:bg-white print:p-0 font-sans text-neutral-900">
            {/* Action Bar (hidden in print) */}
            <div className="max-w-2xl mx-auto mb-6 flex justify-between items-center print:hidden">
                <Link href="/" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 inline-flex items-center gap-2 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>
                <PrintButton />
            </div>

            {/* Receipt Card */}
            <div className="max-w-2xl mx-auto bg-white border border-neutral-200/60 rounded-2xl p-8 sm:p-12 shadow-sm print:border-none print:shadow-none print:p-0">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6 border-b border-neutral-100 pb-8">
                    <div>
                        <Image 
                            src="/rc-logo-primary.svg" 
                            alt="Recovery Compass" 
                            width={140} 
                            height={40} 
                            className="mb-4"
                        />
                        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Payment Receipt</h1>
                        <p className="text-sm text-neutral-500 mt-1">Receipt for Order {orderId}</p>
                    </div>
                    <div className="text-left sm:text-right text-sm text-neutral-500 space-y-1">
                        <p className="font-semibold text-neutral-900">Recovery Compass</p>
                        <p>support@recoverycompass.co</p>
                        <p>Date Paid: {datePaid}</p>
                        <p className="pt-2 font-mono text-xs">GSTIN: 29DUYPR5435M1ZC</p>
                    </div>
                </div>

                {/* Billed To */}
                <div className="mb-10">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Billed To</h2>
                    <p className="font-medium text-neutral-900 text-lg">{customerName}</p>
                    {customerEmail && <p className="text-neutral-500 text-sm mt-1">{customerEmail}</p>}
                </div>

                {/* Items Table */}
                <div className="mb-8">
                    <div className="grid grid-cols-12 gap-4 border-b-2 border-neutral-900 pb-3 text-xs font-bold uppercase tracking-wider text-neutral-400">
                        <div className="col-span-8 sm:col-span-9">Description</div>
                        <div className="col-span-4 sm:col-span-3 text-right">Amount</div>
                    </div>

                    <div className="py-2">
                        {items.length > 0 ? (
                            items.map((item: any, i: number) => (
                                <div key={i} className="grid grid-cols-12 gap-4 py-4 border-b border-neutral-100">
                                    <div className="col-span-8 sm:col-span-9">
                                        <p className="font-medium text-neutral-900">{item.title || "Program Access"}</p>
                                        <p className="text-sm text-neutral-500 mt-0.5">Qty: {item.quantity || 1}</p>
                                    </div>
                                    <div className="col-span-4 sm:col-span-3 text-right">
                                        <p className="font-medium text-neutral-900">
                                            ₹{((item.price_inr || txn.amount) / 100).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="grid grid-cols-12 gap-4 py-4 border-b border-neutral-100">
                                <div className="col-span-8 sm:col-span-9">
                                    <p className="font-medium text-neutral-900">Recovery Compass Curriculum</p>
                                </div>
                                <div className="col-span-4 sm:col-span-3 text-right">
                                    <p className="font-medium text-neutral-900">{amountFormatted}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Totals */}
                <div className="flex justify-end mb-12">
                    <div className="w-full sm:w-1/2 bg-neutral-50/50 rounded-xl p-6 print:bg-transparent print:p-0">
                        <div className="flex justify-between items-center mb-3 text-sm text-neutral-500">
                            <span>Subtotal</span>
                            <span>{amountFormatted}</span>
                        </div>
                        <div className="flex justify-between items-center mb-4 text-sm text-neutral-500 pb-4 border-b border-neutral-200">
                            <span>Tax (Included in price)</span>
                            <span>₹0.00</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-neutral-900 text-lg">Total Paid</span>
                            <span className="font-bold text-neutral-900 text-xl">{amountFormatted}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Notes */}
                <div className="border-t border-neutral-100 pt-8 text-sm text-neutral-500 space-y-2">
                    <p>
                        <strong>Thank you for your trust.</strong> We are honoured to walk this road with you.
                    </p>
                    <p className="text-xs">
                        If you have any questions regarding this receipt, please reply to your welcome email or contact support.
                    </p>
                </div>
            </div>
        </div>
    );
}
