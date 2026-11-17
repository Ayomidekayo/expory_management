// // import { Link } from "react-router-dom";
// // import { Loader2, Plus } from "lucide-react";
// // import {
// //   useEffect,
// //   useMemo,
// //   useState,
// // } from "react";

// // import { Button } from "../../components/ui/button";

// // import { useClients } from "../../hooks/client/useClients";

// // import ClientFilters from "../../components/client/ClientFilters";
// // import ClientTable from "../../components/client/ClientTable";
// // import ClientSummaryCards from "../../components/client/ClientSummaryCards";

// // export default function ClientListPage() {
// //   const [currentPage, setCurrentPage] =
// //     useState(1);

// //   const pageLimit = 10;

// //   const [search, setSearch] =
// //     useState("");

// //   const [clientType, setClientType] =
// //     useState("all");

// //   const [status, setStatus] =
// //     useState("all");

// //   const [country, setCountry] =
// //     useState("all");

// //   const {
// //     data,
// //     isLoading,
// //     isFetching,
// //     isError,
// //   } = useClients();

// //   const allClients = data?.data ?? [];

// //   /*
// //    * Dynamic country options
// //    */
// //   const countries = useMemo(() => {
// //     return Array.from(
// //       new Set(
// //         allClients
// //           .map((client) => client.country)
// //           .filter(
// //             (country): country is string =>
// //               Boolean(country)
// //           )
// //       )
// //     ).sort();
// //   }, [allClients]);

// //   /*
// //    * Filtering
// //    */
// //   const filteredClients = useMemo(() => {
// //     const searchValue =
// //       search.trim().toLowerCase();

// //     return allClients.filter((client) => {
// //       const matchesSearch =
// //         !searchValue ||
// //         client.clientCode
// //           ?.toLowerCase()
// //           .includes(searchValue) ||
// //         client.companyName
// //           ?.toLowerCase()
// //           .includes(searchValue) ||
// //         client.contactPerson
// //           ?.toLowerCase()
// //           .includes(searchValue) ||
// //         client.email
// //           ?.toLowerCase()
// //           .includes(searchValue);

// //       const matchesType =
// //         clientType === "all" ||
// //         client.clientType === clientType;

// //       const matchesStatus =
// //         status === "all" ||
// //         (status === "active" &&
// //           client.isActive === true) ||
// //         (status === "inactive" &&
// //           client.isActive === false);

// //       const matchesCountry =
// //         country === "all" ||
// //         client.country === country;

// //       return (
// //         matchesSearch &&
// //         matchesType &&
// //         matchesStatus &&
// //         matchesCountry
// //       );
// //     });
// //   }, [
// //     allClients,
// //     search,
// //     clientType,
// //     status,
// //     country,
// //   ]);

// //   /*
// //    * Earliest -> latest
// //    */
// //   const sortedClients = useMemo(() => {
// //     return [...filteredClients].sort(
// //       (a, b) =>
// //         new Date(a.createdAt).getTime() -
// //         new Date(b.createdAt).getTime()
// //     );
// //   }, [filteredClients]);

// //   /*
// //    * Pagination
// //    */
// //   const total = sortedClients.length;

// //   const totalPages = Math.max(
// //     Math.ceil(total / pageLimit),
// //     1
// //   );

// //   const safeCurrentPage = Math.min(
// //     currentPage,
// //     totalPages
// //   );

// //   const startIndex =
// //     (safeCurrentPage - 1) * pageLimit;

// //   const paginatedClients =
// //     sortedClients.slice(
// //       startIndex,
// //       startIndex + pageLimit
// //     );

// //   const hasPreviousPage =
// //     safeCurrentPage > 1;

// //   const hasNextPage =
// //     safeCurrentPage < totalPages;

// //   /*
// //    * Reset page whenever filters change.
// //    */
// //   useEffect(() => {
// //     setCurrentPage(1);
// //   }, [
// //     search,
// //     clientType,
// //     status,
// //     country,
// //   ]);

