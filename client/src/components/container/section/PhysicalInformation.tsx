import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";

import {
  Scale,
  Weight,
  Box,
  Calculator,
} from "lucide-react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

import { Input } from "../../ui/input";

import type {
  CreateContainerInput,
  CreateContainerOutput,
} from "../../../validations/container.validation";

interface Props {
  form: UseFormReturn<
    CreateContainerInput,
    undefined,
    CreateContainerOutput
  >;
}

/*
=========================================
FIELD ICON
=========================================
*/

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

export default function PhysicalInformation({
  form,
}: Props) {
  /*
  =========================================
  WATCH WEIGHTS
  =========================================
  */

  const grossWeight =
    form.watch("grossWeight");

  const netWeight =
    form.watch("netWeight");

  /*
  =========================================
  CALCULATE TARE WEIGHT
  =========================================

  Tare Weight =
  Gross Weight - Net Weight

  Never allow a negative tare weight.
  */

  useEffect(() => {
    const gross =
      typeof grossWeight === "number"
        ? grossWeight
        : 0;

    const net =
      typeof netWeight === "number"
        ? netWeight
        : 0;

    form.setValue(
      "tareWeight",
      Math.max(gross - net, 0)
    );
  }, [
    grossWeight,
    netWeight,
    form,
  ]);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* =========================================
          HEADER
      ========================================= */}

      <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Scale className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Physical Information
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              Record the physical measurements and
              weight details of the container.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================
          CONTENT
      ========================================= */}

      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* =====================================
              GROSS WEIGHT
          ===================================== */}

          <FormField
            control={form.control}
            name="grossWeight"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Gross Weight
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <Weight className="h-4 w-4" />
                  </FieldIcon>

                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      {...field}
                      value={
                        typeof field.value ===
                        "number"
                          ? field.value
                          : ""
                      }
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? undefined
                            : Number(
                                e.target.value
                              )
                        )
                      }
                      className="h-11 w-full border-slate-200"
                    />
                  </FormControl>
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  Total weight including cargo.
                </p>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* =====================================
              NET WEIGHT
          ===================================== */}

          <FormField
            control={form.control}
            name="netWeight"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Net Weight
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <Weight className="h-4 w-4" />
                  </FieldIcon>

                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      {...field}
                      value={
                        typeof field.value ===
                        "number"
                          ? field.value
                          : ""
                      }
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? undefined
                            : Number(
                                e.target.value
                              )
                        )
                      }
                      className="h-11 w-full border-slate-200"
                    />
                  </FormControl>
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  Weight of the cargo only.
                </p>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* =====================================
              TARE WEIGHT
          ===================================== */}

          <FormField
            control={form.control}
            name="tareWeight"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Tare Weight
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <Calculator className="h-4 w-4" />
                  </FieldIcon>

                  <FormControl>
                    <Input
                      readOnly
                      type="number"
                      step="0.01"
                      value={
                        typeof field.value ===
                        "number"
                          ? field.value
                          : ""
                      }
                      className="h-11 w-full cursor-not-allowed border-slate-200 bg-slate-50 font-medium text-slate-700"
                    />
                  </FormControl>
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  Automatically calculated.
                </p>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* =====================================
              VOLUME
          ===================================== */}

          <FormField
            control={form.control}
            name="volume"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Volume
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <Box className="h-4 w-4" />
                  </FieldIcon>

                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      {...field}
                      value={
                        typeof field.value ===
                        "number"
                          ? field.value
                          : ""
                      }
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? undefined
                            : Number(
                                e.target.value
                              )
                        )
                      }
                      className="h-11 w-full border-slate-200"
                    />
                  </FormControl>
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  Container volume in CBM.
                </p>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* =========================================
            CALCULATION NOTE
        ========================================= */}

        <div className="mt-6 flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Calculator className="h-4 w-4" />
          </div>

          <div>
            <p className="text-sm font-medium text-slate-800">
              Tare Weight Calculation
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Tare weight is automatically calculated
              as Gross Weight minus Net Weight.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}