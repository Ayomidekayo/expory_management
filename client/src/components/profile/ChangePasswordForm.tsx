import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
} from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { Input } from "../ui/input";
import { Button } from "../ui/button";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";

import {
  changePasswordSchema,
  type ChangePasswordInput,
} from "../../validations/profile.validation";

interface Props {
  loading?: boolean;

  onSubmit: (
    values: ChangePasswordInput
  ) => void;
}

const labels = {
  currentPassword: "Current Password",
  newPassword: "New Password",
  confirmPassword: "Confirm Password",
};

export default function ChangePasswordForm({
  loading = false,
  onSubmit,
}: Props) {
  const form =
    useForm<ChangePasswordInput>({
      resolver: zodResolver(
        changePasswordSchema
      ),
    });

  const [show, setShow] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  return (
    <Card className="overflow-hidden rounded-2xl border-0 shadow-lg">

      {/* Header */}

      <CardHeader className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-500 text-white">

        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">

            <Lock className="h-6 w-6" />

          </div>

          <div>

            <CardTitle className="text-2xl text-white">

              Security

            </CardTitle>

            <CardDescription className="text-green-100">

              Change your password to keep your account secure.

            </CardDescription>

          </div>

        </div>

      </CardHeader>

      <CardContent className="pt-8">

        <Form {...form}>

          <form
            onSubmit={form.handleSubmit(
              onSubmit
            )}
            className="space-y-6"
          >
            {(
              Object.keys(labels) as Array<
                keyof ChangePasswordInput
              >
            ).map((fieldName) => (
              <FormField
                key={fieldName}
                control={form.control}
                name={fieldName}
                render={({ field }) => (
                  <FormItem>

                    <FormLabel className="font-semibold text-slate-700">

                      {labels[fieldName]}

                    </FormLabel>

                    <FormControl>

                      <div className="relative">

                        <Input
                          {...field}
                          type={
                            show[fieldName]
                              ? "text"
                              : "password"
                          }
                          className="h-11 rounded-xl border-slate-300 pr-12 focus:border-green-600 focus:ring-green-600"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShow({
                              ...show,
                              [fieldName]:
                                !show[
                                  fieldName
                                ],
                            })
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-green-600"
                        >
                          {show[fieldName] ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>

                      </div>

                    </FormControl>

                    <FormMessage />

                  </FormItem>
                )}
              />
            ))}

            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-xl bg-gradient-to-r from-green-700 to-green-600 text-white shadow-md transition-all hover:from-green-800 hover:to-green-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Password...
                </>
              ) : (
                "Update Password"
              )}
            </Button>

          </form>

        </Form>

      </CardContent>

    </Card>
  );
}