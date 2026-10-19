import { useState, type FormEvent } from "react";
import {
  AlertCircle,
  Check,
  LoaderCircle,
  Plus,
  Settings2,
  ToggleLeft,
  ToggleRight,
  X,
} from "lucide-react";
import { useCreateRateCardOption, useRateCardOptions, useUpdateRateCardOption } from "../hooks/use-rate-card-options";
import type { CreateRateCardOptionInput, RateCardOption } from "../types/rate-card-option.types";

type Props = {
  configurationId: string;
  configurationName?: string;
  mode?: "AIR" | "LAND" | "SEA";
  rateCardStatus?: string;
};

const presets: Record<"LAND" | "SEA", Array<{ code: string; name: string }>> = {
  LAND: [
    { code: "LONG_TRUCK", name: "Long Truck" },
    { code: "SHORT_TRUCK", name: "Short Truck" },
  ],
  SEA: [
    { code: "20FT", name: "20ft Container" },
    { code: "40FT", name: "40ft Container" },
  ],
};

function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  return error instanceof Error ? error.message : "Something went wrong.";
}

export default function RateCardOptionsManager({
  configurationId,
  configurationName,
  mode,
  rateCardStatus = "DRAFT",
}: Props) {
  const { data: options = [], isLoading, isError, error, refetch } = useRateCardOptions(configurationId);
  const createOption = useCreateRateCardOption(configurationId);
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [formError, setFormError] = useState("");

  const canEdit = rateCardStatus === "DRAFT";

  const create = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    const payload: CreateRateCardOptionInput = {
      name: name.trim(),
      code: code.trim().toUpperCase().replace(/\s+/g, "_"),
      displayOrder: Number(displayOrder),
      isActive: true,
    };
    if (!payload.name || !payload.code) {
      setFormError("Enter both an option name and code.");
      return;
    }
    if (!Number.isInteger(payload.displayOrder) || payload.displayOrder! < 0) {
      setFormError("Display order must be a whole number of zero or more.");
      return;
    }

    try {
      await createOption.mutateAsync(payload);
      setName("");
      setCode("");
      setDisplayOrder(String(options.length + 1));
      setFormOpen(false);
    } catch (err) {
      setFormError(getErrorMessage(err));
    }
  };

  const usePreset = (preset: { code: string; name: string }) => {
    setCode(preset.code);
    setName(preset.name);
    setFormOpen(true);
    setFormError("");
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-amber-700">
            <Settings2 size={16} /> Configuration options
          </div>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            Options
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            {configurationName ? `Manage options for ${configurationName}. ` : ""}
            Exporters will be asked to choose from active options when this mode requires a choice.
          </p>
        </div>
        {canEdit && (
          <button
            type="button"
            onClick={() => { setFormOpen((open) => !open); setFormError(""); }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            {formOpen ? <X size={16} /> : <Plus size={16} />}
            {formOpen ? "Cancel" : "Add option"}
          </button>
        )}
      </header>

      {mode === "AIR" ? (
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
          Air configurations do not use truck/container options. Manage weight slabs, airline selection, and applicable charges instead.
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-semibold text-slate-800">Quick-add common options</p>
          <p className="mt-1 text-xs text-slate-500">
            These are shortcuts only. You can still create any option your admin needs.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(mode === "LAND" || mode === "SEA") && presets[mode].map((preset) => {
              const exists = options.some((item) => item.code.toUpperCase() === preset.code);
              return (
                <button
                  key={preset.code}
                  type="button"
                  disabled={!canEdit || exists}
                  onClick={() => usePreset(preset)}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:border-amber-400 hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {exists ? "✓ " : "+ "}{preset.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {formOpen && canEdit && mode !== "AIR" && (
        <form onSubmit={create} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Option name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Long Truck" maxLength={120} required className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Option code</span>
              <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. LONG_TRUCK" maxLength={60} required className="w-full rounded-xl border border-slate-300 px-3 py-2.5 uppercase outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100" />
              <span className="mt-1 block text-xs text-slate-500">Codes are saved in uppercase; spaces become underscores.</span>
            </label>
            <label className="block md:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Display order</span>
              <input type="number" min="0" step="1" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 md:max-w-xs" />
            </label>
          </div>
          {formError && <p className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700"><AlertCircle size={17} className="mt-0.5 shrink-0" />{formError}</p>}
          <div className="mt-5 flex justify-end gap-3">
            <button type="button" onClick={() => setFormOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700">Cancel</button>
            <button type="submit" disabled={createOption.isPending} className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-amber-400 disabled:opacity-60">
              {createOption.isPending ? <LoaderCircle className="animate-spin" size={16} /> : <Check size={16} />}
              {createOption.isPending ? "Saving..." : "Save option"}
            </button>
          </div>
        </form>
      )}

      {formError && !formOpen && (
        <p className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700"><AlertCircle size={17} />{formError}</p>
      )}

      {isLoading ? (
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-8 text-sm text-slate-500"><LoaderCircle size={18} className="animate-spin" />Loading options...</div>
      ) : isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm text-red-700">{getErrorMessage(error)}</p>
          <button onClick={() => void refetch()} className="mt-3 text-sm font-semibold text-red-800 underline">Try again</button>
        </div>
      ) : mode === "AIR" ? null : options.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
          <Settings2 className="mx-auto text-slate-400" size={30} />
          <h3 className="mt-3 font-semibold text-slate-900">No options created yet</h3>
          <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">Add the truck, container, route, or other option that exporters should choose for this configuration.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  {["Option", "Code", "Order", "Status", "Linked pricing", "Actions"].map((label) => (
                    <th key={label} className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {options.map((option) => (
                  <OptionRow key={option.id} option={option} configurationId={configurationId} canEdit={canEdit} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!canEdit && (
        <p className="text-xs text-slate-500">This rate card is {rateCardStatus.toLowerCase()}; options are read-only until the card is in DRAFT.</p>
      )}
    </section>
  );
}

function OptionRow({ option, configurationId, canEdit }: { option: RateCardOption; configurationId: string; canEdit: boolean }) {
  const update = useUpdateRateCardOption(option.id, configurationId);
  const [editOpen, setEditOpen] = useState(false);
  const [name, setName] = useState(option.name);
  const [code, setCode] = useState(option.code);
  const [displayOrder, setDisplayOrder] = useState(String(option.displayOrder));
  const [error, setError] = useState("");

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    try {
      await update.mutateAsync({ name: name.trim(), code: code.trim(), displayOrder: Number(displayOrder) });
      setEditOpen(false);
    } catch (err) { setError(getErrorMessage(err)); }
  };

  const toggleActive = async () => {
    setError("");
    try { await update.mutateAsync({ isActive: !option.isActive }); }
    catch (err) { setError(getErrorMessage(err)); }
  };

  return (
    <>
      <tr className="align-middle">
        <td className="px-4 py-4">
          <p className="font-medium text-slate-900">{option.name}</p>
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </td>
        <td className="whitespace-nowrap px-4 py-4 font-mono text-xs text-slate-600">{option.code}</td>
        <td className="px-4 py-4 text-sm text-slate-600">{option.displayOrder}</td>
        <td className="px-4 py-4">
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${option.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
            {option.isActive ? "Active" : "Inactive"}
          </span>
        </td>
        <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
          {(option._count?.components ?? 0) + (option._count?.weightSlabs ?? 0) + (option._count?.pricingSections ?? 0)}
          <span className="ml-1 text-xs text-slate-400">items</span>
        </td>
        <td className="whitespace-nowrap px-4 py-4">
          {canEdit ? (
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setEditOpen((value) => !value)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">{editOpen ? "Close" : "Edit"}</button>
              <button type="button" onClick={() => void toggleActive()} disabled={update.isPending} title={option.isActive ? "Deactivate option" : "Activate option"} className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50 disabled:opacity-50">
                {update.isPending ? <LoaderCircle size={16} className="animate-spin" /> : option.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
              </button>
            </div>
          ) : <span className="text-xs text-slate-400">Read-only</span>}
        </td>
      </tr>
      {editOpen && canEdit && (
        <tr>
          <td colSpan={6} className="bg-slate-50 px-4 py-4">
            <form onSubmit={save} className="grid grid-cols-1 gap-3 md:grid-cols-4 md:items-end">
              <label className="text-xs font-semibold text-slate-600">Name<input value={name} onChange={(e) => setName(e.target.value)} required maxLength={120} className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal" /></label>
              <label className="text-xs font-semibold text-slate-600">Code<input value={code} onChange={(e) => setCode(e.target.value)} required maxLength={60} className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal uppercase" /></label>
              <label className="text-xs font-semibold text-slate-600">Display order<input type="number" min="0" step="1" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} required className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal" /></label>
              <button type="submit" disabled={update.isPending} className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60">{update.isPending ? "Saving..." : "Save changes"}</button>
            </form>
          </td>
        </tr>
      )}
    </>
  );
}
