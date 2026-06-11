"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { useState, useEffect } from "react";
import { settingService } from "@/services/settingService";
import toast from "react-hot-toast";
import { FormInput } from "@/components/forms/FormInput";
import { useForm, FormProvider } from "react-hook-form";
import { Save } from "lucide-react";

export default function SettingsPage() {
  const [dollarRate, setDollarRate] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await settingService.getByKey('DOLLAR_RATE');
        setDollarRate(res.data.value);
      } catch (error) {
        console.error("Failed to fetch dollar rate");
      }
    };
    fetchRate();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await settingService.update('DOLLAR_RATE', dollarRate);
      toast.success("Settings updated successfully!");
    } catch (error) {
      toast.error("Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  };

  const methods = useForm({
    defaultValues: {
      companyName: "RiseCRM Enterprise",
    },
  });

  const onSubmit = (data: any) => {
    console.log("Saved Settings:", data);
    alert("Settings saved successfully!");
  };

  return (
    <AppLayout>
      <PageHeader 
        title="Settings" 
        description="Manage system configurations and application preferences."
      />

      <div className="mt-8 max-w-2xl mx-auto">
        <Card className="p-6">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                  Financial Settings
                </h3>
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-2 uppercase tracking-wide">
                    Current Dollar Rate (USD to INR)
                  </label>
                  <div className="flex max-w-sm gap-3">
                    <input
                      type="number"
                      value={dollarRate}
                      onChange={(e) => setDollarRate(e.target.value)}
                      step="0.01"
                      placeholder="e.g. 83.50"
                      className="flex-1 px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-brand-primary outline-none transition-all font-medium"
                    />
                    <Button type="button" onClick={handleSave} disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Rate"}
                    </Button>
                  </div>
                  <p className="mt-2 text-[13px] font-medium text-slate-500">
                    This rate will be used globally for auto-calculating USD prices.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 mt-4">
                  General Preferences
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput 
                    name="companyName" 
                    label="Company Name" 
                    type="text"
                    placeholder="Company Name" 
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <Button type="submit" className="gap-2">
                  <Save size={16} /> Save Settings
                </Button>
              </div>
            </form>
          </FormProvider>
        </Card>
      </div>
    </AppLayout>
  );
}
