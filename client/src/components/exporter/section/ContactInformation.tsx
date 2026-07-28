import type { UseFormReturn } from "react-hook-form";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../ui/form";

import { Input } from "../../ui/input";
import type { CreateExporterInput } from "../../../validations/exporter.validation";



interface Props {
    form: UseFormReturn<CreateExporterInput>;
}

export default function ContactInformation({
    form,
}: Props) {

    return (
        <div className="rounded-xl border bg-white p-6">

            <h2 className="mb-6 text-lg font-semibold">
                Contact Information
            </h2>

            <div className="grid gap-6 md:grid-cols-2">

                <FormField
                    control={form.control}
                    name="contactPerson"
                    render={({ field }) => (
                        <FormItem>

                            <FormLabel>
                                Contact Person
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
                    name="phone"
                    render={({ field }) => (
                        <FormItem>

                            <FormLabel>
                                Phone
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
                    name="email"
                    render={({ field }) => (
                        <FormItem className="md:col-span-2">

                            <FormLabel>
                                Email
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

            </div>

        </div>
    );
}