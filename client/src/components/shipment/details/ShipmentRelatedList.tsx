import {
  ArrowRight,
  ChevronRight,
  FileText,
  Package,
  Truck,
  Route,
} from "lucide-react";
import { Link } from "react-router-dom";

interface RelatedItem {
  id: string;
  title: string;
  subtitle?: string;
  status?: string;
}

interface Props {
  title: string;
  description: string;
  items: RelatedItem[];
  emptyText: string;
  viewAllTo: string;
  createTo?: string;
  icon?: React.ReactNode;
}

export default function ShipmentRelatedList({
  title,
  description,
  items,
  emptyText,
  viewAllTo,
  createTo,
  icon,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900">
              {title}
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              {description}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {createTo && (
            <Link
              to={createTo}
              className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Add
            </Link>
          )}

          <Link
            to={viewAllTo}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            View all
          </Link>
        </div>
      </div>

      <div className="p-5">
        {items.length === 0 ? (
          <div className="flex min-h-[140px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/40 text-center">
            <p className="text-sm font-semibold text-slate-900">
              Nothing here yet
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {emptyText}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <Link
                key={item.id}
                to={`${viewAllTo}/${item.id}`}
                className="group flex items-center justify-between rounded-lg border border-slate-200 p-4 transition hover:bg-slate-50"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900 group-hover:text-primary">
                    {item.title}
                  </p>

                  {item.subtitle && (
                    <p className="mt-1 text-xs text-slate-500">
                      {item.subtitle}
                    </p>
                  )}
                </div>

                <div className="ml-4 flex shrink-0 items-center gap-3">
                  {item.status && (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      {item.status}
                    </span>
                  )}

                  <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}