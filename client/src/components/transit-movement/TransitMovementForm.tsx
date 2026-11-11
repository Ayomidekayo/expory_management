
import { useEffect } from "react";
import {
  useForm,
  useFieldArray,
  Controller,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save, Loader2, Lock } from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ShipmentSelector } from "./ShipmentSelector";
import { TransitMovementItemFields } from "./TransitMovementItemFields";

import {
  transitMovementFormSchema,
  type TransitMovementFormValues,
} from "../../validations/transit-movement-form.schema";

type ItemType = "TRUCK" | "CONTAINER";

interface Props {
  initialValues?: TransitMovementFormValues;
  mode?: "create" | "edit";
  isSubmitting?: boolean;
  isLocked?: boolean;
  onSubmit: (values: TransitMovementFormValues) => void | Promise<void>;
}

function today() {
  return new Date().toLocaleDateString("en-CA");
}

function newItem(itemType: ItemType) {
  return {
    itemType,
    itemDate: today(),
    name: "",
    clientName: "",
    chargeAmount: 0,
    chargeCurrency: "NGN" as const,
    remarks: "",
    frontPlateNumber: "",
    backPlateNumber: "",
    containerName: "",
    containerNumber: "",
  };
}

export function TransitMovementForm({
  initialValues,
  mode = "create",
  isSubmitting = false,
  isLocked = false,
  onSubmit,
}: Props) {
  const form = useForm<TransitMovementFormValues>({
    resolver: zodResolver(transitMovementFormSchema),
    defaultValues: initialValues ?? {
      transitDate: today(),
      direction: "IN",
      shipmentId: null,
      remarks: "",
      items: [newItem("TRUCK")],
    },
  });

  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Synchronize form values when the API record loads.
  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
  }, [initialValues, form]);

  const direction = form.watch("direction");

  const isFormDisabled = isSubmitting || isLocked;

  const handleAddItem = (itemType: ItemType) => {
    if (isFormDisabled || fields.length >= 100) return;

    append(newItem(itemType));
  };

  const handleRemoveItem = (index: number) => {
    if (isFormDisabled || fields.length <= 1) return;

    remove(index);
  };

  const handleFormSubmit = form.handleSubmit(async (values) => {
    if (isLocked || isSubmitting) return;

    await onSubmit(values);
  });

  return (
    <form
      onSubmit={handleFormSubmit}
      className="mx-auto max-w-5xl space-y-6 pb-10"
    >
      {isLocked && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <Lock className="mt-0.5 h-4 w-4 shrink-0" />

          <div>
            <p className="font-semibold">
              Movement is locked
            </p>

            <p className="mt-1">
              This movement is currently locked. You can view its
              information, but editing is disabled.
            </p>
          </div>
        </div>
      )}

      {/* MOVEMENT INFORMATION */}
      <section className="space-y-5 rounded-xl border bg-white p-4 shadow-sm sm:p-6">
        <div>
          <h2 className="text-lg font-semibold">
            Movement Information
          </h2>

          <p className="text-sm text-muted-foreground">
            Enter the movement details and optionally link a shipment.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {/* DIRECTION */}
          <div className="space-y-2">
            <Label>Direction</Label>

            <div className="grid grid-cols-2 gap-2">
              {(["IN", "OUT"] as const).map((option) => (
                <Button
                  key={option}
                  type="button"
                  variant={
                    direction === option ? "default" : "outline"
                  }
                  disabled={mode === "edit" || isFormDisabled}
                  onClick={() =>
                    form.setValue("direction", option, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  className={
                    direction === option
                      ? "bg-green-700 hover:bg-green-800"
                      : ""
                  }
                >
                  Transit {option}
                </Button>
              ))}
            </div>

            {mode === "edit" && (
              <p className="text-xs text-muted-foreground">
                Direction cannot be changed after creation.
              </p>
            )}
          </div>

          {/* TRANSIT DATE */}
          <div className="space-y-2">
            <Label>Transit Date</Label>

            <Input
              type="date"
              disabled={isFormDisabled}
              {...form.register("transitDate")}
            />

            <p className="text-xs text-red-600">
              {form.formState.errors.transitDate?.message}
            </p>
          </div>

          {/* SHIPMENT */}
          <div className="space-y-2 sm:col-span-2">
            <Label>Shipment (Optional)</Label>

            <Controller
              name="shipmentId"
              control={form.control}
              render={({ field }) => (
                <ShipmentSelector
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isFormDisabled}
                />
              )}
            />
          </div>

          {/* REMARKS */}
          <div className="space-y-2 sm:col-span-2">
            <Label>Remarks</Label>

            <textarea
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-green-600 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Optional movement remarks"
              disabled={isFormDisabled}
              {...form.register("remarks")}
            />
          </div>
        </div>
      </section>

      {/* MOVEMENT ITEMS */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">
              Movement Items
            </h2>

            <p className="text-sm text-muted-foreground">
              Add trucks and containers associated with this movement.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isFormDisabled || fields.length >= 100}
              onClick={() => handleAddItem("TRUCK")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Truck
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={isFormDisabled || fields.length >= 100}
              onClick={() => handleAddItem("CONTAINER")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Container
            </Button>
          </div>
        </div>

        {fields.map((field, index) => (
          <TransitMovementItemFields
            key={field.id}
            index={index}
            control={form.control}
            register={form.register}
            setValue={form.setValue}
            errors={form.formState.errors}
            disabled={isFormDisabled}
            canRemove={fields.length > 1}
            onRemove={() => handleRemoveItem(index)}
          />
        ))}

        {form.formState.errors.items?.root?.message && (
          <p className="text-sm text-red-600">
            {form.formState.errors.items.root.message}
          </p>
        )}
      </section>

      {/* SUBMIT */}
      <div className="flex justify-end border-t pt-5">
        <Button
          type="submit"
          disabled={isFormDisabled}
          className="min-w-40 bg-green-700 hover:bg-green-800"
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : isLocked ? (
            <Lock className="mr-2 h-4 w-4" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}

          {isLocked
            ? "Movement Locked"
            : mode === "edit"
              ? "Save Changes"
              : "Create Movement"}
        </Button>
      </div>
    </form>
  );
}
