"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronRight,
  ClipboardCopy,
  FileText,
  Loader2,
  Plus,
  RefreshCw,
  ShieldAlert,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DIET_PLAN_STANDALONE_PRICE_INR } from "@/lib/diet-plan-product";
import { cn } from "@/lib/utils";

/* ─── Types ─────────────────────────────────────────────────────────── */

type DietPlanRow = {
  adminNotes: string | null;
  amount: string;
  canConfirmPayment: boolean;
  canGenerate: boolean;
  createdAt: string;
  email: string;
  errorMessage: string | null;
  fulfilledAt: string;
  id: string;
  manualCreatedBy: string | null;
  name: string;
  paymentConfirmedAt: string | null;
  paymentConfirmedBy: string | null;
  paymentLinkUrl: string | null;
  paymentReference: string | null;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  source: string;
  status: string;
};

type IntakeFormData = {
  activity: string;
  adminNotes: string;
  age: string;
  allergies: string;
  conditions: string;
  dailyRoutine: string;
  diet: string;
  email: string;
  foodPreferences: string;
  goals: string;
  height: string;
  medications: string;
  name: string;
  paymentLinkUrl: string;
  weight: string;
};

const INITIAL_INTAKE: IntakeFormData = {
  activity: "",
  adminNotes: "",
  age: "",
  allergies: "",
  conditions: "",
  dailyRoutine: "",
  diet: "",
  email: "",
  foodPreferences: "",
  goals: "",
  height: "",
  medications: "",
  name: "",
  paymentLinkUrl: "",
  weight: "",
};

const DIET_OPTIONS = [
  "Pure vegetarian",
  "Vegan",
  "Eggetarian",
  "Non-vegetarian",
  "Non-veg (no beef)",
  "Non-veg (no pork)",
  "Fish only",
  "Jain",
];

/* ─── Style tokens ──────────────────────────────────────────────────── */

const inputClass =
  "h-11 w-full rounded-2xl border border-white/10 bg-white/[0.08] px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/25 focus:ring-1 focus:ring-white/15 transition";
const textareaClass =
  "min-h-[80px] w-full resize-y rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/25 focus:ring-1 focus:ring-white/15 transition";
const selectClass =
  "h-11 w-full rounded-2xl border border-white/10 bg-white/[0.08] px-4 text-sm text-white outline-none focus:border-white/25 focus:ring-1 focus:ring-white/15 transition appearance-none";
const labelClass = "block text-xs font-medium text-white/60 mb-1.5";

/* ─── Status badge ──────────────────────────────────────────────────── */

const STATUS_TONES: Record<string, string> = {
  awaiting_payment: "bg-amber-300/12 text-amber-100 ring-amber-200/20",
  failed: "bg-rose-300/12 text-rose-100 ring-rose-200/20",
  fulfilled: "bg-teal-300/12 text-teal-100 ring-teal-200/20",
  generating: "bg-violet-300/12 text-violet-100 ring-violet-200/20",
  paid: "bg-sky-300/12 text-sky-100 ring-sky-200/20",
  pending: "bg-amber-300/12 text-amber-100 ring-amber-200/20",
  processing: "bg-violet-300/12 text-violet-100 ring-violet-200/20",
};

function StatusBadge({ status }: { status: string }) {
  const tone = STATUS_TONES[status] ?? "bg-slate-300/10 text-slate-100 ring-slate-200/15";
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1", tone)}>
      {status.replaceAll("_", " ")}
    </span>
  );
}

function SourceBadge({ source }: { source: string }) {
  const isManual = source === "admin_manual";
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
        isManual
          ? "bg-violet-300/12 text-violet-100 ring-violet-200/20"
          : "bg-slate-300/10 text-slate-100 ring-slate-200/15"
      )}
    >
      {isManual ? "Manual" : source.replaceAll("_", " ")}
    </span>
  );
}

/* ─── Copy button ───────────────────────────────────────────────────── */

