
import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "../../../store/auth.store";
import {
  loginExporter,
  submitExporterQuote,
} from "../../../api/auth/auth.api";

interface QuoteHandoff {
  quoteId: string;
  quoteNumber?: string;
  selectedQuoteItemIds: string[];
  customerName?: string;
  email?: string;
  phone?: string;
  customerMessage?: string;
}

interface LoginLocationState {
  from?: string;
  quoteHandoff?: QuoteHandoff;
}

export default function ExporterLoginForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const authenticate = useAuthStore((state) => state.login);

  const routeState =
    location.state as LoginLocationState | null;

  const quoteHandoff = routeState?.quoteHandoff;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      toast.error("Missing information", {
        description: "Enter your email address and password.",
      });
      return;
    }

    if (
      quoteHandoff &&
      (!quoteHandoff.quoteId ||
        !quoteHandoff.selectedQuoteItemIds?.length)
    ) {
      toast.error("Quotation information is incomplete", {
        description:
          "Return to the calculator and select at least one service.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await loginExporter({
        email: normalizedEmail,
        password,
      });

      const { user, token } = response;

      if (!user || !token) {
        throw new Error("The server returned an invalid login response.");
      }

      if (user.role !== "EXPORTER") {
        toast.error("Exporter account required", {
          description:
            "Please use an exporter account to submit this request.",
        });
        return;
      }

      // Save authentication before requesting protected resources.
      authenticate(user, token);

      if (quoteHandoff) {
        await submitExporterQuote(quoteHandoff.quoteId, {
          selectedQuoteItemIds:
            quoteHandoff.selectedQuoteItemIds,
          customerName: quoteHandoff.customerName ?? user.name,
          email: quoteHandoff.email ?? user.email,
          phone: quoteHandoff.phone ?? user.phone ?? undefined,
          customerMessage: quoteHandoff.customerMessage,
        });

        toast.success("Quotation request submitted", {
          description:
            "Your selected services have been sent to the quotation team.",
        });
      } else {
        toast.success("Welcome back!", {
          description: "You have signed in successfully.",
        });
      }

      navigate("/exporter/quotations", {
        replace: true,
      });
    } catch (error: unknown) {
      const err = error as {
        response?: {
          status?: number;
          data?: { message?: string; code?: string };
        };
        message?: string;
      };

      const status = err.response?.status;
      const code = err.response?.data?.code;

      toast.error(
        quoteHandoff
          ? "Unable to complete quotation submission"
          : "Unable to sign in",
        {
          description:
            status === 401
              ? "Your email or password may be incorrect, or your session needs to be refreshed."
              : code === "QUOTE_NOT_SUBMITTABLE"
                ? "This quote has already been submitted or is no longer available for submission."
                : err.response?.data?.message ??
                  err.message ??
                  "Something went wrong. Please try again.",
        },
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass =
    "block w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:bg-slate-50";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
      noValidate
    >
      {quoteHandoff && (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
          <p className="text-sm font-semibold text-emerald-900">
            Complete your quotation request
          </p>
          <p className="mt-1 text-sm text-emerald-800">
            {quoteHandoff.quoteNumber
              ? `Reference: ${quoteHandoff.quoteNumber}. `
              : ""}
            Sign in to submit your selected services.
          </p>
        </div>
      )}

      <div>
        <label
          htmlFor="exporter-email"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Email address
        </label>

        <div className="relative">
          <Mail
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            id="exporter-email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isSubmitting}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <label
            htmlFor="exporter-password"
            className="text-sm font-semibold text-slate-700"
          >
            Password
          </label>
          <Link
            to="/exporter/forgot-password"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-900"
          >
            Forgot password?
          </Link>
        </div>

        <div className="relative">
          <LockKeyhole
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            id="exporter-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isSubmitting}
            className={`${inputClass} pr-12`}
          />
          <button
            type="button"
            onClick={() =>
              setShowPassword((current) => !current)
            }
            aria-label={
              showPassword ? "Hide password" : "Show password"
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <LoaderCircle size={18} className="animate-spin" />
            {quoteHandoff
              ? "Submitting your request..."
              : "Signing you in..."}
          </>
        ) : quoteHandoff ? (
          "Sign in and submit request"
        ) : (
          "Sign In to Your Account"
        )}
      </button>

      <p className="text-center text-xs leading-5 text-slate-500">
        Secure access to your quotations and shipment information.
      </p>
    </form>
  );
}
