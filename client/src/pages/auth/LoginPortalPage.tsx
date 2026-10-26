import { Link } from "react-router-dom";
import {
  ArrowRight,
  Boxes,
  Building2,
  ShieldCheck,
  Ship,
  UserRound,
} from "lucide-react";

export default function LoginPortalPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-12 sm:px-6">
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-100/70 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-green-100/70 blur-3xl"
      />

      <div className="relative w-full max-w-5xl">
        {/* Brand */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-800 text-white shadow-lg shadow-emerald-900/20">
            <Boxes size={32} />
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            OGW KAY IMPEX
          </h1>

          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
            Management System
          </p>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
            Welcome to your trade management platform. Select the
            appropriate portal to continue.
          </p>
        </div>

        {/* Portal selection */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Staff portal */}
          <Link
            to="/login"
            className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-900/5 sm:p-9"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition group-hover:bg-emerald-100 group-hover:text-emerald-800">
                <Building2 size={28} />
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                Internal Access
              </span>
            </div>

            <h2 className="mt-7 text-2xl font-bold text-slate-900">
              Staff Portal
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              Access internal operations, exporters, shipments,
              invoices, packing lists, documents, and administrative
              tools according to your permissions.
            </p>

            <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-5">
              <span className="text-sm font-semibold text-emerald-800">
                Sign in as staff
              </span>

              <ArrowRight
                size={20}
                className="text-emerald-700 transition-transform group-hover:translate-x-1"
              />
            </div>
          </Link>

          {/* Exporter portal */}
          <Link
            to="/exporter/login"
            className="group rounded-3xl border border-emerald-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-900/10 sm:p-9"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 transition group-hover:bg-emerald-200">
                <Ship size={28} />
              </div>

              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                Exporter Access
              </span>
            </div>

            <h2 className="mt-7 text-2xl font-bold text-slate-900">
              Exporter Portal
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              Access your exporter account, submit quotation requests,
              follow their status, and manage your trade documentation.
            </p>

            <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-5">
              <span className="text-sm font-semibold text-emerald-800">
                Sign in as exporter
              </span>

              <ArrowRight
                size={20}
                className="text-emerald-700 transition-transform group-hover:translate-x-1"
              />
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs text-slate-400">
              <UserRound size={15} />
              <span>New exporter?</span>

              <span
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  window.location.href = "/get-a-quote/register";
                }}
                className="font-semibold text-emerald-700 hover:underline"
              >
                Create an account
              </span>
            </div>
          </Link>
        </div>

        {/* Security note */}
        <div className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-slate-400">
          <ShieldCheck size={16} className="text-emerald-700" />

          <span>
            Secure access for authorized staff and registered exporters.
          </span>
        </div>

        <p className="mt-5 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} OGW KAY IMPEX Management
          System
        </p>
      </div>
    </main>
  );
}