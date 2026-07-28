import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
} from "../../components/ui/card";

import LoginForm from "../../components/form/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">

      {/* LEFT PANEL */}

      <div className="hidden lg:flex flex-col justify-center bg-emerald-800 text-white p-16">

        <div className="max-w-lg">

          <h1 className="text-5xl font-bold leading-tight">
            Export Management
            <br />
            System
          </h1>

          <p className="mt-6 text-lg text-emerald-100 leading-8">
            Manage exporters, shipments,
            invoices, packing lists and export
            documentation from one centralized
            platform.
          </p>

          <div className="mt-14 space-y-6">

            <div className="flex items-center gap-3">
              ✅ Shipment Tracking
            </div>

            <div className="flex items-center gap-3">
              ✅ Invoice Management
            </div>

            <div className="flex items-center gap-3">
              ✅ Packing Lists
            </div>

            <div className="flex items-center gap-3">
              ✅ Secure Authentication
            </div>

          </div>

        </div>

      </div>

      {/* RIGHT PANEL */}

      <div className="flex items-center justify-center p-8">

        <Card className="w-full max-w-md rounded-3xl shadow-2xl border-0">

          <CardContent className="p-10">

            <div className="text-center mb-10">

              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">

                <span className="text-3xl">
                  🚢
                </span>

              </div>

              <h2 className="text-3xl font-bold text-slate-900">
                Welcome Back
              </h2>

              <p className="mt-2 text-slate-500">
                Sign in to continue to your dashboard
              </p>

            </div>

            <LoginForm />

            <div className="mt-8 text-center text-sm text-slate-500">

              Don't have an account?

              <Link
                to="/register"
                className="ml-2 font-semibold text-emerald-700 hover:text-emerald-800"
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