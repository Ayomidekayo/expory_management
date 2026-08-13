import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "../ui/form";

import type { Exporter } from "../../types/exporter.types";

import {
  createExporterSchema,
  type CreateExporterInput,
} from "../../validations/exporter.validation";

import BasicInformation from "./section/BasicInformation";
import ContactInformation from "./section/ContactInformation";
import AddressInformation from "./section/AddressInformation";
import FormActions from "./section/FormActions";

interface Props {
  defaultValues?: Partial<Exporter>;

  loading?: boolean;

  isEditing?: boolean;

  onSubmit: (data: CreateExporterInput) => void;
}

export default function ExporterForm({
  defaultValues,
  loading = false,
  isEditing = false,
  onSubmit,
}: Props) {
  const navigate = useNavigate();

  const form = useForm<CreateExporterInput>({
    resolver: zodResolver(createExporterSchema),

    defaultValues: {
      name: "",
      contactPerson: "",
      phone: "",
      email: "",
      address: "",
    },
  });

  useEffect(() => {
    if (!defaultValues) return;

    form.reset({
      name: defaultValues.name ?? "",
      contactPerson:
        defaultValues.contactPerson ?? "",
      phone: defaultValues.phone ?? "",
      email: defaultValues.email ?? "",
      address: defaultValues.address ?? "",
    });
  }, [defaultValues, form]);

  const submit = (values: CreateExporterInput) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submit)}
        className="w-full space-y-6"
      >
        {/* =====================================================
            FORM SECTIONS
        ===================================================== */}

        <div className="space-y-6">
          {/* Basic Information */}

          <BasicInformation form={form} />

          {/* Contact Information */}

          <ContactInformation form={form} />

          {/* Address Information */}

          <AddressInformation form={form} />
        </div>

        {/* =====================================================
            FORM ACTIONS
        ===================================================== */}

        <div className="border-t border-slate-200 pt-6">
          <FormActions
            isLoading={loading}
            isEdit={isEditing}
            onCancel={() => navigate("/exporters")}
          />
        </div>
      </form>
    </Form>
  );
}