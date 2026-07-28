interface DetailRowProps {
  label: string;

  value?: React.ReactNode;

  className?: string;
}

export default function DetailRow({
  label,
  value,
  className,
}: DetailRowProps) {
  return (
    <div
      className={`flex items-start justify-between gap-4 border-b pb-2 last:border-0 last:pb-0 ${className ?? ""}`}
    >

      <span className="text-sm font-medium text-muted-foreground">

        {label}

      </span>

      <span className="text-right text-sm font-medium">

        {value ?? "-"}

      </span>

    </div>
  );
}