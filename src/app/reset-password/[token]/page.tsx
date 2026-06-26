"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { authService } from "@/services/authService";
import { Button } from "@/components/common/Button";
import { FormInput } from "@/components/forms/FormInput";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;
  
  const methods = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: any) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    try {
      await authService.resetPassword(token, data.password);
      toast.success("Password reset successfully!");
      router.push("/login");
    } catch (error: any) {
      toast.error(error?.error || "Failed to reset password. Token may be invalid or expired.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 overflow-hidden relative selection:bg-indigo-100 selection:text-indigo-900">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-200/50 blur-[120px] pointer-events-none mix-blend-multiply opacity-70 animate-blob" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/50 blur-[120px] pointer-events-none mix-blend-multiply opacity-70 animate-blob animation-delay-2000" />
      
      <div className="relative z-10 w-full max-w-[420px] p-8 mx-4 bg-white/80 backdrop-blur-xl border border-white shadow-2xl shadow-indigo-100/50 rounded-3xl">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-indigo-200">
            <span className="text-2xl font-black text-white tracking-tighter">R</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Reset Password</h1>
          <p className="text-slate-500 text-sm font-medium">
            Enter your new password below.
          </p>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-5">
            <FormInput
              name="password"
              label="New Password"
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
            <FormInput
              name="confirmPassword"
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              rules={{ 
                required: "Confirm password is required"
              }}
            />

            <div className="pt-2">
              <Button type="submit" className="w-full h-12 text-[15px] shadow-md shadow-indigo-200" disabled={isLoading}>
                {isLoading ? "Saving..." : "Reset Password"}
              </Button>
            </div>
            
            <div className="text-center pt-2">
              <a href="/login" className="text-sm text-slate-500 hover:text-[var(--color-brand-primary)] hover:underline font-medium">
                Back to Login
              </a>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
