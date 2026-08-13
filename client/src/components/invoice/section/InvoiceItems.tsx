import { Plus, Trash2 } from "lucide-react";
import {
  useFieldArray,
  type UseFormReturn,
} from "react-hook-form";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../ui/form";

import { Button } from "../../ui/button";
import { Input } from "../../ui/input";

import type {
  CreateInvoiceInput,
  CreateInvoiceOutput,
} from "../../../validations/invoice.validation";

interface Props {
  form: UseFormReturn<
    CreateInvoiceInput,
    undefined,
    CreateInvoiceOutput
  >;
}

export default function InvoiceItems({
  form,
}: Props) {
  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const currency = form.watch("currency");

  const addItem = () => {
    append({
      description: "",
      hsCode: "",
      packageType: "",
      packages: undefined,
      grossWeight: undefined,
      netWeight: undefined,
      quantity: 1,
      unit: "",
      unitPrice: 0,
      remarks: "",
    } as CreateInvoiceInput["items"][number]);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* =========================================
          HEADER
      ========================================= */}

      <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50/70 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Invoice Items
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Add the products or goods included in this invoice.
          </p>
        </div>

        <Button
          type="button"
          onClick={addItem}
          className="h-10 shrink-0"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      {/* =========================================
          TABLE
      ========================================= */}

      <div className="overflow-x-auto">
        <Table className="min-w-[1050px]">
          <TableHeader>
            <TableRow className="bg-white hover:bg-white">
              <TableHead className="w-[220px] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Description
              </TableHead>

              <TableHead className="w-[120px] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                HS Code
              </TableHead>

              <TableHead className="w-[130px] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Package
              </TableHead>

              <TableHead className="w-[90px] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Qty
              </TableHead>

              <TableHead className="w-[100px] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Unit
              </TableHead>

              <TableHead className="w-[140px] px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Unit Price
              </TableHead>

              <TableHead className="w-[150px] bg-slate-50 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Total
              </TableHead>

              <TableHead className="w-[60px] px-4 py-3" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {fields.map((item, index) => {
              const quantity =
                Number(
                  form.watch(
                    `items.${index}.quantity`
                  )
                ) || 0;

              const unitPrice =
                Number(
                  form.watch(
                    `items.${index}.unitPrice`
                  )
                ) || 0;

              const total =
                quantity * unitPrice;

              return (
                <TableRow
                  key={item.id}
                  className="border-b border-slate-100"
                >
                  {/* =================================
                      DESCRIPTION
                  ================================= */}

                  <TableCell className="px-4 py-4 align-top">
                    <FormField
                      control={form.control}
                      name={`items.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Product description"
                              value={
                                typeof field.value ===
                                "string"
                                  ? field.value
                                  : ""
                              }
                              className="h-10 w-full border-slate-200 bg-white"
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>

                  {/* =================================
                      HS CODE
                  ================================= */}

                  <TableCell className="px-4 py-4 align-top">
                    <FormField
                      control={form.control}
                      name={`items.${index}.hsCode`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="HS Code"
                              value={
                                typeof field.value ===
                                "string"
                                  ? field.value
                                  : ""
                              }
                              className="h-10 w-full border-slate-200"
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>

                  {/* =================================
                      PACKAGE
                  ================================= */}

                  <TableCell className="px-4 py-4 align-top">
                    <FormField
                      control={form.control}
                      name={`items.${index}.packageType`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Bag"
                              value={
                                typeof field.value ===
                                "string"
                                  ? field.value
                                  : ""
                              }
                              className="h-10 w-full border-slate-200"
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>

                  {/* =================================
                      QUANTITY
                  ================================= */}

                  <TableCell className="px-4 py-4 align-top">
                    <FormField
                      control={form.control}
                      name={`items.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={
                                typeof field.value ===
                                "number"
                                  ? field.value
                                  : ""
                              }
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value ===
                                  ""
                                    ? undefined
                                    : Number(
                                        e.target.value
                                      )
                                )
                              }
                              className="h-10 w-full border-slate-200"
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>

                  {/* =================================
                      UNIT
                  ================================= */}

                  <TableCell className="px-4 py-4 align-top">
                    <FormField
                      control={form.control}
                      name={`items.${index}.unit`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="MT"
                              value={
                                typeof field.value ===
                                "string"
                                  ? field.value
                                  : ""
                              }
                              className="h-10 w-full border-slate-200"
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>

                  {/* =================================
                      UNIT PRICE
                  ================================= */}

                  <TableCell className="px-4 py-4 align-top">
                    <FormField
                      control={form.control}
                      name={`items.${index}.unitPrice`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={
                                typeof field.value ===
                                "number"
                                  ? field.value
                                  : ""
                              }
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value ===
                                  ""
                                    ? undefined
                                    : Number(
                                        e.target.value
                                      )
                                )
                              }
                              className="h-10 w-full border-slate-200 text-right"
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>

                  {/* =================================
                      TOTAL
                  ================================= */}

                  <TableCell className="bg-slate-50/70 px-4 py-4 text-right align-top">
                    <div className="flex min-h-10 items-center justify-end whitespace-nowrap text-sm font-semibold text-slate-900">
                      {typeof currency === "string"
                        ? currency
                        : ""}{" "}
                      {total.toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </div>
                  </TableCell>

                  {/* =================================
                      DELETE
                  ================================= */}

                  <TableCell className="px-4 py-4 align-top">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={fields.length === 1}
                      onClick={() =>
                        remove(index)
                      }
                      className="h-10 w-10 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                      title="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}

            {/* =====================================
                EMPTY STATE
            ===================================== */}

            {fields.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
                    <p className="text-sm font-medium">
                      No invoice items
                    </p>

                    <p className="text-xs">
                      Add an item to start building
                      the invoice.
                    </p>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addItem}
                      className="mt-2"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Item
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* =========================================
          FOOTER
      ========================================= */}

      <div className="border-t border-slate-200 bg-slate-50/50 px-6 py-3">
        <p className="text-xs text-slate-500">
          {fields.length}{" "}
          {fields.length === 1
            ? "item"
            : "items"}{" "}
          added
        </p>
      </div>
    </div>
  );
}