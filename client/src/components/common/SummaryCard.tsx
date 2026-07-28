import type { LucideIcon } from "lucide-react";
import { TrendingUp } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: string;
  trend?: string;
}

export default function SummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "bg-emerald-100 text-emerald-600",
  trend,
}: SummaryCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-slate-100 opacity-40 transition-all group-hover:scale-110" />

      <div className="relative flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
            {title}
          </p>

          <h2 className="text-4xl font-bold tracking-tight text-slate-900">
            {value}
          </h2>

          {subtitle && (
            <p className="text-sm text-slate-500">
              {subtitle}
            </p>
          )}

          {trend && (
            <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
              <TrendingUp className="h-3.5 w-3.5" />
              {trend}
            </div>
          )}
        </div>

        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm ${color}`}
        >
          <Icon className="h-8 w-8" />
        </div>
      </div>

      <div className="mt-6 h-1 rounded-full bg-gradient-to-r from-emerald-500 via-yellow-400 to-blue-500" />
    </div>
  );
}