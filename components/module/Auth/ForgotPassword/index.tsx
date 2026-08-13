/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import PHInput from "@/components/form/NRInput";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useForgotPasswordMutation } from "@/redux/api/authApi";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation() as any;

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      const res = (await forgotPassword(data).unwrap()) as any;

      if (res?.success) {
        toast.success(res.message || "OTP sent successfully!");
        form.reset();
        router.push(`/forgot-password/otp?email=${encodeURIComponent(data.email)}`);
      } else {
        toast.error(res?.message || "Failed to send OTP");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row w-full max-w-7xl items-center justify-center gap-8 lg:gap-16 xl:gap-24">
        {/* Left Image Banner */}
        <div className="hidden md:flex flex-1 items-center justify-center rounded-xs overflow-hidden min-h-[450px] lg:min-h-[600px] max-h-[85vh]">
          <Image
            src="/images/fgp.jpg"
            alt="Forgot Password"
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
              Forgot Password?
            </h1>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm md:text-base text-gray-600">
              Enter your email to reset password
            </p>
          </div>

          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 sm:space-y-5"
            >
              <PHInput
                control={form.control}
                name="email"
                label="Email Address"
                type="email"
                placeholder="you@example.com"
              />

              <div className="pt-1">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-5 sm:py-6 font-semibold rounded-xs text-sm sm:text-base transition-colors"
                >
                  {isLoading ? <Spinner /> : "Send OTP"}
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
