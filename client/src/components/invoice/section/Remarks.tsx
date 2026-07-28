import type { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

import { Textarea } from "../../ui/textarea";
import type { CreateInvoiceInput } from "../../../validations/invoice.validation";

interface Props {
  form: UseFormReturn<CreateInvoiceInput>;
}

export default function Remarks({
  form,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6">

      <div className="mb-6">

        <h2 className="text-xl font-semibold">
          Remarks
        </h2>

        <p className="text-sm text-muted-foreground">
          Additional notes for this invoice.
        </p>

      </div>

      <FormField
        control={form.control}
        name="remarks"
        render={({ field }) => (
          <FormItem>

            <FormLabel>
              Remarks
            </FormLabel>

            <FormControl>

              <Textarea
                rows={5}
                placeholder="Enter remarks..."
                {...field}
              />

            </FormControl>

            <FormMessage />

          </FormItem>
        )}
      />

    </div>
  );
}