// //   function handlePrevious() {
// //     if (
// //       !hasPreviousPage ||
// //       isFetching
// //     ) {
// //       return;
// //     }

// //     setCurrentPage((prev) =>
// //       Math.max(prev - 1, 1)
// //     );
// //   }

// //   function handleNext() {
// //     if (
// //       !hasNextPage ||
// //       isFetching
// //     ) {
// //       return;
// //     }

// //     setCurrentPage((prev) =>
// //       Math.min(
// //         prev + 1,
// //         totalPages
// //       )
// //     );
// //   }

// //   return (
// //     <div className="space-y-6">

// //       {/* Header */}

// //       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
// //         <div>
// //           <h1 className="text-3xl font-bold">
// //             Clients
// //           </h1>

// //           <p className="text-muted-foreground">
// //             Manage registered clients.
// //           </p>
// //         </div>

// //         <Button asChild>
// //           <Link to="/clients/new">
// //             <Plus className="mr-2 h-4 w-4" />
// //             New Client
// //           </Link>
// //         </Button>
// //       </div>

// //       {/* Filters */}

// //       <ClientFilters
// //         search={search}
// //         clientType={clientType}
// //         status={status}
// //         country={country}
// //         countries={countries}
// //         onSearchChange={setSearch}
// //         onClientTypeChange={setClientType}
// //         onStatusChange={setStatus}
// //         onCountryChange={setCountry}
// //       />

// //       {/* Summary */}

// //       {!isLoading && !isError && (
// //         <ClientSummaryCards
// //           clients={filteredClients}
// //         />
// //       )}

// //       {/* Refreshing */}

// //       {isFetching && !isLoading && (
// //         <div className="flex items-center gap-2 text-sm text-muted-foreground">
// //           <Loader2 className="h-4 w-4 animate-spin" />
// //           Refreshing clients...
// //         </div>
// //       )}

// //       {/* Error */}

// //       {isError ? (
// //         <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
// //           <h3 className="font-semibold text-red-800">
// //             Unable to load clients
// //           </h3>

// //           <p className="mt-1 text-sm text-red-600">
// //             Please try again.
// //           </p>
// //         </div>
// //       ) : (
// //         <ClientTable
// //           clients={paginatedClients}
// //           isLoading={isLoading}
// //           currentPage={safeCurrentPage}
// //           pageLimit={pageLimit}
// //         />
// //       )}

// //       {/* Pagination */}

// //       {!isLoading &&
// //         !isError &&
// //         total > 0 && (
// //           <div className="flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">

// //             <div className="flex items-center gap-2 text-sm text-muted-foreground">
// //               <span>
// //                 Page{" "}
// //                 <strong className="text-foreground">
// //                   {safeCurrentPage}
// //                 </strong>{" "}
// //                 of{" "}
// //                 <strong className="text-foreground">
// //                   {totalPages}
// //                 </strong>
// //               </span>

// //               <span className="text-slate-300">
// //                 •
// //               </span>

// //               <span>
// //                 {total} total
// //               </span>
// //             </div>

// //             <div className="flex gap-2">
// //               <Button
// //                 type="button"
// //                 variant="outline"
// //                 disabled={
// //                   !hasPreviousPage ||
// //                   isFetching
// //                 }
// //                 onClick={handlePrevious}
// //               >
// //                 Previous
// //               </Button>

// //               <Button
// //                 type="button"
// //                 variant="outline"
// //                 disabled={
// //                   !hasNextPage ||
// //                   isFetching
// //                 }
// //                 onClick={handleNext}
// //               >
// //                 Next
// //               </Button>
// //             </div>

// //           </div>
// //         )}

// //     </div>
// //   );
// // }


// import { Link } from "react-router-dom";
// import { Loader2, Plus } from "lucide-react";
// import { useEffect, useMemo, useState } from "react";

// import { Button } from "../../components/ui/button";
// import { useClients } from "../../hooks/client/useClients";

