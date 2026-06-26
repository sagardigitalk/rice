"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { authService } from "@/services/authService";
import { Button } from "@/components/common/Button";
import { FormInput } from "@/components/forms/FormInput";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  
  const methods = useForm({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(data.email);
      setIsSent(true);
      toast.success("Reset link sent to your email!");
    } catch (error: any) {
      toast.error(error?.error || "Failed to send reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 overflow-hidden relative selection:bg-indigo-100 selection:text-indigo-900">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-200/50 blur-[120px] pointer-events-none mix-blend-multiply opacity-70 animate-blob" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/50 blur-[120px] pointer-events-none mix-blend-multiply opacity-70 animate-blob animation-delay-2000" />
      
      <div className="relative z-10 w-full max-w-[420px] p-8 mx-4 bg-white/80 backdrop-blur-xl border border-white shadow-2xl shadow-indigo-100/50 rounded-3xl">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-indigo-200">
            <span className="text-2xl font-black text-white tracking-tighter">R</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Forgot Password</h1>
          <p className="text-slate-500 text-sm font-medium">
            {isSent ? "Check your inbox for the next steps." : "Enter your email to receive a password reset link."}
          </p>
        </div>

        {isSent ? (
          <div className="space-y-4 text-center">
            <div className="p-4 bg-green-50 text-green-700 rounded-xl text-sm font-medium">
              We have emailed you a reset link. Please click it to create a new password.
            </div>
            <a href="/login" className="inline-block mt-4 text-sm text-[var(--color-brand-primary)] hover:underline font-medium">
              Return to Login
            </a>
          </div>
        ) : (
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

              <div className="pt-2">
                <Button type="submit" className="w-full h-12 text-[15px] shadow-md shadow-indigo-200" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </div>
              
              <div className="text-center pt-2">
                <a href="/login" className="text-sm text-slate-500 hover:text-[var(--color-brand-primary)] hover:underline font-medium">
                  Back to Login
                </a>
              </div>
            </form>
          </FormProvider>
        )}
      </div>
    </div>
  );
}
