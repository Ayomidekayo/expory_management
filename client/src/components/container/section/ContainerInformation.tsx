import type { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

import { Input } from "../../ui/input";

import type {
  CreateContainerInput,
} from "../../../validations/container.validation";

interface Props {
  form: UseFormReturn<CreateContainerInput>;
}

export default function ContainerInformation({
  form,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6">

      <div className="mb-6">

        <h2 className="text-xl font-semibold">
          Container Information
        </h2>

        <p className="text-sm text-muted-foreground">
          Basic information about the shipping container.
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        {/* Container Number */}

        <div>

         <FormField
  control={form.control}
  name="containerNumber"
  render={({ field }) => (
    <FormItem>

      <FormLabel>
        Container Number
      </FormLabel>

      <FormControl>

        <Input
          placeholder="Enter container number"
          {...field}
          value={field.value ?? ""}
        />

      </FormControl>

      <FormMessage />

    </FormItem>
  )}
/>

        </div>

        {/* Seal Number */}

        <FormField
          control={form.control}
          name="sealNumber"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                Seal Number
              </FormLabel>

              <FormControl>

                <Input
                  {...field}
                  value={field.value ?? ""}
                  placeholder="Enter seal number"
                />

              </FormControl>

              <FormMessage />

            </FormItem>
          )}
        />

        {/* Container Type */}

        <FormField
          control={form.control}
          name="containerType"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                Container Type
              </FormLabel>

              <Select
                value={field.value}
                onValueChange={field.onChange}
              >

                <FormControl>

                  <SelectTrigger>

                    <SelectValue />

                  </SelectTrigger>

                </FormControl>

                <SelectContent>

                  <SelectItem value="DRY">
                    Dry
                  </SelectItem>

                  <SelectItem value="REEFER">
                    Reefer
                  </SelectItem>

                  <SelectItem value="OPEN_TOP">
                    Open Top
                  </SelectItem>

                  <SelectItem value="FLAT_RACK">
                    Flat Rack
                  </SelectItem>

                  <SelectItem value="TANK">
                    Tank
                  </SelectItem>

            

                </SelectContent>

              </Select>

              <FormMessage />

            </FormItem>
          )}
        />

        {/* Container Size */}

        <FormField
          control={form.control}
          name="containerSize"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                Container Size
              </FormLabel>

              <Select
                value={field.value}
                onValueChange={field.onChange}
              >

                <FormControl>

                  <SelectTrigger>

                    <SelectValue />

                  </SelectTrigger>

                </FormControl>

                <SelectContent>
  <SelectItem value="FT20">
    20 FT
  </SelectItem>

  <SelectItem value="FT40">
    40 FT
  </SelectItem>

  <SelectItem value="FT40_HC">
    40 FT High Cube
  </SelectItem>

  <SelectItem value="FT45">
    45 FT
  </SelectItem>
</SelectContent>

              </Select>

              <FormMessage />

            </FormItem>
          )}
        />

        {/* Status */}

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>

              <FormLabel>
                Status
              </FormLabel>

              <Select
                value={field.value}
                onValueChange={field.onChange}
              >

                <FormControl>

                  <SelectTrigger>

                    <SelectValue />

                  </SelectTrigger>

                </FormControl>

              <SelectContent>
  <SelectItem value="EMPTY">
    Empty
  </SelectItem>

  <SelectItem value="LOADED">
    Loaded
  </SelectItem>

  <SelectItem value="IN_TRANSIT">
    In Transit
  </SelectItem>

  <SelectItem value="DELIVERED">
    Delivered
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