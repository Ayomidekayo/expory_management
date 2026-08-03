import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

import {
  updateProfileSchema,
  type UpdateProfileInput,
} from "../../validations/profile.validation";

interface Props {
  defaultValues?: Partial<UpdateProfileInput>;

  email?: string;

  role?: string;

  loading?: boolean;

  onSubmit: (
    values: UpdateProfileInput
  ) => void;
}

export default function ProfileForm({
  defaultValues,
  email,
  role,
  loading = false,
  onSubmit,
}: Props) {
  const form =
    useForm<UpdateProfileInput>({
      resolver: zodResolver(
        updateProfileSchema
      ),

      defaultValues: {
        name: "",
        phone: "",
        department: "",
        jobTitle: "",
        avatar: "",
        ...defaultValues,
      },
    });

  useEffect(() => {
    if (!defaultValues) return;

    form.reset({
      name:
        defaultValues.name ?? "",

      phone:
        defaultValues.phone ?? "",

      department:
        defaultValues.department ??
        "",

      jobTitle:
        defaultValues.jobTitle ??
        "",

      avatar:
        defaultValues.avatar ?? "",
    });
  }, [defaultValues, form]);

  const initials =
    defaultValues?.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase() ?? "U";

  return (
    <Card className="overflow-hidden rounded-3xl border-0 shadow-xl">

      {/* ===========================
          Profile Header
      ============================ */}

      <div className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-500 p-8 text-white">

        <div className="flex flex-col gap-6 md:flex-row md:items-center">

          <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/20 bg-white/20 text-4xl font-bold shadow-lg backdrop-blur">

            {initials}

          </div>

          <div className="flex-1">

            <h2 className="text-3xl font-bold">

              {defaultValues?.name || "User"}

            </h2>

            <p className="mt-2 text-green-100">

              {email}

            </p>

            {role && (
              <span className="mt-4 inline-flex rounded-full bg-white/20 px-4 py-1 text-sm font-medium backdrop-blur">

                {role}

              </span>
            )}

          </div>

        </div>

      </div>

      {/* ===========================
          Card Header
      ============================ */}

      <CardHeader className="border-b bg-slate-50">

        <CardTitle className="text-2xl">

          Personal Information

        </CardTitle>

        <CardDescription>

          Update your profile information.

        </CardDescription>

      </CardHeader>

      {/* ===========================
          Form
      ============================ */}

      <CardContent className="p-8">

        <Form {...form}>

          <form
            onSubmit={form.handleSubmit(
              onSubmit
            )}
            className="space-y-8"
          >

            <div className="grid gap-6 md:grid-cols-2">

              {/* Name */}

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>

                    <FormLabel>

                      Full Name

                    </FormLabel>

                    <FormControl>

                      <Input
                        {...field}
                        placeholder="Enter your full name"
                        className="h-11 rounded-xl focus-visible:ring-green-600"
                      />

                    </FormControl>

                    <FormMessage />

                  </FormItem>
                )}
              />

              {/* Email */}

              <FormItem>

                <FormLabel>

                  Email Address

                </FormLabel>

                <Input
                  value={email ?? ""}
                  disabled
                  className="h-11 rounded-xl bg-slate-100 text-slate-600"
                />

              </FormItem>

              {/* Phone */}

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>

                    <FormLabel>

                      Phone Number

                    </FormLabel>

                    <FormControl>

                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Enter phone number"
                        className="h-11 rounded-xl focus-visible:ring-green-600"
                      />

                    </FormControl>

                    <FormMessage />

                  </FormItem>
                )}
              />

              {/* Department */}

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>

                    <FormLabel>

                      Department

                    </FormLabel>

                    <FormControl>

                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Enter department"
                        className="h-11 rounded-xl focus-visible:ring-green-600"
                      />

                    </FormControl>

                    <FormMessage />

                  </FormItem>
                )}
              />

              {/* Job Title */}

              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">

                    <FormLabel>

                      Job Title

                    </FormLabel>

                    <FormControl>

                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Enter your job title"
                        className="h-11 rounded-xl focus-visible:ring-green-600"
                      />

                    </FormControl>

                    <FormMessage />

                  </FormItem>
                )}
              />

            </div>

            {/* Save Button */}

            <div className="flex justify-end">

              <Button
                type="submit"
                disabled={loading}
                className="min-w-44 rounded-xl bg-gradient-to-r from-green-700 to-emerald-600 py-6 text-base font-semibold hover:from-green-800 hover:to-emerald-700"
              >

                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}

              </Button>

            </div>

          </form>

        </Form>

      </CardContent>

    </Card>
  );
}