import { Building2, Package } from "lucide-react";

interface Props {
  clients: any[];
}

export default function TopClientsCard({
  clients,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-6">

        <h2 className="text-lg font-semibold text-slate-900">
          Top Clients
        </h2>

        <p className="text-sm text-slate-500">
          Ranked by shipment volume
        </p>

      </div>

      <div className="space-y-4">

        {clients.map((client, index) => (

          <div
            key={client.id}
            className="
              group
              flex
              items-center
              justify-between
              rounded-xl
              border
              border-slate-200
              p-4
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-blue-400
              hover:bg-blue-50
              hover:shadow-md
            "
          >

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">

                <Building2 className="h-6 w-6" />

              </div>

              <div>

                <h4 className="font-semibold text-slate-900">
                  {client.companyName}
                </h4>

                <p className="text-sm text-slate-500">
                  Rank #{index + 1}
                </p>

              </div>

            </div>

            <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-2 text-emerald-700">

              <Package className="h-4 w-4" />

              <span className="text-sm font-semibold">
                {client._count.shipments}
              </span>

            </div>

          </div>

        ))}

        {clients.length === 0 && (

          <div className="rounded-xl border border-dashed border-slate-300 py-10 text-center text-slate-500">
            No client statistics available.
          </div>

        )}

      </div>

    </div>
  );
}