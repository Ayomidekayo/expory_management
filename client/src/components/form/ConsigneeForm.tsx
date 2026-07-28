import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "../ui/input";
import { consigneeSchema, type ConsigneeFormData } from "../../validations/consignee.validation";
import { Button } from "../ui/button";


interface Props {
  defaultValues?: Partial<ConsigneeFormData>;
  loading?: boolean;
  onSubmit: (values: ConsigneeFormData) => void;
}

export default function ConsigneeForm({
  defaultValues,
  loading,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ConsigneeFormData>({
    resolver: zodResolver(consigneeSchema),

    defaultValues: {
      name: "",
      contactPerson: "",
      address: "",
      phone: "",
      email: "",
      transporter: "",
      placeOfLoading: "",
      transitRoute: "",
      portOfDischarge: "",
      transportMode: "ROAD",

      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <div className="grid gap-5 md:grid-cols-2">

        <div>
          <label>Name</label>

          <Input {...register("name")} />

          <p className="text-sm text-red-500">
            {errors.name?.message}
          </p>
        </div>

        <div>
          <label>Contact Person</label>

          <Input {...register("contactPerson")} />
        </div>

        <div>
          <label>Email</label>

          <Input
            type="email"
            {...register("email")}
          />

          <p className="text-sm text-red-500">
            {errors.email?.message}
          </p>
        </div>

        <div>
          <label>Phone</label>

          <Input {...register("phone")} />
        </div>

        <div>
          <label>Transporter</label>

          <Input
            {...register("transporter")}
          />
        </div>

        <div>
          <label>Place of Loading</label>

          <Input
            {...register("placeOfLoading")}
          />

          <p className="text-sm text-red-500">
            {errors.placeOfLoading?.message}
          </p>
        </div>

        <div>
          <label>Transit Route</label>

          <Input
            {...register("transitRoute")}
          />

          <p className="text-sm text-red-500">
            {errors.transitRoute?.message}
          </p>
        </div>

        <div>
          <label>Port of Discharge</label>

          <Input
            {...register(
              "portOfDischarge"
            )}
          />

          <p className="text-sm text-red-500">
            {errors.portOfDischarge?.message}
          </p>
        </div>

        <div>
          <label>Transport Mode</label>

          <select
            {...register("transportMode")}
            className="w-full rounded-lg border h-11 px-3"
          >
            <option value="ROAD">
              Road
            </option>

            <option value="SEA">
              Sea
            </option>

            <option value="AIR">
              Air
            </option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label>Address</label>

          <Input
            {...register("address")}
          />
        </div>
      </div>

      <Button
        className="w-full"
        disabled={loading}
      >
        {loading
          ? "Saving..."
          : "Save Consignee"}
      </Button>
    </form>
  );
}