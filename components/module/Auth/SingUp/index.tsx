/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import PHInput from "@/components/form/NRInput";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useRegisterMutation } from "@/redux/api/authApi";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
    phoneNumber: z.string().optional(),
    dateOfBirth: z.string().optional(),
    skillLevel: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    agreedToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegistrationForm() {
  const router = useRouter();

  const [registerUser, { isLoading }] = useRegisterMutation() as any;

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      dateOfBirth: "",
      skillLevel: "",
      password: "",
      confirmPassword: "",
      agreedToTerms: false,
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    const payload: any = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    };

    if (data.skillLevel) payload.skillLevel = data.skillLevel;
    if (data.dateOfBirth) payload.dateOfBirth = data.dateOfBirth;
    if (data.phoneNumber) payload.phoneNumber = data.phoneNumber;

    const formData = new FormData();
    formData.append("data", JSON.stringify(payload));

    try {
      const res = await registerUser(formData).unwrap();

      if (res.success) {
        toast.success(res.message || "Registration successful");
        form.reset();
        router.push("/login");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row w-full max-w-7xl items-center justify-center gap-8 lg:gap-16 xl:gap-24">
        {/* Left Image Banner */}
        <div className="hidden md:flex flex-1 items-center justify-center rounded-xs overflow-hidden min-h-[450px] lg:min-h-[600px] max-h-[85vh]">
          <Image
            src="/images/rgp.jpg"
            alt="Registration"
            className="w-full h-full object-cover rounded-xs"
            width={1000}
            height={1000}
            priority
          />
        </div>

        {/* Right Form Card */}
        <div className="w-full max-w-xl mx-auto bg-white p-6 sm:p-8 md:p-10 shadow-lg rounded-xs">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
              Create your account
            </h1>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm md:text-base text-gray-600">
              Sign up to get started
            </p>
          </div>

          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 sm:space-y-5"
            >
              {/* First Name & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PHInput
                  control={form.control}
                  name="firstName"
                  label="First Name"
                  placeholder="John"
                />

                <PHInput
                  control={form.control}
                  name="lastName"
                  label="Last Name"
                  placeholder="Doe"
                />
              </div>

              {/* Email Address */}
              <PHInput
                control={form.control}
                name="email"
                label="Email Address"
                type="email"
                placeholder="you@example.com"
              />

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PHInput
                  control={form.control}
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="Enter password"
                />

                <PHInput
                  control={form.control}
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm password"
                />
              </div>

              {/* Terms and Conditions */}
              <div>
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <input
                    type="checkbox"
                    id="agreedToTerms"
                    {...form.register("agreedToTerms")}
                    className="mt-1 w-4 h-4 text-primary border-gray-300 rounded-xs focus:ring-primary cursor-pointer accent-primary"
                  />
                  <label
                    htmlFor="agreedToTerms"
                    className="text-xs sm:text-sm text-gray-600 leading-relaxed cursor-pointer"
                  >
                    I agree to the{" "}
                    <Link
                      href="/terms-privacy"
                      className="text-primary hover:underline font-medium"
                    >
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/terms-privacy"
                      className="text-primary hover:underline font-medium"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {form.formState.errors.agreedToTerms?.message && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {form.formState.errors.agreedToTerms.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-1">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-5 sm:py-6 font-semibold rounded-xs text-sm sm:text-base transition-colors"
                >
                  {isLoading ? <Spinner /> : "Sign Up"}
                </Button>
              </div>

              <p className="mt-6 text-center text-xs sm:text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-gray-900 font-semibold hover:underline"
                >
                  Log in
                </Link>
              </p>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
