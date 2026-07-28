import RegisterForm from "../../components/form/RegisterForm";


export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-6">
      <div className="grid lg:grid-cols-2 w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden">

        <div className="hidden lg:flex flex-col justify-center bg-emerald-800  text-white p-14">

          <h1 className="text-5xl font-bold">
            Export Management System
          </h1>

          <p className="mt-6 text-blue-100 leading-8">
            Securely manage exporters,
            shipments, invoices,
            packing lists and documentation
            from one centralized platform.
          </p>

        </div>

        <div className="flex items-center justify-center p-10">

          <div className="w-full max-w-md">

            <h2 className="text-3xl font-bold">
              Create Account
            </h2>

            <p className="text-slate-500 mt-2 mb-8">
              Start managing your export
              operations today.
            </p>

            <RegisterForm />

          </div>

        </div>

      </div>
    </div>
  );
}