import {
  Calculator,
  Truck,
  DollarSign,
} from "lucide-react";

interface Props {
  subtotal: number;
  freight: number;
  total: number;
  currency?: "NGN" | "USD" | "EUR";
}

function formatMoney(
  value: number,
  currency?: "NGN" | "USD" | "EUR"
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency ?? "NGN",
  }).format(value);
}

function Row({
  icon,
  label,
  value,
  bold = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between py-4 ${
        bold ? "border-t text-lg font-bold" : "border-b"
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </div>
      <span>{value}</span>
    </div>
  );
}

export default function Totals({
  subtotal,
  freight,
  total,
  currency,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Invoice Summary</h2>
        <p className="text-sm text-muted-500">
          Financial summary of this invoice.
        </p>
      </div>

      <div className="max-w-lg ml-auto">
        <Row
          icon={<Calculator className="h-5 w-5 text-blue-600" />}
          label="Subtotal"
          value={formatMoney(subtotal, currency)} // ✅ pass currency
        />

        <Row
          icon={<Truck className="h-5 w-5 text-orange-600" />}
          label="Freight"
          value={formatMoney(freight, currency)} // ✅ pass currency
        />

        <Row
          icon={<DollarSign className="h-5 w-5 text-green-600" />}
          label="Grand Total"
          value={formatMoney(total, currency)} // ✅ pass currency
          bold
        />
      </div>
    </div>
  );
}
