"use client";

import { Printer } from "lucide-react";
import React from "react";

export function PrintButton() {
    return (
        <button 
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors shadow-sm"
        >
            <Printer className="w-4 h-4" />
            Download PDF
        </button>
    );
}
