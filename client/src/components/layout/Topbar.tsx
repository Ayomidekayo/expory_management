import { useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  Search,
  ChevronDown,
  LogOut,
  Settings,
  User,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../../store/auth.store";

interface Props {
  onMenuClick?: () => void;
}

export default function Topbar({ onMenuClick }: Props) {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout } = useAuthStore();

  const [open, setOpen] = useState(false);

  const pageTitle = location.pathname
    .replace("/", "")
    .replace("-", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8 shadow-sm">

      {/* Left */}
      <div className="flex items-center gap-5">

        {/* Mobile Button */}
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {pageTitle || "Dashboard"}
          </h1>

          <p className="text-sm text-slate-500">
            Welcome back, {user?.name}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">

        {/* Search */}
        <div className="relative hidden md:block">

          <Search
            size={18}
            className="absolute left-4 top-3 text-slate-400"
          />

          <input
            placeholder="Search..."
            className="w-80 rounded-xl border border-slate-200 bg-slate-50 py-2 pl-11 pr-4 outline-none focus:border-emerald-500"
          />
        </div>

        {/* Notifications */}
        <button className="relative rounded-xl p-3 transition hover:bg-slate-100">

          <Bell size={22} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* User Dropdown */}
        <div className="relative">

          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-slate-100"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-lg font-bold text-white">
              {user?.name?.charAt(0)}
            </div>

            <div className="hidden text-left md:block">
              <p className="font-semibold text-slate-800">
                {user?.name}
              </p>

              <p className="text-sm text-slate-500">
                {user?.role}
              </p>
            </div>

            <ChevronDown size={18} />
          </button>

          {open && (
            <div className="absolute right-0 mt-3 w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">

              <button
                className="flex w-full items-center gap-3 px-5 py-4 hover:bg-slate-50"
              >
                <User size={18} />
                Profile
              </button>

              <button
                className="flex w-full items-center gap-3 px-5 py-4 hover:bg-slate-50"
              >
                <Settings size={18} />
                Settings
              </button>

              <hr />

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-5 py-4 text-red-600 hover:bg-red-50"
              >
                <LogOut size={18} />
                Logout
              </button>

            </div>
          )}

        </div>

      </div>

    </header>
  );
}