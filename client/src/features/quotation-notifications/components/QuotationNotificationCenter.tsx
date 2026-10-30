import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Bell, Check, Circle, LoaderCircle, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { getQuotationNotifications, markQuotationNotificationRead, type QuotationNotification } from "../api/quotation-notifications.api";
import { useAuthStore } from "../../../store/auth.store";

const queryKey = ["quotation-notifications"] as const;
const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : new Intl.DateTimeFormat("en-NG", { dateStyle: "medium", timeStyle: "short" }).format(date);
};

export default function QuotationNotificationCenter({ variant = "bell", limit = 8 }: { variant?: "bell" | "panel"; limit?: number }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const notificationsQuery = useQuery({
    queryKey,
    queryFn: getQuotationNotifications,
    refetchInterval: 15000,
    refetchOnWindowFocus: true,
  });
  const readMutation = useMutation({
    mutationFn: markQuotationNotificationRead,
    onSuccess: async () => queryClient.invalidateQueries({ queryKey }),
    onError: (error) => toast.error("Could not mark notification as read", { description: error instanceof Error ? error.message : "Please try again." }),
  });

  useEffect(() => {
    const refresh = () => { void queryClient.invalidateQueries({ queryKey }); };
    const outside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("quotation-notifications:refresh", refresh);
    document.addEventListener("mousedown", outside);
    return () => {
      window.removeEventListener("quotation-notifications:refresh", refresh);
      document.removeEventListener("mousedown", outside);
    };
  }, [queryClient]);

  const result = notificationsQuery.data;
  const notifications = result?.notifications ?? [];
  const unreadCount = result?.unreadCount ?? notifications.filter((item) => !item.readAt).length;
  const isExporter = user?.role === "EXPORTER";
  const knownNotificationIds = useRef<Set<string> | null>(null);

  useEffect(() => {
    if (!result) return;
    const incoming = result.notifications ?? [];
    if (knownNotificationIds.current === null) {
      // Establish a baseline so opening the page does not toast every old unread item.
      knownNotificationIds.current = new Set(incoming.map((item) => item.id));
      return;
    }
    const known = knownNotificationIds.current;
    const fresh = incoming.filter((item) => !known.has(item.id) && !item.readAt);
    for (const item of fresh.slice(0, 3)) {
      if (variant === "panel" && isExporter) {
        toast.info(item.title, { description: item.message, duration: 9000 });
      }
    }
    for (const item of incoming) known.add(item.id);
  }, [result, variant, isExporter]);

  const destination = (notification: QuotationNotification) => {
    if (isExporter) return notification.submissionId ? `/exporter/quotations/${encodeURIComponent(notification.submissionId)}` : "/exporter/quotations";
    return notification.submissionId ? `/quotations/review/${encodeURIComponent(notification.submissionId)}` : "/quotations/review";
  };

  const openNotification = async (notification: QuotationNotification) => {
    try {
      if (!notification.readAt) await readMutation.mutateAsync(notification.id);
      setOpen(false);
      navigate(destination(notification));
    } catch {
      // The unread item stays red when the read acknowledgement fails.
    }
  };

  const list = notifications.slice(0, limit);
  const panel = (
    <div className={variant === "bell" ? "absolute right-0 top-full z-[90] mt-3 w-[min(94vw,420px)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15" : "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"}>
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-white to-rose-50/70 px-4 py-4 sm:px-5">
        <div className="min-w-0"><div className="flex items-center gap-2"><span className="flex size-9 items-center justify-center rounded-xl bg-rose-100 text-rose-700"><Bell size={17} /></span><h2 className="text-sm font-extrabold text-slate-900">Notifications</h2>{unreadCount > 0 && <span className="rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-extrabold text-white">{unreadCount > 99 ? "99+" : unreadCount} unread</span>}</div><p className="mt-1 text-xs leading-5 text-slate-500">Quotation requests, updates, charges and adjustments.</p></div>
        {variant === "bell" && <button type="button" onClick={() => setOpen(false)} className="rounded-lg px-2 py-1 text-xs font-bold text-slate-500 hover:bg-slate-100">Close</button>}
      </div>
      <div className="max-h-[min(68vh,560px)] space-y-2 overflow-y-auto p-3 sm:p-4">
        {notificationsQuery.isPending ? <div className="flex items-center justify-center gap-2 px-4 py-8 text-sm text-slate-500"><LoaderCircle size={17} className="animate-spin" /> Loading notifications…</div>
        : notificationsQuery.isError ? <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">Notifications could not be loaded. Refresh the page and try again.</div>
        : list.length === 0 ? <div className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center"><Bell size={22} className="mx-auto text-slate-300" /><p className="mt-2 text-sm font-bold text-slate-700">You're all caught up</p><p className="mt-1 text-xs text-slate-500">New quotation activity will appear here.</p></div>
        : list.map((notification) => {
          const unread = !notification.readAt;
          return <article key={notification.id} className={`rounded-xl border p-3 transition-colors ${unread ? "border-rose-300 bg-rose-50/80 shadow-sm shadow-rose-950/5" : "border-slate-200 bg-white"}`}>
            <button type="button" onClick={() => void openNotification(notification)} className="block w-full text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-500/15 rounded-lg">
              <div className="flex items-start gap-2.5"><span className={`mt-1 shrink-0 ${unread ? "text-rose-600" : "text-slate-300"}`}>{unread ? <Circle size={10} fill="currentColor" /> : <Check size={14} />}</span><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><p className={`break-words text-sm ${unread ? "font-extrabold text-rose-950" : "font-semibold text-slate-800"}`}>{notification.title}</p>{unread && <span className="shrink-0 rounded-full bg-rose-600 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-white">New</span>}</div><p className={`mt-1 whitespace-pre-wrap break-words text-xs leading-5 ${unread ? "text-rose-900/90" : "text-slate-600"}`}>{notification.message}</p><time className="mt-2 block text-[10px] font-medium text-slate-500">{formatDate(notification.createdAt)}</time></div></div>
            </button>
            <div className="mt-2 flex justify-end"><button type="button" disabled={!unread || readMutation.isPending} onClick={() => readMutation.mutate(notification.id)} className={`inline-flex min-h-8 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-extrabold transition disabled:cursor-default disabled:opacity-50 ${unread ? "bg-rose-600 text-white hover:bg-rose-700" : "text-slate-400"}`}>{readMutation.isPending ? <LoaderCircle size={12} className="animate-spin" /> : <Check size={12} />}{unread ? "Mark as read" : "Read"}</button></div>
          </article>;
        })}
      </div>
      {notifications.length > limit && <div className="border-t border-slate-100 px-4 py-3 text-center text-xs text-slate-500">Showing {limit} of {notifications.length} notifications.</div>}
      {variant === "panel" && <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-3 text-xs leading-5 text-slate-500"><ShieldAlert className="mr-1 inline" size={13} />Unread notifications remain highlighted in red until you mark them as read or open them.</div>}
    </div>
  );

  if (variant === "panel") return <section className="w-full">{panel}</section>;
  return <div ref={rootRef} className="relative">
    <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={unreadCount ? `${unreadCount} unread quotation notifications` : "Open quotation notifications"} title="Quotation notifications" className={`relative inline-flex size-11 items-center justify-center rounded-xl border transition focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-500/15 ${unreadCount ? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100" : "border-transparent text-slate-600 hover:bg-emerald-50 hover:text-emerald-800"}`}>
      <Bell size={21} />{unreadCount > 0 && <><span className="absolute right-2 top-2 size-2 rounded-full bg-rose-600 ring-2 ring-white" /><span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-extrabold text-white shadow">{unreadCount > 99 ? "99+" : unreadCount}</span></>}
    </button>
    {open && panel}
  </div>;
}
