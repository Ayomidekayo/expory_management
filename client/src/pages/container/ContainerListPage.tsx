// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { Loader2, Plus } from "lucide-react";

// import { Button } from "../../components/ui/button";

// import { useContainers } from "../../hooks/container/useContainers";

// import ContainerTable from "../../components/container/ContainerTable";

// import type { ContainerQuery } from "../../types/container.type";

// export default function ContainerListPage() {
//   /* =========================================
//      FILTERS / PAGINATION
//   ========================================= */

//   const [filters, setFilters] = useState<ContainerQuery>({
//     page: 1,
//     limit: 10,
//     sortBy: "createdAt",
//     sortOrder: "asc",
//   });

//   /* =========================================
//      GET CONTAINERS
//   ========================================= */

//   const {
//     data,
//     isLoading,
//     isFetching,
//     isError,
//   } = useContainers(filters);

//   const containers = Array.isArray(data)
//     ? data
//     : data?.data ?? [];

//   const pagination = Array.isArray(data)
//     ? undefined
//     : data?.pagination;

//   /* =========================================
//      PAGINATION DATA
//   ========================================= */

//   const currentPage =
//     pagination?.page ??
//     filters.page ??
//     1;

//   const pageLimit =
//     pagination?.limit ??
//     filters.limit ??
//     10;

//   const totalPages =
//     pagination?.totalPages ??
//     1;

//   const total =
//     pagination?.total ??
//     containers.length;

//   const hasPreviousPage =
//     currentPage > 1;

//   const hasNextPage =
//     currentPage < totalPages;

//   /* =========================================
//      PAGINATION HANDLERS
//   ========================================= */

//   function handlePrevious() {
//     if (!hasPreviousPage || isFetching) {
//       return;
//     }

//     setFilters((prev) => ({
//       ...prev,
//       page: Math.max(
//         (prev.page ?? 1) - 1,
//         1
//       ),
//     }));
//   }

//   function handleNext() {
//     if (!hasNextPage || isFetching) {
//       return;
//     }

//     setFilters((prev) => ({
//       ...prev,
//       page: (prev.page ?? 1) + 1,
//     }));
//   }

//   return (
//     <div className="space-y-6">

//       {/* =========================================
//           HEADER
//       ========================================= */}

//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-3xl font-bold">
//             Containers
//           </h1>

//           <p className="text-muted-foreground">
//             Manage shipment containers.
//           </p>
//         </div>

//         <Button asChild>
//           <Link to="/containers/create">
//             <Plus className="mr-2 h-4 w-4" />
//             Add Container
//           </Link>
//         </Button>
//       </div>

//       {/* =========================================
//           FETCHING
//       ========================================= */}

//       {isFetching && !isLoading && (
//         <div className="flex items-center gap-2 text-sm text-muted-foreground">
//           <Loader2 className="h-4 w-4 animate-spin" />
//           Refreshing containers...
//         </div>
//       )}

//       {/* =========================================
//           ERROR
//       ========================================= */}

//       {isError && (
//         <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
//           <h3 className="font-semibold text-red-800">
//             Unable to load containers
//           </h3>

//           <p className="mt-1 text-sm text-red-600">
//             Please try again.
//           </p>
//         </div>
//       )}

//       {/* =========================================
//           TABLE
//       ========================================= */}

//       {!isError && (
//         <ContainerTable
//           data={containers}
//           loading={isLoading}
//           currentPage={currentPage}
//           pageLimit={pageLimit}
//         />
//       )}

//       {/* =========================================
//           PAGINATION
//       ========================================= */}

//       {!isLoading &&
//         !isError &&
//         containers.length > 0 && (
//           <div className="flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">

//             <div className="flex items-center gap-2 text-sm text-muted-foreground">
//               <span>
//                 Page{" "}
//                 <strong className="text-foreground">
//                   {currentPage}
//                 </strong>{" "}
//                 of{" "}
//                 <strong className="text-foreground">
//                   {totalPages}
//                 </strong>
//               </span>

//               <span className="text-slate-300">
//                 •
//               </span>

//               <span>
//                 {total} total
//               </span>
//             </div>

