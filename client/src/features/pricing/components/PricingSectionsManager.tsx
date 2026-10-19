
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  CirclePlus,
  LoaderCircle,
  Pencil,
  RefreshCw,
  Save,
  X,
} from "lucide-react";
import {
  useCreatePricingSection,
  usePricingSections,
} from "../hooks/use-pricing-sections";
import type {
  CreatePricingSectionInput,
  PricingSection,
  PricingSectionCurrency,
} from "../types/pricing-section.types";

type OptionChoice = { id: string; code: string; name: string; isActive: boolean };

type Props = {
  configurationId: string;
  configurationName?: string;
  configurationCurrency?: PricingSectionCurrency;
  rateCardStatus?: "DRAFT" | "ACTIVE" | "ARCHIVED" | string;
  options?: OptionChoice[];
};

type FormState = {
  code: string;
  name: string;
  currency: PricingSectionCurrency;
  optionId: string;
  displayOrder: number;
  isActive: boolean;
};

const emptyForm = (currency: PricingSectionCurrency): FormState => ({
  code: "",
  name: "",
  currency,
  optionId: "",
  displayOrder: 0,
  isActive: true,
});

function errorMessage(error: unknown) {
  if (error && typeof error === "object" && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">{children}</label>;
}

export default function PricingSectionsManager({
  configurationId,
  configurationName,
  configurationCurrency = "NGN",
  rateCardStatus = "DRAFT",
  options = [],
}: Props) {
  const canEdit = rateCardStatus === "DRAFT";
  const { data: sections = [], isLoading, isError, error, refetch, isFetching } =
    usePricingSections(configurationId);
  const createSection = useCreatePricingSection(configurationId);
  const [editingSection, setEditingSection] = useState<PricingSection | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<FormState>(() => emptyForm(configurationCurrency));
  const [formError, setFormError] = useState("");

  const sortedSections = useMemo(
    () => [...sections].sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name)),
    [sections],
  );

  function startCreate() {
    setEditingSection(null);
    setForm(emptyForm(configurationCurrency));
    setFormError("");
    setShowCreate(true);
  }

  function startEdit(section: PricingSection) {
    setShowCreate(false);
    setEditingSection(section);
    setForm({
      code: section.code,
      name: section.name,
      currency: section.currency,
      optionId: section.optionId ?? "",
      displayOrder: section.displayOrder,
      isActive: section.isActive,
    });
    setFormError("");
  }

  function closeForm() {
    setEditingSection(null);
    setShowCreate(false);
    setFormError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    const normalizedCode = form.code.trim().toUpperCase().replace(/\s+/g, "_");
    if (!editingSection && normalizedCode.length < 2) {
      setFormError("Enter a section code with at least 2 characters.");
      return;
    }
    if (form.name.trim().length < 2) {
      setFormError("Enter a section name with at least 2 characters.");
      return;
    }
    if (!Number.isInteger(Number(form.displayOrder)) || Number(form.displayOrder) < 0) {
      setFormError("Display order must be a whole number of 0 or more.");
      return;
    }

    try {
      if (editingSection) {
        const { pricingSectionsApi } = await import("../api/pricing-sections.api");
        await pricingSectionsApi.update(editingSection.id, {
          name: form.name.trim(),
          currency: form.currency,
          optionId: form.optionId || null,
          displayOrder: Number(form.displayOrder),
          isActive: form.isActive,
        });
      } else {
        const input: CreatePricingSectionInput = {
          code: normalizedCode,
          name: form.name.trim(),
          currency: form.currency,
          optionId: form.optionId || null,
          displayOrder: Number(form.displayOrder),
          isActive: form.isActive,
        };
        await createSection.mutateAsync(input);
      }
      closeForm();
      await refetch();
    } catch (submitError) {
      setFormError(errorMessage(submitError));
    }
  }

  const saving = createSection.isPending;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-900">Pricing Sections</h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{sections.length}</span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {configurationName ? `Organize charges for ${configurationName}.` : "Organize charges into manageable pricing groups."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} /> Refresh
          </button>
          {canEdit && (
            <button
              type="button"
              onClick={startCreate}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              <CirclePlus className="h-4 w-4" /> Add Section
            </button>
          )}
        </div>
      </header>

      {!canEdit && (
        <div className="flex gap-2 border-b border-amber-100 bg-amber-50 px-5 py-3 text-sm text-amber-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          This rate card is {rateCardStatus?.toLowerCase()}; pricing sections are read-only.
        </div>
      )}

      {(showCreate || editingSection) && (
        <form onSubmit={handleSubmit} className="border-b border-emerald-100 bg-emerald-50/50 p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="font-semibold text-slate-900">{editingSection ? `Edit ${editingSection.name}` : "Create Pricing Section"}</h3>
            <button type="button" onClick={closeForm} className="rounded-lg p-2 text-slate-500 hover:bg-white" aria-label="Close form"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <FieldLabel>Section Code</FieldLabel>
              <input
                value={form.code}
                onChange={(event) => setForm({ ...form, code: event.target.value.toUpperCase().replace(/\s+/g, "_") })}
                disabled={Boolean(editingSection)}
                required
                minLength={2}
                maxLength={50}
                pattern="[A-Za-z0-9_-]+"
                placeholder="e.g. TERMINAL_CHARGES"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100"
              />
              <p className="mt-1 text-xs text-slate-500">Letters, numbers, underscores and hyphens.</p>
            </div>
            <div>
              <FieldLabel>Section Name</FieldLabel>
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required minLength={2} maxLength={100} placeholder="e.g. Terminal Charges" className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" />
            </div>
            <div>
              <FieldLabel>Currency</FieldLabel>
              <select value={form.currency} onChange={(event) => setForm({ ...form, currency: event.target.value as PricingSectionCurrency })} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100">
                <option value="NGN">NGN — Nigerian Naira</option>
                <option value="CFA">CFA — West African CFA Franc</option>
              </select>
            </div>
            <div>
              <FieldLabel>Option (Optional)</FieldLabel>
              <select value={form.optionId} onChange={(event) => setForm({ ...form, optionId: event.target.value })} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100">
                <option value="">General section — no specific option</option>
                {options.map((option) => <option key={option.id} value={option.id}>{option.name} ({option.code}){!option.isActive ? " — inactive" : ""}</option>)}
              </select>
              <p className="mt-1 text-xs text-slate-500">Choose 20ft, 40ft, Long Truck, Short Truck, or another configured option.</p>
            </div>
            <div>
              <FieldLabel>Display Order</FieldLabel>
              <input type="number" min={0} step={1} value={form.displayOrder} onChange={(event) => setForm({ ...form, displayOrder: Number(event.target.value) })} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
                <input type="checkbox" checked={form.isActive} onChange={(event) => setForm({ ...form, isActive: event.target.checked })} className="h-4 w-4 rounded border-slate-300 accent-emerald-700" />
                Active section
              </label>
            </div>
          </div>
          {formError && <div role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</div>}
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <button type="button" onClick={closeForm} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50">
              {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {editingSection ? "Save Changes" : "Create Section"}
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center gap-3 p-10 text-sm text-slate-500"><LoaderCircle className="h-5 w-5 animate-spin" /> Loading pricing sections...</div>
      ) : isError ? (
        <div className="p-5">
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="flex items-center gap-2 font-semibold"><AlertCircle className="h-4 w-4" /> Unable to load pricing sections</p>
            <p className="mt-1">{errorMessage(error)}</p>
            <button type="button" onClick={() => void refetch()} className="mt-3 rounded-lg border border-red-200 bg-white px-3 py-2 font-semibold">Try again</button>
          </div>
        </div>
      ) : sortedSections.length === 0 ? (
        <div className="px-5 py-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100"><ChevronDown className="h-6 w-6 text-slate-500" /></div>
          <h3 className="mt-3 font-semibold text-slate-900">No pricing sections yet</h3>
          <p className="mx-auto mt-1 max-w-lg text-sm leading-6 text-slate-500">Create sections such as Customs Charges, Terminal Charges, Documentation, or Transportation. You can then assign pricing components to each section.</p>
          {canEdit && <button type="button" onClick={startCreate} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white"><CirclePlus className="h-4 w-4" /> Create First Section</button>}
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {sortedSections.map((section) => (
            <PricingSectionRow
              key={section.id}
              section={section}
              canEdit={canEdit}
              onEdit={() => startEdit(section)}
            />
          ))}
        </div>
      )}
      {createSection.isSuccess && <div className="flex items-center gap-2 border-t border-emerald-100 bg-emerald-50 px-5 py-3 text-sm text-emerald-800"><CheckCircle2 className="h-4 w-4" /> Pricing section saved successfully.</div>}
    </section>
  );
}

function PricingSectionRow({
  section,
  canEdit,
  onEdit,
}: {
  section: PricingSection;
  canEdit: boolean;
  onEdit: () => void;
}) {
  return (
    <article className="flex flex-col gap-4 px-5 py-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex min-w-0 items-start gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${section.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
          {section.isActive ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-slate-900">{section.name}</h3>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${section.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{section.isActive ? "Active" : "Inactive"}</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Code: {section.code} · Currency: {section.currency} · Order: {section.displayOrder}</p>
          {section.option && <p className="mt-1 text-sm text-slate-600">Option: {section.option.name} ({section.option.code})</p>}
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-700">{section._count?.components ?? 0} components</span>
            <span className="rounded-md bg-purple-50 px-2 py-1 text-xs text-purple-700">{section._count?.weightSlabs ?? 0} weight slabs</span>
          </div>
        </div>
      </div>
      {canEdit && <button type="button" onClick={onEdit} className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-white sm:self-center"><Pencil className="h-4 w-4" /> Edit Section</button>}
    </article>
  );
}