// import ClientFilters from "../../components/client/ClientFilters";
// import ClientTable from "../../components/client/ClientTable";
// import ClientSummaryCards from "../../components/client/ClientSummaryCards";

// export default function ClientListPage() {
//   const [currentPage, setCurrentPage] = useState(1);
//   const pageLimit = 10;

//   const [search, setSearch] = useState("");
//   const [clientType, setClientType] = useState("all");
//   const [status, setStatus] = useState("all");
//   const [country, setCountry] = useState("all");

//   const { data, isLoading, isFetching, isError } = useClients();
//   const allClients = data?.data ?? [];

//   /* Dynamic country options */
//   const countries = useMemo(() => {
//     return Array.from(
//       new Set(
//         allClients
//           .map((client) => client.country)
//           .filter((country): country is string => Boolean(country)),
//       ),
//     ).sort();
//   }, [allClients]);

//   /* Filtering */
//   const filteredClients = useMemo(() => {
//     const searchValue = search.trim().toLowerCase();

//     return allClients.filter((client) => {
//       const matchesSearch =
//         !searchValue ||
//         client.clientCode?.toLowerCase().includes(searchValue) ||
//         client.companyName?.toLowerCase().includes(searchValue) ||
//         client.contactPerson?.toLowerCase().includes(searchValue) ||
//         client.email?.toLowerCase().includes(searchValue);

//       const matchesType =
//         clientType === "all" || client.clientType === clientType;

//       const matchesStatus =
//         status === "all" ||
//         (status === "active" && client.isActive === true) ||
//         (status === "inactive" && client.isActive === false);

//       const matchesCountry = country === "all" || client.country === country;

//       return matchesSearch && matchesType && matchesStatus && matchesCountry;
//     });
//   }, [allClients, search, clientType, status, country]);

//   /* Earliest -> latest */
//   const sortedClients = useMemo(() => {
//     return [...filteredClients].sort(
//       (a, b) =>
//         new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
//     );
//   }, [filteredClients]);

//   /* Pagination */
//   const total = sortedClients.length;
//   const totalPages = Math.max(Math.ceil(total / pageLimit), 1);
//   const safeCurrentPage = Math.min(currentPage, totalPages);
//   const startIndex = (safeCurrentPage - 1) * pageLimit;
//   const paginatedClients = sortedClients.slice(
//     startIndex,
//     startIndex + pageLimit,
//   );

//   const hasPreviousPage = safeCurrentPage > 1;
//   const hasNextPage = safeCurrentPage < totalPages;

//   /* Reset page whenever filters change. */
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [search, clientType, status, country]);

//   function handlePrevious() {
//     if (!hasPreviousPage || isFetching) return;
//     setCurrentPage((prev) => Math.max(prev - 1, 1));
//   }

//   function handleNext() {
//     if (!hasNextPage || isFetching) return;
//     setCurrentPage((prev) => Math.min(prev + 1, totalPages));
//   }

//   return (
//     <main className="mx-auto w-full min-w-0 max-w-full space-y-4 overflow-x-hidden px-3 py-4 sm:space-y-6 sm:px-5 sm:py-6 lg:px-6">
//       {/* Header */}
//       <header className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
//         <div className="min-w-0">
//           <h1 className="break-words text-2xl font-bold leading-tight sm:text-3xl">
//             Clients
//           </h1>
//           <p className="mt-1 text-sm text-muted-foreground">
//             Manage registered clients.
//           </p>
//         </div>

//         <Button asChild className="w-full shrink-0 sm:w-auto">
//           <Link to="/clients/new" className="inline-flex items-center justify-center">
//             <Plus className="mr-2 h-4 w-4" />
//             New Client
//           </Link>
//         </Button>
//       </header>

//       {/* Filters: constrain child controls to the viewport width. */}
//       <section className="w-full min-w-0 max-w-full">
//         <ClientFilters
//           search={search}
//           clientType={clientType}
//           status={status}
//           country={country}
//           countries={countries}
//           onSearchChange={setSearch}
//           onClientTypeChange={setClientType}
//           onStatusChange={setStatus}
//           onCountryChange={setCountry}
//         />
//       </section>

