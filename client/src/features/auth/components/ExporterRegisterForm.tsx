import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  LoaderCircle,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { useRegisterExporter } from "../../../hooks/useRegisterExporter";
import { useAuthStore } from "../../../store/auth.store";
import { registerSchema, type RegisterFormData } from "../../../validations/auth.validation";





export default function ExporterRegisterForm() {
  const navigate = useNavigate();

  const { mutate, isPending } = useRegisterExporter();

  const login = useAuthStore((state) => state.login);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password") || "";

  const passwordChecks = [
    {
      label: "At least 8 characters",
      valid: password.length >= 8,
    },
    {
      label: "Uppercase letter",
      valid: /[A-Z]/.test(password),
    },
    {
      label: "Lowercase letter",
      valid: /[a-z]/.test(password),
    },
    {
      label: "At least one number",
      valid: /[0-9]/.test(password),
    },
  ];

  const score = passwordChecks.filter((check) => check.valid).length;

  const strength = {
    label:
      score <= 1
        ? "Weak"
        : score === 2
          ? "Fair"
          : score === 3
            ? "Good"
            : "Strong",

    color:
      score <= 1
        ? "bg-red-500"
        : score === 2
          ? "bg-amber-500"
          : score === 3
            ? "bg-emerald-400"
            : "bg-emerald-600",

    textColor:
      score <= 1
        ? "text-red-600"
        : score === 2
          ? "text-amber-600"
          : "text-emerald-700",
  };

  const inputClass = (hasError: boolean, hasToggle = false) =>
    [
      "w-full rounded-xl border bg-white py-3.5 pl-11",
      hasToggle ? "pr-12" : "pr-4",
      "text-sm text-slate-900 placeholder:text-slate-400",
      "outline-none transition duration-200",
      "focus:ring-4",
      hasError
        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
        : "border-slate-200 hover:border-slate-300 focus:border-emerald-600 focus:ring-emerald-100",
    ].join(" ");

  const onSubmit = (data: RegisterFormData) => {
    mutate(
      {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
      },
      {
        onSuccess: (response) => {
          const authData = response.data;

          if (!response.success || !authData?.user || !authData?.token) {
            toast.error(
              "Your account may have been created, but automatic sign-in failed. Please sign in."
            );

            navigate("/exporter/login", { replace: true });
            return;
          }

          if (authData.user.role !== "EXPORTER") {
            toast.error(
              "This registration did not return an exporter account. Please contact support."
            );

            return;
          }

          login(authData.user, authData.token);

          toast.success("Exporter account created successfully!", {
            description: "Welcome to OGW KAY IMPEX.",
          });

          navigate("/exporter/quotations", { replace: true });
        },

        onError: (error: unknown) => {
          const message =
            typeof error === "object" &&
            error !== null &&
            "response" in error
              ? (
                  error as {
                    response?: {
                      data?: { message?: string };
                    };
                  }
                ).response?.data?.message
              : undefined;

          toast.error(message ?? "Registration failed. Please try again.");
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Full name */}
      <div>
        <label
          htmlFor="register-name"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Full name
        </label>

        <div className="relative">
          <UserRound
            size={19}
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            id="register-name"
            autoComplete="name"
            {...register("name")}
            placeholder="Enter your full name"
            aria-invalid={!!errors.name}
            className={inputClass(!!errors.name)}
          />
        </div>

        {errors.name && (
          <p role="alert" className="mt-1.5 text-xs text-red-600">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="register-email"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Email address
        </label>

        <div className="relative">
          <Mail
            size={19}
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            id="register-email"
            type="email"
            autoComplete="email"
            {...register("email")}
            placeholder="you@company.com"
            aria-invalid={!!errors.email}
            className={inputClass(!!errors.email)}
          />
        </div>

        {errors.email && (
          <p role="alert" className="mt-1.5 text-xs text-red-600">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <label
            htmlFor="register-password"
            className="text-sm font-semibold text-slate-700"
          >
            Password
          </label>

          <span className="text-xs text-slate-400">
            Minimum 8 characters
          </span>
        </div>

        <div className="relative">
          <LockKeyhole
            size={19}
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            id="register-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            {...register("password")}
            placeholder="Create a strong password"
            aria-invalid={!!errors.password}
            className={inputClass(!!errors.password, true)}
          />

          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
          </button>
        </div>

        {password.length > 0 && (
          <div className="mt-3">
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((segment) => (
                <div
                  key={segment}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    score >= segment ? strength.color : "bg-slate-200"
                  }`}
                />
              ))}
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Password strength:{" "}
              <span className={`font-semibold ${strength.textColor}`}>
                {strength.label}
              </span>
            </p>

            <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
              {passwordChecks.map((check) => (
                <div
                  key={check.label}
                  className="flex items-center gap-2 text-xs"
                >
                  <Check
                    size={14}
                    className={
                      check.valid ? "text-emerald-600" : "text-slate-300"
                    }
                  />

                  <span
                    className={
                      check.valid ? "text-emerald-700" : "text-slate-500"
                    }
                  >
                    {check.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {errors.password && (
          <p role="alert" className="mt-2 text-xs text-red-600">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm password */}
      <div>
        <label
          htmlFor="register-confirm-password"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Confirm password
        </label>

        <div className="relative">
          <ShieldCheck
            size={19}
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            id="register-confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            {...register("confirmPassword")}
            placeholder="Re-enter your password"
            aria-invalid={!!errors.confirmPassword}
            className={inputClass(!!errors.confirmPassword, true)}
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword((current) => !current)
            }
            aria-label={
              showConfirmPassword
                ? "Hide confirmation password"
                : "Show confirmation password"
            }
            className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            {showConfirmPassword ? (
              <EyeOff size={19} />
            ) : (
              <Eye size={19} />
            )}
          </button>
        </div>

        {errors.confirmPassword && (
          <p role="alert" className="mt-1.5 text-xs text-red-600">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/10 transition duration-200 hover:bg-emerald-900 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? (
          <>
            <LoaderCircle size={19} className="animate-spin" />
            Creating your account...
          </>
        ) : (
          <>
            Create exporter account
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </>
        )}
      </button>

      {/* Login */}
      <div className="border-t border-slate-100 pt-5 text-center">
        <p className="text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/exporter/login"
            className="font-semibold text-emerald-700 transition hover:text-emerald-900 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>

      {/* Security */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
        <ShieldCheck size={15} className="text-emerald-600" />
        Your account details are protected.
      </div>
    </form>
  );
}