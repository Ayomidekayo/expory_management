
import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

import NavItem from "../navigation/NavItem";
import {
  sidebarItems,
  exporterSidebarItems,
} from "../../config/sidebar";
import { useAuthStore } from "../../store/auth.store";
import { hasPermission } from "../../utils/permissions";

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const isExporter = user?.role === "EXPORTER";

  const menu = isExporter
    ? exporterSidebarItems
    : sidebarItems.filter((item) =>
        hasPermission(user, item.permission)
      );

  const homePath = isExporter
    ? "/exporter/quotations"
    : "/dashboard";

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex h-screen w-72 flex-col border-r border-slate-200 bg-white">
      {/* Logo */}
      <div className="border-b border-slate-200 px-6 py-6">
        <Link to={homePath}>
          <h1 className="text-2xl font-bold text-emerald-700">
            Export ERP
          </h1>

          <p className="text-sm text-slate-500">
            Export Management System
          </p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
        {menu.map((item) => (
          <NavItem
            key={`${item.path}-${item.title}`}
            title={item.title}
            path={item.path}
            icon={item.icon}
          />
        ))}
      </nav>

      {/* Authenticated user */}
      <div className="border-t border-slate-200 p-5">
        <div className="mb-4">
          <p className="font-semibold text-slate-800">
            {user?.name}
          </p>

          <p className="text-sm text-slate-500">
            {user?.role}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 text-white transition hover:bg-red-600"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
