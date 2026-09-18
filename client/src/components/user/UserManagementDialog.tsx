import { useEffect, useState } from "react";
import {
  Check,
  Shield,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";
import type { ManagedUser } from "../../api/user.api";
import { useUpdateUserPermissions, useUpdateUserRole, useUpdateUserStatus } from "../../hooks/user/useUsers";
import { permissionGroups } from "../../config/permission-groups";


interface UserManagementDialogProps {
  user: ManagedUser;
  onClose: () => void;
}

const roles = [
  "ADMIN",
  "STAFF",
  "OFFICER",
  "VIEWER",
];

export default function UserManagementDialog({
  user,
  onClose,
}: UserManagementDialogProps) {
  const [role, setRole] = useState(user.role);

  const [isActive, setIsActive] =
    useState(user.isActive);

  const [permissions, setPermissions] =
    useState<string[]>(
      user.permissions ?? []
    );

  const updatePermissions =
    useUpdateUserPermissions();

  const updateRole =
    useUpdateUserRole();

  const updateStatus =
    useUpdateUserStatus();

  useEffect(() => {
    setRole(user.role);
    setIsActive(user.isActive);
    setPermissions(user.permissions ?? []);
  }, [user]);

  const togglePermission = (
    permission: string
  ) => {
    setPermissions((current) =>
      current.includes(permission)
        ? current.filter(
            (item) => item !== permission
          )
        : [...current, permission]
    );
  };

  const selectAll = () => {
    const allPermissions =
      permissionGroups.flatMap((group) =>
        group.permissions.map(
          (permission) => permission.key
        )
      );

    setPermissions(allPermissions);
  };

  const clearAll = () => {
    setPermissions([]);
  };

  const handleSave = async () => {
    try {
      if (role !== user.role) {
        await updateRole.mutateAsync({
          userId: user.id,
          role,
        });
      }

      if (isActive !== user.isActive) {
        await updateStatus.mutateAsync({
          userId: user.id,
          isActive,
        });
      }

      await updatePermissions.mutateAsync({
        userId: user.id,
        permissions,
      });

      toast.success(
        "User settings updated successfully."
      );

      onClose();
    } catch {
      toast.error(
        "Unable to update user settings."
      );
    }
  };

  const isSaving =
    updateRole.isPending ||
    updateStatus.isPending ||
    updatePermissions.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <Shield size={22} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Manage User
              </h2>

              <p className="text-sm text-slate-500">
                {user.name} · {user.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        </div>

        {/* User settings */}
        <div className="grid gap-4 border-b bg-slate-50 px-6 py-5 md:grid-cols-2">

          {/* Role */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Role
            </label>

            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value)
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              {roles.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Account Status
            </label>

            <button
              type="button"
              onClick={() =>
                setIsActive(
                  (current) => !current
                )
              }
              className={`flex w-full items-center justify-between rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              <span>
                {isActive
                  ? "Active"
                  : "Inactive"}
              </span>

              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  isActive
                    ? "bg-emerald-500"
                    : "bg-red-500"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Permission toolbar */}
        <div className="flex flex-col justify-between gap-3 border-b px-6 py-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-semibold text-slate-800">
              Permissions
            </h3>

            <p className="text-sm text-slate-500">
              {permissions.length} permissions selected
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={selectAll}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Select All
            </button>

            <button
              type="button"
              onClick={clearAll}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Permissions */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-5">
            {permissionGroups.map(
              (group) => (
                <section
                  key={group.title}
                  className="overflow-hidden rounded-xl border border-slate-200"
                >
                  <div className="border-b bg-slate-50 px-4 py-3">
                    <h4 className="font-semibold text-slate-800">
                      {group.title}
                    </h4>
                  </div>

                  <div className="grid gap-0 divide-y md:grid-cols-2 md:divide-x md:divide-y-0">
                    {group.permissions.map(
                      (permission) => {
                        const checked =
                          permissions.includes(
                            permission.key
                          );

                        return (
                          <button
                            key={
                              permission.key
                            }
                            type="button"
                            onClick={() =>
                              togglePermission(
                                permission.key
                              )
                            }
                            className="flex items-center justify-between border-b px-4 py-4 text-left transition last:border-b-0 hover:bg-slate-50"
                          >
                            <div>
                              <p className="text-sm font-medium text-slate-800">
                                {
                                  permission.label
                                }
                              </p>

                              <p className="mt-1 text-xs text-slate-400">
                                {
                                  permission.key
                                }
                              </p>
                            </div>

                            <span
                              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${
                                checked
                                  ? "border-emerald-600 bg-emerald-600 text-white"
                                  : "border-slate-300 bg-white"
                              }`}
                            >
                              {checked && (
                                <Check
                                  size={15}
                                />
                              )}
                            </span>
                          </button>
                        );
                      }
                    )}
                  </div>
                </section>
              )
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}