import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  loginSchema,
  type LoginFormData,
} from "../../validations/auth.validation";

import { useLogin } from "../../hooks/useLogin";
import { useAuthStore } from "../../store/auth.store";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
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

  // ✅ Only subscribe to the login action
  const login =
    useAuthStore(
      (state) => state.login
    );

  const onSubmit = (
    values: LoginFormData
  ) => {
    mutate(values, {
      onSuccess: (response) => {
  login(response.user, response.token);

  queryClient.removeQueries({
    queryKey: ["current-user"],
  });

  toast.success("Login successful.");

  navigate("/dashboard", {
    replace: true,
  });
},
      onError: (error: any) => {
        toast.error(
          error.response?.data
            ?.message ??
            "Login failed."
        );
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(
        onSubmit
      )}
      className="space-y-5"
    >
      <div
        className="
          rounded-xl
          border
          border-slate-300
          bg-white
          px-4
          py-3
          transition
          focus-within:border-emerald-700
          focus-within:ring-2
          focus-within:ring-emerald-200
        "
      >
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Email Address
        </label>

        <input
          {...register("email")}
          className="w-full border-0 p-0 outline-none"
        />

        <p className="mt-1 text-sm text-red-500">
          {errors.email?.message}
        </p>
      </div>

   <div
  className="
    rounded-xl
    border
    border-slate-300
    bg-white
    px-4
    py-3
    transition
    focus-within:border-emerald-700
    focus-within:ring-2
    focus-within:ring-emerald-200
  "
>
  <label className="mb-2 block text-sm font-medium text-slate-700">
    Password
  </label>

  <div className="relative">

    <input
      type={
        showPassword
          ? "text"
          : "password"
      }
      {...register("password")}
      className="
        w-full
        border-0
        bg-transparent
        p-0
        pr-10
        outline-none
      "
    />

    <button
      type="button"
      onClick={() =>
        setShowPassword(
          !showPassword
        )
      }
      className="
        absolute
        right-0
        top-1/2
        -translate-y-1/2
        text-slate-500
        transition
        hover:text-emerald-700
      "
    >
      {showPassword ? (
        <EyeOff size={18} />
      ) : (
        <Eye size={18} />
      )}
    </button>

  </div>

  <p className="mt-1 text-sm text-red-500">
    {errors.password?.message}
  </p>
</div>

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