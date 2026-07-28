import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createDocumentSchema,
  type CreateDocumentInput,
} from "../../validations/document.validation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { Button } from "../ui/button";

import FileUpload from "../shared/FileUpload";
import { useShipmentsWithoutDocuments } from "../../hooks/shipments/useShipmentsWithoutDocuments";


interface Props {
  defaultValues?: Partial<CreateDocumentInput> & {
    fileName?: string;
  };

  isEditing?: boolean;

  loading?: boolean;

  onSubmit: (data: CreateDocumentInput) => void;
}

export default function DocumentForm({
  defaultValues,
  isEditing = false,
  loading = false,
  onSubmit,
}: Props) {
  const form = useForm<CreateDocumentInput>({
    resolver: zodResolver(createDocumentSchema),

    defaultValues: {
      shipmentId: "",
      type: DocumentType.INVOICE,
      remarks: "",
      ...defaultValues,
    },
  });

  const {
    data: shipments = [],
    isLoading: loadingShipments,
  } = useShipmentsWithoutDocuments();

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* Shipment */}

        <FormField
          control={form.control}
          name="shipmentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shipment</FormLabel>

              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isEditing}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Shipment" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {shipments.map((shipment) => (
                    <SelectItem
                      key={shipment.id}
                      value={shipment.id}
                    >
                      {shipment.shipmentNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Document Type */}

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document Type</FormLabel>

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
                  {Object.values(DocumentType).map(
                    (type) => (
                      <SelectItem
                        key={type}
                        value={type}
                      >
                        {type.replaceAll("_", " ")}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Remarks */}

        <FormField
          control={form.control}
          name="remarks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Remarks</FormLabel>

              <FormControl>
                <textarea
                  rows={4}
                  placeholder="Enter remarks..."
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Current File */}

        {isEditing && defaultValues?.fileName && (
          <div className="rounded-lg border bg-muted/40 p-4">
            <p className="text-sm font-medium">
              Current File
            </p>

            <p className="text-sm text-muted-foreground">
              {defaultValues.fileName}
            </p>

            <p className="mt-2 text-xs text-muted-foreground">
              Upload another file only if you want to
              replace the existing one.
            </p>
          </div>
        )}

        {/* File Upload */}

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {isEditing
                  ? "Replace Document (Optional)"
                  : "Document"}
              </FormLabel>

              <FormControl>
                <FileUpload
                  value={field.value}
                  onChange={field.onChange}
                  required={!isEditing}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={
            loading || loadingShipments
          }
        >
          {loading
            ? "Saving..."
            : isEditing
            ? "Update Document"
            : "Upload Document"}
        </Button>
      </form>
    </Form>
  );
}