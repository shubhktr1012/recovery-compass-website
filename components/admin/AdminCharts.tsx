"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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

const ADMIN_CHART_COLORS = [
  "#8bd3ff",
  "#f7c66a",
  "#c7b7ff",
  "#ff9fb2",
  "#7dd6c6",
  "#f4a66f",
  "#a8c5ff",
  "#d7e8a5",
];

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
              background: "#111716",
              border: "1px solid rgba(255,255,255,0.16)",
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
  const visibleData = data.slice(0, 8);

  return (
    <div className="h-72 rounded-3xl border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.07),rgba(255,255,255,0.035))] p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={visibleData} layout="vertical" margin={{ left: 18, right: 12 }}>
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
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
            contentStyle={{
              background: "#111716",
              border: "1px solid rgba(255,255,255,0.16)",
              borderRadius: 16,
              color: "white",
            }}
          />
          <Bar dataKey="count" radius={[0, 8, 8, 0]}>
            {visibleData.map((entry, index) => (
              <Cell
                fill={ADMIN_CHART_COLORS[index % ADMIN_CHART_COLORS.length]}
                key={`${entry.label}-${index}`}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
