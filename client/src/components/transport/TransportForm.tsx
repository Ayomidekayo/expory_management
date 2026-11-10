
import { useEffect } from "react";
import {
  useFieldArray,
  useForm,
} from "react-hook-form";
import {
  Plus,
  Trash2,
  Truck,
  Package,
  Save,
  Loader2,
} from "lucide-react";




import type {
  Transport,
  TransportItemType,
  Currency,
  CreateTransportPayload,
  UpdateTransportPayload,
} from "../../types/transport";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

type TransportFormValues = {
  transportDate: string;
  shipmentId: string;
  remarks: string;
  items: {
    id?: string;
    itemDate: string;
    itemType: TransportItemType;
    name: string;
    ownerName: string;
    frontPlateNumber: string;
    backPlateNumber: string;
    containerName: string;
    containerNumber: string;
    chargeAmount: number;
    chargeCurrency: Currency;
    remarks: string;
  }[];
};

interface Props {
  initialData?: Transport;
  onSubmit: (
    data: CreateTransportPayload | UpdateTransportPayload
  ) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function getInitialValues(
  transport?: Transport
): TransportFormValues {
  return {
    transportDate: transport?.transportDate
      ? new Date(transport.transportDate)
          .toISOString()
          .split("T")[0]
      : getToday(),

    shipmentId: transport?.shipmentId ?? "",
    remarks: transport?.remarks ?? "",

    items: transport?.items?.length
      ? transport.items.map((item) => ({
          id: item.id,
          itemDate: new Date(item.itemDate)
            .toISOString()
            .split("T")[0],
          itemType: item.itemType,
          name: item.name ?? "",
          ownerName: item.ownerName,
          frontPlateNumber: item.frontPlateNumber ?? "",
          backPlateNumber: item.backPlateNumber ?? "",
          containerName: item.containerName ?? "",
          containerNumber: item.containerNumber ?? "",
          chargeAmount: Number(item.chargeAmount),
          chargeCurrency: item.chargeCurrency,
          remarks: item.remarks ?? "",
        }))
      : [
          {
            itemDate: getToday(),
            itemType: "TRUCK" as TransportItemType,
            name: "",
            ownerName: "",
            frontPlateNumber: "",
            backPlateNumber: "",
            containerName: "",
            containerNumber: "",
            chargeAmount: 0,
            chargeCurrency: "NGN" as Currency,
            remarks: "",
          },
        ],
  };
}

export default function TransportForm({
  initialData,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Save Transport",
}: Props) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<TransportFormValues>({
    defaultValues: getInitialValues(initialData),
  });

  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "items",
  });

  useEffect(() => {
    reset(getInitialValues(initialData));
  }, [initialData, reset]);

  const watchedItems = watch("items");

  function addItem(type: TransportItemType) {
    append({
      itemDate: getToday(),
      itemType: type,
      name: "",
      ownerName: "",
      frontPlateNumber: "",
      backPlateNumber: "",
      containerName: "",
      containerNumber: "",
      chargeAmount: 0,
      chargeCurrency: "NGN",
      remarks: "",
    });
  }

  function submit(values: TransportFormValues) {
    const items = values.items.map((item) => ({
      ...(item.id ? { id: item.id } : {}),
      itemDate: item.itemDate,
      itemType: item.itemType,
      name: item.name.trim() || undefined,
      ownerName: item.ownerName.trim(),
      frontPlateNumber:
        item.itemType === "TRUCK"
          ? item.frontPlateNumber.trim()
          : undefined,
      backPlateNumber:
        item.itemType === "TRUCK"
          ? item.backPlateNumber.trim()
          : undefined,
      containerName:
        item.itemType === "CONTAINER"
          ? item.containerName.trim()
          : undefined,
      containerNumber:
        item.itemType === "CONTAINER"
          ? item.containerNumber.trim()
          : undefined,
      chargeAmount: Number(item.chargeAmount),
      chargeCurrency: item.chargeCurrency,
      remarks: item.remarks.trim() || undefined,
    }));

    const payload = {
      transportDate: values.transportDate,
      shipmentId: values.shipmentId.trim() || undefined,
      remarks: values.remarks.trim() || undefined,
      items,
    };

    onSubmit(payload);
  }

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="space-y-6"
    >
      {/* TRANSPORT INFORMATION */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">
            Transport Information
          </h2>
          <p className="text-sm text-muted-foreground">
            Enter the general details for this transport record.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Transport Date <span className="text-red-500">*</span>
            </label>

            <Input
              type="date"
              {...register("transportDate", {
                required: "Transport date is required",
              })}
            />

            {errors.transportDate && (
              <p className="text-xs text-red-500">
                {errors.transportDate.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Shipment ID
            </label>

            <Input
              placeholder="Enter shipment ID (optional)"
              {...register("shipmentId")}
            />

            <p className="text-xs text-muted-foreground">
              Leave empty to create an independent transport record.
            </p>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">
              Remarks
            </label>

            <textarea
              rows={3}
              placeholder="Additional transport information..."
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              {...register("remarks")}
            />
          </div>
        </div>
      </section>

      {/* TRANSPORT ITEMS */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Transport Items
            </h2>

            <p className="text-sm text-muted-foreground">
              Add the trucks and containers involved.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => addItem("TRUCK")}
            >
              <Truck className="mr-2 h-4 w-4" />
              Add Truck
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => addItem("CONTAINER")}
            >
              <Package className="mr-2 h-4 w-4" />
              Add Container
            </Button>
          </div>
        </div>

        {fields.map((field, index) => {
          const itemType = watchedItems?.[index]?.itemType;

          return (
            <div
              key={field.id}
              className="mb-5 rounded-xl border bg-slate-50/60 p-5 last:mb-0"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {itemType === "TRUCK" ? (
                    <Truck className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <Package className="h-5 w-5 text-emerald-600" />
                  )}

                  <h3 className="font-semibold">
                    Item {index + 1} — {itemType}
                  </h3>
                </div>

                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  disabled={fields.length === 1}
                  onClick={() => remove(index)}
                  title="Remove item"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <input
                type="hidden"
                {...register(`items.${index}.id`)}
              />

              <input
                type="hidden"
                {...register(`items.${index}.itemType`)}
              />

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {/* ITEM DATE */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Item Date *
                  </label>

                  <Input
                    type="date"
                    {...register(`items.${index}.itemDate`, {
                      required: "Item date is required",
                    })}
                  />
                </div>

                {/* OWNER */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Owner Name *
                  </label>

                  <Input
                    placeholder="Enter owner name"
                    {...register(`items.${index}.ownerName`, {
                      required: "Owner name is required",
                    })}
                  />
                </div>

                {/* ITEM NAME */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Item Name
                  </label>

                  <Input
                    placeholder="Optional item name"
                    {...register(`items.${index}.name`)}
                  />
                </div>

                {/* TRUCK FIELDS */}
                {itemType === "TRUCK" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Front Plate Number *
                      </label>

                      <Input
                        placeholder="e.g. AAA-123-BB"
                        {...register(
                          `items.${index}.frontPlateNumber`,
                          {
                            required: "Front plate number is required",
                          }
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Back Plate Number *
                      </label>

                      <Input
                        placeholder="Enter back plate number"
                        {...register(
                          `items.${index}.backPlateNumber`,
                          {
                            required: "Back plate number is required",
                          }
                        )}
                      />
                    </div>
                  </>
                )}

                {/* CONTAINER FIELDS */}
                {itemType === "CONTAINER" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Container Name *
                      </label>

                      <Input
                        placeholder="Enter container name"
                        {...register(
                          `items.${index}.containerName`,
                          {
                            required: "Container name is required",
                          }
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Container Number *
                      </label>

                      <Input
                        placeholder="Enter container number"
                        {...register(
                          `items.${index}.containerNumber`,
                          {
                            required: "Container number is required",
                          }
                        )}
                      />
                    </div>
                  </>
                )}

                {/* CHARGE */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Charge Amount *
                  </label>

                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    {...register(
                      `items.${index}.chargeAmount`,
                      {
                        valueAsNumber: true,
                        required: "Charge amount is required",
                        min: {
                          value: 0,
                          message: "Charge cannot be negative",
                        },
                      }
                    )}
                  />
                </div>

                {/* CURRENCY */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Currency *
                  </label>

                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    {...register(`items.${index}.chargeCurrency`)}
                  >
                    <option value="NGN">NGN — Naira</option>
                    <option value="USD">USD — US Dollar</option>
                    <option value="EUR">EUR — Euro</option>
                    <option value="CFA">CFA — CFA Franc</option>
                  </select>
                </div>

                {/* ITEM REMARKS */}
                <div className="space-y-2 md:col-span-2 xl:col-span-3">
                  <label className="text-sm font-medium">
                    Item Remarks
                  </label>

                  <textarea
                    rows={2}
                    placeholder="Additional information..."
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    {...register(`items.${index}.remarks`)}
                  />
                </div>
              </div>
            </div>
          );
        })}

        <div className="mt-5 flex items-center justify-between border-t pt-4">
          <p className="text-sm text-muted-foreground">
            {fields.length} transport item(s)
          </p>

          <Button
            type="button"
            variant="outline"
            onClick={() => addItem("TRUCK")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Another Truck
          </Button>
        </div>
      </section>

      {/* ACTIONS */}
      <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}

          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
