import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatISO } from "date-fns";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { useShipments } from "../../hooks/shipments/useShipments";
import { invoiceSchema, type InvoiceFormData } from "../../validations/invoice.validation";

interface Props {
  defaultValues?: Partial<InvoiceFormData>;
  loading?: boolean;
  onSubmit: (values: InvoiceFormData) => void;
}

export default function InvoiceForm({
  defaultValues,
  loading,
  onSubmit,
}: Props) {
  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      shipmentId: "",
      invoiceNumber: "",
      invoiceDate: "",
      currency: "USD",
      numberOfTrucks: 0,
      freight: 0,
      ...defaultValues,
    },
  });

  const { data: shipments = [] } = useShipments();

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

  // ✅ Wrap handleSubmit to normalize invoiceDate
  const handleFormSubmit = (values: InvoiceFormData) => {
    const isoDate = values.invoiceDate
      ? formatISO(new Date(values.invoiceDate))
      : "";

    onSubmit({
      ...values,
      invoiceDate: isoDate, // always ISO format
    });
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleFormSubmit)}
      className="space-y-6"
    >
      <div className="grid gap-5 md:grid-cols-2">
        {/* Shipment */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Shipment</label>
          <Select
            value={form.watch("shipmentId")}
            onValueChange={(value) => form.setValue("shipmentId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Shipment" />
            </SelectTrigger>
            <SelectContent>
              {shipments.map((shipment: any) => (
                <SelectItem key={shipment.id} value={shipment.id}>
                  {shipment.shipmentNumber}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-red-500">
            {form.formState.errors.shipmentId?.message}
          </p>
        </div>

        {/* Invoice Number */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Invoice Number</label>
          <Input
            placeholder="Invoice Number"
            {...form.register("invoiceNumber")}
          />
          <p className="text-sm text-red-500">
            {form.formState.errors.invoiceNumber?.message}
          </p>
        </div>

        {/* Invoice Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Invoice Date</label>
          <Input type="date" {...form.register("invoiceDate")} />
          <p className="text-sm text-red-500">
            {form.formState.errors.invoiceDate?.message}
          </p>
        </div>

        {/* Currency */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Currency</label>
          <Input placeholder="USD" {...form.register("currency")} />
          <p className="text-sm text-red-500">
            {form.formState.errors.currency?.message}
          </p>
        </div>

        {/* Number of Trucks */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Number of Trucks</label>
          <Input
            type="number"
            {...form.register("numberOfTrucks", { valueAsNumber: true })}
          />
          <p className="text-sm text-red-500">
            {form.formState.errors.numberOfTrucks?.message}
          </p>
        </div>

        {/* Freight */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Freight</label>
          <Input
            type="number"
            step="0.01"
            {...form.register("freight", { valueAsNumber: true })}
          />
          <p className="text-sm text-red-500">
            {form.formState.errors.freight?.message}
          </p>
        </div>

        {/* Total Amount */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Total Amount</label>
          <Input disabled value="0.00" />
          <p className="text-xs text-muted-foreground">
            Total amount is calculated automatically after invoice items are added.
          </p>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving..." : "Save Invoice"}
      </Button>
    </form>
  );
}
