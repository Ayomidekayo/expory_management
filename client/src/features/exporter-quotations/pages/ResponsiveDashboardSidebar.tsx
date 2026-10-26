import { useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  LogOut,
  PackageCheck,
  X,
  type LucideIcon,
} from "lucide-react";

type SidebarItem = {
  label: string;
  to: string;
  Icon: LucideIcon;
  end?: boolean;
};

type ResponsiveDashboardSidebarProps = {
  /** Items should be selected from the current user's role/permissions. */
  items: SidebarItem[];
  mobileOpen: boolean;
  onClose: () => void;
  brand?: string;
  tagline?: string;
  displayName?: string;
  roleLabel?: string;
  onLogout?: () => void;
};

const itemClass = (active: boolean) =>
  `group flex min-h-11 min-w-0 items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/20 ${
    active
      ? "bg-emerald-700 text-white shadow-sm shadow-emerald-950/10"
      : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-900"
  }`;

function Navigation({
  items,
  onNavigate,
}: {
  items: SidebarItem[];
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label="Main navigation" className="flex-1 overflow-y-auto overscroll-contain px-3 py-4">
      <p className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
        Workspace
      </p>
      <div className="space-y-1">
        {items.map(({ label, to, Icon, end }) => (
          <NavLink
            key={`${to}:${label}`}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) => itemClass(isActive)}
          >
            <Icon size={18} strokeWidth={1.9} aria-hidden="true" className="shrink-0" />
            <span className="min-w-0 flex-1 break-words">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

function SidebarBrand({ brand, tagline }: { brand: string; tagline: string }) {
  return (
    <Link to="/dashboard" className="flex min-w-0 items-center gap-3 rounded-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/20">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-emerald-700 text-white shadow-sm">
        <PackageCheck size={21} aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-base font-extrabold tracking-tight text-emerald-950">{brand}</span>
        <span className="mt-0.5 block truncate text-xs text-slate-500">{tagline}</span>
      </span>
    </Link>
  );
}

function SidebarFooter({
  displayName,
  roleLabel,
  onLogout,
}: {
  displayName: string;
  roleLabel: string;
  onLogout?: () => void;
}) {
  return (
    <div className="shrink-0 border-t border-slate-100 p-3 sm:p-4">
      <div className="flex min-w-0 items-center gap-3 rounded-2xl bg-slate-50 p-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-700 text-xs font-extrabold text-white" aria-hidden="true">
          {displayName.trim().slice(0, 2).toUpperCase() || "EX"}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block break-words text-sm font-bold text-slate-900">{displayName}</span>
          <span className="mt-0.5 block truncate text-xs font-medium uppercase tracking-wide text-emerald-700">{roleLabel}</span>
        </span>
      </div>
      {onLogout && (
        <button
          type="button"
          onClick={onLogout}
          className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-rose-100 px-4 py-2.5 text-sm font-bold text-rose-700 transition hover:bg-rose-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-500/20"
        >
          <LogOut size={16} aria-hidden="true" />
          Sign out
        </button>
      )}
    </div>
  );
}

export default function ResponsiveDashboardSidebar({
  items,
  mobileOpen,
  onClose,
  brand = "Export ERP",
  tagline = "Export Management System",
  displayName = "Exporter account",
  roleLabel = "Exporter",
  onLogout,
}: ResponsiveDashboardSidebarProps) {
  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen, onClose]);

  const desktopContent = (
    <>
      <div className="flex h-[76px] shrink-0 items-center border-b border-slate-100 px-4">
        <SidebarBrand brand={brand} tagline={tagline} />
      </div>
      <Navigation items={items} />
      <SidebarFooter displayName={displayName} roleLabel={roleLabel} onLogout={onLogout} />
    </>
  );

  return (
    <>
      {/* Permanent desktop navigation. The shell's content column should use lg:pl-[250px]. */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[250px] flex-col border-r border-slate-200 bg-white lg:flex">
        {desktopContent}
      </aside>

      {/* Mobile drawer with backdrop, scroll locking, Escape-to-close, and close-on-navigation. */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden" role="presentation">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={onClose}
            className="absolute inset-0 h-full w-full bg-slate-950/45 backdrop-blur-[2px]"
          />
          <style>{`
            @keyframes exporter-sidebar-in { from { transform: translateX(-100%); opacity: .75; } to { transform: translateX(0); opacity: 1; } }
            .exporter-mobile-sidebar { animation: exporter-sidebar-in 220ms cubic-bezier(.2,.75,.25,1) both; }
            @media (prefers-reduced-motion: reduce) { .exporter-mobile-sidebar { animation: none !important; } }
          `}</style>
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="exporter-mobile-sidebar relative flex h-[100dvh] max-h-[100dvh] w-[min(88vw,320px)] flex-col border-r border-slate-200 bg-white shadow-2xl"
          >
            <div className="flex min-h-[76px] shrink-0 items-center justify-between gap-3 border-b border-slate-100 px-4">
              <div className="min-w-0 flex-1">
                <SidebarBrand brand={brand} tagline={tagline} />
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/20"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <Navigation items={items} onNavigate={onClose} />
            <SidebarFooter displayName={displayName} roleLabel={roleLabel} onLogout={onLogout} />
          </aside>
        </div>
      )}
    </>
  );
}
