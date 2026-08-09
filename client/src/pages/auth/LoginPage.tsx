import { Link } from "react-router-dom";

import {
  Ship,
  PackageCheck,
  ReceiptText,
  ClipboardList,
  ShieldCheck,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "../../components/ui/card";

import LoginForm from "../../components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">

      {/* =========================================
          LEFT PANEL
      ========================================= */}

      <div className="hidden lg:flex flex-col justify-center bg-emerald-800 p-16 text-white">

        <div className="max-w-lg">

          <div className="mb-8 flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
              <Ship className="h-6 w-6 text-emerald-100" />
            </div>

            <span className="text-lg font-semibold tracking-wide">
              Export Management
            </span>

          </div>

          <h1 className="text-5xl font-bold leading-tight">
            Export Management
            <br />
            System
          </h1>

          <p className="mt-6 text-lg leading-8 text-emerald-100">
            Manage exporters, shipments, invoices, packing lists
            and export documentation from one centralized platform.
          </p>

          {/* Features */}

          <div className="mt-14 space-y-6">

            {/* Shipment Tracking */}

            <div className="flex items-center gap-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                <PackageCheck className="h-5 w-5 text-emerald-100" />
              </div>

              <div>
                <p className="font-medium">
                  Shipment Tracking
                </p>

                <p className="text-sm text-emerald-200">
                  Monitor shipments throughout the export process.
                </p>
              </div>

            </div>

            {/* Invoice Management */}

            <div className="flex items-center gap-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                <ReceiptText className="h-5 w-5 text-emerald-100" />
              </div>

              <div>
                <p className="font-medium">
                  Invoice Management
                </p>

                <p className="text-sm text-emerald-200">
                  Keep your financial documentation organized.
                </p>
              </div>

            </div>

            {/* Packing Lists */}

            <div className="flex items-center gap-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                <ClipboardList className="h-5 w-5 text-emerald-100" />
              </div>

              <div>
                <p className="font-medium">
                  Packing Lists
                </p>

                <p className="text-sm text-emerald-200">
                  Manage cargo and packing information efficiently.
                </p>
              </div>

            </div>

            {/* Secure Authentication */}

            <div className="flex items-center gap-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                <ShieldCheck className="h-5 w-5 text-emerald-100" />
              </div>

              <div>
                <p className="font-medium">
                  Secure Authentication
                </p>

                <p className="text-sm text-emerald-200">
                  Protect access to your export operations.
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =========================================
          RIGHT PANEL
      ========================================= */}

      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 sm:p-8">

        <Card className="w-full max-w-md rounded-3xl border-0 bg-white shadow-xl">

          <CardContent className="p-8 sm:p-10">

            {/* Header */}

            <div className="mb-10 text-center">

              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">

                <Ship className="h-9 w-9 text-emerald-700" />

              </div>

              <h2 className="text-3xl font-bold text-slate-900">
                Welcome Back
              </h2>

              <p className="mt-2 text-slate-500">
                Sign in to continue to your dashboard
              </p>

            </div>

            {/* Login Form */}

            <LoginForm />

            {/* Register */}

            <div className="mt-8 text-center text-sm text-slate-500">

              Don't have an account?

              <Link
                to="/register"
                className="ml-2 font-semibold text-emerald-700 transition-colors hover:text-emerald-800"
              >
                Create Account
              </Link>

            </div>

          </CardContent>

        </Card>

      </div>

    </div>
  );
}