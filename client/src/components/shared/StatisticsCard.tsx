import type { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
}

export default function StatisticsCard({
  title,
  value,
  icon: Icon,
  description,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {value}
          </h2>

          {description && (
            <p className="mt-2 text-sm text-muted-foreground">
              {description}
            </p>
          )}

        </div>

        <div className="rounded-full bg-primary/10 p-4">

          <Icon className="h-7 w-7 text-primary" />

        </div>

      </div>

    </div>
  );
}