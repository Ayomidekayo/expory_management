import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  shipmentSchema,
  type ShipmentFormData,
} from "../../validations/shipment.validation";

import { useExporters } from "../../hooks/exporter/useExporters";
import { useConsignees } from "../../hooks/consignee/useConsignees";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Props {
  defaultValues?: Partial<ShipmentFormData>;
  loading?: boolean;
  onSubmit: (values: ShipmentFormData) => void;
}

export default function ShipmentForm({
  defaultValues,
  loading,
  onSubmit,
}: Props) {
  const form = useForm<ShipmentFormData>({
    resolver: zodResolver(shipmentSchema),

    defaultValues: {
      shipmentDate: "",
      exporterId: "",
      consigneeId: "",
      xfNumber: "",
      nxpNumber: "",
      cciNumber: "",
      eNumber: "",

      ...defaultValues,
    },
  });

  const { data: exporters = [], isLoading: exportersLoading } = useExporters();

  const { data: consignees = [], isLoading: consigneesLoading } =
    useConsignees();

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipment Date */}

        <div className="space-y-2">
          <label className="font-medium text-sm">Shipment Date *</label>

          <Input type="date" {...form.register("shipmentDate")} />

          <p className="text-sm text-red-500">
            {form.formState.errors.shipmentDate?.message}
          </p>
        </div>

        {/* Exporter */}

        <div className="space-y-2">
          <label className="font-medium text-sm">Exporter *</label>

          <Select
            value={form.watch("exporterId")}
            onValueChange={(value) =>
              form.setValue("exporterId", value, {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Exporter" />
            </SelectTrigger>

            <SelectContent>
              {exportersLoading ? (
                <SelectItem value="loading" disabled>
                  Loading...
                </SelectItem>
              ) : (
                exporters.map((exporter: any) => (
                  <SelectItem key={exporter.id} value={exporter.id}>
                    {exporter.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          <p className="text-sm text-red-500">
            {form.formState.errors.exporterId?.message}
          </p>
        </div>

        {/* Consignee */}

        <div className="space-y-2">
          <label className="font-medium text-sm">Consignee *</label>

          <Select
            value={form.watch("consigneeId")}
            onValueChange={(value) =>
              form.setValue("consigneeId", value, {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Consignee" />
            </SelectTrigger>

            <SelectContent>
              {consigneesLoading ? (
                <SelectItem value="loading2" disabled>
                  Loading...
                </SelectItem>
              ) : (
                consignees.map((consignee: any) => (
                  <SelectItem key={consignee.id} value={consignee.id}>
                    {consignee.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          <p className="text-sm text-red-500">
            {form.formState.errors.consigneeId?.message}
          </p>
        </div>

        {/* XF */}

        <div className="space-y-2">
          <label className="font-medium text-sm">XF Number</label>

          <Input placeholder="XF000123" {...form.register("xfNumber")} />

          <p className="text-sm text-red-500">
            {form.formState.errors.xfNumber?.message}
          </p>
        </div>

        {/* NXP */}

        <div className="space-y-2">
          <label className="font-medium text-sm">NXP Number</label>

          <Input placeholder="NXP000123" {...form.register("nxpNumber")} />

          <p className="text-sm text-red-500">
            {form.formState.errors.nxpNumber?.message}
          </p>
        </div>

        {/* CCI */}

        <div className="space-y-2">
          <label className="font-medium text-sm">CCI Number</label>

          <Input placeholder="CCI000123" {...form.register("cciNumber")} />

          <p className="text-sm text-red-500">
            {form.formState.errors.cciNumber?.message}
          </p>
        </div>

        {/* E Number */}

        <div className="space-y-2">
          <label className="font-medium text-sm">E Number</label>

          <Input placeholder="E000123" {...form.register("eNumber")} />

          <p className="text-sm text-red-500">
            {form.formState.errors.eNumber?.message}
          </p>
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full h-11">
        {loading ? "Saving Shipment..." : "Save Shipment"}
      </Button>
    </form>
  );
}
