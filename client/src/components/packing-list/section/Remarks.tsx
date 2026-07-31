import type { UseFormReturn } from "react-hook-form";
import { MessageSquareText } from "lucide-react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

import { Textarea } from "../../ui/textarea";

import type { CreatePackingListInput } from "../../../validations/packing-list.validation";

interface Props {
  form: UseFormReturn<CreatePackingListInput>;
}

export default function Remarks({
  form,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6">

      <div className="mb-6">

        <h2 className="flex items-center gap-2 text-xl font-semibold">

          <MessageSquareText className="h-5 w-5 text-primary" />

          Remarks

        </h2>

        <p className="text-sm text-muted-foreground">
          Additional notes or special packing instructions.
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
  name={field.name}
  ref={field.ref}
  onBlur={field.onBlur}
  value={
    typeof field.value === "string"
      ? field.value
      : ""
  }
  onChange={(e) =>
    field.onChange(e.target.value)
  }
  rows={6}
  placeholder="Enter any additional remarks, handling instructions, or special notes..."
  className="resize-none"
/>
            </FormControl>

            <FormMessage />

          </FormItem>
        )}
      />

    </div>
  );
}