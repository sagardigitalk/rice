"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/common/Card";
import { useAuth } from "@/context/AuthContext";
import { FormProvider, useForm } from "react-hook-form";
import { FormInput } from "@/components/forms/FormInput";
import { Button } from "@/components/common/Button";
import { authService } from "@/services/authService";
import toast from "react-hot-toast";

export default function AccountPage() {
  const { user, login } = useAuth();
  const [isUpdatingDetails, setIsUpdatingDetails] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const detailsMethods = useForm({
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const passwordMethods = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (user) {
      detailsMethods.reset({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user, detailsMethods]);

  const onUpdateDetails = async (data: any) => {
    setIsUpdatingDetails(true);
    try {
      const res = await authService.updateDetails(data);
      if (res.success && res.data) {
        // Update user context
        const token = localStorage.getItem('token');
        if (token) {
          login(token, res.data);
        }
        toast.success("Profile updated successfully!");
      }
    } catch (error: any) {
      toast.error(error?.error || "Failed to update profile.");
    } finally {
      setIsUpdatingDetails(false);
    }
  };

  const onUpdatePassword = async (data: any) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    
    setIsUpdatingPassword(true);
    try {
      const res = await authService.updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      if (res.success && res.token) {
        localStorage.setItem('token', res.token);
        passwordMethods.reset();
        toast.success("Password updated successfully!");
      }
    } catch (error: any) {
      toast.error(error?.error || "Failed to update password.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : "A";

  return (
    <AppLayout>
      <PageHeader 
        title="My Account" 
        description="View and manage your personal profile information."
      />

      <div className="mt-8 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Summary Card */}
        <div className="md:col-span-1">
          <Card className="p-8 flex flex-col items-center text-center justify-center space-y-4 h-full border border-slate-100 shadow-sm bg-gradient-to-b from-white to-slate-50/50">
             <div className="h-28 w-28 rounded-full bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] flex items-center justify-center text-4xl font-bold border-4 border-white shadow-xl shadow-indigo-100/50">
               {firstLetter}
             </div>
             <div>
               <h2 className="text-xl font-bold text-slate-900">{user?.name || "User"}</h2>
               <p className="text-[var(--color-brand-primary)] font-semibold mt-1 uppercase tracking-wider text-xs bg-indigo-50 inline-block px-3 py-1 rounded-full">{user?.role || "User"}</p>
             </div>
          </Card>
        </div>

        {/* Settings Form Cards */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Update Profile Details */}
          <Card className="p-6 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">Profile Details</h3>
            <FormProvider {...detailsMethods}>
              <form onSubmit={detailsMethods.handleSubmit(onUpdateDetails)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    name="name"
                    label="Full Name"
                    placeholder="Enter your name"
                    rules={{ required: "Name is required" }}
                  />
                  <FormInput
                    name="email"
                    label="Email Address"
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
                </div>
                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={isUpdatingDetails} className="shadow-md shadow-indigo-100">
                    {isUpdatingDetails ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </Card>

          {/* Update Password */}
          <Card className="p-6 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">Change Password</h3>
            <FormProvider {...passwordMethods}>
              <form onSubmit={passwordMethods.handleSubmit(onUpdatePassword)} className="space-y-4">
                <FormInput
                  name="currentPassword"
                  label="Current Password"
                  type="password"
                  placeholder="••••••••"
                  rules={{ required: "Current password is required" }}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    name="newPassword"
                    label="New Password"
                    type="password"
                    placeholder="••••••••"
                    rules={{ 
                      required: "New password is required",
                      minLength: { value: 6, message: "Minimum 6 characters" }
                    }}
                  />
                  <FormInput
                    name="confirmPassword"
                    label="Confirm New Password"
                    type="password"
                    placeholder="••••••••"
                    rules={{ required: "Please confirm your password" }}
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={isUpdatingPassword} variant="outline" className="border-[var(--color-brand-primary)] text-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary)] hover:text-white transition-colors">
                    {isUpdatingPassword ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </Card>

        </div>
      </div>
    </AppLayout>
  );
}
