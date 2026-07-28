import type { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

import { Input } from "../../ui/input";
import type { CreateShipmentInput } from "../../../validations/shipment.validation";
interface Props {
  form: UseFormReturn<CreateShipmentInput>;
}

export default function ExportDocuments({
  form,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6">

      <div className="mb-6">

        <h2 className="text-xl font-semibold">
          Export Documents
        </h2>

        <p className="text-sm text-slate-500">
          Export document reference numbers.
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2">

        {/* XF Number */}

        <FormField
          control={form.control}
          name="xfNumber"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                XF Number
              </FormLabel>

              <FormControl>

                <Input
                  placeholder="XF-2026-0001"
                  {...field}
                  value={field.value ?? ""}
                />

              </FormControl>

              <FormMessage />

            </FormItem>
          )}
        />

        {/* NXP Number */}

        <FormField
          control={form.control}
          name="nxpNumber"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                NXP Number
              </FormLabel>

              <FormControl>

                <Input
                  placeholder="NXP-2026-0001"
                  {...field}
                  value={field.value ?? ""}
                />

              </FormControl>

              <FormMessage />

            </FormItem>
          )}
        />

        {/* CCI Number */}

        <FormField
          control={form.control}
          name="cciNumber"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                CCI Number
              </FormLabel>

              <FormControl>

                <Input
                  placeholder="CCI-2026-0001"
                  {...field}
                  value={field.value ?? ""}
                />

              </FormControl>

              <FormMessage />

            </FormItem>
          )}
        />

        {/* E Number */}

        <FormField
          control={form.control}
          name="eNumber"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                E Number
              </FormLabel>

              <FormControl>

                <Input
                  placeholder="E-2026-0001"
                  {...field}
                  value={field.value ?? ""}
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