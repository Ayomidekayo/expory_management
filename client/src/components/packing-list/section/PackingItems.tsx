import { Plus, Trash2, Package, Scale3D } from "lucide-react";
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
  CreatePackingListInput,
  CreatePackingListOutput,
} from "../../../validations/packing-list.validation";

interface Props {
  form: UseFormReturn<
    CreatePackingListInput,
    undefined,
    CreatePackingListOutput
  >;
}

export default function PackingItems({
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

  const addItem = () => {
    append({
      description: "",
      packageType: "",
      packages: 0,
      grossWeight: 0,
      netWeight: 0,
      remarks: "",
    } as CreatePackingListInput["items"][number]);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 bg-slate-50/60 px-4 py-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Package className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Packing Items
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Add and manage all items included in this packing list.
              </p>
            </div>
          </div>

          <Button
            type="button"
            onClick={addItem}
            className="w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {fields.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <Package className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-900">
              No packing items
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Add an item to start building this packing list.
            </p>

            <Button
              type="button"
              variant="outline"
              className="mt-5"
              onClick={addItem}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add First Item
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="min-w-[220px] font-semibold text-slate-600">
                    Description
                  </TableHead>

                  <TableHead className="min-w-[150px] font-semibold text-slate-600">
                    Package Type
                  </TableHead>

                  <TableHead className="min-w-[110px] font-semibold text-slate-600">
                    Packages
                  </TableHead>

                  <TableHead className="min-w-[150px] font-semibold text-slate-600">
                    Gross Weight
                  </TableHead>

                  <TableHead className="min-w-[150px] font-semibold text-slate-600">
                    Net Weight
                  </TableHead>

                  <TableHead className="min-w-[180px] font-semibold text-slate-600">
                    Remarks
                  </TableHead>

                  <TableHead className="w-[60px]" />
                </TableRow>
              </TableHeader>

              <TableBody>
                {fields.map((field, index) => (
                  <TableRow
                    key={field.id}
                    className="border-slate-100 hover:bg-slate-50/50"
                  >
                    {/* Description */}
                    <TableCell className="align-top">
                      <FormField
                        control={form.control}
                        name={`items.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                {...field}
                                value={
                                  typeof field.value === "string"
                                    ? field.value
                                    : ""
                                }
                                placeholder="e.g. Sesame Seeds"
                                className="h-10 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>

                    {/* Package Type */}
                    <TableCell className="align-top">
                      <FormField
                        control={form.control}
                        name={`items.${index}.packageType`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                {...field}
                                value={
                                  typeof field.value === "string"
                                    ? field.value
                                    : ""
                                }
                                placeholder="Bags"
                                className="h-10 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>

                    {/* Packages */}
                    <TableCell className="align-top">
                      <FormField
                        control={form.control}
                        name={`items.${index}.packages`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                {...field}
                                value={
                                  typeof field.value === "number"
                                    ? field.value
                                    : ""
                                }
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value === ""
                                      ? undefined
                                      : Number(e.target.value)
                                  )
                                }
                                className="h-10 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>

                    {/* Gross Weight */}
                    <TableCell className="align-top">
                      <FormField
                        control={form.control}
                        name={`items.${index}.grossWeight`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="relative">
                                <Scale3D className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  {...field}
                                  value={
                                    typeof field.value === "number"
                                      ? field.value
                                      : ""
                                  }
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value === ""
                                        ? undefined
                                        : Number(e.target.value)
                                    )
                                  }
                                  placeholder="0.00"
                                  className="h-10 border-slate-200 pl-9 focus:border-emerald-500 focus:ring-emerald-500/20"
                                />
                              </div>
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>

                    {/* Net Weight */}
                    <TableCell className="align-top">
                      <FormField
                        control={form.control}
                        name={`items.${index}.netWeight`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="relative">
                                <Scale3D className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  {...field}
                                  value={
                                    typeof field.value === "number"
                                      ? field.value
                                      : ""
                                  }
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value === ""
                                        ? undefined
                                        : Number(e.target.value)
                                    )
                                  }
                                  placeholder="0.00"
                                  className="h-10 border-slate-200 pl-9 focus:border-emerald-500 focus:ring-emerald-500/20"
                                />
                              </div>
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>

                    {/* Remarks */}
                    <TableCell className="align-top">
                      <FormField
                        control={form.control}
                        name={`items.${index}.remarks`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                {...field}
                                value={
                                  typeof field.value === "string"
                                    ? field.value
                                    : ""
                                }
                                placeholder="Optional"
                                className="h-10 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>

                    {/* Delete */}
                    <TableCell className="align-top">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        disabled={fields.length === 1}
                        onClick={() => remove(index)}
                        className="h-9 w-9 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                        aria-label={`Remove item ${index + 1}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Footer */}
        {fields.length > 0 && (
          <div className="mt-4 flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              <span className="font-medium text-slate-700">
                {fields.length}
              </span>{" "}
              {fields.length === 1 ? "item" : "items"} added
            </p>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addItem}
              className="w-full sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Another Item
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}