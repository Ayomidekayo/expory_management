import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "../ui/form";

import {
  createContainerSchema,
  type CreateContainerInput,
  type CreateContainerOutput,
} from "../../validations/container.validation";

import ContainerInformation from "./section/ContainerInformation";
import ShipmentInformation from "./section/ShipmentInformation";
import PhysicalInformation from "./section/PhysicalInformation";
import LogisticsInformation from "./section/LogisticsInformation";
import Summary from "./section/Summary";
import FormActions from "./section/FormActions";

interface Props {
  defaultValues?: Partial<CreateContainerInput>;

  isEditing?: boolean;

  loading?: boolean;

  onSubmit: (
    values: CreateContainerOutput
  ) => void;
}

export default function ContainerForm({
  defaultValues,
  isEditing = false,
  loading = false,
  onSubmit,
}: Props) {
  const form = useForm<
    CreateContainerInput,
    undefined,
    CreateContainerOutput
  >({
    resolver: zodResolver(
      createContainerSchema
    ),

    defaultValues: {
      shipmentId: "",

      packingListId: "",

      containerNumber: "",

      sealNumber: "",

      containerType: "DRY",

      containerSize: "FT20",

      grossWeight: 0,

      netWeight: 0,

      tareWeight: 0,

      volume: 0,

      loadingLocation: "",

      destination: "",

      shippingLine: "",

      bookingReference: "",

      containerCondition: "",

      status: "EMPTY",

      ...defaultValues,
    },
  });

  useEffect(() => {
    if (!defaultValues) return;

    form.reset({
      ...defaultValues,
    });
  }, [defaultValues, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          (values) => {
            console.log(
              "✅ VALID CONTAINER:",
              values
            );

            onSubmit(values);
          },
          (errors) => {
            console.log(
              "❌ CONTAINER VALIDATION ERRORS:",
              errors
            );
          }
        )}
        className="w-full"
      >
        {/* =========================================
            FORM CONTENT
        ========================================= */}

        <div className="mx-auto w-full  space-y-6">
          {/* =====================================
              CONTAINER INFORMATION
          ===================================== */}

          <section>
            <ContainerInformation
              form={form}
            />
          </section>

          {/* =====================================
              SHIPMENT INFORMATION
          ===================================== */}

          <section>
            <ShipmentInformation
              form={form}
            />
          </section>

          {/* =====================================
              PHYSICAL INFORMATION
          ===================================== */}

          <section>
            <PhysicalInformation
              form={form}
            />
          </section>

          {/* =====================================
              LOGISTICS INFORMATION
          ===================================== */}

          <section>
            <LogisticsInformation
              form={form}
            />
          </section>

          {/* =====================================
              SUMMARY
          ===================================== */}

          <section>
            <Summary form={form} />
          </section>

          {/* =====================================
              ACTIONS
          ===================================== */}

          <div className="sticky bottom-0 z-10 -mx-4 border-t border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <FormActions
                loading={loading}
                isEditing={isEditing}
              />
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}