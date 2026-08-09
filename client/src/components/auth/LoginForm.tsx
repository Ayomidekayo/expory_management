import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
} from "lucide-react";

import {
  loginSchema,
  type LoginFormData,
} from "../../validations/auth.validation";

import { useLogin } from "../../hooks/useLogin";
import { useAuthStore } from "../../store/auth.store";
import { queryClient } from "../../lib/react-query";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const { mutate, isPending } =
    useLogin();

  // Only subscribe to the login action
  const login = useAuthStore(
    (state) => state.login
  );

  const onSubmit = (
    values: LoginFormData
  ) => {
    mutate(values, {
      onSuccess: (response) => {
        login(
          response.user,
          response.token
        );

        queryClient.removeQueries({
          queryKey: ["current-user"],
        });

        toast.success(
          "Login successful."
        );

        navigate("/dashboard", {
          replace: true,
        });
      },

      onError: () => {
        /*
         * Do not expose detailed authentication
         * errors from the server.
         *
         * The backend already uses the same
         * response for:
         *
         * - User does not exist
         * - Wrong password
         * - Disabled account
         */

        toast.error(
          "Invalid email or password."
        );
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      {/* ================================
          EMAIL
      ================================= */}

      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Email Address
        </label>

        <input
          id="email"
          type="email"
          autoComplete="email"
          {...register("email")}
          className="
            w-full
            rounded-xl
            border
            border-slate-300
            bg-white
            px-4
            py-3
            outline-none
            transition
            focus:border-emerald-600
            focus:ring-2
            focus:ring-emerald-100
          "
          placeholder="Enter your email"
        />

        {errors.email && (
          <p className="mt-1 text-sm text-red-500">
            Please enter a valid email address.
          </p>
        )}
      </div>

      {/* ================================
          PASSWORD
      ================================= */}

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Password
        </label>

        <div className="relative">
          <input
            id="password"
            type={
              showPassword
                ? "text"
                : "password"
            }
            autoComplete="current-password"
            {...register("password")}
            className="
              w-full
              rounded-xl
              border
              border-slate-300
              bg-white
              px-4
              py-3
              pr-12
              outline-none
              transition
              focus:border-emerald-600
              focus:ring-2
              focus:ring-emerald-100
            "
            placeholder="Enter your password"
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                (previous) => !previous
              )
            }
            className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              text-slate-500
              transition
              hover:text-emerald-700
            "
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
            }
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>

        {errors.password && (
          <p className="mt-1 text-sm text-red-500">
            Please enter your password.
          </p>
        )}
      </div>

      {/* ================================
          SUBMIT
      ================================= */}

      <button
        type="submit"
        disabled={isPending}
        className="
          w-full
          rounded-xl
          bg-emerald-700
          py-3
          font-semibold
          text-white
          transition
          hover:bg-emerald-800
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {isPending
          ? "Signing In..."
          : "Sign In"}
      </button>
    </form>
  );
}