import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { EMPTY_SUMMARY_VALUE, type SummaryRow } from "@/lib/admin/user-summary-snapshot";
import { cn } from "@/lib/utils";

const BADGE_TONES = {
  amber: "bg-amber-300/12 text-amber-100 ring-amber-200/20",
  rose: "bg-rose-300/12 text-rose-100 ring-rose-200/20",
  sky: "bg-sky-300/12 text-sky-100 ring-sky-200/20",
  slate: "bg-slate-300/10 text-slate-100 ring-slate-200/15",
  teal: "bg-teal-300/12 text-teal-100 ring-teal-200/20",
  violet: "bg-violet-300/12 text-violet-100 ring-violet-200/20",
};

const ADMIN_INNER_CARD =
  "gap-0 rounded-[1.35rem] border-white/10 bg-white/[0.05] py-0 text-white shadow-none";

function SnapshotValue({ row }: { row: SummaryRow }) {
  const isEmpty = row.value === EMPTY_SUMMARY_VALUE;

  if (row.badgeTone && !isEmpty) {
    return (
      <Badge
        className={cn("capitalize hover:bg-transparent", BADGE_TONES[row.badgeTone])}
        variant="outline"
      >
        {row.value}
      </Badge>
    );
  }

  return (
    <span className={cn("text-sm leading-6", isEmpty ? "text-white/35" : "text-white/82")}>
      {row.value}
    </span>
  );
}

export function SummarySnapshotSection({
  highlight,
  rows,
  title,
}: {
  highlight?: boolean;
  rows: SummaryRow[];
  title: string;
}) {
  return (
    <Card
      className={cn(
        ADMIN_INNER_CARD,
        highlight && "border-teal-200/20 bg-teal-300/[0.08]"
      )}
    >
      <CardHeader className="border-b border-white/10 px-4 py-3">
        <CardTitle className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0 pt-0">
        <Table>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                className="border-white/10 hover:bg-white/[0.04] data-[state=selected]:bg-white/[0.04]"
                key={row.key}
              >
                <TableCell className="w-[38%] align-top px-4 py-2.5 text-xs font-medium uppercase tracking-[0.12em] text-white/42">
                  {row.label}
                </TableCell>
                <TableCell className="align-top px-4 py-2.5 whitespace-normal">
                  <SnapshotValue row={row} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
