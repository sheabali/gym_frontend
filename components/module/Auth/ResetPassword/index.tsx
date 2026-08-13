/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import PHInput from "@/components/form/NRInput";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useResetPasswordMutation } from "@/redux/api/authApi";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],  
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [resetPassword, { isLoading }] = useResetPasswordMutation() as any;

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!email) {
      toast.error("Session expired or email missing. Please try again.");
      router.replace("/forgot-password");
    }
  }, [email, router]);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!email) {
      toast.error("Email address is missing");
      router.push("/forgot-password");
      return;
    }

    const payload = {
      email: email,
      password: data.confirmPassword,
    };

    try {
      const res = (await resetPassword(payload).unwrap()) as any;

      if (res?.success) {
        toast.success(res.message || "Password reset successfully!");
        form.reset();
        router.push("/login");
      } else {
        toast.error(res?.message || "Failed to reset password");
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row w-full max-w-7xl items-center justify-center gap-8 lg:gap-16 xl:gap-24">
        {/* Left Image Banner */}
        <div className="hidden md:flex flex-1 items-center justify-center rounded-xs overflow-hidden min-h-[450px] lg:min-h-[600px] max-h-[85vh]">
          <Image
            src="/images/fgp.jpg"
            alt="Reset Password"
            width={800}
            height={800}
            className="w-full h-full object-cover rounded-xs"
            priority
          />
        </div>

        {/* Right Form Card */}
        <div className="w-full max-w-xl mx-auto bg-white p-6 sm:p-8 md:p-10 shadow-lg rounded-xs">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
              Reset Password
            </h1>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm md:text-base text-gray-600">
              Create a new password for your account
            </p>
          </div>

          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 sm:space-y-5"
            >
              <PHInput
                control={form.control}
                name="newPassword"
                label="New Password"
                type="password"
                placeholder="Enter new password"
              />

              <PHInput
                control={form.control}
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Re-enter new password"
              />

              <div className="pt-1">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-5 sm:py-6 font-semibold rounded-xs text-sm sm:text-base transition-colors"
                >
                  {isLoading ? <Spinner /> : "Reset Password"}
                </Button>
              </div>
            </form>
          </FormProvider>

          <p className="mt-6 text-center text-xs sm:text-sm text-gray-600">
            Remember your password?{" "}
            <Link
              href="/login"
              className="text-gray-900 font-semibold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