//       {/* Summary */}
//       {!isLoading && !isError && (
//         <section className="w-full min-w-0 max-w-full">
//           <ClientSummaryCards clients={filteredClients} />
//         </section>
//       )}

//       {/* Refreshing */}
//       {isFetching && !isLoading && (
//         <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
//           <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
//           <span>Refreshing clients...</span>
//         </div>
//       )}

//       {/* Error */}
//       {isError ? (
//         <div className="w-full min-w-0 rounded-xl border border-red-200 bg-red-50 p-4 text-center sm:p-6">
//           <h3 className="font-semibold text-red-800">Unable to load clients</h3>
//           <p className="mt-1 text-sm text-red-600">Please try again.</p>
//         </div>
//       ) : (
//         /* Keep the table's own content contained on narrow screens. */
//         <section className="w-full min-w-0 max-w-full overflow-hidden rounded-xl">
//           <div className="w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain [touch-action:pan-x_pan-y]">
//             <ClientTable
//               clients={paginatedClients}
//               isLoading={isLoading}
//               currentPage={safeCurrentPage}
//               pageLimit={pageLimit}
//             />
//           </div>
//         </section>
//       )}

//       {/* Pagination */}
//       {!isLoading && !isError && total > 0 && (
//         <nav
//           aria-label="Client pagination"
//           className="flex w-full min-w-0 flex-col gap-3 rounded-xl border bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4"
//         >
//           <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
//             <span>
//               Page <strong className="text-foreground">{safeCurrentPage}</strong> of{" "}
//               <strong className="text-foreground">{totalPages}</strong>
//             </span>
//             <span aria-hidden="true" className="text-slate-300">•</span>
//             <span>{total.toLocaleString()} total</span>
//           </div>

