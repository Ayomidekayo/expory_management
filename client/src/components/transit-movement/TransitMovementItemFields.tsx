
import { useWatch } from "react-hook-form";
import type {
  Control,
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
} from "react-hook-form";

import {
  Trash2,
  Truck,
  Container,
} from "lucide-react";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

import type {
  TransitMovementFormValues,
} from "../../validations/transit-movement-form.schema";

interface Props {
  index: number;
  control: Control<TransitMovementFormValues>;
  register: UseFormRegister<TransitMovementFormValues>;
  setValue: UseFormSetValue<TransitMovementFormValues>;
  errors: FieldErrors<TransitMovementFormValues>;
  onRemove: () => void;
  canRemove: boolean;
  disabled?: boolean;
}

type ItemType = "TRUCK" | "CONTAINER";

type ErrorField =
  | "itemDate"
  | "name"
  | "clientName"
  | "frontPlateNumber"
  | "backPlateNumber"
  | "containerName"
  | "containerNumber"
  | "chargeAmount"
  | "chargeCurrency"
  | "remarks";

export function TransitMovementItemFields({
  index,
  control,
  register,
  setValue,
  errors,
  onRemove,
  canRemove,
  disabled = false,
}: Props) {
  const itemType = useWatch({
    control,
    name: `items.${index}.itemType`,
  });

  const itemErrors = errors.items?.[index];

  // Safely read errors from the truck/container union.
  const getError = (field: ErrorField): string | undefined => {
    const errorMap = itemErrors as
      | Record<string, { message?: unknown } | undefined>
      | undefined;

    const message = errorMap?.[field]?.message;

    return typeof message === "string" ? message : undefined;
  };

  // Switch item type and clear fields that no longer apply.
  const handleItemTypeChange = (type: ItemType) => {
    if (disabled || type === itemType) return;

    setValue(`items.${index}.itemType`, type, {
      shouldDirty: true,
      shouldValidate: true,
      shouldTouch: true,
    });

    if (type === "TRUCK") {
      setValue(`items.${index}.containerName`, "", {
        shouldDirty: true,
        shouldValidate: true,
      });

      setValue(`items.${index}.containerNumber`, "", {
        shouldDirty: true,
        shouldValidate: true,
      });
    } else {
      setValue(`items.${index}.frontPlateNumber`, "", {
        shouldDirty: true,
        shouldValidate: true,
      });

      setValue(`items.${index}.backPlateNumber`, "", {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  const renderError = (field: ErrorField) => {
    const message = getError(field);

    if (!message) return null;

    return (
      <p className="text-xs text-red-600" role="alert">
        {message}
      </p>
    );
  };

  return (
    <div className="space-y-5 rounded-xl border bg-white p-4 shadow-sm sm:p-5">

      {/* ITEM HEADER */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          {itemType === "TRUCK" ? (
            <Truck className="h-5 w-5 shrink-0 text-green-700" />
          ) : (
            <Container className="h-5 w-5 shrink-0 text-green-700" />
          )}

          <div>
            <h3 className="font-semibold">
              Item {index + 1}
            </h3>

            <p className="text-xs text-muted-foreground">
              {itemType === "TRUCK"
                ? "Truck information"
                : "Container information"}
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={!canRemove || disabled}
          onClick={onRemove}
          className="shrink-0 text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <Trash2 className="mr-1 h-4 w-4" />
          Remove
        </Button>
      </div>

      {/* ITEM DETAILS */}
      <div className="grid gap-4 sm:grid-cols-2">

        {/* ITEM TYPE */}
        <div className="space-y-2">
          <Label>Item Type *</Label>

          <select
            value={itemType}
            onChange={(event) =>
              handleItemTypeChange(
                event.target.value as ItemType
              )
            }
            disabled={disabled}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-green-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="TRUCK">Truck</option>
            <option value="CONTAINER">Container</option>
          </select>
        </div>

        {/* ITEM DATE */}
        <div className="space-y-2">
          <Label>Item Date *</Label>

          <Input
            type="date"
            disabled={disabled}
            {...register(`items.${index}.itemDate`)}
          />

          {renderError("itemDate")}
        </div>

        {/* ITEM NAME */}
        <div className="space-y-2">
          <Label>Name *</Label>

          <Input
            placeholder="Enter item name"
            disabled={disabled}
            {...register(`items.${index}.name`)}
          />

          {renderError("name")}
        </div>

        {/* CLIENT NAME */}
        <div className="space-y-2">
          <Label>Client Name *</Label>

          <Input
            placeholder="Enter client name"
            disabled={disabled}
            {...register(`items.${index}.clientName`)}
          />

          {renderError("clientName")}
        </div>

        {/* TRUCK FIELDS */}
        {itemType === "TRUCK" && (
          <>
            <div className="space-y-2">
              <Label>Front Plate Number</Label>

              <Input
                placeholder="Enter front plate number"
                disabled={disabled}
                {...register(
                  `items.${index}.frontPlateNumber`
                )}
              />

              {renderError("frontPlateNumber")}
            </div>

            <div className="space-y-2">
              <Label>Back Plate Number</Label>

              <Input
                placeholder="Enter back plate number"
                disabled={disabled}
                {...register(
                  `items.${index}.backPlateNumber`
                )}
              />

              {renderError("backPlateNumber")}
            </div>
          </>
        )}

        {/* CONTAINER FIELDS */}
        {itemType === "CONTAINER" && (
          <>
            <div className="space-y-2">
              <Label>Container Name *</Label>

              <Input
                placeholder="Enter container name"
                disabled={disabled}
                {...register(
                  `items.${index}.containerName`
                )}
              />

              {renderError("containerName")}
            </div>

            <div className="space-y-2">
              <Label>Container Number *</Label>

              <Input
                placeholder="Enter container number"
                disabled={disabled}
                {...register(
                  `items.${index}.containerNumber`
                )}
              />

              {renderError("containerNumber")}
            </div>
          </>
        )}

        {/* CHARGE AMOUNT */}
        <div className="space-y-2">
          <Label>Charge Amount *</Label>

          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="Enter charge amount"
            disabled={disabled}
            {...register(
              `items.${index}.chargeAmount`,
              {
                valueAsNumber: true,
              }
            )}
          />

          {renderError("chargeAmount")}
        </div>

        {/* CURRENCY */}
        <div className="space-y-2">
          <Label>Currency *</Label>

          <select
            disabled={disabled}
            {...register(
              `items.${index}.chargeCurrency`
            )}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-green-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="NGN">NGN - Nigerian Naira</option>
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="CFA">CFA - CFA Franc</option>
          </select>

          {renderError("chargeCurrency")}
        </div>
      </div>

      {/* REMARKS */}
      <div className="space-y-2">
        <Label>Item Remarks</Label>

        <textarea
          rows={3}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-green-600 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Optional item remarks"
          disabled={disabled}
          {...register(`items.${index}.remarks`)}
        />

        {renderError("remarks")}
      </div>
    </div>
  );
}
