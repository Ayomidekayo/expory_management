import { Trash2, Plus } from "lucide-react";
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
import type { CreateInvoiceInput } from "../../../validations/invoice.validation";


interface Props {
  form: UseFormReturn<CreateInvoiceInput>;
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

  return (
    <div className="rounded-xl border bg-white p-6">

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h2 className="text-xl font-semibold">
            Invoice Items
          </h2>

          <p className="text-sm text-muted-foreground">
            Add one or more products.
          </p>

        </div>

        <Button
          type="button"
          onClick={() =>
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

              <TableHead>HS Code</TableHead>

              <TableHead>Package</TableHead>

              <TableHead>Qty</TableHead>

              <TableHead>Unit</TableHead>

              <TableHead>Unit Price</TableHead>

              <TableHead>Total</TableHead>

              <TableHead />

            </TableRow>

          </TableHeader>

          <TableBody>

            {fields.map((field, index) => {

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
                              placeholder="Product"
                            />

                          </FormControl>

                          <FormMessage />

                        </FormItem>
                      )}
                    />

                  </TableCell>

                  {/* HS CODE */}

                  <TableCell>

                    <FormField
                      control={form.control}
                      name={`items.${index}.hsCode`}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="HS"
                        />
                      )}
                    />

                  </TableCell>

                  {/* Package */}

                  <TableCell>

                    <FormField
                      control={form.control}
                      name={`items.${index}.packageType`}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Bag"
                        />
                      )}
                    />

                  </TableCell>

                  {/* Quantity */}

                  <TableCell>

                    <FormField
                      control={form.control}
                      name={`items.${index}.quantity`}
                      render={({ field }) => (
                        <Input
                          type="number"
                          {...field}
                        />
                      )}
                    />

                  </TableCell>

                  {/* Unit */}

                  <TableCell>

                    <FormField
                      control={form.control}
                      name={`items.${index}.unit`}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="MT"
                        />
                      )}
                    />

                  </TableCell>

                  {/* Unit Price */}

                  <TableCell>

                    <FormField
                      control={form.control}
                      name={`items.${index}.unitPrice`}
                      render={({ field }) => (
                        <Input
                          type="number"
                          {...field}
                        />
                      )}
                    />

                  </TableCell>

                  {/* Total */}

                  <TableCell>

                    <div className="font-semibold whitespace-nowrap">

                      {form.watch("currency")}{" "}

                      {total.toLocaleString()}

                    </div>

                  </TableCell>

                  {/* Delete */}

                  <TableCell>

                    <Button
                      size="icon"
                      variant="ghost"
                      type="button"
                      disabled={
                        fields.length === 1
                      }
                      onClick={() =>
                        remove(index)
                      }
                    >

                      <Trash2 className="h-4 w-4 text-red-500" />

                    </Button>

                  </TableCell>

                </TableRow>

              );

            })}

          </TableBody>

        </Table>

      </div>

    </div>
  );
}