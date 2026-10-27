import { useCallback, useEffect, useState, type MouseEvent } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

/**
 * Responsive authenticated dashboard shell.
 * Reuses the existing Sidebar so its current role-based menu, active links,
 * account information and logout behavior remain the source of truth.
 */
export default function DashboardLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  const closeMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(false);
  }, []);

  // Close the drawer after navigation, including when a user follows a link
  // that changes only the query string or hash.
  useEffect(() => {
    closeMobileSidebar();
  }, [location.pathname, location.search, location.hash, closeMobileSidebar]);

  // Lock background scrolling while the mobile drawer is open and support Esc.
  useEffect(() => {
    if (!mobileSidebarOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMobileSidebar();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileSidebarOpen, closeMobileSidebar]);

  const handleMobileSidebarClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target;
    if (target instanceof Element && target.closest("a[href]")) {
      closeMobileSidebar();
    }
  };

  return (
    <div className="min-h-screen w-full min-w-0 overflow-x-clip bg-slate-50 text-slate-900">
      {/* Desktop navigation. The existing Sidebar owns its role-filtered items. */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile menu drawer. This renders only while open, so desktop and mobile
          do not create two simultaneously visible navigation surfaces. */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden" role="presentation">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={closeMobileSidebar}
            className="absolute inset-0 h-full w-full bg-slate-950/50 backdrop-blur-[2px]"
          />

          <aside
            id="mobile-dashboard-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Dashboard navigation"
            className="mobile-dashboard-drawer relative flex h-[100dvh] max-h-[100dvh] w-[min(88vw,320px)] flex-col overflow-hidden border-r border-slate-200 bg-white shadow-2xl"
          >
            <div className="relative z-10 flex min-h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4">
              <span className="text-sm font-bold text-slate-800">Navigation</span>
              <button
                type="button"
                onClick={closeMobileSidebar}
                aria-label="Close navigation"
                className="grid h-10 w-10 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/20"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <div
              className="mobile-dashboard-sidebar-content min-h-0 flex-1 overflow-y-auto overscroll-contain"
              onClick={handleMobileSidebarClick}
            >
              <Sidebar />
            </div>
          </aside>
        </div>
      )}

      <div className="flex min-h-screen min-w-0 flex-col lg:ml-72">
        {/* Keep a single mobile menu trigger in the Topbar. */}
        <Topbar
          onMenuClick={() => setMobileSidebarOpen(true)}
          mobileMenuOpen={mobileSidebarOpen}
        />

        <main className="min-w-0 w-full flex-1 overflow-x-clip px-3 py-4 sm:px-5 sm:py-6 md:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>

      <style>{`
        @keyframes dashboard-drawer-enter {
          from { opacity: .8; transform: translateX(-100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        .mobile-dashboard-drawer {
          animation: dashboard-drawer-enter 220ms cubic-bezier(.2,.75,.25,1) both;
        }

        /* Some existing Sidebar implementations position the root as fixed
           for desktop. Normalize that root only within the mobile drawer. */
        .mobile-dashboard-sidebar-content > * {
          position: relative !important;
          inset: auto !important;
          width: 100% !important;
          max-width: 100% !important;
          height: auto !important;
          min-height: 100% !important;
          max-height: none !important;
          transform: none !important;
          box-shadow: none !important;
        }
        .mobile-dashboard-sidebar-content [class~="fixed"],
        .mobile-dashboard-sidebar-content [class*="inset-y-0"] {
          position: relative !important;
          inset: auto !important;
          width: 100% !important;
          max-width: 100% !important;
          height: auto !important;
          min-height: 100% !important;
          max-height: none !important;
          transform: none !important;
        }

        @media (prefers-reduced-motion: reduce) {
          .mobile-dashboard-drawer { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
