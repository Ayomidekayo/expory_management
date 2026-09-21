import {
  ArrowLeft,
  Check,
  ChevronsUpDown,
  Container as ContainerIcon,
  FileText,
  Loader2,
  Ship,
  Truck,
  UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";

import type {
  GateMovementStatus,
  GateType,
} from "../../api/gate-movement.api";

import type { Container } from "../../types/container.type";

interface FormValues {
  containerId?: string;
  containerNumber: string;
  yardStoreNumber: string;
  truckFrontPlate: string;
  truckBackPlate: string;
  gateType: GateType;
  status: GateMovementStatus;
  notes: string;
}

interface Props {
  containers: Container[];
  loadingContainers?: boolean;
  loading?: boolean;
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
}

export default function GateMovementForm({
  containers,
  loadingContainers = false,
  loading = false,
  onSubmit,
  onCancel,
}: Props) {
  const [containerSearch, setContainerSearch] =
    useState("");

  const [containerOpen, setContainerOpen] =
    useState(false);

  const [selectedContainer, setSelectedContainer] =
    useState<Container | null>(null);

  const [containerNumber, setContainerNumber] =
    useState("");

  const [yardStoreNumber, setYardStoreNumber] =
    useState("");

  const [truckFrontPlate, setTruckFrontPlate] =
    useState("");

  const [truckBackPlate, setTruckBackPlate] =
    useState("");

  const [gateType, setGateType] =
    useState<GateType>("TERMINAL_GATE");

  const [status, setStatus] =
    useState<GateMovementStatus>("PENDING");

  const [notes, setNotes] = useState("");

  const filteredContainers = useMemo(() => {
    const search = containerSearch
      .trim()
      .toLowerCase();

    if (!search) {
      return containers;
    }

    return containers.filter((container) =>
      container.containerNumber
        .toLowerCase()
        .includes(search)
    );
  }, [containers, containerSearch]);

  const handleContainerSelect = (
    container: Container
  ) => {
    setSelectedContainer(container);

    setContainerNumber(
      container.containerNumber
    );

    setContainerOpen(false);
    setContainerSearch("");
  };

  const handleManualContainer = () => {
    setSelectedContainer(null);
    setContainerNumber("");
    setContainerOpen(false);
    setContainerSearch("");
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    onSubmit({
      containerId: selectedContainer?.id,
      containerNumber:
        containerNumber.trim(),
      yardStoreNumber:
        yardStoreNumber.trim(),
      truckFrontPlate:
        truckFrontPlate.trim(),
      truckBackPlate:
        truckBackPlate.trim(),
      gateType,
      status,
      notes: notes.trim(),
    });
  };

  const shipment =
    selectedContainer?.shipment;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* =========================================
          CONTAINER INFORMATION
      ========================================= */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
              <ContainerIcon
                size={20}
                className="text-slate-700"
              />
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Container Information
              </h2>

              <p className="text-sm text-slate-500">
                Select an existing container or enter one manually.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5 p-6">

          {/* Existing Container */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Existing Container
            </label>

            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setContainerOpen(
                    (current) => !current
                  )
                }
                className="flex w-full items-center justify-between rounded-xl border border-slate-300 bg-white px-4 py-3 text-left text-sm outline-none transition hover:border-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              >
                <span
                  className={
                    selectedContainer
                      ? "font-medium text-slate-900"
                      : "text-slate-500"
                  }
                >
                  {selectedContainer
                    ? selectedContainer.containerNumber
                    : "Search and select a container"}
                </span>

                <ChevronsUpDown
                  size={17}
                  className="text-slate-400"
                />
              </button>

              {containerOpen && (
                <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">

                  <div className="border-b border-slate-200 p-3">
                    <input
                      value={containerSearch}
                      onChange={(event) =>
                        setContainerSearch(
                          event.target.value
                        )
                      }
                      autoFocus
                      placeholder="Search container number..."
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                    />
                  </div>

                  <div className="max-h-64 overflow-y-auto p-2">
                    {loadingContainers ? (
                      <div className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-slate-500">
                        <Loader2
                          size={17}
                          className="animate-spin"
                        />

                        Loading containers...
                      </div>
                    ) : filteredContainers.length ===
                      0 ? (
                      <div className="px-4 py-6 text-center text-sm text-slate-500">
                        No containers found.
                      </div>
                    ) : (
                      filteredContainers.map(
                        (container) => (
                          <button
                            key={container.id}
                            type="button"
                            onClick={() =>
                              handleContainerSelect(
                                container
                              )
                            }
                            className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left transition hover:bg-slate-50"
                          >
                            <div>
                              <p className="text-sm font-semibold text-slate-900">
                                {
                                  container.containerNumber
                                }
                              </p>

                              <p className="mt-0.5 text-xs text-slate-500">
                                {
                                  container.containerSize
                                }{" "}
                                ·{" "}
                                {
                                  container.containerType
                                }
                              </p>
                            </div>

                            {selectedContainer?.id ===
                              container.id && (
                              <Check
                                size={17}
                                className="text-emerald-600"
                              />
                            )}
                          </button>
                        )
                      )
                    )}
                  </div>

                  <div className="border-t border-slate-200 p-2">
                    <button
                      type="button"
                      onClick={
                        handleManualContainer
                      }
                      className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      + Enter container manually
                    </button>
                  </div>

                </div>
              )}
            </div>
          </div>

          {/* Container Number */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Container Number
            </label>

            <input
              value={containerNumber}
              onChange={(event) =>
                setContainerNumber(
                  event.target.value
                )
              }
              placeholder="e.g. MSCU1234567"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm uppercase outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />

            <p className="mt-1.5 text-xs text-slate-500">
              Automatically filled when an existing container is selected.
            </p>
          </div>

          {/* Container Summary */}
          {selectedContainer && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <div>
                  <p className="text-xs text-slate-500">
                    Container
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {
                      selectedContainer.containerNumber
                    }
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Size
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {
                      selectedContainer.containerSize
                    }
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Type
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {
                      selectedContainer.containerType
                    }
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Status
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {
                      selectedContainer.status
                    }
                  </p>
                </div>

              </div>
            </div>
          )}
        </div>
      </section>

      {/* =========================================
          SHIPMENT INFORMATION
      ========================================= */}
      {shipment && (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <FileText
                  size={20}
                  className="text-slate-700"
                />
              </div>

              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Shipment Information
                </h2>

                <p className="text-sm text-slate-500">
                  Information retrieved from the selected container's shipment.
                </p>
              </div>

            </div>
          </div>

          <div className="space-y-6 p-6">

            {/* Main Shipment Details */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

              <div>
                <p className="text-xs text-slate-500">
                  Shipment Number
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {shipment.shipmentNumber}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Shipment Date
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {shipment.shipmentDate
                    ? new Date(
                        shipment.shipmentDate
                      ).toLocaleDateString()
                    : "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Transport Mode
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {shipment.transportMode}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Shipment Status
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {shipment.status}
                </p>
              </div>

            </div>

            {/* Parties */}
            <div className="grid gap-5 md:grid-cols-3">

              {/* Client */}
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center gap-2">
                  <UserRound
                    size={16}
                    className="text-slate-500"
                  />

                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Client
                  </p>
                </div>

                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {shipment.client?.companyName ||
                    "—"}
                </p>
              </div>

              {/* Exporter */}
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center gap-2">
                  <UserRound
                    size={16}
                    className="text-slate-500"
                  />

                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Exporter
                  </p>
                </div>

                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {shipment.exporter?.name ||
                    "—"}
                </p>
              </div>

              {/* Consignee */}
              <div className="roundeda-xl border border-slate-200 p-4">
                <div className="flex items-center gap-2">
                  <UserRound
                    size={16}
                    className="text-slate-500"
                  />

                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Consignee
                  </p>
                </div>

                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {shipment.consignee?.name ||
                    "—"}
                </p>
              </div>

            </div>

            {/* Shipping Details */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

              <div className="mb-4 flex items-center gap-2">
                <Ship
                  size={17}
                  className="text-slate-500"
                />

                <h3 className="text-sm font-semibold text-slate-900">
                  Shipping Details
                </h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <div>
                  <p className="text-xs text-slate-500">
                    Booking Number
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {shipment.bookingNumber ||
                      "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Shipping Line
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {shipment.shippingLine ||
                      "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Vessel
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {shipment.vesselName ||
                      "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Voyage
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {shipment.voyageNumber ||
                      "—"}
                  </p>
                </div>

              </div>
            </div>

            {/* Ports */}
            <div className="grid gap-4 sm:grid-cols-2">

              <div>
                <p className="text-xs text-slate-500">
                  Port of Loading
                </p>

                <p className="mt-1 text-sm font-medium text-slate-900">
                  {shipment.portOfLoading ||
                    "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Port of Discharge
                </p>

                <p className="mt-1 text-sm font-medium text-slate-900">
                  {shipment.portOfDischarge ||
                    "—"}
                </p>
              </div>

            </div>

          </div>
        </section>
      )}

      {/* =========================================
          YARD & TRUCK
      ========================================= */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
              <Truck
                size={20}
                className="text-slate-700"
              />
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Yard & Truck Details
              </h2>

              <p className="text-sm text-slate-500">
                Provide the storage location and truck information.
              </p>
            </div>

          </div>

        </div>

        <div className="grid gap-5 p-6 md:grid-cols-3">

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Yard / Store Number
            </label>

            <input
              value={yardStoreNumber}
              onChange={(event) =>
                setYardStoreNumber(
                  event.target.value
                )
              }
              placeholder="e.g. YD-102"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Truck Front Plate
            </label>

            <input
              value={truckFrontPlate}
              onChange={(event) =>
                setTruckFrontPlate(
                  event.target.value
                )
              }
              placeholder="e.g. ABC-123XY"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm uppercase outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Truck Back Plate
            </label>

            <input
              value={truckBackPlate}
              onChange={(event) =>
                setTruckBackPlate(
                  event.target.value
                )
              }
              placeholder="e.g. KJA-456AA"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm uppercase outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

        </div>
      </section>

      {/* =========================================
          GATE DETAILS
      ========================================= */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">

          <h2 className="text-base font-semibold text-slate-900">
            Gate Details
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Specify the gate and current movement status.
          </p>

        </div>

        <div className="grid gap-5 p-6 md:grid-cols-2">

          {/* Gate Type */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Gate Type
            </label>

            <select
              value={gateType}
              onChange={(event) =>
                setGateType(
                  event.target.value as GateType
                )
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            >
              <option value="TERMINAL_GATE">
                Terminal Gate
              </option>

              <option value="ECOWAS_GATE">
                ECOWAS Gate
              </option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Status
            </label>

            <select
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value as GateMovementStatus
                )
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            >
              <option value="PENDING">
                Pending
              </option>

              <option value="CLEARED">
                Cleared
              </option>

              <option value="CROSSED">
                Crossed
              </option>

              <option value="CANCELLED">
                Cancelled
              </option>
            </select>
          </div>

          {/* Notes */}
          <div className="md:col-span-2">

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Notes
            </label>

            <textarea
              value={notes}
              onChange={(event) =>
                setNotes(event.target.value)
              }
              rows={4}
              placeholder="Add any additional information about this gate movement..."
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />

          </div>

        </div>
      </section>

      {/* =========================================
          ACTIONS
      ========================================= */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">

        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <ArrowLeft size={17} />
          Back to Gates
        </button>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2
                size={17}
                className="animate-spin"
              />
              Saving...
            </>
          ) : (
            <>
              <Check size={17} />
              Record Gate Movement
            </>
          )}
        </button>

      </div>
    </form>
  );
}