"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { authService } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/common/Button";
import { FormInput } from "@/components/forms/FormInput";
import { FormProvider } from "react-hook-form";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const methods = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await authService.login(data);
      if (res.success && res.token) {
        // Fetch user details with the new token
        localStorage.setItem('token', res.token);
        const meRes = await authService.getMe();
        if (meRes.success) {
          login(res.token, meRes.data);
          toast.success("Welcome back!");
        } else {
          toast.error("Failed to retrieve user details.");
          localStorage.removeItem('token');
        }
      } else {
        toast.error("Invalid credentials.");
      }
    } catch (error: any) {
      toast.error(error?.error || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 overflow-hidden relative selection:bg-indigo-100 selection:text-indigo-900">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-200/50 blur-[120px] pointer-events-none mix-blend-multiply opacity-70 animate-blob" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/50 blur-[120px] pointer-events-none mix-blend-multiply opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-purple-200/50 blur-[120px] pointer-events-none mix-blend-multiply opacity-70 animate-blob animation-delay-4000" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-[420px] p-8 mx-4 bg-white/80 backdrop-blur-xl border border-white shadow-2xl shadow-indigo-100/50 rounded-3xl">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-indigo-200">
            <span className="text-2xl font-black text-white tracking-tighter">R</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Welcome back</h1>
          <p className="text-slate-500 text-sm font-medium">Please enter your details to sign in.</p>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-5">
            <FormInput
              name="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
              rules={{ 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "invalid email address"
                }
              }}
            />
            <FormInput
              name="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              rules={{ 
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              }}
            />

            <div className="pt-2">
              <Button type="submit" className="w-full h-12 text-[15px] shadow-md shadow-indigo-200" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
