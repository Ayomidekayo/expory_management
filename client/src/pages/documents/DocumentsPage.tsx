import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";


import { useDocuments } from "../../hooks/document/useDocuments";

import type {
  DocumentQuery,
} from "../../types/document";
import DocumentFilters from "../../components/documents/DocumentFilters";
import DocumentStatisticsCards from "../../components/documents/DocumentStatisticsCards";
import { Button } from "../../components/ui/button";
import DocumentTable from "../../components/documents/DocumentTable";

export default function DocumentsPage() {

  const [filters, setFilters] =
    useState<DocumentQuery>({
      page: 1,
      limit: 10,
    });

  const {
    data,
    isLoading,
  } = useDocuments(filters);

  return (

    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            Documents
          </h1>

          <p className="text-muted-foreground">
            Manage export documents and supporting files.
          </p>

        </div>

        <Link to="/documents/create">

          <Button>

            <Plus className="mr-2 h-4 w-4" />

            Upload Document

          </Button>

        </Link>

      </div>

      {/* Filters */}

      <DocumentFilters
        filters={filters}
        onChange={setFilters}
      />

      {/* Statistics */}

      <DocumentStatisticsCards
        data={data?.data ?? []}
      />

      {/* Table */}

      <DocumentTable
        data={data?.data ?? []}
        loading={isLoading}
      />

    </div>

  );

}