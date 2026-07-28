import {
  FilePlus2,
  Truck,
  FileText,
  Boxes,
} from "lucide-react";

import { Link } from "react-router-dom";

const actions = [
  {
    icon: FilePlus2,
    title: "Allocation",
    to: "/allocations/new",
    color: "bg-blue-100 text-blue-600",
    hover: "hover:border-blue-500 hover:bg-blue-50",
  },
  {
    icon: Truck,
    title: "Shipment",
    to: "/shipments/new",
    color: "bg-emerald-100 text-emerald-600",
    hover: "hover:border-emerald-500 hover:bg-emerald-50",
  },
  {
    icon: FileText,
    title: "Invoice",
    to: "/invoices/create",
    color: "bg-amber-100 text-amber-600",
    hover: "hover:border-amber-500 hover:bg-amber-50",
  },
  {
    icon: Boxes,
    title: "Container",
    to: "/containers/create",
    color: "bg-purple-100 text-purple-600",
    hover: "hover:border-purple-500 hover:bg-purple-50",
  },
];

export default function QuickActions() {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-lg font-semibold">
        Quick Actions
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              to={action.to}
              className={`
                group
                rounded-xl
                border
                border-slate-200
                p-5
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-lg
                ${action.hover}
              `}
            >
              <div
                className={`
                  mb-4
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  ${action.color}
                `}
              >
                <Icon className="h-7 w-7" />
              </div>

              <h3 className="font-semibold text-slate-900">
                {action.title}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Create a new {action.title.toLowerCase()}.
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}