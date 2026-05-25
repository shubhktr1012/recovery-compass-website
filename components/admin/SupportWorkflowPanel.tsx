import { ExternalLink, ShieldCheck } from "lucide-react";
import { CopySupportButton } from "@/components/admin/CopySupportButton";
import type { SupportSnippet, SupabaseTableLink } from "@/lib/admin/support";

const SNIPPET_TONES = [
  "bg-sky-300/10 text-sky-100 ring-sky-200/15",
  "bg-amber-300/10 text-amber-100 ring-amber-200/15",
  "bg-violet-300/10 text-violet-100 ring-violet-200/15",
  "bg-rose-300/10 text-rose-100 ring-rose-200/15",
  "bg-teal-300/10 text-teal-100 ring-teal-200/15",
];

export function SupportWorkflowPanel({
  snippets,
  tableLinks,
}: {
  snippets: SupportSnippet[];
  tableLinks: SupabaseTableLink[];
}) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_0%_0%,rgba(139,211,255,0.12),transparent_32%),radial-gradient(circle_at_95%_8%,rgba(247,198,106,0.12),transparent_30%),rgba(255,255,255,0.045)]">
      <div className="border-b border-white/10 p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sky-100">
              <ShieldCheck className="size-5" />
              <h2 className="text-lg font-semibold">Phase 1.5 support workflow</h2>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/58">
              This section helps non-technical support users inspect and escalate cases
              without mutating production data. Copy packets are intentionally read-only
              or non-executable until admin roles and audit logs exist.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-xs leading-5 text-white/55">
            <p className="font-semibold text-white/75">Safety rule</p>
            <p>No grant, retry, queue, or payment write runs from this screen.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/42">
              Support checklist
            </p>
            <ol className="mt-3 space-y-2 text-sm leading-6 text-white/66">
              <li>1. Confirm the user email and UUID match the support request.</li>
              <li>2. Check web transactions or external store evidence before any entitlement review.</li>
              <li>3. Check active and queued programs before requesting any grant or queue change.</li>
              <li>4. Check outbound emails before escalating diet plan delivery issues.</li>
              <li>5. Copy the right packet and send it to an owner/engineer for the actual write.</li>
            </ol>
          </div>

          {tableLinks.length > 0 ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/42">
                Open Supabase tables
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {tableLinks.map((link, index) => (
                  <a
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium ring-1 transition hover:bg-white/[0.12] hover:text-white ${
                      SNIPPET_TONES[index % SNIPPET_TONES.length]
                    }`}
                    href={link.href}
                    key={link.table}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {link.label}
                    <ExternalLink className="size-3" />
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {snippets.map((snippet, index) => (
            <div
              className="rounded-3xl border border-white/10 bg-black/15 p-4"
              key={snippet.label}
            >
              <p
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                  SNIPPET_TONES[index % SNIPPET_TONES.length]
                }`}
              >
                {snippet.label}
              </p>
              <p className="mt-2 min-h-10 text-xs leading-5 text-white/50">
                {snippet.description}
              </p>
              <div className="mt-4">
                <CopySupportButton label={snippet.label} text={snippet.body} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
