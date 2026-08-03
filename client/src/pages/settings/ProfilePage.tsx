import {
  Loader2,
} from "lucide-react";

import {
  toast,
} from "sonner";

import ProfileForm from "../../components/profile/ProfileForm";

import ChangePasswordForm from "../../components/profile/ChangePasswordForm";

import {
  useProfile,
} from "../../hooks/user/useProfile";

import {
  useUpdateProfile,
} from "../../hooks/user/useUpdateProfile";

import {
  useChangePassword,
} from "../../hooks/user/useChangePassword";

export default function ProfilePage() {

  const {
    data,
    isLoading,
  } = useProfile();

  const updateProfile =
    useUpdateProfile();

  const changePassword =
    useChangePassword();

  if (isLoading) {

    return (

      <div className="flex justify-center py-20">

        <Loader2 className="h-8 w-8 animate-spin" />

      </div>

    );

  }
  console.log(data);

 const profile = data?.data;

if (!profile) {
  return (
    <div className="text-center py-10">
      Profile not found.
    </div>
  );
}

  return (

  <div className="space-y-8 bg-slate-50 min-h-screen p-6">

      <div>

        <h1 className="text-3xl font-bold">

          Profile Settings

        </h1>

        <p className="text-muted-foreground">

          Manage your account information.

        </p>

      </div>

    <ProfileForm
  defaultValues={{
    name: profile.name,
    phone: profile.phone,
    department: profile.department,
    jobTitle: profile.jobTitle,
    avatar: profile.avatar,
  }}
  email={profile.email}
  role={profile.role}
  loading={updateProfile.isPending}
  onSubmit={(values) => updateProfile.mutate(values)}
/>

      <ChangePasswordForm

        loading={
          changePassword.isPending
        }

        onSubmit={(values) =>

          changePassword.mutate(values, {

            onSuccess() {

              toast.success(

                "Password updated."

              );

            },

          })

        }

      />

    </div>

  );

}