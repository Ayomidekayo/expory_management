import type { ReactNode } from "react";


interface Props {
  label: string;
  value: ReactNode;
}

export default function InfoCard({
  label,
  value,
}: Props) {
  return (
    <div className="rounded-lg border bg-slate-50 p-4">

      <p className="text-sm text-slate-500">

        {label}

      </p>

      <p className="mt-1 font-semibold">

        {value}

      </p>

    </div>
  );
}