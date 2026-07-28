import type { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

import { Input } from "../../ui/input";
import type { CreateConsigneeInput } from "../../../validations/consignee.validation";

interface Props {
  form: UseFormReturn<CreateConsigneeInput>;
}

export default function BasicInformation({
  form,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6">

      <h2 className="mb-6 text-lg font-semibold">
        Basic Information
      </h2>

      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>

            <FormLabel>
              Consignee Name
            </FormLabel>

            <FormControl>

              <Input
                placeholder="Consignee Name"
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