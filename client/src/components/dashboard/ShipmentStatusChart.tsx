import {
  BarChart,
  Bar,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface Props {
  data: {
    name: string;
    value: number;
  }[];
}

const STATUS_COLORS: Record<string, string> = {
  Draft: "#F59E0B",        // Amber
  Pending: "#3B82F6",      // Blue
  "In Transit": "#10B981", // Emerald
  Completed: "#8B5CF6",    // Purple
  Cancelled: "#EF4444",    // Red
};

export default function ShipmentStatusChart({
  data,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">

      <div className="mb-6">

        <h2 className="text-lg font-semibold">
          Shipment Status
        </h2>

        <p className="text-sm text-muted-foreground">
          Current shipment distribution
        </p>

      </div>

      <ResponsiveContainer
        width="100%"
        height={320}
      >
        <BarChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#E2E8F0"
          />

          <XAxis
            dataKey="name"
            tick={{ fill: "#64748B", fontSize: 13 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fill: "#64748B", fontSize: 13 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            cursor={{ fill: "#F8FAFC" }}
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #E2E8F0",
              boxShadow:
                "0 8px 24px rgba(0,0,0,0.08)",
            }}
          />

          <Bar
            dataKey="value"
            radius={[10, 10, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  STATUS_COLORS[entry.name] ??
                  "#10B981"
                }
              />
            ))}
          </Bar>

        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}