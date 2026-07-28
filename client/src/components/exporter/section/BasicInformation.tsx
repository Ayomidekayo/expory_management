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
                            Exporter Name
                        </FormLabel>

                        <FormControl>

                            <Input
                                placeholder="Exporter Name"
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