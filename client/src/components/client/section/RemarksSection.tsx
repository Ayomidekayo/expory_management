import type { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";


import type {
  CreateClientDto,
} from "../../../types/client.types";
import FormSection from "../../documents/FormSection";

interface Props {
  form: UseFormReturn<CreateClientDto>;
}

export default function RemarksSection({
  form,
}: Props) {
  return (
    <FormSection
      title="Remarks"
      description="Additional notes about the client."
    >
      <FormField
        control={form.control}
        name="remarks"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Remarks
            </FormLabel>

            <FormControl>
              <textarea
                rows={5}
                placeholder="Enter any additional information..."
                {...field}
                value={field.value ?? ""}
                className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
    </FormSection>
  );
}