function CopyButton({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  }

  return (
    <button
      className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.06] px-2.5 py-1.5 text-xs text-white/60 transition hover:bg-white/[0.12] hover:text-white"
      onClick={handleCopy}
      type="button"
    >
      {copied ? <Check className="size-3" /> : <ClipboardCopy className="size-3" />}
      {copied ? "Copied" : label}
    </button>
  );
}

/* ─── Detail row helper ─────────────────────────────────────────────── */

function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-1 border-b border-white/[0.06] py-2.5 last:border-b-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <span className="shrink-0 text-xs font-medium text-white/40">{label}</span>
      <span className="break-all text-xs text-white/70 sm:max-w-[70%] sm:text-right">{value}</span>
    </div>
  );
}

/* ─── Inline action forms ───────────────────────────────────────────── */

function ConfirmPaymentForm({
  onDone,
  orderId,
}: {
  onDone: () => void;
  orderId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [paymentReference, setPaymentReference] = useState("");
  const [reason, setReason] = useState("");
  const [evidence, setEvidence] = useState("");
  const [triggerGeneration, setTriggerGeneration] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/diet-plans/confirm-payment", {
        body: JSON.stringify({
          evidence,
          orderId,
          paymentReference,
          reason,
          triggerGeneration,
        }),
        headers: { "content-type": "application/json" },
        method: "POST",
      });

      const payload = (await response.json()) as { message?: string; success?: boolean };
      if (!response.ok || !payload.success) {
        setError(payload.message ?? "Could not confirm payment.");
        return;
      }

      setSuccess(true);
      startTransition(() => router.refresh());
      setTimeout(() => onDone(), 1500);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not confirm payment.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-teal-200/15 bg-teal-300/10 p-4 text-sm text-teal-50">
        Payment confirmed. {triggerGeneration ? "Diet plan generation has been queued." : ""}
      </div>
    );
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <p className="text-xs font-medium text-white/50">
        Confirm that payment has been collected for this manual order.
      </p>
      <div>
        <label className={labelClass}>Payment reference</label>
        <input
          className={inputClass}
          onChange={(e) => setPaymentReference(e.target.value)}
          placeholder="Razorpay payment ID, UPI ref, bank ref..."
          required
          value={paymentReference}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Reason</label>
          <input
            className={inputClass}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Payment collected via link"
            required
            value={reason}
          />
        </div>
        <div>
          <label className={labelClass}>Evidence</label>
          <input
            className={inputClass}
            onChange={(e) => setEvidence(e.target.value)}
            placeholder="Screenshot, Razorpay dashboard..."
            required
            value={evidence}
          />
        </div>
      </div>
      <label className="flex items-center gap-2.5 text-sm text-white/65">
        <input
          checked={triggerGeneration}
          className="size-4 rounded border-white/20 bg-white/10 accent-sky-300"
          onChange={(e) => setTriggerGeneration(e.target.checked)}
          type="checkbox"
        />
        Generate diet plan immediately after confirming
      </label>
      {error ? (
        <div className="rounded-2xl border border-rose-200/15 bg-rose-300/10 p-3 text-xs text-rose-50">{error}</div>
      ) : null}
      <Button
        className="h-10 rounded-xl bg-sky-100 px-5 text-sm text-[#082035] hover:bg-sky-50"
        disabled={isSubmitting || isPending}
        type="submit"
      >
        {isSubmitting || isPending ? "Confirming..." : "Confirm payment"}
      </Button>
    </form>
  );
}

