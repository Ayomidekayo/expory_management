import { Link } from "react-router-dom";
import { Loader2, Plus } from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Button } from "../../components/ui/button";

import { useClients } from "../../hooks/client/useClients";

import ClientFilters from "../../components/client/ClientFilters";
import ClientTable from "../../components/client/ClientTable";
import ClientSummaryCards from "../../components/client/ClientSummaryCards";

export default function ClientListPage() {
  const [currentPage, setCurrentPage] =
    useState(1);

  const pageLimit = 10;

  const [search, setSearch] =
    useState("");

  const [clientType, setClientType] =
    useState("all");

  const [status, setStatus] =
    useState("all");

  const [country, setCountry] =
    useState("all");

  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useClients();

  const allClients = data?.data ?? [];

  /*
   * Dynamic country options
   */
  const countries = useMemo(() => {
    return Array.from(
      new Set(
        allClients
          .map((client) => client.country)
          .filter(
            (country): country is string =>
              Boolean(country)
          )
      )
    ).sort();
  }, [allClients]);

  /*
   * Filtering
   */
  const filteredClients = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    return allClients.filter((client) => {
      const matchesSearch =
        !searchValue ||
        client.clientCode
          ?.toLowerCase()
          .includes(searchValue) ||
        client.companyName
          ?.toLowerCase()
          .includes(searchValue) ||
        client.contactPerson
          ?.toLowerCase()
          .includes(searchValue) ||
        client.email
          ?.toLowerCase()
          .includes(searchValue);

      const matchesType =
        clientType === "all" ||
        client.clientType === clientType;

      const matchesStatus =
        status === "all" ||
        (status === "active" &&
          client.isActive === true) ||
        (status === "inactive" &&
          client.isActive === false);

      const matchesCountry =
        country === "all" ||
        client.country === country;

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus &&
        matchesCountry
      );
    });
  }, [
    allClients,
    search,
    clientType,
    status,
    country,
  ]);

  /*
   * Earliest -> latest
   */
  const sortedClients = useMemo(() => {
    return [...filteredClients].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime()
    );
  }, [filteredClients]);

  /*
   * Pagination
   */
  const total = sortedClients.length;

  const totalPages = Math.max(
    Math.ceil(total / pageLimit),
    1
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const startIndex =
    (safeCurrentPage - 1) * pageLimit;

  const paginatedClients =
    sortedClients.slice(
      startIndex,
      startIndex + pageLimit
    );

  const hasPreviousPage =
    safeCurrentPage > 1;

  const hasNextPage =
    safeCurrentPage < totalPages;

  /*
   * Reset page whenever filters change.
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    clientType,
    status,
    country,
  ]);

  function handlePrevious() {
    if (
      !hasPreviousPage ||
      isFetching
    ) {
      return;
    }

    setCurrentPage((prev) =>
      Math.max(prev - 1, 1)
    );
  }

  function handleNext() {
    if (
      !hasNextPage ||
      isFetching
    ) {
      return;
    }

    setCurrentPage((prev) =>
      Math.min(
        prev + 1,
        totalPages
      )
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Clients
          </h1>

          <p className="text-muted-foreground">
            Manage registered clients.
          </p>
        </div>

        <Button asChild>
          <Link to="/clients/new">
            <Plus className="mr-2 h-4 w-4" />
            New Client
          </Link>
        </Button>
      </div>

      {/* Filters */}

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

      {/* Summary */}

      {!isLoading && !isError && (
        <ClientSummaryCards
          clients={filteredClients}
        />
      )}

      {/* Refreshing */}

      {isFetching && !isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Refreshing clients...
        </div>
      )}

      {/* Error */}

      {isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <h3 className="font-semibold text-red-800">
            Unable to load clients
          </h3>

          <p className="mt-1 text-sm text-red-600">
            Please try again.
          </p>
        </div>
      ) : (
        <ClientTable
          clients={paginatedClients}
          isLoading={isLoading}
          currentPage={safeCurrentPage}
          pageLimit={pageLimit}
        />
      )}

      {/* Pagination */}

      {!isLoading &&
        !isError &&
        total > 0 && (
          <div className="flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                Page{" "}
                <strong className="text-foreground">
                  {safeCurrentPage}
                </strong>{" "}
                of{" "}
                <strong className="text-foreground">
                  {totalPages}
                </strong>
              </span>

              <span className="text-slate-300">
                •
              </span>

              <span>
                {total} total
              </span>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={
                  !hasPreviousPage ||
                  isFetching
                }
                onClick={handlePrevious}
              >
                Previous
              </Button>

              <Button
                type="button"
                variant="outline"
                disabled={
                  !hasNextPage ||
                  isFetching
                }
                onClick={handleNext}
              >
                Next
              </Button>
            </div>

          </div>
        )}

    </div>
  );
}