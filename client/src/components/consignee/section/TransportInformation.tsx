import type { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

import { Input } from "../../ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import type { CreateConsigneeInput } from "../../../validations/consignee.validation";



interface Props {
  form: UseFormReturn<CreateConsigneeInput>;
}

export default function TransportInformation({
  form,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6">

      <h2 className="mb-6 text-lg font-semibold">
        Transport Information
      </h2>

      <div className="grid gap-6 md:grid-cols-2">

        <FormField
          control={form.control}
          name="transporter"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                Transporter
              </FormLabel>

              <FormControl>

                <Input
                  {...field}
                  value={field.value ?? ""}
                />

              </FormControl>

              <FormMessage />

            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="placeOfLoading"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                Place of Loading
              </FormLabel>

              <FormControl>

                <Input {...field} />

              </FormControl>

              <FormMessage />

            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="transitRoute"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                Transit Route
              </FormLabel>

              <FormControl>

                <Input {...field} />

              </FormControl>

              <FormMessage />

            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="portOfDischarge"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                Port of Discharge
              </FormLabel>

              <FormControl>

                <Input {...field} />

              </FormControl>

              <FormMessage />

            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="transportMode"
          render={({ field }) => (
            <FormItem className="md:col-span-2">

              <FormLabel>
                Transport Mode
              </FormLabel>

              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >

                <FormControl>

                  <SelectTrigger>

                    <SelectValue placeholder="Select transport mode" />

                  </SelectTrigger>

                </FormControl>

                <SelectContent>

                  <SelectItem value="ROAD">
                    Road
                  </SelectItem>

                  <SelectItem value="SEA">
                    Sea
                  </SelectItem>

                  <SelectItem value="AIR">
                    Air
                  </SelectItem>

                  <SelectItem value="RAIL">
                    Rail
                  </SelectItem>

                </SelectContent>

              </Select>

              <FormMessage />

            </FormItem>
          )}
        />

      </div>

    </div>
  );
}