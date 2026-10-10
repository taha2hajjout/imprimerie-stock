"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from "recharts"

interface ChartItem {
  name: string
  fullName: string
  ratio: number
  isLow: boolean
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: ChartItem }> }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-white border border-border rounded-lg px-3 py-2 shadow-md text-xs">
      <p className="font-medium text-text mb-0.5">{d.fullName}</p>
      <p className={d.isLow ? "text-danger" : "text-ok"}>
        {d.isLow ? "Sous le seuil" : "Stock OK"} — {(d.ratio * 100).toFixed(0)}% du seuil
      </p>
    </div>
  )
}

export function StockChart({ data }: { data: ChartItem[] }) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(160, data.length * 28)}>
      <BarChart layout="vertical" data={data} barSize={14} margin={{ top: 4, right: 24, left: 0, bottom: 4 }}>
        <XAxis
          type="number"
          domain={[0, Math.max(3, ...data.map((d) => d.ratio))]}
          tick={{ fontSize: 10, fill: "#78716C" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={120}
          tick={{ fontSize: 11, fill: "#1C1917" }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F7F4F0" }} />
        <ReferenceLine x={1} stroke="#E8E3DD" strokeWidth={1.5} strokeDasharray="4 3" label={{ value: "seuil", position: "top", fontSize: 9, fill: "#78716C" }} />
        <Bar dataKey="ratio" radius={[0, 4, 4, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.isLow ? "#DC2626" : "#16A34A"} opacity={entry.isLow ? 0.9 : 0.75} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
