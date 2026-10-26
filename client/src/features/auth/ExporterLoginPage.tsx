import { Link } from "react-router-dom";

import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  FileCheck2,
  Globe2,
  ShieldCheck,
  Truck,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "../../components/ui/card";
import ExporterLoginForm from "./components/ExporterLoginForm";

const features = [
  {
    icon: FileCheck2,
    title: "Quotation Management",
    description:
      "Access your quotation requests and review their status.",
  },
  {
    icon: Truck,
    title: "Shipment Updates",
    description:
      "Stay informed about your export operations.",
  },
  {
    icon: Globe2,
    title: "Trade Documentation",
    description:
      "Keep your export information organized in one place.",
  },
];

export default function ExporterLoginPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-3 sm:p-5 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] w-full max-w-7xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 sm:min-h-[calc(100vh-2.5rem)] lg:grid-cols-2 lg:rounded-[2rem]">

        {/* =========================================
            LEFT: BRANDING PANEL
        ========================================== */}

        <section className="relative hidden overflow-hidden bg-emerald-950 p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">

          {/* Decorative background */}
          <div
            aria-hidden="true"
            className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-emerald-700/40"
          />

          <div
            aria-hidden="true"
            className="absolute -right-12 -top-12 h-64 w-64 rounded-full border border-emerald-700/40"
          />

          <div
            aria-hidden="true"
            className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-emerald-800/40 blur-3xl"
          />

          <div className="relative z-10">

            {/* Brand */}
            <Link
              to="/"
              className="inline-flex items-center gap-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400 text-emerald-950 shadow-lg">
                <Boxes size={27} strokeWidth={2.2} />
              </div>

              <div>
                <p className="text-lg font-extrabold tracking-wide">
                  OGW KAY IMPEX
                </p>

                <p className="mt-0.5 text-xs font-medium tracking-[0.2em] text-emerald-300">
                  MANAGEMENT SYSTEM
                </p>
              </div>
            </Link>

            {/* Introduction */}
            <div className="mt-20 xl:mt-24">

              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-700/70 bg-emerald-900/70 px-3 py-1.5 text-xs font-semibold tracking-wide text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                EXPORTER PORTAL
              </span>

              <h1 className="mt-7 max-w-lg text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
                Welcome back to your{" "}
                <span className="text-emerald-400">
                  trade workspace.
                </span>
              </h1>

              <p className="mt-6 max-w-md text-base leading-8 text-emerald-100/80">
                Sign in to manage your quotations, follow shipment
                progress, and access your export information.
              </p>

            </div>

            {/* Features */}
            <div className="mt-12 space-y-6">

              {features.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="flex items-start gap-4"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-700/60 bg-emerald-900/70 text-emerald-300">
                    <Icon size={21} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">
                      {title}
                    </h3>

                    <p className="mt-1 max-w-sm text-sm leading-6 text-emerald-100/65">
                      {description}
                    </p>
                  </div>
                </div>
              ))}

            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10 mt-12 flex items-center gap-3 border-t border-emerald-800 pt-6">
            <ShieldCheck
              size={20}
              className="shrink-0 text-emerald-400"
            />

            <p className="text-sm leading-6 text-emerald-100/70">
              Your trade operations, organized in one place.
            </p>
          </div>
        </section>

        {/* =========================================
            RIGHT: LOGIN PANEL
        ========================================== */}

        <section className="flex items-center justify-center px-5 py-8 sm:px-10 sm:py-12 lg:px-12 xl:px-16">

          <Card className="w-full max-w-md rounded-3xl border-0 bg-white shadow-none">

            <CardContent className="p-0">

              {/* Mobile branding */}
              <Link
                to="/"
                className="mb-10 inline-flex items-center gap-3 lg:hidden"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-800 text-white">
                  <Boxes size={24} />
                </div>

                <div>
                  <p className="font-extrabold tracking-wide text-slate-900">
                    OGW KAY IMPEX
                  </p>

                  <p className="text-xs font-medium tracking-wider text-emerald-700">
                    MANAGEMENT SYSTEM
                  </p>
                </div>
              </Link>

              {/* Heading */}
              <div className="mb-8">

                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                  <CheckCircle2 size={25} />
                </div>

                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
                  Exporter account
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Welcome back
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
                  Sign in to continue to your exporter dashboard.
                </p>

              </div>

              {/* Existing login form */}
              <ExporterLoginForm />

              {/* Registration link */}
              <div className="mt-8 border-t border-slate-100 pt-6 text-center">

                <p className="text-sm text-slate-500">
                  Don't have an exporter account?
                </p>

                <Link
                  to="/get-a-quote/register"
                  className="mt-3 inline-flex items-center gap-2 font-semibold text-emerald-700 transition hover:text-emerald-900"
                >
                  Create exporter account
                  <ArrowRight size={17} />
                </Link>

              </div>

              {/* Security note */}
              <div className="mt-7 flex items-center justify-center gap-2 text-xs text-slate-400">
                <ShieldCheck
                  size={15}
                  className="text-emerald-600"
                />

                <span>Secure exporter access</span>
              </div>

            </CardContent>
          </Card>

        </section>
      </div>
    </main>
  );
}