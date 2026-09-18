import { useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Search,
  ShieldCheck,
  UserCheck,
  UserCog,
  UserX,
  Users as UsersIcon,
  XCircle,
} from "lucide-react";

import type { ManagedUser } from "../../api/user.api";
import UserManagementDialog from "../../components/user/UserManagementDialog";
import { useUpdateUserStatus, useUsers } from "../../hooks/user/useUsers";


type StatusFilter = "ALL" | "ACTIVE" | "INACTIVE";
type RoleFilter =
  | "ALL"
  | "ADMIN"
  | "STAFF"
  | "OFFICER"
  | "VIEWER";

export default function UsersPage() {
  const {
    data: users = [],
    isLoading,
    isError,
    refetch,
  } = useUsers();

  const updateStatus = useUpdateUserStatus();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] =
    useState<RoleFilter>("ALL");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");

  const [selectedUser, setSelectedUser] =
    useState<ManagedUser | null>(null);

  const filteredUsers = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !searchValue ||
        user.name
          .toLowerCase()
          .includes(searchValue) ||
        user.email
          .toLowerCase()
          .includes(searchValue);

      const matchesRole =
        roleFilter === "ALL" ||
        user.role === roleFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" &&
          user.isActive) ||
        (statusFilter === "INACTIVE" &&
          !user.isActive);

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [
    users,
    search,
    roleFilter,
    statusFilter,
  ]);

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => user.isActive
  ).length;

  const inactiveUsers = users.filter(
    (user) => !user.isActive
  ).length;

  const adminUsers = users.filter(
    (user) => user.role === "ADMIN"
  ).length;

  const handleStatusChange = (
    user: ManagedUser
  ) => {
    updateStatus.mutate({
      userId: user.id,
      isActive: !user.isActive,
    });
  };

  const clearFilters = () => {
    setSearch("");
    setRoleFilter("ALL");
    setStatusFilter("ALL");
  };

  const hasFilters =
    search.trim() !== "" ||
    roleFilter !== "ALL" ||
    statusFilter !== "ALL";

  if (isLoading) {
    return <UsersPageSkeleton />;
  }

  if (isError) {
    return (
      <div className="min-h-full">
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-[520px] items-center justify-center">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
                <XCircle size={28} />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-slate-900">
                Unable to load users
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                We couldn't retrieve the user list.
                Please check your connection and try
                again.
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="mt-6 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-50/40">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Page Header */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <UsersIcon size={24} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  User Management
                </h1>

                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                  {totalUsers}{" "}
                  {totalUsers === 1
                    ? "user"
                    : "users"}
                </span>
              </div>

              <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
                Manage registered users, account
                access, roles, status, and system
                permissions.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Users"
            value={totalUsers}
            description="Registered accounts"
            icon={<UsersIcon size={20} />}
            iconClass="bg-slate-100 text-slate-700"
          />

          <StatCard
            title="Active Users"
            value={activeUsers}
            description="Currently enabled"
            icon={<UserCheck size={20} />}
            iconClass="bg-emerald-100 text-emerald-700"
          />

          <StatCard
            title="Inactive Users"
            value={inactiveUsers}
            description="Currently disabled"
            icon={<UserX size={20} />}
            iconClass="bg-red-100 text-red-700"
          />

          <StatCard
            title="Administrators"
            value={adminUsers}
            description="Full system access"
            icon={<ShieldCheck size={20} />}
            iconClass="bg-blue-100 text-blue-700"
          />
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center">
            
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search by name or email..."
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  pl-10
                  pr-4
                  text-sm
                  text-slate-900
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-emerald-500
                  focus:bg-white
                  focus:ring-4
                  focus:ring-emerald-500/10
                "
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <FilterSelect
                value={roleFilter}
                onChange={(value) =>
                  setRoleFilter(
                    value as RoleFilter
                  )
                }
                options={[
                  {
                    value: "ALL",
                    label: "All Roles",
                  },
                  {
                    value: "ADMIN",
                    label: "Admin",
                  },
                  {
                    value: "STAFF",
                    label: "Staff",
                  },
                  {
                    value: "OFFICER",
                    label: "Officer",
                  },
                  {
                    value: "VIEWER",
                    label: "Viewer",
                  },
                ]}
              />

              <FilterSelect
                value={statusFilter}
                onChange={(value) =>
                  setStatusFilter(
                    value as StatusFilter
                  )
                }
                options={[
                  {
                    value: "ALL",
                    label: "All Status",
                  },
                  {
                    value: "ACTIVE",
                    label: "Active",
                  },
                  {
                    value: "INACTIVE",
                    label: "Inactive",
                  },
                ]}
              />

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  <XCircle size={16} />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Filter summary */}
          <div className="border-t border-slate-100 px-4 py-3">
            <p className="text-xs text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {filteredUsers.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {totalUsers}
              </span>{" "}
              users
            </p>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Desktop Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    User
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Role
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Permissions
                  </th>

                  <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    onManage={() =>
                      setSelectedUser(user)
                    }
                    onToggleStatus={() =>
                      handleStatusChange(user)
                    }
                    isUpdatingStatus={
                      updateStatus.isPending &&
                      updateStatus.variables
                        ?.userId === user.id
                    }
                  />
                ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-16"
                    >
                      <EmptyState
                        hasFilters={hasFilters}
                        onClear={clearFilters}
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom info */}
        <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <ShieldCheck
              size={17}
              className="text-emerald-600"
            />

            <span>
              Permissions are enforced at the
              server level.
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Changes take effect on subsequent
            requests.
          </p>
        </div>
      </div>

      {/* User Management Modal */}
      {selectedUser && (
        <UserManagementDialog
          user={selectedUser}
          onClose={() =>
            setSelectedUser(null)
          }
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Stat Card                                                                  */
/* -------------------------------------------------------------------------- */

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  iconClass: string;
}

function StatCard({
  title,
  value,
  description,
  icon,
  iconClass,
}: StatCardProps) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-slate-500">
          {title}
        </p>

        <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          {value}
        </p>

        <p className="mt-1 text-xs text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Filter Select                                                              */
/* -------------------------------------------------------------------------- */

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: {
    value: string;
    label: string;
  }[];
}

