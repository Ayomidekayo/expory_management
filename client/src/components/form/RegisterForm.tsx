import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import {
  registerSchema,
  type RegisterFormData,
} from "../../validations/register.validation";

import { useRegister } from "../../hooks/useRegister";

export default function RegisterForm() {
  const navigate = useNavigate();

  const { mutate, isPending } = useRegister();

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

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

  const password = watch("password");

  const passwordStrength = () => {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;

    return score;
  };

  const score = passwordStrength();

  const strengthColor = () => {
    if (score <= 1) return "bg-red-500";
    if (score === 2) return "bg-yellow-500";
    if (score === 3) return "bg-green-500";
    return "bg-green-500";
  };

  const strengthText = () => {
    if (score <= 1) return "Weak";
    if (score === 2) return "Fair";
    if (score === 3) return "Good";
    return "Strong";
  };

  const onSubmit = (data: RegisterFormData) => {
    mutate(
      {
        name: data.name,
        email: data.email,
        password: data.password,
      } as any,
      {
        onSuccess: (response) => {
          console.log(response);

          toast.success("Account created successfully");

          setTimeout(() => {
            navigate("/login");
          }, 1000);
        },

        onError: (error: any) => {
          console.error(error);

          toast.error(
            error.response?.data?.message ??
              "Registration failed"
          );
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* Name */}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Full Name
        </label>

        <input
          {...register("name")}
          placeholder="John Doe"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none transition"
        />

        {errors.name && (
          <p className="text-red-500 text-sm mt-1">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Email Address
        </label>

        <input
          type="email"
          {...register("email")}
          placeholder="john@example.com"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none transition"
        />

        {errors.email && (
          <p className="text-red-500 text-sm mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Password
        </label>

        <div className="relative">
          <input
            type={
              showPassword ? "text" : "password"
            }
            {...register("password")}
            placeholder="********"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none transition"
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(!showPassword)
            }
            className="absolute right-4 top-3.5 text-slate-500"
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>

        {password.length > 0 && (
          <>
            <div className="w-full h-2 bg-slate-200 rounded mt-3 overflow-hidden">
              <div
                className={`h-full ${strengthColor()}`}
                style={{
                  width: `${score * 25}%`,
                }}
              />
            </div>

            <p className="text-sm mt-2 text-slate-500">
              Password Strength:
              <span className="font-semibold ml-1">
                {strengthText()}
              </span>
            </p>
          </>
        )}

        {errors.password && (
          <p className="text-red-500 text-sm mt-2">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Confirm Password
        </label>

        <div className="relative">
          <input
            type={
              showConfirmPassword
                ? "text"
                : "password"
            }
            {...register("confirmPassword")}
            placeholder="********"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none transition"
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword(
                !showConfirmPassword
              )
            }
            className="absolute right-4 top-3.5 text-slate-500"
          >
            {showConfirmPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>

        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-2">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Submit */}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-emerald-800 hover:bg-green-700 transition text-white py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
      >
        {isPending && (
          <Loader2
            className="animate-spin"
            size={18}
          />
        )}

        {isPending
          ? "Creating Account..."
          : "Create Account"}
      </button>

      {/* Footer */}

      <div className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-green-600 hover:underline font-medium"
        >
          Sign In
        </Link>
      </div>
    </form>
  );
}