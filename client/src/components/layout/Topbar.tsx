import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Settings,
  User,
} from "lucide-react";

import { useAuthStore } from "../../store/auth.store";

interface Props {
  onMenuClick?: () => void;
}

export default function Topbar({
  onMenuClick,
}: Props) {
  const navigate = useNavigate();

  const location = useLocation();

  const { user, logout } =
    useAuthStore();

  const [open, setOpen] =
    useState(false);

  const dropdownRef =
    useRef<HTMLDivElement>(null);

  /*
  ======================================
  Page Title
  ======================================
  */

  const titles: Record<
    string,
    string
  > = {
    dashboard: "Dashboard",
    clients: "Clients",
    exporters: "Exporters",
    consignees: "Consignees",
    allocations: "Allocations",
    shipments: "Shipments",
    invoices: "Invoices",
    "packing-lists":
      "Packing Lists",
    containers: "Containers",
    transits: "Transit Records",
    documents: "Documents",
    profile:
      "Profile Settings",
    settings: "Settings",
  };

  const current =
    location.pathname.split("/")[1];

  const pageTitle =
    titles[current] ??
    "Dashboard";

  /*
  ======================================
  Close Dropdown
  ======================================
  */

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent
    ) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  /*
  ======================================
  ESC Key
  ======================================
  */

  useEffect(() => {
    function handleEsc(
      event: KeyboardEvent
    ) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener(
      "keydown",
      handleEsc
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleEsc
      );
  }, []);

  /*
  ======================================
  Logout
  ======================================
  */

  function handleLogout() {
    logout();

    navigate("/login");
  }

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() ?? "U";

  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-6 shadow-sm backdrop-blur">

      {/* Left */}

      <div className="flex flex-1 items-center gap-5">

        <button
          onClick={onMenuClick}
          className="rounded-xl p-2 transition hover:bg-slate-100 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div>

          <h1 className="text-2xl font-bold text-slate-800">
            {pageTitle}
          </h1>

          <p className="text-sm text-slate-500">
            Welcome back,
            {" "}
            <span className="font-medium text-emerald-600">
              {user?.name}
            </span>
          </p>

        </div>

      </div>

      {/* Right */}

      <div className="flex shrink-0 items-center gap-4">

        {/* Search */}

        <div className="relative hidden lg:block">

          <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />

          <input
            placeholder="Search..."
            className="w-72 rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white xl:w-96"
          />

        </div>

        {/* Notification */}

        <button className="relative rounded-xl p-3 transition hover:bg-slate-100">

          <Bell className="h-6 w-6 text-slate-700" />

          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">

            3

          </span>

        </button>

        {/* User */}

        <div
          ref={dropdownRef}
          className="relative"
        >

          <button
            onClick={() =>
              setOpen(!open)
            }
            className="flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-slate-100"
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-green-700 to-emerald-500 text-lg font-bold text-white shadow-md">

              {initials}

            </div>

            <div className="hidden text-left md:block">

              <p className="font-semibold text-slate-800">

                {user?.name}

              </p>

              <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">

                {user?.role}

              </span>

            </div>

            <ChevronDown
              className={`h-5 w-5 text-slate-500 transition-transform ${
                open
                  ? "rotate-180"
                  : ""
              }`}
            />

          </button>

          {open && (

            <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

            

              <button
                onClick={() => {
                  navigate(
                    "/settings"
                  );

                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 px-5 py-4 transition hover:bg-slate-50"
              >

                <Settings className="h-5 w-5 text-emerald-600" />

                Settings

              </button>

              <div className="border-t" />

              <button
                onClick={
                  handleLogout
                }
                className="flex w-full items-center gap-3 px-5 py-4 text-red-600 transition hover:bg-red-50"
              >

                <LogOut className="h-5 w-5" />

                Logout

              </button>

            </div>

          )}

        </div>

      </div>

    </header>
  );
}