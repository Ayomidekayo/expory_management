import type { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import type { CreateConsigneeInput } from "../../../validations/consignee.validation";


interface Props {
  form: UseFormReturn<CreateConsigneeInput>;
}

export default function AddressInformation({
  form,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6">

      <h2 className="mb-6 text-lg font-semibold">
        Address Information
      </h2>

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>

            <FormLabel>
              Address
            </FormLabel>

            <FormControl>

              <textarea
                rows={4}
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