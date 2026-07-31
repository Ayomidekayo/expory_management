
import clsx from "clsx";
import type { ReactNode } from "react";

interface FormGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
}

export default function FormGrid({
  children,
  columns = 2,
}: FormGridProps) {
  return (
    <div
      className={clsx(
        "grid gap-6",
        columns === 2 && "md:grid-cols-2",
        columns === 3 && "md:grid-cols-3",
        columns === 4 && "md:grid-cols-4"
      )}
    >
      {children}
    </div>
  );
}