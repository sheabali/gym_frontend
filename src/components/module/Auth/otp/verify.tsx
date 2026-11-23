/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Spinner } from "@/components/ui/spinner";
import {
  useResendOtpMutation,
  useVerifyOtpMutation,
} from "@/redux/api/authApi";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const otpSchema = z.object({
  otp: z
    .array(
      z
        .string()
        .length(1, "Each digit must be 1 character")
        .regex(/^\d$/, "Must be a number")
    )
    .length(4, "Must be 4 digits"),
});

type OtpFormData = z.infer<typeof otpSchema>;

export default function OtpVerify() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [reSendOtp, { isLoading: isResendingOtp }] =
    useResendOtpMutation() as any;
  const [verifiedOtp, { isLoading: isVerifyingOtp }] =
    useVerifyOtpMutation() as any;

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otpValues, setOtpValues] = useState<string[]>(Array(4).fill(""));

  // 60-second Cooldown timer for resend
  const [cooldown, setCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: Array(4).fill(""),
    },
  });

  // Redirect or guard if email param is missing
  useEffect(() => {
    if (!email) {
      toast.error("Please enter your email to receive an OTP code.");
      router.replace("/forgot-password");
      return;
    }
    inputRefs.current[0]?.focus();
  }, [email, router]);

  const handleResendOtp = async () => {
    if (!email) {
      toast.error("Email not found. Please try again.");
      router.push("/forgot-password");
      return;
    }

    if (!canResend || isResendingOtp) return;

    try {
      const res = (await reSendOtp({ email: email }).unwrap()) as any;
      if (res?.success) {
        toast.success(res.message || "A new OTP code has been sent!");
        setCooldown(60);
        setCanResend(false);
        setOtpValues(Array(4).fill(""));
        setValue("otp", Array(4).fill(""));
        inputRefs.current[0]?.focus();
      } else {
        toast.error(res?.message || "Failed to resend OTP");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong. Please try again.");
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    const digits = pastedData.replace(/\D/g, "").slice(0, 4).split("");

    if (digits.length > 0) {
      const newOtpValues = [...otpValues];
      digits.forEach((digit, i) => {
        newOtpValues[i] = digit;
        setValue(`otp.${i}`, digit);
      });
      setOtpValues(newOtpValues);
      trigger("otp");

      const nextFocusIndex = Math.min(digits.length, 3);
      inputRefs.current[nextFocusIndex]?.focus();
    }
  };

  const handleChange = (index: number, value: string) => {
    const cleanedValue = value.replace(/\D/g, "");

    if (cleanedValue.length > 1) {
      const digits = cleanedValue.slice(0, 4 - index).split("");
      const newOtpValues = [...otpValues];

      digits.forEach((digit, i) => {
        if (index + i < 4) {
          newOtpValues[index + i] = digit;
          setValue(`otp.${index + i}`, digit);
        }
      });

      setOtpValues(newOtpValues);
      const nextIndex = Math.min(index + digits.length, 3);
      inputRefs.current[nextIndex]?.focus();
    } else if (cleanedValue.length === 1) {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = cleanedValue;
      setOtpValues(newOtpValues);
      setValue(`otp.${index}`, cleanedValue);

      if (index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    } else if (value === "") {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = "";
      setOtpValues(newOtpValues);
      setValue(`otp.${index}`, "");
    }

    trigger("otp");
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      if (!otpValues[index] && index > 0) {
        const newOtpValues = [...otpValues];
        newOtpValues[index - 1] = "";
        setOtpValues(newOtpValues);
        setValue(`otp.${index - 1}`, "");
        inputRefs.current[index - 1]?.focus();
        trigger("otp");
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const onSubmit = async (data: OtpFormData) => {
    if (!email) {
      toast.error("Email not found");
      return;
    }

    const payload = {
      email: email,
      otp: Number(data.otp.join("")),
    };

    try {
      const res = (await verifiedOtp(payload).unwrap()) as any;
      if (res?.success) {
        toast.success(res.message || "OTP verified successfully!");
        router.push("/");
      } else {
        toast.error(res?.message || "Failed to verify OTP");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Invalid OTP code. Please try again.");
    }
  };

  const isOtpComplete = otpValues.every((val) => val.trim().length === 1);

  return (
    <div className="w-full flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
        className="relative z-10 w-full max-w-md mx-auto"
      >
        <div className="bg-white p-4 sm:p-6 md:p-8 w-full">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold text-gray-900 mb-2 tracking-tight">
              Enter Code
            </h1>
            <p className="text-gray-600 text-sm sm:text-base lg:text-[18px] break-words">
              We’ve sent a code to{" "}
              <span className="font-semibold text-gray-900 break-all">
                {email || "your email"}
              </span>
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 sm:space-y-6"
          >
            <div>
              <div className="flex justify-between gap-2 sm:gap-3 md:gap-4">
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="flex-1 flex justify-center">
                    <input
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      autoComplete={index === 0 ? "one-time-code" : "off"}
                      maxLength={1}
                      value={otpValues[index]}
                      onPaste={handlePaste}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-full max-w-[68px] aspect-square text-center text-lg sm:text-xl md:text-2xl font-semibold border rounded-xs focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all border-gray-300 bg-white"
                      aria-label={`Digit ${index + 1} of OTP`}
                    />
                  </div>
                ))}
              </div>
              {errors.otp && (
                <p className="mt-2 text-xs sm:text-sm text-red-600 text-center font-medium">
                  Please enter a valid 4-digit code
                </p>
              )}
            </div>

            <div className="text-xs sm:text-sm md:text-base text-gray-600 text-center">
              Didn’t get a code?{" "}
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isResendingOtp}
                  className="text-primary font-semibold hover:underline cursor-pointer focus:outline-none transition-colors"
                >
                  {isResendingOtp ? "Resending..." : "Click to resend"}
                </button>
              ) : (
                <span className="text-gray-500 font-medium">
                  Resend in{" "}
                  <span className="text-gray-800 font-semibold">{cooldown}s</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 sm:gap-4 pt-2">
              <motion.button
                type="submit"
                disabled={isVerifyingOtp || !isOtpComplete}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer flex-1 bg-primary disabled:bg-primary/60 text-white font-medium py-3 px-4 rounded-xs transition-colors duration-200 flex items-center justify-center text-sm sm:text-base h-11 sm:h-12"
              >
                {isVerifyingOtp ? <Spinner /> : "Verify OTP"}
              </motion.button>

              <Link href="/forgot-password" className="flex-1">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="cursor-pointer w-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xs transition-colors duration-200 flex items-center justify-center text-sm sm:text-base h-11 sm:h-12"
                >
                  Cancel
                </motion.button>
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
