import type { UseFormReturn } from "react-hook-form";
import { Package, CalendarDays, Hash } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

import { Input } from "../../ui/input";
import type { CreatePackingListInput } from "../../../validations/packing-list.validation";

interface Props {
  form: UseFormReturn<CreatePackingListInput>;
}

export default function PackingInformation({
  form,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6">

      <div className="mb-6">

        <h2 className="text-xl font-semibold flex items-center gap-2">

          <Package className="h-5 w-5 text-primary" />

          Packing Information

        </h2>

        <p className="text-sm text-muted-foreground">
          Basic packing list information.
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        {/* Packing Date */}

        <FormField
          control={form.control}
          name="packingDate"
          render={({ field }) => (
            <FormItem>

              <FormLabel className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                Packing Date
              </FormLabel>

              <FormControl>

                <Input
                  type="date"
                  {...field}
                />

              </FormControl>

              <FormMessage />

            </FormItem>
          )}
        />

        {/* Package Type */}

        <FormField
          control={form.control}
          name="packageType"
          render={({ field }) => (
            <FormItem>

              <FormLabel className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Package Type
              </FormLabel>

              <FormControl>

                <Input
                  {...field}
                  value={field.value ?? ""}
                  placeholder="e.g. Bags, Cartons, Drums, Pallets"
                />

              </FormControl>

              <FormMessage />

            </FormItem>
          )}
        />

        {/* Marks & Numbers */}

        <FormField
          control={form.control}
          name="marksAndNumbers"
          render={({ field }) => (
            <FormItem>

              <FormLabel className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Marks & Numbers
              </FormLabel>

              <FormControl>

                <Input
                  {...field}
                  value={field.value ?? ""}
                  placeholder="Shipping marks / Container marks"
                />

              </FormControl>

              <FormMessage />

            </FormItem>
          )}
        />

      </div>

    </div>
  );
}





