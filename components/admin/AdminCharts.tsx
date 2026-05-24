"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AdminTrendPoint } from "@/lib/admin/types";

type BarDatum = {
  count: number;
  label: string;
  technical?: string;
};

export function TrendLineChart({
  data,
  lines,
}: {
  data: AdminTrendPoint[];
  lines: Array<{ key: keyof AdminTrendPoint; label: string; color: string }>;
}) {
  return (
    <div className="h-72 rounded-3xl border border-white/10 bg-white/[0.05] p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ bottom: 8, left: -20, right: 12, top: 8 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis
            dataKey="label"
            stroke="rgba(255,255,255,0.45)"
            tick={{ fontSize: 11 }}
            tickLine={false}
          />
          <YAxis stroke="rgba(255,255,255,0.35)" tick={{ fontSize: 11 }} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: "#07180d",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: 16,
              color: "white",
            }}
          />
          {lines.map((line) => (
            <Line
              key={String(line.key)}
              dataKey={line.key}
              dot={false}
              name={line.label}
              stroke={line.color}
              strokeWidth={2.5}
              type="monotone"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SimpleBarChart({ data }: { data: BarDatum[] }) {
  return (
    <div className="h-72 rounded-3xl border border-white/10 bg-white/[0.05] p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data.slice(0, 8)} layout="vertical" margin={{ left: 18, right: 12 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" horizontal={false} />
          <XAxis type="number" stroke="rgba(255,255,255,0.35)" tick={{ fontSize: 11 }} />
          <YAxis
            dataKey="label"
            stroke="rgba(255,255,255,0.45)"
            tick={{ fontSize: 11 }}
            type="category"
            width={112}
          />
          <Tooltip
            contentStyle={{
              background: "#07180d",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: 16,
              color: "white",
            }}
          />
          <Bar dataKey="count" fill="#b7e7c0" radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
