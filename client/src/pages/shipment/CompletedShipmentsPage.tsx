import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  PackageCheck,
  Search,
  Ship,
} from "lucide-react";

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom"
import { useShipments } from "../../hooks/shipments/useShipments";

export default function CompletedShipmentsPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  /* =========================================
     GET COMPLETED SHIPMENTS
  ========================================= */

  const {
    data: response,
    isLoading,
    isError,
  } = useShipments({
    status: "COMPLETED",
  });

  const shipments = response?.data ?? [];

  /* =========================================
     SEARCH
  ========================================= */

  const filteredShipments = useMemo(() => {
    if (!search.trim()) {
      return shipments;
    }

    const query =
      search.trim().toLowerCase();

    return shipments.filter((shipment) => {
      return (
        shipment.shipmentNumber
          ?.toLowerCase()
          .includes(query) ||
        shipment.client?.companyName
          ?.toLowerCase()
          .includes(query) ||
        shipment.exporter?.name
          ?.toLowerCase()
          .includes(query) ||
        shipment.consignee?.name
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [shipments, search]);

  /* =========================================
     TOTAL
  ========================================= */

  const totalCompleted =
    response?.pagination?.total ??
    shipments.length;

  return (
    <div className="space-y-6">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-start gap-3">

          <button
            type="button"
            onClick={() =>
              navigate("/shipments")
            }
            className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
            aria-label="Back to shipments"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Completed Shipments
              </h1>

              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <CheckCircle2 size={13} />
                Completed
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              View historical shipments that have
              completed their operational lifecycle.
            </p>
          </div>
        </div>
      </div>

      {/* =====================================
          SUMMARY
      ===================================== */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <PackageCheck size={21} />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Completed Shipments
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {totalCompleted}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Ship size={21} />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Historical Records
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-700">
                Available for review
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <CheckCircle2 size={21} />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Status
              </p>

              <p className="mt-1 text-sm font-semibold text-emerald-700">
                Successfully completed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================
          SEARCH
      ===================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search completed shipments..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
          />
        </div>
      </div>

      {/* =====================================
          LOADING
      ===================================== */}

      {isLoading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-16 animate-pulse rounded-xl bg-slate-100"
                />
              )
            )}
          </div>
        </div>
      )}

      {/* =====================================
          ERROR
      ===================================== */}

      {isError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <h2 className="font-semibold text-red-800">
            Unable to load completed shipments
          </h2>

          <p className="mt-1 text-sm text-red-600">
            Please try again.
          </p>
        </div>
      )}

      {/* =====================================
          TABLE
      ===================================== */}

      {!isLoading &&
        !isError &&
        filteredShipments.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="overflow-x-auto">
              <table className="min-w-[1100px] w-full">

                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Shipment
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Date
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Client
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Exporter
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Transport
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      View
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">

                  {filteredShipments.map(
                    (shipment) => (
                      <tr
                        key={shipment.id}
                        className="group transition hover:bg-slate-50"
                      >
                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold text-slate-900">
                            {shipment.shipmentNumber}
                          </p>

                          {shipment.bookingNumber && (
                            <p className="mt-1 text-xs text-slate-500">
                              Booking:{" "}
                              {shipment.bookingNumber}
                            </p>
                          )}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {formatDate(
                            shipment.shipmentDate
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-slate-800">
                            {shipment.client
                              ?.companyName ||
                              "—"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm text-slate-700">
                            {shipment.exporter
                              ?.name || "—"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                            {shipment.transportMode ||
                              "—"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                            <CheckCircle2
                              size={13}
                            />
                            Completed
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/shipments/${shipment.id}`
                              )
                            }
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-900 hover:text-white"
                            title="View shipment details"
                            aria-label={`View ${shipment.shipmentNumber}`}
                          >
                            <ArrowRight size={17} />
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      {/* =====================================
          EMPTY
      ===================================== */}

      {!isLoading &&
        !isError &&
        filteredShipments.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <PackageCheck size={25} />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              {search
                ? "No matching completed shipments"
                : "No completed shipments"}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              {search
                ? "Try a different shipment number, client, exporter, or consignee."
                : "Completed shipments will appear here once their status is marked as completed."}
            </p>

            {search && (
              <button
                type="button"
                onClick={() =>
                  setSearch("")
                }
                className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
    </div>
  );
}

/* =========================================
   HELPERS
========================================= */

function formatDate(
  value?: string | null
) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}