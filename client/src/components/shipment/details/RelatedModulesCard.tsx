import {
  ArrowRight,
  Box,
  FileText,
  FolderOpen,
  Package,
  Route,
  Truck,
} from "lucide-react";

import { Link } from "react-router-dom";

import { Button } from "../../ui/button";

import type { Shipment } from "../../../types/shipment.types";

interface Props {
  shipment: Shipment;
}

interface ModuleRowProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText?: string;
  to?: string;
  iconClassName?: string;
  iconBgClassName?: string;
  children?: React.ReactNode;
}

function ModuleRow({
  icon,
  title,
  description,
  buttonText,
  to,
  iconClassName = "text-slate-600",
  iconBgClassName = "bg-slate-50",
  children,
}: ModuleRowProps) {
  return (
    <div className="border-b border-slate-100 py-6 last:border-b-0">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 ${iconBgClassName} ${iconClassName}`}
          >
            {icon}
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-900">
              {title}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {description}
            </p>
          </div>
        </div>

        {buttonText && to && (
          <Button
            asChild
            variant="outline"
            className="w-full border-slate-200 bg-white sm:w-auto"
          >
            <Link to={to}>
              {buttonText}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>

      {/* Related records */}
      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  );
}

interface RelatedRecordProps {
  to: string;
  title: string;
  subtitle?: string;
  status?: string;
}

function RelatedRecord({
  to,
  title,
  subtitle,
  status,
}: RelatedRecordProps) {
  return (
    <Link
      to={to}
      className="group flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 transition hover:border-primary/30 hover:bg-slate-50"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-900 group-hover:text-primary">
          {title}
        </p>

        {subtitle && (
          <p className="mt-1 text-xs text-slate-500">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {status && (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            {status}
          </span>
        )}

        <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

function EmptyRelatedRecord({
  message,
}: {
  message: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 px-5 py-8 text-center">
      <p className="text-sm font-medium text-slate-700">
        Nothing here yet
      </p>

      <p className="mt-1 text-sm text-slate-500">
        {message}
      </p>
    </div>
  );
}

export default function RelatedModulesCard({
  shipment,
}: Props) {
  const invoices = shipment.invoices ?? [];

  const containers = shipment.containers ?? [];

  const packingList = shipment.packingList;

  const transits = shipment.transits ?? [];

  const documents = shipment.documents ?? [];

  /*
   * Gate movements are attached to containers.
   *
   * We flatten them here so the shipment page
   * can display all gates belonging to the shipment.
   */
  const gates = containers.flatMap((container) => {
    const containerWithGates = container as typeof container & {
      gateMovements?: Array<{
        id: string;
        gateType?: string;
        status?: string;
        yardStoreNumber?: string | null;
      }>;
    };

    return (
      containerWithGates.gateMovements?.map(
        (gate) => ({
          ...gate,
          containerNumber:
            container.containerNumber,
        })
      ) ?? []
    );
  });

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 bg-slate-50/60 px-6 py-5">
        <h2 className="text-base font-semibold text-slate-900">
          Related Modules
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Everything connected to this shipment.
        </p>
      </div>

      <div className="px-6">

        {/* =====================================================
            INVOICES
        ===================================================== */}

        <ModuleRow
          icon={<FileText className="h-5 w-5" />}
          title="Invoices"
          description="Create and manage invoices for this shipment."
          buttonText="Create Invoice"
          to={`/invoices/create?shipmentId=${shipment.id}`}
          iconClassName="text-blue-600"
          iconBgClassName="bg-blue-50"
        >
          {invoices.length > 0 ? (
            <div className="space-y-2">
              {invoices.map((invoice) => (
                <RelatedRecord
                  key={invoice.id}
                  to={`/invoices/${invoice.id}`}
                  title={invoice.invoiceNumber}
                  subtitle={`${invoice.currency} ${Number(
                    invoice.totalAmount ?? 0
                  ).toLocaleString()}`}
                  status={invoice.status}
                />
              ))}
            </div>
          ) : (
            <EmptyRelatedRecord message="No invoices have been linked to this shipment." />
          )}
        </ModuleRow>

        {/* =====================================================
            PACKING LIST
        ===================================================== */}

        <ModuleRow
          icon={<Package className="h-5 w-5" />}
          title="Packing List"
          description="Create and manage the packing list for this shipment."
          buttonText={packingList ? "View" : "Create Packing List"}
          to={
            packingList
              ? `/packing-lists/${packingList.id}`
              : `/packing-lists/create?shipmentId=${shipment.id}`
          }
          iconClassName="text-emerald-600"
          iconBgClassName="bg-emerald-50"
        >
          {packingList ? (
            <RelatedRecord
              to={`/packing-lists/${packingList.id}`}
              title={packingList.packingListNumber}
              subtitle={`${packingList.items?.length ?? 0} item(s)`}
            />
          ) : (
            <EmptyRelatedRecord message="No packing list has been created for this shipment." />
          )}
        </ModuleRow>

        {/* =====================================================
            CONTAINERS
        ===================================================== */}

        <ModuleRow
          icon={<Truck className="h-5 w-5" />}
          title="Containers"
          description="Manage containers associated with this shipment."
          buttonText="Add Container"
          to={`/containers/create?shipmentId=${shipment.id}`}
          iconClassName="text-orange-600"
          iconBgClassName="bg-orange-50"
        >
          {containers.length > 0 ? (
            <div className="space-y-2">
              {containers.map((container) => (
                <RelatedRecord
                  key={container.id}
                  to={`/containers/${container.id}`}
                  title={container.containerNumber}
                  subtitle={`${container.containerType} • ${container.containerSize}`}
                  status={container.status}
                />
              ))}
            </div>
          ) : (
            <EmptyRelatedRecord message="No containers have been assigned to this shipment." />
          )}
        </ModuleRow>

        {/* =====================================================
            GATES
        ===================================================== */}

        <ModuleRow
          icon={<Box className="h-5 w-5" />}
          title="Gate Movements"
          description="Track gate entry and exit activities for this shipment."
          buttonText="Add Gate"
          to={`/gates/create?shipmentId=${shipment.id}`}
          iconClassName="text-red-600"
          iconBgClassName="bg-red-50"
        >
          {gates.length > 0 ? (
            <div className="space-y-2">
              {gates.map((gate) => (
                <RelatedRecord
                  key={gate.id}
                  to={`/gates/${gate.id}`}
                  title={`${gate.gateType ?? "Gate Movement"} — ${
                    gate.containerNumber
                  }`}
                  subtitle={
                    gate.yardStoreNumber
                      ? `Yard/Store: ${gate.yardStoreNumber}`
                      : undefined
                  }
                  status={gate.status}
                />
              ))}
            </div>
          ) : (
            <EmptyRelatedRecord message="No gate movements have been recorded for this shipment." />
          )}
        </ModuleRow>

        {/* =====================================================
            TRANSITS
        ===================================================== */}

        <ModuleRow
          icon={<Route className="h-5 w-5" />}
          title="Transit"
          description="Manage transit activities for this shipment."
          buttonText="Add Transit"
          to={`/transits/create?shipmentId=${shipment.id}`}
          iconClassName="text-purple-600"
          iconBgClassName="bg-purple-50"
        >
          {transits.length > 0 ? (
            <div className="space-y-2">
              {transits.map((transit) => (
                <RelatedRecord
                  key={transit.id}
                  to={`/transits/${transit.id}`}
                  title={`Transit ${transit.id}`}
                />
              ))}
            </div>
          ) : (
            <EmptyRelatedRecord message="No transit activities have been recorded for this shipment." />
          )}
        </ModuleRow>

        {/* =====================================================
            DOCUMENTS
        ===================================================== */}

        <ModuleRow
          icon={<FolderOpen className="h-5 w-5" />}
          title="Documents"
          description="Upload and manage documents related to this shipment."
          buttonText="Upload Document"
          to={`/documents/create?shipmentId=${shipment.id}`}
          iconClassName="text-rose-600"
          iconBgClassName="bg-rose-50"
        >
          {documents.length > 0 ? (
            <div className="space-y-2">
              {documents.map((document) => (
                <RelatedRecord
                  key={document.id}
                  to={`/documents/${document.id}`}
                  title={document.fileName}
                  subtitle={document.type}
                />
              ))}
            </div>
          ) : (
            <EmptyRelatedRecord message="No documents have been uploaded for this shipment." />
          )}
        </ModuleRow>
      </div>
    </div>
  );
}