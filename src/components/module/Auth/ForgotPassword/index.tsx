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
    <div className="min-h-screen bg-[#0b0b0d] text-white flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row w-full max-w-7xl items-center justify-center gap-8 lg:gap-12 xl:gap-16">
        {/* Left Image Banner */}
        <div className="hidden md:flex flex-1 relative border border-white/[0.08] bg-[#121216] p-2 rounded-xs overflow-hidden min-h-[450px] lg:min-h-[580px] max-h-[85vh] group">
          <div className="relative w-full h-full min-h-[440px] lg:min-h-[560px] overflow-hidden rounded-xs bg-zinc-900">
            <Image
              src="/images/fgp.jpg"
              alt="Forgot Password"
              fill
              className="object-cover contrast-110 grayscale-[30%] group-hover:grayscale-0 transition-all duration-700"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-zinc-300">
              <span className="mono-label text-[11px] text-white font-bold">
                ACCOUNT RECOVERY • TERMINAL
              </span>
              <span className="text-[#22c55e] font-mono font-bold text-[11px]">
                SECURE OTP
              </span>
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="w-full max-w-xl mx-auto bg-[#0e0e12] border border-white/[0.08] p-6 sm:p-8 md:p-10 shadow-2xl rounded-xs">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/[0.06] text-xs font-mono">
            <span className="mono-label text-zinc-400">
              AUTH • RECOVERY PROTOCOL
            </span>
            <span className="text-[#22c55e] font-bold text-[11px]">
              IDENTITY VERIFICATION
            </span>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Password Recovery
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 font-sans">
              Enter your verified email address to receive an authentication code.
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
                placeholder="you@domain.com"
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 text-xs sm:text-sm font-mono uppercase tracking-wider font-black !text-black bg-[#22c55e] hover:bg-[#16a34a] transition-all rounded-xs shadow-lg shadow-[#22c55e]/20 cursor-pointer"
                >
                  {isLoading ? <Spinner /> : "Dispatch Verification OTP"}
                </Button>
              </div>
            </form>
          </FormProvider>

          <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400 font-sans">
            <span>Remembered credentials?</span>
            <Link
              href="/login"
              className="text-[#22c55e] font-bold hover:underline font-mono uppercase tracking-wider"
            >
              Return to Login →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