function TriggerGenerationForm({
  onDone,
  orderId,
}: {
  onDone: () => void;
  orderId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [reason, setReason] = useState("");
  const [evidence, setEvidence] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/diet-plans/generate", {
        body: JSON.stringify({ evidence, orderId, reason }),
        headers: { "content-type": "application/json" },
        method: "POST",
      });

      const payload = (await response.json()) as { message?: string; success?: boolean };
      if (!response.ok || !payload.success) {
        setError(payload.message ?? "Could not trigger generation.");
        return;
      }

      setSuccess(true);
      startTransition(() => router.refresh());
      setTimeout(() => onDone(), 1500);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not trigger generation.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-teal-200/15 bg-teal-300/10 p-4 text-sm text-teal-50">
        Diet plan generation has been queued.
      </div>
    );
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <p className="text-xs font-medium text-white/50">
        Queue diet plan generation for this order.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Reason</label>
          <input
            className={inputClass}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Retry failed delivery, first generation..."
            required
            value={reason}
          />
        </div>
        <div>
          <label className={labelClass}>Evidence</label>
          <input
            className={inputClass}
            onChange={(e) => setEvidence(e.target.value)}
            placeholder="Support ticket, error log..."
            required
            value={evidence}
          />
        </div>
      </div>
      {error ? (
        <div className="rounded-2xl border border-rose-200/15 bg-rose-300/10 p-3 text-xs text-rose-50">{error}</div>
      ) : null}
      <Button
        className="h-10 rounded-xl bg-violet-100 px-5 text-sm text-[#1f1735] hover:bg-violet-50"
        disabled={isSubmitting || isPending}
        type="submit"
      >
        {isSubmitting || isPending ? "Triggering..." : "Trigger generation"}
      </Button>
    </form>
  );
}

/* ─── Expandable row detail card ────────────────────────────────────── */

