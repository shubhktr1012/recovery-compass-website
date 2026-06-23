"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, Pause, Pencil, Play, Plus, Users } from "lucide-react";
import type {
  AdminReferralDashboard,
  AdminReferralPartner,
} from "@/lib/admin/referrals";
import { suggestReferralCode } from "@/lib/referral-utils";
import { Button } from "@/components/ui/button";

function formatInr(paise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

function formatDate(value: string | null) {
  return value
    ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(value))
    : "No referrals yet";
}

const primaryButtonClass =
  "rounded-xl bg-emerald-100 px-4 text-[#073512] shadow-sm shadow-black/15 transition-[background-color,box-shadow,transform] duration-150 ease-out hover:bg-emerald-50 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-emerald-100/45";

const secondaryButtonClass =
  "rounded-xl border border-white/14 bg-white/[0.08] px-4 text-white/86 transition-[background-color,border-color,color,transform] duration-150 ease-out hover:border-white/24 hover:bg-white/[0.13] hover:text-white active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white/25";

const copyButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.08] px-3 py-2 text-xs font-semibold text-white/82 transition-[background-color,border-color,color,transform] duration-150 ease-out hover:border-white/24 hover:bg-white/[0.13] hover:text-white active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25";

export function ReferralOpsPanel({
  canManage,
  initialData,
}: {
  canManage: boolean;
  initialData: AdminReferralDashboard;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"partners" | "payouts">("partners");
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [codeEdited, setCodeEdited] = useState(false);
  const [partnerType, setPartnerType] = useState("coach");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [payoutNotes, setPayoutNotes] = useState<Record<string, string>>({});
  const [editingPartner, setEditingPartner] = useState<AdminReferralPartner | null>(null);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://recoverycompass.co";

  const request = async (url: string, init: RequestInit) => {
    setMessage("");
    setIsSaving(true);
    try {
      const response = await fetch(url, init);
      const payload = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(payload.message || "Admin action failed.");
      router.refresh();
      return true;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Admin action failed.");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const createPartner = async (event: React.FormEvent) => {
    event.preventDefault();
    const saved = await request("/api/admin/referrals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, code, partnerType, email, phone, notes, expiresAt, maxUses }),
    });
    if (saved) {
      setName("");
      setCode("");
      setEmail("");
      setPhone("");
      setNotes("");
      setExpiresAt("");
      setMaxUses("");
      setCodeEdited(false);
      setShowCreate(false);
      setMessage("Partner created.");
    }
  };

  const togglePartner = async (partner: AdminReferralPartner) => {
    const status = partner.status === "active" ? "paused" : "active";
    const saved = await request("/api/admin/referrals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partnerId: partner.id, status }),
    });
    if (saved) setMessage(`${partner.name} is now ${status}.`);
  };

  const savePartner = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingPartner) return;
    const saved = await request("/api/admin/referrals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        partnerId: editingPartner.id,
        name: editingPartner.name,
        code: editingPartner.code,
        partnerType: editingPartner.partnerType,
        email: editingPartner.email || "",
        phone: editingPartner.phone || "",
        notes: editingPartner.notes || "",
        expiresAt: editingPartner.expiresAt || "",
        maxUses: editingPartner.maxUses ?? "",
      }),
    });
    if (saved) {
      setEditingPartner(null);
      setMessage("Partner details updated.");
    }
  };

  const markPaid = async (partner: AdminReferralPartner) => {
    const payoutNote = payoutNotes[partner.id]?.trim();
    const saved = await request("/api/admin/referrals/payouts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partnerId: partner.id, payoutNote }),
    });
    if (saved) {
      setPayoutNotes((current) => ({ ...current, [partner.id]: "" }));
      setMessage(`Unpaid commissions for ${partner.name} were marked paid.`);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-2xl border border-white/10 bg-white/[0.05] p-1">
          {(["partners", "payouts"] as const).map((value) => (
            <button
              className={`rounded-xl px-4 py-2 text-sm font-semibold capitalize ${
                tab === value ? "bg-sky-100 text-[#082035]" : "text-white/55"
              }`}
              key={value}
              onClick={() => setTab(value)}
              type="button"
            >
              {value}
            </button>
          ))}
        </div>
        {canManage && tab === "partners" ? (
          <Button className={primaryButtonClass} onClick={() => setShowCreate((open) => !open)}>
            <Plus className="mr-2 size-4" /> Add partner
          </Button>
        ) : null}
      </div>

      {message ? (
        <p className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white/75">
          {message}
        </p>
      ) : null}

      {showCreate ? (
        <form className="grid gap-4 rounded-3xl border border-white/10 bg-white/[0.06] p-5 md:grid-cols-2" onSubmit={createPartner}>
          <label className="space-y-2 text-sm text-white/60">
            <span>Partner name</span>
            <input
              className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-white outline-none focus:border-sky-200/50"
              onChange={(event) => {
                setName(event.target.value);
                if (!codeEdited) setCode(suggestReferralCode(event.target.value));
              }}
              required
              value={name}
            />
          </label>
          <label className="space-y-2 text-sm text-white/60">
            <span>Referral code</span>
            <input
              className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 font-mono uppercase text-white outline-none focus:border-sky-200/50"
              onChange={(event) => {
                setCodeEdited(true);
                setCode(suggestReferralCode(event.target.value));
              }}
              required
              value={code}
            />
          </label>
          <label className="space-y-2 text-sm text-white/60">
            <span>Partner type</span>
            <select className="w-full rounded-xl border border-white/10 bg-[#0a2112] px-3 py-2.5 text-white" onChange={(event) => setPartnerType(event.target.value)} value={partnerType}>
              <option value="coach">Coach</option>
              <option value="mentor">Mentor</option>
              <option value="nutritionist">Nutritionist</option>
            </select>
          </label>
          <label className="space-y-2 text-sm text-white/60">
            <span>Email</span>
            <input className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-white" onChange={(event) => setEmail(event.target.value)} type="email" value={email} />
          </label>
          <label className="space-y-2 text-sm text-white/60">
            <span>Phone</span>
            <input className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-white" onChange={(event) => setPhone(event.target.value)} value={phone} />
          </label>
          <label className="space-y-2 text-sm text-white/60">
            <span>Internal notes</span>
            <input className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-white" onChange={(event) => setNotes(event.target.value)} value={notes} />
          </label>
          <label className="space-y-2 text-sm text-white/60">
            <span>Expiry date (optional)</span>
            <input className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-white" onChange={(event) => setExpiresAt(event.target.value)} type="date" value={expiresAt} />
          </label>
          <label className="space-y-2 text-sm text-white/60">
            <span>Maximum uses (optional)</span>
            <input className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-white" min="1" onChange={(event) => setMaxUses(event.target.value)} type="number" value={maxUses} />
          </label>
          <div className="flex gap-2 md:col-span-2">
            <Button className={primaryButtonClass} disabled={isSaving} type="submit">Create partner</Button>
            <Button className={secondaryButtonClass} onClick={() => setShowCreate(false)} type="button" variant="outline">Cancel</Button>
          </div>
        </form>
      ) : null}

      {tab === "partners" ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {initialData.partners.map((partner) => (
            <article className="rounded-3xl border border-white/10 bg-white/[0.05] p-5" key={partner.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-white">{partner.name}</h2>
                    <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] uppercase tracking-wider text-white/55">{partner.partnerType}</span>
                  </div>
                  <p className="mt-1 text-sm text-white/45">{partner.email || partner.phone || "No contact added"}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${partner.status === "active" ? "bg-emerald-300/15 text-emerald-100" : "bg-amber-300/15 text-amber-100"}`}>
                  {partner.status}
                </span>
              </div>
              <div className="mt-5 space-y-3 rounded-2xl bg-black/20 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">Referral code</p>
                    <p className="mt-1 break-all font-mono text-lg font-semibold text-sky-100">{partner.code}</p>
                  </div>
                  <button
                    aria-label={`Copy referral code for ${partner.name}`}
                    className={copyButtonClass}
                    onClick={() => navigator.clipboard.writeText(partner.code)}
                    type="button"
                  >
                    <Copy className="size-3.5" /> Copy code
                  </button>
                </div>
                <div className="flex flex-col gap-3 border-t border-white/10 pt-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">Referral link</p>
                    <p className="mt-1 break-all font-mono text-xs font-medium text-white/70">{siteUrl}/?ref={partner.code}</p>
                  </div>
                  <button
                    aria-label={`Copy referral link for ${partner.name}`}
                    className={copyButtonClass}
                    onClick={() => navigator.clipboard.writeText(`${siteUrl}/?ref=${partner.code}`)}
                    type="button"
                  >
                    <Copy className="size-3.5" /> Copy link
                  </button>
                </div>
              </div>
              <dl className="mt-5 grid grid-cols-3 gap-3 text-sm">
                <div><dt className="text-white/40">Referrals</dt><dd className="mt-1 font-semibold text-white">{partner.successfulReferrals}</dd></div>
                <div><dt className="text-white/40">Unpaid</dt><dd className="mt-1 font-semibold text-white">{formatInr(partner.unpaidCommissionPaise)}</dd></div>
                <div><dt className="text-white/40">Last sale</dt><dd className="mt-1 text-xs font-semibold text-white">{formatDate(partner.lastRedemptionAt)}</dd></div>
              </dl>
              {editingPartner?.id === partner.id ? (
                <form className="mt-5 grid gap-3 rounded-2xl border border-white/10 bg-black/15 p-4 sm:grid-cols-2" onSubmit={savePartner}>
                  <input aria-label="Partner name" className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white" onChange={(event) => setEditingPartner({ ...editingPartner, name: event.target.value })} value={editingPartner.name} />
                  <input aria-label="Referral code" className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 font-mono text-sm uppercase text-white" onChange={(event) => setEditingPartner({ ...editingPartner, code: suggestReferralCode(event.target.value) })} value={editingPartner.code} />
                  <select aria-label="Partner type" className="rounded-xl border border-white/10 bg-[#0a2112] px-3 py-2 text-sm text-white" onChange={(event) => setEditingPartner({ ...editingPartner, partnerType: event.target.value as AdminReferralPartner["partnerType"] })} value={editingPartner.partnerType}>
                    <option value="coach">Coach</option><option value="mentor">Mentor</option><option value="nutritionist">Nutritionist</option>
                  </select>
                  <input aria-label="Partner email" className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white" onChange={(event) => setEditingPartner({ ...editingPartner, email: event.target.value })} placeholder="Email" type="email" value={editingPartner.email || ""} />
                  <input aria-label="Partner phone" className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white" onChange={(event) => setEditingPartner({ ...editingPartner, phone: event.target.value })} placeholder="Phone" value={editingPartner.phone || ""} />
                  <input aria-label="Internal notes" className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white" onChange={(event) => setEditingPartner({ ...editingPartner, notes: event.target.value })} placeholder="Internal notes" value={editingPartner.notes || ""} />
                  <input aria-label="Expiry date" className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white" onChange={(event) => setEditingPartner({ ...editingPartner, expiresAt: event.target.value || null })} type="date" value={editingPartner.expiresAt?.slice(0, 10) || ""} />
                  <input aria-label="Maximum uses" className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white" min="1" onChange={(event) => setEditingPartner({ ...editingPartner, maxUses: event.target.value ? Number(event.target.value) : null })} placeholder="Maximum uses" type="number" value={editingPartner.maxUses ?? ""} />
                  <div className="flex gap-2 sm:col-span-2"><Button className={primaryButtonClass} disabled={isSaving} size="sm" type="submit">Save</Button><Button className={secondaryButtonClass} onClick={() => setEditingPartner(null)} size="sm" type="button" variant="outline">Cancel</Button></div>
                </form>
              ) : null}
              {canManage ? (
                <div className="mt-5 flex gap-2">
                  <Button className={secondaryButtonClass} disabled={isSaving} onClick={() => setEditingPartner(partner)} size="sm" variant="outline"><Pencil className="mr-2 size-3.5" /> Edit</Button>
                  <Button className={secondaryButtonClass} disabled={isSaving} onClick={() => togglePartner(partner)} size="sm" variant="outline">
                    {partner.status === "active" ? <Pause className="mr-2 size-3.5" /> : <Play className="mr-2 size-3.5" />}
                    {partner.status === "active" ? "Pause code" : "Reactivate code"}
                  </Button>
                </div>
              ) : null}
            </article>
          ))}
          {initialData.partners.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/15 p-10 text-center text-white/50 xl:col-span-2">
              <Users className="mx-auto mb-3 size-6" /> No referral partners yet.
            </div>
          ) : null}
        </div>
      ) : (
        <div className="space-y-4">
          {initialData.partners.map((partner) => {
            const rows = initialData.redemptions.filter((row) => row.partnerId === partner.id);
            const unpaidRows = rows.filter((row) => row.redemptionStatus === "active" && row.payoutStatus === "unpaid");
            if (rows.length === 0) return null;
            return (
              <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05]" key={partner.id}>
                <div className="flex flex-col gap-4 border-b border-white/10 p-5 md:flex-row md:items-end md:justify-between">
                  <div><h2 className="font-semibold text-white">{partner.name}</h2><p className="mt-1 text-sm text-white/45">{unpaidRows.length} unpaid · {formatInr(partner.unpaidCommissionPaise)} due</p></div>
                  {canManage && unpaidRows.length > 0 ? (
                    <div className="flex w-full gap-2 md:w-auto">
                      <input className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white md:w-64" onChange={(event) => setPayoutNotes((current) => ({ ...current, [partner.id]: event.target.value }))} placeholder="UTR / payout reference" value={payoutNotes[partner.id] || ""} />
                      <Button className={primaryButtonClass} disabled={isSaving || (payoutNotes[partner.id]?.trim().length ?? 0) < 3} onClick={() => markPaid(partner)} size="sm"><Check className="mr-2 size-4" /> Mark paid</Button>
                    </div>
                  ) : null}
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="text-xs uppercase tracking-wider text-white/35"><tr><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Sale</th><th className="px-5 py-3">Commission</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Date</th></tr></thead>
                    <tbody className="divide-y divide-white/10">
                      {rows.map((row) => <tr key={row.id}><td className="px-5 py-3 text-white/70">{row.customerEmail || "Unknown"}</td><td className="px-5 py-3 text-white/70">{formatInr(row.finalAmountPaise)}</td><td className="px-5 py-3 font-semibold text-white">{formatInr(row.commissionAmountPaise)}</td><td className="px-5 py-3 text-white/60">{row.redemptionStatus === "active" ? row.payoutStatus : row.redemptionStatus}</td><td className="px-5 py-3 text-white/50">{formatDate(row.createdAt)}</td></tr>)}
                    </tbody>
                  </table>
                </div>
              </section>
            );
          })}
          {initialData.redemptions.length === 0 ? <div className="rounded-3xl border border-dashed border-white/15 p-10 text-center text-white/50">No referral sales yet.</div> : null}
        </div>
      )}
    </div>
  );
}
