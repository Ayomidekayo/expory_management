import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";

interface DeleteGateMovementModalProps {
  open: boolean;
  containerNumber?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteGateMovementModal({
  open,
  containerNumber,
  loading = false,
  onClose,
  onConfirm,
}: DeleteGateMovementModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-gate-title"
        className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <AlertTriangle size={22} />
            </div>

            <div>
              <h2
                id="delete-gate-title"
                className="text-lg font-bold text-slate-900"
              >
                Delete Gate Movement
              </h2>

              <p className="mt-0.5 text-sm text-slate-500">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close"
          >
            <X size={19} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <p className="text-sm leading-6 text-slate-600">
            Are you sure you want to delete the gate movement for container{" "}
            <span className="font-semibold text-slate-900">
              {containerNumber || "this container"}
            </span>
            ?
          </p>

          <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
            <p className="text-xs leading-5 text-red-700">
              The gate movement record will be permanently removed from the
              system.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={17} />
                Delete Movement
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}