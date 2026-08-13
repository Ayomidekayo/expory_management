import type { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

import {
  Building2,
  UserRound,
  Users,
  ClipboardList,
} from "lucide-react";

import { useClients } from "../../../hooks/client/useClients";
import { useExporters } from "../../../hooks/exporter/useExporters";
import { useConsignees } from "../../../hooks/consignee/useConsignees";
import { useAllocations } from "../../../hooks/allocation/useAllocations";

import type { CreateShipmentInput } from "../../../validations/shipment.validation";

interface Props {
  form: UseFormReturn<CreateShipmentInput>;
}

function FieldIcon({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500">
      {children}
    </div>
  );
}

export default function PartiesInformation({
  form,
}: Props) {
  const { data: clients } = useClients();

  const { data: exporters } = useExporters();

  const { data: consignees } = useConsignees();

  const { data: allocations } = useAllocations();

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* =========================================
          HEADER
      ========================================= */}

      <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Users className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Parties Information
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              Select the parties associated with this shipment.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================
          FORM CONTENT
      ========================================= */}

      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* =====================================
              CLIENT
          ===================================== */}

          <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Client
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <Building2 className="h-4 w-4" />
                  </FieldIcon>

                  <div className="min-w-0 flex-1">
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 w-full border-slate-200 bg-white">
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {clients?.data?.map((client) => (
                          <SelectItem
                            key={client.id}
                            value={client.id}
                          >
                            {client.companyName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* =====================================
              EXPORTER
          ===================================== */}

          <FormField
            control={form.control}
            name="exporterId"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Exporter
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <UserRound className="h-4 w-4" />
                  </FieldIcon>

                  <div className="min-w-0 flex-1">
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 w-full border-slate-200 bg-white">
                          <SelectValue placeholder="Select exporter" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {exporters?.data?.map((exporter) => (
                          <SelectItem
                            key={exporter.id}
                            value={exporter.id}
                          >
                            {exporter.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* =====================================
              CONSIGNEE
          ===================================== */}

          <FormField
            control={form.control}
            name="consigneeId"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Consignee
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <UserRound className="h-4 w-4" />
                  </FieldIcon>

                  <div className="min-w-0 flex-1">
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 w-full border-slate-200 bg-white">
                          <SelectValue placeholder="Select consignee" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {consignees?.data?.map((consignee) => (
                          <SelectItem
                            key={consignee.id}
                            value={consignee.id}
                          >
                            {consignee.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* =====================================
              ALLOCATION
          ===================================== */}

          <FormField
            control={form.control}
            name="allocationId"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Allocation
                  <span className="ml-1 text-xs font-normal text-slate-400">
                    (Optional)
                  </span>
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <ClipboardList className="h-4 w-4" />
                  </FieldIcon>

                  <div className="min-w-0 flex-1">
                    <Select
                      value={field.value ?? ""}
                      onValueChange={(value) =>
                        field.onChange(
                          value === "none"
                            ? undefined
                            : value
                        )
                      }
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 w-full border-slate-200 bg-white">
                          <SelectValue placeholder="Select allocation" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value="none">
                          No Allocation
                        </SelectItem>

                        {allocations?.data?.map(
                          (allocation) => (
                            <SelectItem
                              key={allocation.id}
                              value={allocation.id}
                            >
                              {allocation.allocationNumber}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}