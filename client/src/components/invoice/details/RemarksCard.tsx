import {
  MessageSquare,
  FileText,
} from "lucide-react";
import type { Invoice } from "../../../types/invoice";


interface Props {
  invoice: Invoice;
}

function Section({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value?: string | null;
}) {
  return (
    <div className="space-y-3">

      <div className="flex items-center gap-2">

        {icon}

        <h3 className="font-medium">
          {title}
        </h3>

      </div>

      <div className="min-h-28 rounded-lg border bg-slate-50 p-4">

        {value ? (
          <p className="whitespace-pre-wrap text-sm leading-7">
            {value}
          </p>
        ) : (
          <p className="italic text-muted-foreground">
            No remarks available.
          </p>
        )}

      </div>

    </div>
  );
}

export default function RemarksCard({
  invoice,
}: Props) {
  return (
    <div className="rounded-xl border bg-white">

      <div className="border-b p-5">

        <div className="flex items-center gap-2">

          <MessageSquare className="h-5 w-5 text-primary" />

          <h2 className="text-lg font-semibold">
            Remarks
          </h2>

        </div>

      </div>

      <div className="space-y-6 p-5">

        <Section
          icon={
            <MessageSquare className="h-4 w-4 text-blue-600" />
          }
          title="Customer Remarks"
          value={invoice.remarks}
        />

        <Section
          icon={
            <FileText className="h-4 w-4 text-orange-600" />
          }
          title="Internal Notes"
          value={invoice.shipment?.remarks}
        />

      </div>

    </div>
  );
}