function OrderDetailCard({
  canManage,
  row,
}: {
  canManage: boolean;
  row: DietPlanRow;
}) {
  const [action, setAction] = useState<"confirm" | "generate" | null>(null);

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3 sm:p-4">
      <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
        {/* Left: metadata */}
        <div className="space-y-0.5">
          <DetailItem label="Order ID" value={
            <span className="flex items-center gap-2">
              <span className="font-mono">{row.id.slice(0, 8)}…</span>
              <CopyButton label="Copy ID" value={row.id} />
            </span>
          } />
          {row.paymentLinkUrl ? (
            <DetailItem label="Payment link" value={
              <span className="flex items-center gap-2">
                <a
                  className="truncate text-sky-200 underline-offset-4 hover:underline"
                  href={row.paymentLinkUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  {new URL(row.paymentLinkUrl).hostname}…
                </a>
                <CopyButton label="Copy link" value={row.paymentLinkUrl} />
              </span>
            } />
          ) : null}
          {row.paymentReference ? (
            <DetailItem label="Payment reference" value={row.paymentReference} />
          ) : null}
          {row.paymentConfirmedAt ? (
            <DetailItem label="Payment confirmed" value={row.paymentConfirmedAt} />
          ) : null}
          {row.paymentConfirmedBy ? (
            <DetailItem label="Confirmed by" value={row.paymentConfirmedBy} />
          ) : null}
          {row.razorpayOrderId ? (
            <DetailItem label="Razorpay order" value={
              <span className="font-mono">{row.razorpayOrderId}</span>
            } />
          ) : null}
          {row.razorpayPaymentId ? (
            <DetailItem label="Razorpay payment" value={
              <span className="font-mono">{row.razorpayPaymentId}</span>
            } />
          ) : null}
          {row.manualCreatedBy ? (
            <DetailItem label="Created by" value={row.manualCreatedBy} />
          ) : null}
          {row.adminNotes ? (
            <DetailItem label="Admin notes" value={row.adminNotes} />
          ) : null}
          {row.errorMessage ? (
            <DetailItem label="Error" value={
              <span className="text-rose-200">{row.errorMessage}</span>
            } />
          ) : null}
        </div>

        {/* Right: actions */}
        <div className="space-y-3">
          {canManage && row.canConfirmPayment && action !== "generate" ? (
            action === "confirm" ? (
              <ConfirmPaymentForm
                onDone={() => setAction(null)}
                orderId={row.id}
              />
            ) : (
              <button
                className="flex w-full items-center gap-2.5 rounded-2xl border border-sky-200/15 bg-sky-300/10 p-4 text-left text-sm text-sky-50 transition hover:bg-sky-300/15"
                onClick={() => setAction("confirm")}
                type="button"
              >
                <Wallet className="size-4 shrink-0" />
                Confirm payment received
              </button>
            )
          ) : null}

          {canManage && row.canGenerate && action !== "confirm" ? (
            action === "generate" ? (
              <TriggerGenerationForm
                onDone={() => setAction(null)}
                orderId={row.id}
              />
            ) : (
              <button
                className="flex w-full items-center gap-2.5 rounded-2xl border border-violet-200/15 bg-violet-300/10 p-4 text-left text-sm text-violet-50 transition hover:bg-violet-300/15"
                onClick={() => setAction("generate")}
                type="button"
              >
                <RefreshCw className="size-4 shrink-0" />
                {row.status === "failed" || row.status === "generating"
                  ? "Retry generation"
                  : "Trigger generation"}
              </button>
            )
          ) : null}

          {!canManage && (row.canConfirmPayment || row.canGenerate) ? (
            <div className="flex items-start gap-2.5 rounded-2xl border border-amber-200/15 bg-amber-300/10 p-4 text-xs leading-5 text-amber-50">
              <ShieldAlert className="mt-0.5 size-4 shrink-0" />
              Actions available for owner and ops admins only.
            </div>
          ) : null}

          {!row.canConfirmPayment && !row.canGenerate && !row.errorMessage ? (
            <p className="text-xs text-white/35">No actions available for this order.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* ─── Create Manual Order form ──────────────────────────────────────── */

function intakeToQuestionnaireData(data: IntakeFormData) {
  return {
    name: data.name.trim(),
    age: data.age.trim(),
    gender: "",
    city: "",
    height: data.height.trim(),
    weight: data.weight.trim(),
    conditions: data.conditions
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    medications: data.medications.trim(),
    allergies: data.allergies.trim(),
    diet: data.diet,
    region: "",
    regionOther: "",
    grain: "",
    oil: "",
    fasting: "",
    btime: "",
    ltime: "",
    dtime: "",
    portion: "",
    lateeat: "",
    cooks: "",
    sepcook: "",
    activity: data.activity.trim(),
    programs: [],
    goal: data.goals.trim(),
    dineout: "",
    loves: data.foodPreferences.trim(),
    hates: "",
    spice: "",
    tea: "",
    alcohol: "",
    softdrink: "",
    other: [data.dailyRoutine.trim(), data.adminNotes.trim()]
      .filter(Boolean)
      .join(" | "),
  };
}

function CreateManualOrderForm({ onCreated }: { onCreated: () => void }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [intake, setIntake] = useState<IntakeFormData>(INITIAL_INTAKE);
  const [amountInr, setAmountInr] = useState(String(DIET_PLAN_STANDALONE_PRICE_INR));
  const [reason, setReason] = useState("");
  const [evidence, setEvidence] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvancedJson, setShowAdvancedJson] = useState(false);
  const [advancedJson, setAdvancedJson] = useState("");

  const updateIntake = useCallback(
    <K extends keyof IntakeFormData>(key: K, value: IntakeFormData[K]) => {
      setIntake((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      let questionnaireData: Record<string, unknown>;

      if (showAdvancedJson && advancedJson.trim()) {
        try {
          questionnaireData = JSON.parse(advancedJson);
        } catch {
          setError("Advanced JSON is not valid JSON.");
          setIsSubmitting(false);
          return;
        }
      } else {
        questionnaireData = intakeToQuestionnaireData(intake);
      }

      const amountPaise = Math.round(Number(amountInr) * 100);
      if (!Number.isFinite(amountPaise) || amountPaise <= 0) {
        setError("Amount must be a positive number.");
        setIsSubmitting(false);
        return;
      }

      const response = await fetch("/api/admin/diet-plans/manual-orders", {
        body: JSON.stringify({
          adminNotes: intake.adminNotes.trim() || undefined,
          amountInPaise: amountPaise,
          email: intake.email,
          evidence,
          name: intake.name || undefined,
          paymentLinkUrl: intake.paymentLinkUrl,
          questionnaireData,
          reason,
        }),
        headers: { "content-type": "application/json" },
        method: "POST",
      });

      const payload = (await response.json()) as { message?: string; success?: boolean };
      if (!response.ok || !payload.success) {
        setError(payload.message ?? "Could not create manual order.");
        return;
      }

      setSuccess("Manual diet plan order created. Share the payment link with the client.");
      setIntake(INITIAL_INTAKE);
      setAmountInr(String(DIET_PLAN_STANDALONE_PRICE_INR));
      setReason("");
      setEvidence("");
      setAdvancedJson("");
      startTransition(() => router.refresh());
      onCreated();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not create manual order.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_0%_0%,rgba(199,183,255,0.10),transparent_34%),rgba(255,255,255,0.04)]">
      {/* Collapsible header */}
      <button
        className="flex w-full items-center justify-between border-b border-white/10 p-5 text-left transition hover:bg-white/[0.03]"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-violet-300/12 p-3 text-violet-100">
            <Plus className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Create manual diet plan order</h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-white/55">
              For clients who contacted via WhatsApp, phone, or email. Creates an order
              awaiting payment — does not generate the diet plan yet.
            </p>
          </div>
        </div>
        {isOpen ? (
          <ChevronDown className="size-5 shrink-0 text-white/40" />
        ) : (
          <ChevronRight className="size-5 shrink-0 text-white/40" />
        )}
      </button>

      {isOpen ? (
        <form className="p-5" onSubmit={handleSubmit}>
          {/* Callout */}
          <div className="mb-5 rounded-2xl border border-sky-200/15 bg-sky-300/10 p-4 text-sm leading-6 text-sky-50">
            <strong>How this works:</strong> Fill the client intake below, share the Razorpay
            payment link with the client, and confirm payment once collected. The diet plan is
            generated only after payment confirmation.
          </div>

          {/* Client info row */}
          <fieldset className="mb-5">
            <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              Client details
            </legend>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className={labelClass}>Email *</label>
                <input
                  className={inputClass}
                  onChange={(e) => updateIntake("email", e.target.value)}
                  placeholder="client@example.com"
                  required
                  type="email"
                  value={intake.email}
                />
              </div>
              <div>
                <label className={labelClass}>Name</label>
                <input
                  className={inputClass}
                  onChange={(e) => updateIntake("name", e.target.value)}
                  placeholder="Client name"
                  value={intake.name}
                />
              </div>
              <div>
                <label className={labelClass}>Age</label>
                <input
                  className={inputClass}
                  onChange={(e) => updateIntake("age", e.target.value)}
                  placeholder="32"
                  type="text"
                  value={intake.age}
                />
              </div>
              <div>
                <label className={labelClass}>Height</label>
                <input
                  className={inputClass}
                  onChange={(e) => updateIntake("height", e.target.value)}
                  placeholder="5'8&quot; or 173 cm"
                  value={intake.height}
                />
              </div>
              <div>
                <label className={labelClass}>Weight</label>
                <input
                  className={inputClass}
                  onChange={(e) => updateIntake("weight", e.target.value)}
                  placeholder="75 kg"
                  value={intake.weight}
                />
              </div>
              <div>
                <label className={labelClass}>Diet preference</label>
                <select
                  className={selectClass}
                  onChange={(e) => updateIntake("diet", e.target.value)}
                  value={intake.diet}
                >
                  <option className="bg-[#101716]" value="">Select...</option>
                  {DIET_OPTIONS.map((opt) => (
                    <option className="bg-[#101716]" key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>

          {/* Health info */}
          <fieldset className="mb-5">
            <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              Health &amp; goals
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Medical conditions</label>
                <input
                  className={inputClass}
                  onChange={(e) => updateIntake("conditions", e.target.value)}
                  placeholder="Diabetes, PCOS, thyroid (comma-separated)"
                  value={intake.conditions}
                />
              </div>
              <div>
                <label className={labelClass}>Current medications</label>
                <input
                  className={inputClass}
                  onChange={(e) => updateIntake("medications", e.target.value)}
                  placeholder="Metformin 500mg, Thyronorm..."
                  value={intake.medications}
                />
              </div>
              <div>
                <label className={labelClass}>Allergies</label>
                <input
                  className={inputClass}
                  onChange={(e) => updateIntake("allergies", e.target.value)}
                  placeholder="Nuts, dairy, gluten..."
                  value={intake.allergies}
                />
              </div>
              <div>
                <label className={labelClass}>Primary goals</label>
                <input
                  className={inputClass}
                  onChange={(e) => updateIntake("goals", e.target.value)}
                  placeholder="Weight loss, blood sugar control..."
                  value={intake.goals}
                />
              </div>
              <div>
                <label className={labelClass}>Activity level</label>
                <input
                  className={inputClass}
                  onChange={(e) => updateIntake("activity", e.target.value)}
                  placeholder="Sedentary, walks 30 min daily..."
                  value={intake.activity}
                />
              </div>
            </div>
          </fieldset>

          {/* Preferences */}
          <fieldset className="mb-5">
            <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              Food &amp; routine
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Food preferences / likes</label>
                <textarea
                  className={textareaClass}
                  onChange={(e) => updateIntake("foodPreferences", e.target.value)}
                  placeholder="Loves dal rice, south Indian food, hates bitter gourd..."
                  value={intake.foodPreferences}
                />
              </div>
              <div>
                <label className={labelClass}>Daily routine</label>
                <textarea
                  className={textareaClass}
                  onChange={(e) => updateIntake("dailyRoutine", e.target.value)}
                  placeholder="Wakes 7am, office 9-6, dinner by 9pm..."
                  value={intake.dailyRoutine}
                />
              </div>
            </div>
          </fieldset>

          {/* Advanced JSON toggle */}
          <div className="mb-5">
            <button
              className="flex items-center gap-1.5 text-xs text-white/40 transition hover:text-white/60"
              onClick={() => setShowAdvancedJson(!showAdvancedJson)}
              type="button"
            >
              {showAdvancedJson ? (
                <ChevronDown className="size-3" />
              ) : (
                <ChevronRight className="size-3" />
              )}
              Advanced: paste raw questionnaire JSON
            </button>
            {showAdvancedJson ? (
              <div className="mt-2">
                <textarea
                  className={cn(textareaClass, "min-h-[120px] font-mono text-xs")}
                  onChange={(e) => setAdvancedJson(e.target.value)}
                  placeholder='{"name": "...", "age": "32", "conditions": ["Diabetes"], ...}'
                  value={advancedJson}
                />
                <p className="mt-1 text-xs text-white/35">
                  When provided, this overrides all structured fields above.
                </p>
              </div>
            ) : null}
          </div>

          {/* Order metadata */}
          <fieldset className="mb-5">
            <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              Order details &amp; audit
            </legend>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className={labelClass}>Amount (₹) *</label>
                <input
                  className={inputClass}
                  min="1"
                  onChange={(e) => setAmountInr(e.target.value)}
                  required
                  step="1"
                  type="number"
                  value={amountInr}
                />
              </div>
              <div>
                <label className={labelClass}>Razorpay payment link *</label>
                <input
                  className={inputClass}
                  onChange={(e) => updateIntake("paymentLinkUrl", e.target.value)}
                  placeholder="https://rzp.io/i/..."
                  required
                  type="url"
                  value={intake.paymentLinkUrl}
                />
              </div>
              <div>
                <label className={labelClass}>Reason *</label>
                <input
                  className={inputClass}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="WhatsApp lead, phone enquiry..."
                  required
                  value={reason}
                />
              </div>
              <div>
                <label className={labelClass}>Evidence *</label>
                <input
                  className={inputClass}
                  onChange={(e) => setEvidence(e.target.value)}
                  placeholder="WhatsApp screenshot, email thread..."
                  required
                  value={evidence}
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-2">
                <label className={labelClass}>Admin notes</label>
                <input
                  className={inputClass}
                  onChange={(e) => updateIntake("adminNotes", e.target.value)}
                  placeholder="Optional internal notes"
                  value={intake.adminNotes}
                />
              </div>
            </div>
          </fieldset>

          {error ? (
            <div className="mb-4 rounded-2xl border border-rose-200/15 bg-rose-300/10 p-4 text-sm text-rose-50">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="mb-4 rounded-2xl border border-teal-200/15 bg-teal-300/10 p-4 text-sm text-teal-50">
              {success}
            </div>
          ) : null}

          <Button
            className="h-11 rounded-2xl bg-violet-100 px-6 text-sm text-[#1f1735] hover:bg-violet-50"
            disabled={isSubmitting || isPending}
            type="submit"
          >
            {isSubmitting || isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Creating order...
              </>
            ) : (
              "Create manual order"
            )}
          </Button>
        </form>
      ) : null}
    </section>
  );
}

/* ─── Mobile order card ─────────────────────────────────────────────── */

function MobileOrderCard({
  canManage,
  isExpanded,
  onToggle,
  row,
}: {
  canManage: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  row: DietPlanRow;
}) {
  const hasActions = row.canConfirmPayment || row.canGenerate;
  const hasDetails =
    row.paymentLinkUrl ||
    row.paymentReference ||
    row.errorMessage ||
    row.adminNotes ||
    row.razorpayOrderId ||
    row.manualCreatedBy;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04]">
      <button
        className="w-full p-4 text-left transition hover:bg-white/[0.04]"
        onClick={onToggle}
        type="button"
      >
        {/* Top: email + status */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white/85">{row.email}</p>
            {row.name && row.name !== "No name" ? (
              <p className="truncate text-xs text-white/40">{row.name}</p>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <StatusBadge status={row.status} />
            {isExpanded ? (
              <ChevronDown className="size-4 text-white/40" />
            ) : (
              <ChevronRight className="size-4 text-white/40" />
            )}
          </div>
        </div>

        {/* Bottom: metadata row */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-white/50">
          <span>{row.createdAt}</span>
          <span className="font-medium text-white/65">{row.amount}</span>
          <SourceBadge source={row.source} />
        </div>

        {/* Compact info line */}
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/40">
          <span>Paid: {row.paymentConfirmedAt ?? "—"}</span>
          <span>Generated / scheduled: {row.fulfilledAt}</span>
        </div>

        {(hasActions || hasDetails) && !isExpanded ? (
          <p className="mt-2 text-xs text-white/30">
            Tap to {hasActions ? "see actions" : "see details"}
          </p>
        ) : null}
      </button>

      {isExpanded ? (
        <div className="border-t border-white/[0.06] p-4">
          <OrderDetailCard canManage={canManage} row={row} />
        </div>
      ) : null}
    </div>
  );
}

/* ─── Main table + detail cards ─────────────────────────────────────── */

function DietPlanOrderTable({
  canManage,
  rows,
}: {
  canManage: boolean;
  rows: DietPlanRow[];
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.05] p-8 text-center sm:p-12">
        <FileText className="mb-3 size-8 text-white/25" />
        <p className="text-sm text-white/50">No diet plan orders in the selected range.</p>
      </div>
    );
  }

  return (
    <>
      {/* ── Mobile: card layout (<md) ── */}
      <div className="space-y-3 md:hidden">
        {rows.map((row) => (
          <MobileOrderCard
            canManage={canManage}
            isExpanded={expandedId === row.id}
            key={row.id}
            onToggle={() => setExpandedId(expandedId === row.id ? null : row.id)}
            row={row}
          />
        ))}
      </div>

      {/* ── Desktop: table layout (≥md) ── */}
      <div className="hidden overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/[0.06] text-xs uppercase tracking-[0.18em] text-white/45">
              <tr>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Created</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Client</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Amount</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Status</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Source</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Payment confirmed</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Generated / scheduled</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {rows.map((row) => {
                const isExpanded = expandedId === row.id;
                const hasActions = row.canConfirmPayment || row.canGenerate;
                const hasDetails =
                  row.paymentLinkUrl ||
                  row.paymentReference ||
                  row.errorMessage ||
                  row.adminNotes ||
                  row.razorpayOrderId ||
                  row.manualCreatedBy;

                return (
                  <tr key={row.id} className="group">
                    <td colSpan={8} className="p-0">
                      {/* Main row */}
                      <button
                        className="flex w-full items-center text-left transition hover:bg-white/[0.04]"
                        onClick={() => setExpandedId(isExpanded ? null : row.id)}
                        type="button"
                      >
                        <span className="whitespace-nowrap px-4 py-3 text-white/70">{row.createdAt}</span>
                        <span className="min-w-[180px] px-4 py-3">
                          <span className="block text-white/80">{row.email}</span>
                          {row.name && row.name !== "No name" ? (
                            <span className="block text-xs text-white/40">{row.name}</span>
                          ) : null}
                        </span>
                        <span className="whitespace-nowrap px-4 py-3 text-white/70">{row.amount}</span>
                        <span className="px-4 py-3"><StatusBadge status={row.status} /></span>
                        <span className="px-4 py-3"><SourceBadge source={row.source} /></span>
                        <span className="whitespace-nowrap px-4 py-3 text-white/55">
                          {row.paymentConfirmedAt ?? "—"}
                        </span>
                        <span className="whitespace-nowrap px-4 py-3 text-white/55">{row.fulfilledAt}</span>
                        <span className="px-4 py-3">
                          {hasActions || hasDetails ? (
                            <span className="inline-flex items-center gap-1 text-xs text-white/40">
                              {isExpanded ? (
                                <ChevronDown className="size-4" />
                              ) : (
                                <ChevronRight className="size-4" />
                              )}
                              {hasActions ? "Actions" : "Details"}
                            </span>
                          ) : (
                            <span className="text-xs text-white/25">—</span>
                          )}
                        </span>
                      </button>

                      {/* Expanded detail */}
                      {isExpanded ? (
                        <div className="border-t border-white/[0.06] px-4 pb-4 pt-3">
                          <OrderDetailCard canManage={canManage} row={row} />
                        </div>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ─── Public export ─────────────────────────────────────────────────── */

export function DietPlanOpsPanel({
  canManage,
  rows,
}: {
  canManage: boolean;
  rows: DietPlanRow[];
}) {
  const [, setLastCreated] = useState(0);

  return (
    <div className="space-y-5">
      {/* Create Manual Order – owner/ops only */}
      {canManage ? (
        <CreateManualOrderForm onCreated={() => setLastCreated(Date.now())} />
      ) : null}

      {/* Error summary banner */}
      {rows.some((r) => r.errorMessage) ? (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-200/15 bg-rose-300/10 p-4 text-sm text-rose-50">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <span>
            {rows.filter((r) => r.errorMessage).length} order{rows.filter((r) => r.errorMessage).length > 1 ? "s" : ""}{" "}
            with errors — expand rows for details.
          </span>
        </div>
      ) : null}

      {/* Orders table */}
      <DietPlanOrderTable canManage={canManage} rows={rows} />
    </div>
  );
}