function FilterSelect({
  value,
  onChange,
  options,
}: FilterSelectProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="
          h-11
          min-w-[150px]
          appearance-none
          rounded-xl
          border
          border-slate-200
          bg-white
          pl-4
          pr-10
          text-sm
          font-medium
          text-slate-700
          outline-none
          transition
          hover:border-slate-300
          focus:border-emerald-500
          focus:ring-4
          focus:ring-emerald-500/10
        "
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* User Row                                                                   */
/* -------------------------------------------------------------------------- */

interface UserRowProps {
  user: ManagedUser;
  onManage: () => void;
  onToggleStatus: () => void;
  isUpdatingStatus: boolean;
}

function UserRow({
  user,
  onManage,
  onToggleStatus,
  isUpdatingStatus,
}: UserRowProps) {
  return (
    <tr className="group transition hover:bg-slate-50/70">

      {/* User */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <UserAvatar name={user.name} />

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">
              {user.name}
            </p>

            <p className="truncate text-sm text-slate-500">
              {user.email}
            </p>
          </div>
        </div>
      </td>

      {/* Role */}
      <td className="px-6 py-4">
        <RoleBadge role={user.role} />
      </td>

      {/* Permissions */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            <ShieldCheck size={16} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              {user.permissions?.length ?? 0}
            </p>

            <p className="text-xs text-slate-400">
              assigned
            </p>
          </div>
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <button
          type="button"
          onClick={onToggleStatus}
          disabled={isUpdatingStatus}
          title={
            user.isActive
              ? "Click to deactivate user"
              : "Click to activate user"
          }
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
            user.isActive
              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              : "bg-red-50 text-red-700 hover:bg-red-100"
          }`}
        >
          {user.isActive ? (
            <CheckCircle2 size={14} />
          ) : (
            <XCircle size={14} />
          )}

          {isUpdatingStatus
            ? "Updating..."
            : user.isActive
            ? "Active"
            : "Inactive"}
        </button>
      </td>

      {/* Action */}
      <td className="px-6 py-4 text-right">
        <button
          type="button"
          onClick={onManage}
          className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            border
            border-slate-200
            bg-white
            px-3.5
            py-2
            text-sm
            font-semibold
            text-slate-700
            shadow-sm
            transition
            hover:border-emerald-200
            hover:bg-emerald-50
            hover:text-emerald-700
          "
        >
          <UserCog size={16} />
          Manage
        </button>
      </td>
    </tr>
  );
}

/* -------------------------------------------------------------------------- */
/* Avatar                                                                     */
/* -------------------------------------------------------------------------- */

function UserAvatar({
  name,
}: {
  name: string;
}) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0).toUpperCase()
    )
    .join("");

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 text-sm font-bold text-emerald-700 ring-4 ring-white">
      {initials || "U"}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Role Badge                                                                 */
/* -------------------------------------------------------------------------- */

function RoleBadge({
  role,
}: {
  role: string;
}) {
  const styles: Record<
    string,
    string
  > = {
    ADMIN:
      "bg-purple-50 text-purple-700 border-purple-100",
    STAFF:
      "bg-blue-50 text-blue-700 border-blue-100",
    OFFICER:
      "bg-amber-50 text-amber-700 border-amber-100",
    VIEWER:
      "bg-slate-100 text-slate-600 border-slate-200",
  };

  const labels: Record<
    string,
    string
  > = {
    ADMIN: "Admin",
    STAFF: "Staff",
    OFFICER: "Officer",
    VIEWER: "Viewer",
  };

  return (
    <span
      className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-semibold ${
        styles[role] ??
        "border-slate-200 bg-slate-100 text-slate-600"
      }`}
    >
      {labels[role] ?? role}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty State                                                                */
/* -------------------------------------------------------------------------- */

function EmptyState({
  hasFilters,
  onClear,
}: {
  hasFilters: boolean;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <UsersIcon size={26} />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-900">
        No users found
      </h3>

      <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
        {hasFilters
          ? "No users match your current search and filters."
          : "There are currently no registered users."}
      </p>

      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="mt-4 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Loading Skeleton                                                           */
/* -------------------------------------------------------------------------- */

function UsersPageSkeleton() {
  return (
    <div className="min-h-full bg-slate-50/40">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 animate-pulse rounded-2xl bg-slate-200" />

          <div className="space-y-2">
            <div className="h-7 w-52 animate-pulse rounded-lg bg-slate-200" />
            <div className="h-4 w-80 animate-pulse rounded bg-slate-200" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white"
              />
            )
          )}
        </div>

        {/* Filters */}
        <div className="h-20 animate-pulse rounded-2xl border border-slate-200 bg-white" />

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="h-14 animate-pulse bg-slate-100" />

          <div className="divide-y divide-slate-100">
            {Array.from({ length: 5 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-20 animate-pulse bg-white"
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}