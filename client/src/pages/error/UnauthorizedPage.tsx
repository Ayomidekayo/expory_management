import { Link } from "react-router-dom";
import { ShieldX } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
          <ShieldX size={30} />
        </div>

        <h1 className="mt-6 text-2xl font-bold">
          Access denied
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Your account does not have the required access
          to view this page. Contact your school
          administrator if you believe this is a mistake.
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950"
        >
          Return to home
        </Link>
      </div>
    </div>
  );
}