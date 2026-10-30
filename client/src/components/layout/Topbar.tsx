import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { Toaster, toast } from "sonner";

import {
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Settings,
  FileText,
} from "lucide-react";

import { useAuthStore } from "../../store/auth.store";
import QuotationNotificationCenter from "../../features/quotation-notifications/components/QuotationNotificationCenter";


interface Props {
  onMenuClick?: () => void;
  /** Whether the responsive dashboard drawer is currently open. */
  mobileMenuOpen?: boolean;
}

interface QuotationSubmittedEvent {
  submissionId?: string;
  quoteId?: string;
  status?: string;
  submittedAt?: string;
}

interface AdditionalChargeRequestedEvent {
  submissionId?: string;
  quoteId?: string;
  customsChargeRequested?: boolean;
  invoiceValue?: number | string | null;
  invoiceCurrency?: string | null;
  transportChargeRequested?: boolean;
}

export default function Topbar({ onMenuClick, mobileMenuOpen = false }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuthStore();

  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  /*
  ========================================================
  PAGE TITLE
  ========================================================
  */

  const titles: Record<string, string> = {
    dashboard: "Dashboard",
    clients: "Clients",
    exporters: "Exporters",
    consignees: "Consignees",
    allocations: "Allocations",
    shipments: "Shipments",
    invoices: "Invoices",
    "packing-lists": "Packing Lists",
    containers: "Containers",
    transits: "Transit Records",
    documents: "Documents",
    profile: "Profile Settings",
    settings: "Settings",
    quotations: "Quotation Management",
  };

  const current = location.pathname.split("/")[1];
  const pageTitle = titles[current] ?? "Dashboard";

  /*
  ========================================================
  QUOTATION REVIEW ACCESS

  Only admins and authorized quotation reviewers should
  receive administrative quotation notifications.
  ========================================================
  */

  const permissions = (
    user as
      | (typeof user & { permissions?: string[] })
      | null
  )?.permissions ?? [];

  const canReviewQuotations =
    user?.role === "ADMIN" ||
    permissions.includes("REVIEW_QUOTE") ||
    permissions.includes("REVIEW_QUOTATIONS") ||
    permissions.includes("VIEW_ALL_QUOTES") ||
    permissions.includes("MANAGE_QUOTE_CHARGES");

  /*
  ========================================================
  REAL-TIME QUOTATION NOTIFICATIONS

  Listens for the backend event:
  quotation:submitted
  ========================================================
  */

  useEffect(() => {
    if (!canReviewQuotations) {
      return;
    }

    const token = localStorage.getItem("token");

    /*
      VITE_SOCKET_URL should be the backend server origin,
      not an API path such as /api/v1.

      If it is not configured, derive the origin from
      VITE_API_URL.
    */

    const apiUrl = import.meta.env.VITE_API_URL as
      | string
      | undefined;

    const configuredSocketUrl = import.meta.env
      .VITE_SOCKET_URL as string | undefined;

    let socketUrl: string;

    try {
      socketUrl =
        configuredSocketUrl?.trim() ||
        new URL(
          apiUrl || window.location.origin,
          window.location.origin,
        ).origin;
    } catch {
      console.error(
        "Invalid Socket.IO server URL. Check VITE_SOCKET_URL.",
      );
      return;
    }

    const socket = io(socketUrl, {
      autoConnect: false,
      withCredentials: true,
      ...(token ? { auth: { token } } : {}),
    });

    const handleQuotationSubmitted = (
      event: QuotationSubmittedEvent,
    ) => {
      const submissionId =
        typeof event?.submissionId === "string"
          ? event.submissionId
          : "";

      const shortReference = submissionId
        ? submissionId.slice(0, 8).toUpperCase()
        : "";

      window.dispatchEvent(new Event("quotation-notifications:refresh"));

      toast.success("New quotation received", {
        description: submissionId
          ? `An exporter has submitted a quotation. Submission: ${shortReference}.`
          : "An exporter has submitted a new quotation for review.",

        duration: 8000,

        action: {
          label: "Review quotation",

          onClick: () => {
            if (submissionId) {
              navigate(
                `/quotations/review/${encodeURIComponent(
                  submissionId,
                )}`,
              );
            } else {
              navigate("/quotations/review");
            }
          },
        },
      });
    };

    const handleAdditionalChargeRequested = (event: AdditionalChargeRequestedEvent) => {
      const submissionId = typeof event?.submissionId === "string" ? event.submissionId : "";
      const isCustoms = Boolean(event?.customsChargeRequested);
      const invoiceValue = Number(event?.invoiceValue ?? 0);
      const currency = typeof event?.invoiceCurrency === "string" ? event.invoiceCurrency : "NGN";
      const details = [
        isCustoms && invoiceValue > 0 ? `Invoice value: ${currency} ${invoiceValue.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.` : "",
        event?.transportChargeRequested ? "Additional transportation pricing was also requested." : "",
      ].filter(Boolean).join(" ");

      window.dispatchEvent(new Event("quotation-notifications:refresh"));
      toast.error(isCustoms ? "Customs assistance requested" : "Additional-service pricing requested", {
        description: details || "An exporter requested additional quotation services.",
        duration: 12000,
        action: {
          label: "Review request",
          onClick: () => navigate(submissionId ? `/quotations/review/${encodeURIComponent(submissionId)}` : "/quotations/review"),
        },
      });
    };

    const handleConnectionError = (error: Error) => {
      if (import.meta.env.DEV) {
        console.warn(
          "Quotation notification connection failed:",
          error.message,
        );
      }
    };

    socket.on(
      "quotation:submitted",
      handleQuotationSubmitted,
    );
    socket.on("quotation:additional-charge-requested", handleAdditionalChargeRequested);

    socket.on("connect_error", handleConnectionError);

    socket.connect();

    return () => {
      socket.off(
        "quotation:submitted",
        handleQuotationSubmitted,
      );
      socket.off("quotation:additional-charge-requested", handleAdditionalChargeRequested);

      socket.off("connect_error", handleConnectionError);

      socket.disconnect();
    };
  }, [canReviewQuotations, user?.id, navigate]);

  /*
  ========================================================
  CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  ========================================================
  */

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  /*
  ========================================================
  ESCAPE KEY
  ========================================================
  */

  useEffect(() => {
    function handleEsc(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  /*
  ========================================================
  LOGOUT
  ========================================================
  */

  function handleLogout() {
    logout();
    navigate("/login");
  }

  /*
  ========================================================
  USER INITIALS
  ========================================================
  */

  const initials =
    user?.name
      ?.split(" ")
      .filter(Boolean)
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase() ?? "U";

  /*
  ========================================================
  OPEN QUOTATION NOTIFICATIONS
  ========================================================
  */

  /*
  ========================================================
  RENDER
  ========================================================
  */

  return (
    <>
      {/* Render one toast container for this dashboard shell. */}
      <Toaster
        position="top-right"
        richColors
        closeButton
        visibleToasts={4}
        expand
      />

      <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 shadow-sm backdrop-blur sm:px-6">
        {/* LEFT: PAGE INFORMATION */}

        <div className="flex min-w-0 flex-1 items-center gap-4">
          <button
            type="button"
            onClick={onMenuClick}
            aria-controls="mobile-dashboard-navigation"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Navigation menu open" : "Open navigation menu"}
            className="rounded-xl p-2 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/20 lg:hidden"
          >
            <Menu className="h-6 w-6 text-slate-700" />
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold text-slate-800 sm:text-2xl">
              {pageTitle}
            </h1>

            <p className="hidden text-sm text-slate-500 sm:block">
              Welcome back,{" "}
              <span className="font-semibold text-emerald-600">
                {user?.name || "User"}
              </span>
            </p>
          </div>
        </div>

        {/* RIGHT: SEARCH, NOTIFICATIONS AND ACCOUNT */}

        <div className="ml-3 flex shrink-0 items-center gap-2 sm:gap-4">
          {/* SEARCH */}

          <div className="relative hidden lg:block">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />

            <input
              type="search"
              placeholder="Search..."
              aria-label="Search"
              className="w-64 rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white xl:w-80"
            />
          </div>

          {/* Persistent, user-scoped quotation notifications. Unread alerts stay red until read. */}
          <QuotationNotificationCenter />

          {/* USER DROPDOWN */}

          <div
            ref={dropdownRef}
            className="relative"
          >
            <button
              type="button"
              onClick={() => setOpen((previous) => !previous)}
              aria-expanded={open}
              aria-haspopup="menu"
              className="flex items-center gap-2 rounded-xl px-2 py-2 transition hover:bg-slate-100 sm:gap-3 sm:px-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-green-700 to-emerald-500 text-sm font-bold text-white shadow-sm sm:h-11 sm:w-11 sm:text-base">
                {initials}
              </div>

              <div className="hidden text-left md:block">
                <p className="max-w-36 truncate text-sm font-semibold text-slate-800">
                  {user?.name || "User"}
                </p>

                <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                  {user?.role || "User"}
                </span>
              </div>

              <ChevronDown
                className={`hidden h-5 w-5 text-slate-500 transition-transform sm:block ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>

            {open && (
              <div
                role="menu"
                className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
              >
                <div className="border-b border-slate-100 px-5 py-4">
                  <p className="truncate text-sm font-bold text-slate-800">
                    {user?.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Account settings
                  </p>
                </div>

                {canReviewQuotations && (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setOpen(false);
                      navigate("/quotations/review");
                    }}
                    className="flex w-full items-center gap-3 px-5 py-4 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800"
                  >
                    <FileText className="h-5 w-5 text-emerald-600" />
                    Quotation review
                  </button>
                )}

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    navigate("/settings");
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-3 px-5 py-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <Settings className="h-5 w-5 text-emerald-600" />
                  Settings
                </button>

                <div className="border-t border-slate-100" />

                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-5 py-4 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}