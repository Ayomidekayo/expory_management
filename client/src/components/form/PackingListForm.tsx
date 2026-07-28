import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  packingListSchema,
  type PackingListFormData,

} from "../../validations/packing-list.validation";

import { useShipments } from "../../hooks/shipments/useShipments";

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
  defaultValues?: Partial<PackingListFormData>;

  loading?: boolean;

  isEditing?: boolean;

  onSubmit: (values: PackingListFormData) => void;
}

export default function PackingListForm({
  defaultValues,
  loading,
  isEditing = false,
  onSubmit,
}: Props) {
  const form = useForm<PackingListFormData>({
    resolver: zodResolver(packingListSchema),

    defaultValues: {
      shipmentId: "",

      packingListNumber: "",

      grossWeight: 0,

      netWeight: 0,

      ...defaultValues,
    },
  });

  const { data: shipments = [] } = useShipments();

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-5">
        {/* Shipment */}

        <div>
          <label className="text-sm font-medium">Shipment</label>

          <Select
            disabled={isEditing}
            value={form.watch("shipmentId")}
            onValueChange={(value) => form.setValue("shipmentId", value)}
          >
             {isEditing && (
    <p className="mt-1 text-xs text-muted-foreground">
      Shipment cannot be changed after a packing list has been created.
    </p>
  )}
            <SelectTrigger>
              <SelectValue placeholder="Select Shipment" />
            </SelectTrigger>

            <SelectContent>
              {shipments.map((shipment: any) => (
                <SelectItem key={shipment.id} value={shipment.id}>
                  {shipment.shipmentNumber}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <p className="text-sm text-red-500 mt-1">
            {form.formState.errors.shipmentId?.message}
          </p>
        </div>

        {/* Packing List Number */}

        <div>
          <label className="text-sm font-medium">Packing List Number</label>

          <Input
            placeholder="Packing List Number"
            {...form.register("packingListNumber")}
          />

          <p className="text-sm text-red-500 mt-1">
            {form.formState.errors.packingListNumber?.message}
          </p>
        </div>

        {/* Gross Weight */}

        <div>
          <label className="text-sm font-medium">Gross Weight (kg)</label>

          <Input
            type="number"
            step="0.01"
            {...form.register("grossWeight", {
              valueAsNumber: true,
            })}
          />

          <p className="text-sm text-red-500 mt-1">
            {form.formState.errors.grossWeight?.message}
          </p>
        </div>

        {/* Net Weight */}

        <div>
          <label className="text-sm font-medium">Net Weight (kg)</label>

          <Input
            type="number"
            step="0.01"
            {...form.register("netWeight", {
              valueAsNumber: true,
            })}
          />

          <p className="text-sm text-red-500 mt-1">
            {form.formState.errors.netWeight?.message}
          </p>
        </div>
      </div>

      <Button className="w-full" disabled={loading}>
        {loading ? "Saving..." : "Save Packing List"}
      </Button>
    </form>
  );
}
