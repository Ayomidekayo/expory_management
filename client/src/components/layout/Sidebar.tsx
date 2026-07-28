import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

import NavItem from "../navigation/NavItem";
import { sidebarItems } from "../../config/sidebar";
import { useAuthStore } from "../../store/auth.store";

export default function Sidebar() {
 

const navigate = useNavigate();

const { user, logout } = useAuthStore();

const handleLogout = () => {
    logout();
    navigate("/login");
};

  const menu = sidebarItems.filter((item) =>
    item.roles.includes(user?.role ?? "")
  );

  return (
   <aside
  className="
    fixed
    left-0
    top-0
    z-40
    flex
    h-screen
    w-72
    flex-col
    border-r
    border-slate-200
    bg-white
  "
>
      <div className="border-b border-slate-200 px-6 py-6">
        <Link to="/dashboard">
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
            key={item.path}
            title={item.title}
            path={item.path}
            icon={item.icon}
          />
        ))}
      </nav>

      {/* User Section */}
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