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

import type { CreatePackingListInput } from "../../../validations/packing-list.validation";

interface Props {
  form: UseFormReturn<CreatePackingListInput>;
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

  return (
    <div className="rounded-xl border bg-white p-6">

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h2 className="text-xl font-semibold">
            Packing Items
          </h2>

          <p className="text-sm text-muted-foreground">
            Add all packed items.
          </p>

        </div>

        <Button
          type="button"
          onClick={() =>
            append({
              description: "",
              packageType: "",
              packages: 0,
              grossWeight: 0,
              netWeight: 0,
              remarks: "",
            })
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>

      </div>

      <div className="overflow-x-auto">

        <Table>

          <TableHeader>

            <TableRow>

              <TableHead>Description</TableHead>

              <TableHead>Package</TableHead>

              <TableHead>Packages</TableHead>

              <TableHead>Gross Weight</TableHead>

              <TableHead>Net Weight</TableHead>

              <TableHead>Remarks</TableHead>

              <TableHead />

            </TableRow>

          </TableHeader>

          <TableBody>

            {fields.map((field, index) => (

              <TableRow key={field.id}>

                {/* Description */}

                <TableCell>

                  <FormField
                    control={form.control}
                    name={`items.${index}.description`}
                    render={({ field }) => (
                      <FormItem>

                        <FormControl>

                          <Input
                            {...field}
                            placeholder="Description"
                          />

                        </FormControl>

                        <FormMessage />

                      </FormItem>
                    )}
                  />

                </TableCell>

                {/* Package Type */}

                <TableCell>

                  <FormField
                    control={form.control}
                    name={`items.${index}.packageType`}
                    render={({ field }) => (
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Bag"
                      />
                    )}
                  />

                </TableCell>

                {/* Packages */}

                <TableCell>

                  <FormField
                    control={form.control}
                    name={`items.${index}.packages`}
                    render={({ field }) => (
                      <Input
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                      />
                    )}
                  />

                </TableCell>

                {/* Gross Weight */}

                <TableCell>

                  <FormField
                    control={form.control}
                    name={`items.${index}.grossWeight`}
                    render={({ field }) => (
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        value={field.value ?? ""}
                      />
                    )}
                  />

                </TableCell>

                {/* Net Weight */}

                <TableCell>

                  <FormField
                    control={form.control}
                    name={`items.${index}.netWeight`}
                    render={({ field }) => (
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        value={field.value ?? ""}
                      />
                    )}
                  />

                </TableCell>

                {/* Remarks */}

                <TableCell>

                  <FormField
                    control={form.control}
                    name={`items.${index}.remarks`}
                    render={({ field }) => (
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Optional"
                      />
                    )}
                  />

                </TableCell>

                {/* Delete */}

                <TableCell>

                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    disabled={fields.length === 1}
                    onClick={() =>
                      remove(index)
                    }
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>

                </TableCell>

              </TableRow>

            ))}

          </TableBody>

        </Table>

      </div>

    </div>
  );
}