import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  FileCheck2,
  ShieldCheck,
  Truck,
} from "lucide-react";

import RegisterForm from "../../components/auth/RegisterForm";

const features = [
  {
    icon: Boxes,
    title: "Exporter Management",
    description: "Keep your export operations organized.",
  },
  {
    icon: FileCheck2,
    title: "Document Management",
    description: "Manage export documents in one place.",
  },
  {
    icon: Truck,
    title: "Shipment Tracking",
    description: "Stay informed about shipment progress.",
  },
];

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-10">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-7xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 sm:min-h-[calc(100vh-3rem)] lg:grid-cols-2 lg:rounded-[2rem]">
        {/* Branding panel */}
        <section className="relative hidden overflow-hidden bg-emerald-950 p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
          {/* Decorative elements */}
          <div
            aria-hidden="true"
            className="absolute -right-28 -top-28 h-96 w-96 rounded-full border border-emerald-700/40"
          />
          <div
            aria-hidden="true"
            className="absolute -right-12 -top-12 h-64 w-64 rounded-full border border-emerald-700/40"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-emerald-800/40 blur-3xl"
          />

          <div className="relative z-10">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400 text-emerald-950 shadow-lg shadow-emerald-950/20">
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
            </div>

            {/* Main heading */}
            <div className="mt-20 max-w-lg xl:mt-24">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-700/70 bg-emerald-900/70 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                YOUR EXPORT OPERATIONS, SIMPLIFIED
              </span>

              <h1 className="mt-7 text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
                Your business deserves a{" "}
                <span className="text-emerald-400">
                  smarter way
                </span>{" "}
                to move goods.
              </h1>

              <p className="mt-6 max-w-md text-base leading-8 text-emerald-100/80">
                Manage quotations, shipments, invoices, and export
                documentation through one organized platform.
              </p>
            </div>

            {/* Features */}
            <div className="mt-12 space-y-5">
              {features.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-700/60 bg-emerald-900/70 text-emerald-300">
                    <Icon size={21} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-emerald-100/65">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10 mt-12 flex items-center gap-2 border-t border-emerald-800 pt-6 text-sm text-emerald-100/60">
            <ShieldCheck size={17} className="text-emerald-400" />
            A centralized workspace for your trade operations.
          </div>
        </section>

        {/* Registration panel */}
        <section className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-12 xl:px-16">
          <div className="w-full max-w-md">
            {/* Mobile brand */}
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-700 text-white">
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
            </div>

            {/* Heading */}
            <div className="mb-8">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                <CheckCircle2 size={25} />
              </div>

              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
                Get started today
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Create your account
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
                Join OGW KAY IMPEX and manage your trade operations
                from one convenient place.
              </p>
            </div>

            {/* Existing registration form */}
            <RegisterForm />

            {/* Footer note */}
            <div className="mt-8 flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/70 p-4">
              <ShieldCheck
                size={20}
                className="mt-0.5 shrink-0 text-emerald-700"
              />

              <p className="text-xs leading-6 text-slate-600">
                Your account information should be handled securely.
                Never share your password with anyone.
              </p>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-slate-400">
              <span>OGW KAY IMPEX Management System</span>
              <ArrowRight size={13} />
              <span>Account Registration</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}