//             <div className="flex gap-2">
//               <Button
//                 type="button"
//                 variant="outline"
//                 disabled={
//                   !hasPreviousPage ||
//                   isFetching
//                 }
//                 onClick={handlePrevious}
//               >
//                 Previous
//               </Button>

//               <Button
//                 type="button"
//                 variant="outline"
//                 disabled={
//                   !hasNextPage ||
//                   isFetching
//                 }
//                 onClick={handleNext}
//               >
//                 Next
//               </Button>
//             </div>

//           </div>
//         )}
//     </div>
//   );
// }

import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Plus } from "lucide-react";

import { Button } from "../../components/ui/button";
import { useContainers } from "../../hooks/container/useContainers";
import ContainerTable from "../../components/container/ContainerTable";

import type { ContainerQuery } from "../../types/container.type";

export default function ContainerListPage() {
  /* =========================================
     FILTERS / PAGINATION
  ========================================= */

  const [filters, setFilters] = useState<ContainerQuery>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "asc",
  });

  /* =========================================
     GET CONTAINERS
  ========================================= */

  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useContainers(filters);

  const containers = Array.isArray(data)
    ? data
    : data?.data ?? [];

  const pagination = Array.isArray(data)
    ? undefined
    : data?.pagination;

  /* =========================================
     PAGINATION DATA
  ========================================= */

  const currentPage = pagination?.page ?? filters.page ?? 1;
  const pageLimit = pagination?.limit ?? filters.limit ?? 10;
  const totalPages = pagination?.totalPages ?? 1;
  const total = pagination?.total ?? containers.length;

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  /* =========================================
     PAGINATION HANDLERS
  ========================================= */

  function handlePrevious() {
    if (!hasPreviousPage || isFetching) {
      return;
    }

    setFilters((prev) => ({
      ...prev,
      page: Math.max((prev.page ?? 1) - 1, 1),
    }));
  }

  function handleNext() {
    if (!hasNextPage || isFetching) {
      return;
    }

    setFilters((prev) => ({
      ...prev,
      page: (prev.page ?? 1) + 1,
    }));
  }

  return (
    <main className="mx-auto w-full min-w-0 max-w-screen-2xl space-y-5 px-3 py-4 sm:space-y-6 sm:px-5 sm:py-6 lg:px-6">
      {/* =========================================
          HEADER
      ========================================= */}

      <header className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Containers
          </h1>

          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Manage shipment containers.
          </p>
        </div>

        <Button asChild className="w-full shrink-0 sm:w-auto">
          <Link to="/containers/create" className="inline-flex items-center justify-center">
            <Plus className="mr-2 h-4 w-4" />
            Add Container
          </Link>
        </Button>
      </header>

      {/* =========================================
          FETCHING
      ========================================= */}

      {isFetching && !isLoading && (
        <div
          className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground"
          role="status"
          aria-live="polite"
        >
          <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
          <span>Refreshing containers...</span>
        </div>
      )}

      {/* =========================================
          ERROR
      ========================================= */}

      {isError && (
        <div className="w-full min-w-0 rounded-xl border border-red-200 bg-red-50 p-4 text-center sm:p-6">
          <h3 className="font-semibold text-red-800">
            Unable to load containers
          </h3>

          <p className="mt-1 text-sm text-red-600">
            Please try again.
          </p>
        </div>
      )}

      {/* =========================================
          TABLE
      ========================================= */}

      {!isError && (
        <section className="w-full min-w-0" aria-label="Container records">
          <div className="w-full min-w-0 overflow-x-auto overscroll-x-contain rounded-xl">
            <ContainerTable
              data={containers}
              loading={isLoading}
              currentPage={currentPage}
              pageLimit={pageLimit}
            />
          </div>
        </section>
      )}

      {/* =========================================
          PAGINATION
      ========================================= */}

      {!isLoading && !isError && containers.length > 0 && (
        <nav
          className="flex min-w-0 flex-col gap-4 rounded-xl border bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-4"
          aria-label="Container list pagination"
        >
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            <span>
              Page{" "}
              <strong className="text-foreground">{currentPage}</strong>{" "}
              of{" "}
              <strong className="text-foreground">{totalPages}</strong>
            </span>

            <span className="text-slate-300" aria-hidden="true">
              •
            </span>

            <span>{total} total</span>
          </div>

          <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:shrink-0">
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
