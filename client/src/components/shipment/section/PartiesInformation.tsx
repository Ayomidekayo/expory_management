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

import { useClients } from "../../../hooks/client/useClients";
import { useExporters } from "../../../hooks/exporter/useExporters";
import { useConsignees } from "../../../hooks/consignee/useConsignees";
import { useAllocations } from "../../../hooks/allocation/useAllocations";
import type { CreateShipmentInput } from "../../../validations/shipment.validation";


interface Props {
  form: UseFormReturn<CreateShipmentInput>;
}

export default function PartiesInformation({
  form,
}: Props) {
  const { data: clients } =
    useClients();

  const { data: exporters } =
    useExporters();

  const { data: consignees } =
    useConsignees();

  const { data: allocations } =
    useAllocations();

  return (
    <div className="rounded-xl border bg-white p-6">

      <div className="mb-6">

        <h2 className="text-xl font-semibold">
          Parties Information
        </h2>

        <p className="text-sm text-slate-500">
          Select the client, exporter,
          consignee and allocation.
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2">

        {/* Client */}

        <FormField
          control={form.control}
          name="clientId"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                Client
              </FormLabel>

              <Select
                value={field.value}
                onValueChange={field.onChange}
              >

                <FormControl>

                  <SelectTrigger>

                    <SelectValue placeholder="Select Client" />

                  </SelectTrigger>

                </FormControl>

                <SelectContent>

                  {clients?.data?.map(
                    (client) => (

                      <SelectItem
                        key={client.id}
                        value={client.id}
                      >
                        {client.companyName}
                      </SelectItem>

                    )
                  )}

                </SelectContent>

              </Select>

              <FormMessage />

            </FormItem>
          )}
        />

        {/* Exporter */}

        <FormField
          control={form.control}
          name="exporterId"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                Exporter
              </FormLabel>

              <Select
                value={field.value}
                onValueChange={field.onChange}
              >

                <FormControl>

                  <SelectTrigger>

                    <SelectValue placeholder="Select Exporter" />

                  </SelectTrigger>

                </FormControl>

                <SelectContent>

                  {exporters?.data?.map(
                    (exporter) => (

                      <SelectItem
                        key={exporter.id}
                        value={exporter.id}
                      >
                        {exporter.name}
                      </SelectItem>

                    )
                  )}

                </SelectContent>

              </Select>

              <FormMessage />

            </FormItem>
          )}
        />

        {/* Consignee */}

        <FormField
          control={form.control}
          name="consigneeId"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                Consignee
              </FormLabel>

              <Select
                value={field.value}
                onValueChange={field.onChange}
              >

                <FormControl>

                  <SelectTrigger>

                    <SelectValue placeholder="Select Consignee" />

                  </SelectTrigger>

                </FormControl>

                <SelectContent>

                  {consignees?.data?.map(
                    (consignee) => (

                      <SelectItem
                        key={consignee.id}
                        value={consignee.id}
                      >
                        {consignee.name}
                      </SelectItem>

                    )
                  )}

                </SelectContent>

              </Select>

              <FormMessage />

            </FormItem>
          )}
        />

        {/* Allocation */}

        <FormField
          control={form.control}
          name="allocationId"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                Allocation
              </FormLabel>

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

                  <SelectTrigger>

                    <SelectValue placeholder="Select Allocation (Optional)" />

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

              <FormMessage />

            </FormItem>
          )}
        />

      </div>

    </div>
  );
}