type PricingStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

interface PricingStatusBadgeProps {
  status: PricingStatus;
  className?: string;
}

const statusConfig: Record<
  PricingStatus,
  { label: string; styles: string }
> = {
  DRAFT: {
    label: "Draft",
    styles: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  ACTIVE: {
    label: "Active",
    styles: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  ARCHIVED: {
    label: "Archived",
    styles: "bg-slate-100 text-slate-600 ring-slate-200",
  },
};

export default function PricingStatusBadge({
  status,
  className = "",
}: PricingStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full px-3 py-1",
        "text-xs font-semibold ring-1 ring-inset",
        config.styles,
        className,
      ].join(" ")}
    >
      <span
        aria-hidden="true"
        className={[
          "h-1.5 w-1.5 rounded-full",
          status === "ACTIVE"
            ? "bg-emerald-500"
            : status === "DRAFT"
              ? "bg-amber-500"
              : "bg-slate-400",
        ].join(" ")}
      />

      {config.label}
    </span>
  );
}