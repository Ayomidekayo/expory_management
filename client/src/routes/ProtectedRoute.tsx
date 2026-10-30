// import { useEffect } from "react";
// import { Navigate, Outlet } from "react-router-dom";

// import { useCurrentUser } from "../hooks/useCurrentUser";
// import { useAuthStore } from "../store/auth.store";

// const ProtectedRoute = () => {
//   const token = useAuthStore((state) => state.token);
//   const setUser = useAuthStore((state) => state.setUser);
//   const logout = useAuthStore((state) => state.logout);

//   const {
//     data,
//     isLoading,
//     isError,
//     error,
//   } = useCurrentUser();

//   useEffect(() => {
//     if (data?.data) {
//       setUser(data.data);
//     }
//   }, [data, setUser]);



  

//   // No token means the user is not authenticated.
//   if (!token) {
//     return <Navigate to="/login" replace />;
//   }

//   // Wait for the current-user request to finish.
//   if (isLoading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-slate-50">
//         <div className="text-center">
//           <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />

//           <p className="text-sm text-slate-500">
//             Loading your account...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // Only clear the session when the server explicitly
//   // rejects the authentication credentials.
//   if (isError) {
//     const status = (
//       error as {
//         response?: {
//           status?: number;
//         };
//       }
//     )?.response?.status;

//     if (status === 401) {
//       logout();
//       return <Navigate to="/login" replace />;
//     }

//     // Do not automatically log out the user for a network
//     // error, 403, or server error. Show a diagnostic message.
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
//         <div className="max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
//           <h1 className="text-lg font-semibold text-slate-900">
//             Unable to verify your session
//           </h1>

//           <p className="mt-2 text-sm text-slate-600">
//             We could not verify your account. Please check your
//             connection and try again.
//           </p>

//           <button
//             type="button"
//             onClick={() => window.location.reload()}
//             className="mt-5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
//           >
//             Try again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // A successful response must contain a user.
//   if (!data?.data) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <p className="text-sm text-slate-600">
//           The server did not return your account information.
//           Please refresh the page.
//         </p>
//       </div>
//     );
//   }

//   return <Outlet />;
// };

// export default ProtectedRoute;


import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useCurrentUser } from "../hooks/useCurrentUser";
import { useAuthStore } from "../store/auth.store";

const ProtectedRoute = () => {
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const location = useLocation();

  const exporterRoute = location.pathname.startsWith("/exporter/");
  const fallbackLoginPath = exporterRoute ? "/exporter/login" : "/login";

  const { data, isLoading, isError, error } = useCurrentUser();

  useEffect(() => {
    if (data?.data) setUser(data.data);
  }, [data, setUser]);

  if (!token) {
    return <Navigate to={fallbackLoginPath} replace state={{ from: location }} />;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
          <p className="text-sm text-slate-500">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    const status = (error as { response?: { status?: number } })?.response?.status;

    if (status === 401) {
      // The route provides a safe fallback if the saved role is unavailable.
      const loginPath = logout(fallbackLoginPath);
      return <Navigate to={loginPath} replace state={{ from: location }} />;
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-slate-900">
            Unable to verify your session
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            We could not verify your account. Please check your connection and try again.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-slate-600">
          The server did not return your account information. Please refresh the page.
        </p>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