//           <div className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:flex sm:shrink-0">
//             <Button
//               type="button"
//               variant="outline"
//               className="w-full sm:w-auto"
//               disabled={!hasPreviousPage || isFetching}
//               onClick={handlePrevious}
//             >
//               Previous
//             </Button>
//             <Button
//               type="button"
//               variant="outline"
//               className="w-full sm:w-auto"
//               disabled={!hasNextPage || isFetching}
//               onClick={handleNext}
//             >
//               Next
//             </Button>
//           </div>
//         </nav>
//       )}
//     </main>
//   );
// }
import { Link } from "react-router-dom";
import {
  Building2,
  CalendarDays,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Plus,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "../../components/ui/button";
import { useClients } from "../../hooks/client/useClients";

import ClientFilters from "../../components/client/ClientFilters";
import ClientTable from "../../components/client/ClientTable";
import ClientSummaryCards from "../../components/client/ClientSummaryCards";

function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function ClientListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageLimit = 10;

  const [search, setSearch] = useState("");
  const [clientType, setClientType] = useState("all");
  const [status, setStatus] = useState("all");
  const [country, setCountry] = useState("all");

  const { data, isLoading, isFetching, isError } = useClients();
  const allClients = data?.data ?? [];

  /* Dynamic country options */
  const countries = useMemo(() => {
    return Array.from(
      new Set(
        allClients
          .map((client) => client.country)
          .filter((country): country is string => Boolean(country)),
      ),
    ).sort();
  }, [allClients]);

  /* Filtering */
  const filteredClients = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return allClients.filter((client) => {
      const matchesSearch =
        !searchValue ||
        client.clientCode?.toLowerCase().includes(searchValue) ||
        client.companyName?.toLowerCase().includes(searchValue) ||
        client.contactPerson?.toLowerCase().includes(searchValue) ||
        client.email?.toLowerCase().includes(searchValue);

      const matchesType =
        clientType === "all" || client.clientType === clientType;

      const matchesStatus =
        status === "all" ||
        (status === "active" && client.isActive === true) ||
        (status === "inactive" && client.isActive === false);

      const matchesCountry = country === "all" || client.country === country;

      return matchesSearch && matchesType && matchesStatus && matchesCountry;
    });
  }, [allClients, search, clientType, status, country]);

  /* Earliest -> latest */
  const sortedClients = useMemo(() => {
    return [...filteredClients].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }, [filteredClients]);

  /* Pagination */
  const total = sortedClients.length;
  const totalPages = Math.max(Math.ceil(total / pageLimit), 1);
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageLimit;
  const paginatedClients = sortedClients.slice(
    startIndex,
    startIndex + pageLimit,
  );

  const hasPreviousPage = safeCurrentPage > 1;
  const hasNextPage = safeCurrentPage < totalPages;

  /* Reset page whenever filters change. */
  useEffect(() => {
    setCurrentPage(1);
  }, [search, clientType, status, country]);

  function handlePrevious() {
    if (!hasPreviousPage || isFetching) return;
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }

  function handleNext() {
    if (!hasNextPage || isFetching) return;
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }

  return (
    <main className="mx-auto w-full min-w-0 max-w-screen-2xl space-y-5 overflow-x-hidden px-3 py-4 sm:space-y-6 sm:px-5 sm:py-6 lg:px-6">
      {/* Header */}
      <header className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h1 className="break-words text-2xl font-bold leading-tight sm:text-3xl">
            Clients
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage registered clients.
          </p>
        </div>

        <Button
          asChild
          className="w-full shrink-0 bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-600 sm:w-auto"
        >
          <Link to="/clients/new" className="inline-flex items-center justify-center">
            <Plus className="mr-2 h-4 w-4" />
            New Client
          </Link>
        </Button>
      </header>

      {/* Filters */}
      <section className="w-full min-w-0 max-w-full">
        <ClientFilters
          search={search}
          clientType={clientType}
          status={status}
          country={country}
          countries={countries}
          onSearchChange={setSearch}
          onClientTypeChange={setClientType}
          onStatusChange={setStatus}
          onCountryChange={setCountry}
        />
      </section>

      {/* Summary */}
      {!isLoading && !isError && (
        <section className="w-full min-w-0 max-w-full" aria-label="Client summary">
          <ClientSummaryCards clients={filteredClients} />
        </section>
      )}

      {/* Refreshing */}
      {isFetching && !isLoading && (
        <div
          className="flex min-w-0 items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2 text-xs text-muted-foreground sm:text-sm"
          role="status"
          aria-live="polite"
        >
          <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
          <span>Refreshing clients...</span>
        </div>
      )}

      {/* Error */}
      {isError ? (
        <div
          className="w-full min-w-0 rounded-xl border border-red-200 bg-red-50 p-4 text-center sm:p-6"
          role="alert"
        >
          <h3 className="font-semibold text-red-800">Unable to load clients</h3>
          <p className="mt-1 text-sm text-red-600">Please try again.</p>
        </div>
      ) : (
        <section className="w-full min-w-0 max-w-full" aria-label="Client records">
          {/* Mobile: display each client as a responsive card. */}
          <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 md:hidden">
            {isLoading ? (
              <div className="col-span-full flex min-h-36 items-center justify-center rounded-xl border bg-white p-6 text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading clients...
              </div>
            ) : paginatedClients.length === 0 ? (
              <div className="col-span-full rounded-xl border border-dashed bg-white px-4 py-10 text-center">
                <Building2 className="mx-auto h-8 w-8 text-muted-foreground/60" />
                <h3 className="mt-3 text-sm font-semibold text-foreground">
                  No clients found
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Try adjusting your search or filters.
                </p>
              </div>
            ) : (
              paginatedClients.map((client) => {
                const location = [
                  client.address,
                  client.city,
                  client.state,
                  client.country,
                ]
                  .filter(Boolean)
                  .join(", ");

                return (
                  <article
                    key={client.id}
                    className="min-w-0 overflow-hidden rounded-xl border bg-white shadow-sm"
                  >
                    <div className="flex min-w-0 items-start gap-3 border-b bg-muted/20 p-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                        <Building2 className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 flex-wrap items-center gap-2">
                          <h2 className="min-w-0 break-words text-sm font-semibold leading-5 text-foreground">
                            {client.companyName || "Unnamed client"}
                          </h2>
                          <span
                            className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              client.isActive
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {client.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <p className="mt-1 break-all text-xs text-muted-foreground">
                          {client.clientCode || "No client code"}
                        </p>
                      </div>
                    </div>

                    <div className="grid min-w-0 gap-3 p-4">
                      <div className="flex min-w-0 items-start gap-2.5 text-sm">
                        <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        <div className="min-w-0">
                          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                            Contact person
                          </p>
                          <p className="break-words text-foreground">
                            {client.contactPerson || "Not provided"}
                          </p>
                        </div>
                      </div>

                      <div className="flex min-w-0 items-start gap-2.5 text-sm">
                        <Mail className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        <div className="min-w-0">
                          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                            Email
                          </p>
                          {client.email ? (
                            <a
                              href={`mailto:${client.email}`}
                              className="break-all text-foreground hover:text-emerald-700"
                            >
                              {client.email}
                            </a>
                          ) : (
                            <p className="text-muted-foreground">Not provided</p>
                          )}
                        </div>
                      </div>

                      <div className="flex min-w-0 items-start gap-2.5 text-sm">
                        <Phone className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        <div className="min-w-0">
                          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                            Phone
                          </p>
                          {client.phone ? (
                            <a
                              href={`tel:${client.phone}`}
                              className="break-all text-foreground hover:text-emerald-700"
                            >
                              {client.phone}
                            </a>
                          ) : (
                            <p className="text-muted-foreground">Not provided</p>
                          )}
                        </div>
                      </div>

                      <div className="flex min-w-0 items-start gap-2.5 text-sm">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        <div className="min-w-0">
                          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                            Location
                          </p>
                          <p className="break-words text-foreground">
                            {location || "No address provided"}
                          </p>
                        </div>
                      </div>

                      <div className="flex min-w-0 items-center justify-between gap-3 border-t pt-3 text-xs">
                        <span className="rounded-md bg-slate-100 px-2 py-1 font-medium text-slate-700">
                          {client.clientType === "INDIVIDUAL" ? "Individual" : "Company"}
                        </span>
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                          Added {formatDate(client.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 border-t p-3">
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link to={`/clients/${client.id}`}>View details</Link>
                      </Button>
                      <Button
                        asChild
                        size="sm"
                        className="w-full bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-600"
                      >
                        <Link to={`/clients/${client.id}/edit`}>Edit client</Link>
                      </Button>
                    </div>
                  </article>
                );
              })
            )}
          </div>

          {/* Tablet / desktop: retain the existing table and its row actions. */}
          <div className="hidden w-full min-w-0 overflow-x-auto overscroll-x-contain md:block">
            <div className="min-w-0">
              <ClientTable
                clients={paginatedClients}
                isLoading={isLoading}
                currentPage={safeCurrentPage}
                pageLimit={pageLimit}
              />
            </div>
          </div>
        </section>
      )}

      {/* Pagination */}
      {!isLoading && !isError && total > 0 && (
        <nav
          aria-label="Client pagination"
          className="flex w-full min-w-0 flex-col gap-3 rounded-xl border bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4"
        >
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground sm:text-sm">
            <span>
              Page <strong className="text-foreground">{safeCurrentPage}</strong> of{" "}
              <strong className="text-foreground">{totalPages}</strong>
            </span>
            <span aria-hidden="true" className="hidden text-slate-300 sm:inline">
              •
            </span>
            <span>{total.toLocaleString()} total</span>
          </div>

          <div className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:flex sm:shrink-0">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              disabled={!hasPreviousPage || isFetching}
              onClick={handlePrevious}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              disabled={!hasNextPage || isFetching}
              onClick={handleNext}
            >
              Next
            </Button>
          </div>
        </nav>
      )}
    </main>
  );
}
