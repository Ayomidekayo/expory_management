import type { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

import { Textarea } from "../../ui/textarea";

import type {
  CreateDocumentInput,
} from "../../../validations/document.validation";

interface Props {
  form: UseFormReturn<CreateDocumentInput>;
}

export default function RemarksSection({
  form,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6">

      <div className="mb-6">

        <h2 className="text-xl font-semibold">
          Remarks
        </h2>

        <p className="text-sm text-muted-foreground">
          Add additional notes about this document (optional).
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
                value={field.value ?? ""}
              />

            </FormControl>

            <FormMessage />

          </FormItem>
        )}
      />

    </div>
  );
}