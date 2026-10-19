import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  AlertCircle,
  Layers3,
  CheckCircle2,
} from "lucide-react";

import RateCardForm from "../components/rate-card-form";
import { useCreateRateCard } from "../hooks/use-rate-cards";

import type {
  CreateRateCardInput,
} from "../types/pricing.types";

export default function CreateRateCardPage() {
  const navigate = useNavigate();

  const createMutation = useCreateRateCard();

  const [error, setError] = useState("");

  async function handleSubmit(input: CreateRateCardInput) {
    setError("");

    try {
      const created = await createMutation.mutateAsync(input);

      navigate(`/quotations/rate-cards/${created.id}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create the rate card. Please try again.",
      );
    }
  }

  return (
    <main className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Breadcrumb */}
        <Link
          to="/quotations/rate-cards"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-emerald-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Rate Cards
        </Link>

        {/* Page heading */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
              <Layers3 className="h-6 w-6 text-emerald-700" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Create Rate Card
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Create a pricing framework for one transport mode and
              direction. You will configure its pricing rules and
              charges after saving.
            </p>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            Draft configuration
          </span>
        </header>

        {/* Workflow guidance */}
        <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-semibold text-slate-900">
            How rate card setup works
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-sm font-bold text-emerald-800">
                1
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Create rate card
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Choose the transport mode, direction and validity period.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700">
                2
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Configure pricing
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Add features, options, charges, VAT rules and weight slabs
                  where applicable.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700">
                3
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Preview and activate
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Validate the pricing configuration and preview its table
                  before activation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-semibold">
                Rate card creation failed
              </p>

              <p className="mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-8">
            <h2 className="text-lg font-semibold text-slate-900">
              Rate Card Details
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter the basic information. Pricing components will be
              configured separately.
            </p>
          </div>

          <div className="p-5 sm:p-8">
            <RateCardForm
              isSubmitting={createMutation.isPending}
              onSubmit={handleSubmit}
              onCancel={() => navigate("/quotations/rate-cards")}
            />
          </div>
        </section>

        {/* Draft notice */}
        <div className="flex items-start gap-3 rounded-xl bg-slate-100 p-4">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />

          <div>
            <p className="text-sm font-semibold text-slate-700">
              Saving does not activate your rate card
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Newly created rate cards remain drafts. They will not become
              available for quotations until the pricing configuration
              has been validated and activated.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}