import { Link, Navigate, useParams } from "react-router-dom";
import { useState } from "react";

import {
  ArrowLeft,
  Container as ContainerIcon,
  Banknote,
  CheckCircle2,
  Clock3,
  Loader2,
} from "lucide-react";

import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import ContainerForm from "../../components/container/ContainerForm";

import { useContainer } from "../../hooks/container/useContainer";
import { useUpdateContainer } from "../../hooks/container/useUpdateContainer";

import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

import axiosInstance from "../../lib/axios";

export default function EditContainerPage() {
  const { id } = useParams();

  const {
    data,
    isLoading,
    isError,
  } = useContainer(id);

  const updateContainer =
    useUpdateContainer();

  const queryClient =
    useQueryClient();

  const [terminalAmount, setTerminalAmount] =
    useState<string>("");

  /*
  ==========================================
  CONTAINER
  ==========================================
  */

  const container = data?.data;

  /*
  ==========================================
  UPDATE TERMINAL CHARGE STATUS
  ==========================================
  */

  const updateTerminalChargeStatus =
    useMutation({
      mutationFn: async (
        status: "UNPAID" | "PAID"
      ) => {
        const { data } =
          await axiosInstance.patch(
            `/containers/${id}/terminal-charge-status`,
            {
              status,
            }
          );

        return data;
      },

      onSuccess: () => {
        toast.success(
          "Terminal charge status updated successfully."
        );

        queryClient.invalidateQueries({
          queryKey: ["container", id],
        });
      },

      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message ??
            "Unable to update terminal charge status."
        );
      },
    });

  /*
  ==========================================
  UPDATE TERMINAL CHARGE AMOUNT
  ==========================================
  */

  const updateTerminalCharge =
    useMutation({
      mutationFn: async (
        amount: number | null
      ) => {
        const { data } =
          await axiosInstance.patch(
            `/containers/${id}/terminal-charge`,
            {
              amount,
            }
          );

        return data;
      },

      onSuccess: () => {
        toast.success(
          "Terminal charge amount updated successfully."
        );

        queryClient.invalidateQueries({
          queryKey: ["container", id],
        });

        setTerminalAmount("");
      },

      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message ??
            "Unable to update terminal charge amount."
        );
      },
    });

  /*
  ==========================================
  LOADING
  ==========================================
  */

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />

          <span>
            Loading container...
          </span>
        </div>
      </div>
    );
  }

  /*
  ==========================================
  ERROR / NOT FOUND
  ==========================================
  */

  if (isError || !container) {
    return (
      <Navigate
        to="/containers"
        replace
      />
    );
  }

  /*
  ==========================================
  TERMINAL CHARGE VALUES
  ==========================================
  */

  const terminalChargeStatus =
    container.terminalChargeStatus ??
    "UNPAID";

  const terminalChargeAmount =
    container.terminalChargeAmount;

  /*
  ==========================================
  SAVE TERMINAL AMOUNT
  ==========================================
  */

  const handleSaveTerminalAmount =
    () => {
      const trimmed =
        terminalAmount.trim();

      /*
       * Empty amount is allowed.
       * This allows the user to clear
       * the existing amount.
       */

      if (!trimmed) {
        updateTerminalCharge.mutate(null);
        return;
      }

      const amount =
        Number(trimmed);

      if (
        Number.isNaN(amount) ||
        amount < 0
      ) {
        toast.error(
          "Please enter a valid terminal charge amount."
        );

        return;
      }

      updateTerminalCharge.mutate(
        amount
      );
    };

  return (
    <div className="space-y-6">

      {/* ==========================================
          PAGE HEADER
      ========================================== */}

      <div className="flex items-center gap-4">

        <Link to="/containers">

          <Button
            variant="outline"
            className="
              h-11
              rounded-xl
              border-slate-300
              bg-white
              px-4
              shadow-sm
              transition-all
              hover:border-emerald-500
              hover:bg-emerald-50
              hover:text-emerald-700
              hover:shadow-md
            "
          >
            <ArrowLeft className="mr-2 h-5 w-5" />

            Back
          </Button>

        </Link>

        <div
          className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            bg-emerald-100
          "
        >
          <ContainerIcon
            className="
              h-7
              w-7
              text-emerald-700
            "
          />
        </div>

        <div>

          <h1 className="text-3xl font-bold text-slate-900">
            Edit Container
          </h1>

          <p className="mt-1 text-slate-500">
            Update container information and terminal charge details.
          </p>

        </div>

      </div>

      {/* ==========================================
          CONTAINER INFORMATION
      ========================================== */}

      <ContainerForm
        isEditing
        loading={
          updateContainer.isPending
        }
        defaultValues={{
          ...container,

          packingListId:
            container.packingListId ??
            undefined,

          sealNumber:
            container.sealNumber ??
            undefined,

          grossWeight:
            container.grossWeight ??
            undefined,

          netWeight:
            container.netWeight ??
            undefined,

          tareWeight:
            container.tareWeight ??
            undefined,

          volume:
            container.volume ??
            undefined,

          loadingLocation:
            container.loadingLocation ??
            undefined,

          destination:
            container.destination ??
            undefined,

          shippingLine:
            container.shippingLine ??
            undefined,

          bookingReference:
            container.bookingReference ??
            undefined,

          containerCondition:
            container.containerCondition ??
            undefined,

          status:
            container.status,
        }}
        onSubmit={(values) =>
          updateContainer.mutate({
            id: id!,
            payload: values,
          })
        }
      />

      {/* ==========================================
          TERMINAL CHARGES
      ========================================== */}

      <div className="rounded-2xl border bg-white shadow-sm">

        {/* HEADER */}

        <div className="border-b p-6">

          <div className="flex items-start gap-4">

            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-emerald-100
              "
            >
              <Banknote className="h-5 w-5 text-emerald-700" />
            </div>

            <div>

              <h2 className="text-lg font-semibold text-slate-900">
                Terminal Charges
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage the terminal charge payment status and amount.
              </p>

            </div>

          </div>

        </div>

        {/* CONTENT */}

        <div className="grid gap-6 p-6 md:grid-cols-2">

          {/* ==========================================
              PAYMENT STATUS
          ========================================== */}

          <div className="rounded-xl border bg-slate-50 p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-slate-700">
                  Payment Status
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Update the current terminal charge status.
                </p>

              </div>

              {terminalChargeStatus ===
              "PAID" ? (

                <Badge
                  className="
                    gap-1
                    bg-emerald-100
                    text-emerald-700
                    hover:bg-emerald-100
                  "
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />

                  Paid
                </Badge>

              ) : (

                <Badge
                  className="
                    gap-1
                    bg-red-100
                    text-red-700
                    hover:bg-red-100
                  "
                >
                  <Clock3 className="h-3.5 w-3.5" />

                  Unpaid
                </Badge>

              )}

            </div>

            <div className="mt-5 flex gap-3">

              <Button
                type="button"
                variant={
                  terminalChargeStatus ===
                  "UNPAID"
                    ? "destructive"
                    : "outline"
                }
                disabled={
                  updateTerminalChargeStatus.isPending
                }
                onClick={() =>
                  updateTerminalChargeStatus.mutate(
                    "UNPAID"
                  )
                }
              >
                Unpaid
              </Button>

              <Button
                type="button"
                variant={
                  terminalChargeStatus ===
                  "PAID"
                    ? "default"
                    : "outline"
                }
                disabled={
                  updateTerminalChargeStatus.isPending
                }
                onClick={() =>
                  updateTerminalChargeStatus.mutate(
                    "PAID"
                  )
                }
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />

                Paid
              </Button>

            </div>

          </div>

          {/* ==========================================
              AMOUNT
          ========================================== */}

          <div className="rounded-xl border bg-slate-50 p-5">

            <div>

              <p className="text-sm font-medium text-slate-700">
                Terminal Charge Amount
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Enter the amount paid. This field is optional.
              </p>

            </div>

            <div className="mt-5 flex gap-3">

              <div className="relative flex-1">

                <span
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-sm
                    font-medium
                    text-slate-500
                  "
                >
                  ₦
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder={
                    terminalChargeAmount != null
                      ? String(
                          terminalChargeAmount
                        )
                      : "Enter amount"
                  }
                  value={terminalAmount}
                  onChange={(event) =>
                    setTerminalAmount(
                      event.target.value
                    )
                  }
                  className="
                    h-10
                    w-full
                    rounded-lg
                    border
                    border-slate-300
                    bg-white
                    pl-8
                    pr-3
                    text-sm
                    outline-none
                    transition
                    focus:border-emerald-500
                    focus:ring-2
                    focus:ring-emerald-100
                  "
                />

              </div>

              <Button
                type="button"
                disabled={
                  updateTerminalCharge.isPending
                }
                onClick={
                  handleSaveTerminalAmount
                }
              >
                {updateTerminalCharge.isPending
                  ? "Saving..."
                  : "Save"}
              </Button>

            </div>

            {terminalChargeAmount != null && (
              <p className="mt-3 text-sm text-slate-600">

                Current amount:{" "}

                <span className="font-semibold text-slate-900">
                  ₦
                  {Number(
                    terminalChargeAmount
                  ).toLocaleString()}
                </span>

              </p>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}