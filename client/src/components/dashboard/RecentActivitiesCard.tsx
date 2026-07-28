import {
  FileText,
  Truck,
  Receipt,
} from "lucide-react";

interface Props {
  activities: any;
}

const iconStyles = {
  shipment:
    "bg-emerald-100 text-emerald-600",
  invoice:
    "bg-amber-100 text-amber-600",
  document:
    "bg-blue-100 text-blue-600",
};

export default function RecentActivitiesCard({
  activities,
}: Props) {
  const items = [
    ...activities.shipments.map((s: any) => ({
      title: `Shipment ${s.shipmentNumber}`,
      icon: Truck,
      color: iconStyles.shipment,
      date: s.createdAt,
    })),

    ...activities.invoices.map((i: any) => ({
      title: `Invoice ${i.invoiceNumber}`,
      icon: Receipt,
      color: iconStyles.invoice,
      date: i.createdAt,
    })),

    ...activities.documents.map((d: any) => ({
      title: d.fileName,
      icon: FileText,
      color: iconStyles.document,
      date: d.uploadedAt,
    })),
  ].sort(
    (a, b) =>
      new Date(b.date).getTime() -
      new Date(a.date).getTime()
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-6">

        <h2 className="text-lg font-semibold text-slate-900">
          Recent Activities
        </h2>

        <p className="text-sm text-slate-500">
          Latest activities across your export operations
        </p>

      </div>

      <div className="space-y-4">

        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 py-10 text-center text-slate-500">
            No recent activities.
          </div>
        ) : (
          items.slice(0, 8).map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="
                  group
                  flex
                  items-center
                  gap-4
                  rounded-xl
                  border
                  border-slate-200
                  p-4
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-emerald-400
                  hover:bg-slate-50
                  hover:shadow-md
                "
              >
                <div
                  className={`
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-2xl
                    ${item.color}
                  `}
                >
                  <Icon className="h-6 w-6" />
                </div>

                <div className="flex-1">

                  <h4 className="font-semibold text-slate-900">
                    {item.title}
                  </h4>

                  <p className="mt-1 text-sm text-slate-500">
                    {new Date(
                      item.date
                    ).toLocaleString()}
                  </p>

                </div>

              </div>
            );
          })
        )}

      </div>

    </div>
  );
}