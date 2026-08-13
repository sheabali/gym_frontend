/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import PHInput from "@/components/form/NRInput";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useLoginMutation } from "@/redux/api/authApi";
import { setUser } from "@/redux/features/authSlice";
import { useAppDispatch } from "@/redux/hooks";

import { setCookie } from "@/src/utils/cookies";
import { zodResolver } from "@hookform/resolvers/zod";
import { jwtDecode, JwtPayload } from "jwt-decode";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

type LoginFormValues = {
  email: string;
  password: string;
};

interface CustomJwtPayload extends JwtPayload {
  role: string;
}

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation() as any;

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await login(data).unwrap();

      if (res.success) {
        const token = res.data.token;

        setCookie(token);

        const user = jwtDecode<CustomJwtPayload>(token);

        dispatch(setUser({ token, user }));

        toast.success(res.message || "Login successful!");

        if (user?.role === "ADMIN") {
          router.push("/admin/dashboard");
        } else {
          router.push("/");
        }
      } else {
        toast.error(res.message || "Login failed");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row w-full max-w-7xl items-center justify-center gap-8 lg:gap-16 xl:gap-24">
        {/* Left Image Banner */}
        <div className="hidden md:flex flex-1 items-center justify-center rounded-xs overflow-hidden min-h-[450px] lg:min-h-[600px] max-h-[85vh]">
          <Image
            src="/images/lip.jpg"
            alt="Logo"
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
              Welcome Back
            </h1>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm md:text-base text-gray-600">
              Sign in to your account
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
                label="Email"
                type="email"
                placeholder="Enter your email"
              />

              <PHInput
                control={form.control}
                name="password"
                label="Password"
                type="password"
                placeholder="Enter your password"
              />

              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-xs sm:text-sm text-primary hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="pt-1">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-5 sm:py-6 font-semibold rounded-xs text-sm sm:text-base transition-colors"
                >
                  {isLoading ? <Spinner /> : "Sign In"}
                </Button>
              </div>
            </form>
          </FormProvider>

          <p className="mt-6 text-center text-xs sm:text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-gray-900 font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
