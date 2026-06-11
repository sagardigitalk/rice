"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { FormInput } from "@/components/forms/FormInput";
import { useForm, FormProvider } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { exmillService } from "@/services/exmillService";
import { settingService } from "@/services/settingService";
import toast from "react-hot-toast";

export default function ExmillAddEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const isEditMode = id && id !== "add";
  const methods = useForm({
    defaultValues: {
      variety: "",
      form: "",
      inrPerKg: "",
      inrPerMt: "",
      usdPerMt: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode) {
      const fetchExmill = async () => {
        try {
          const res = await exmillService.getById(id);
          methods.reset(res.data);
        } catch (error) {
          toast.error("Failed to load ExMill data for editing");
        } finally {
          setIsLoading(false);
        }
      };
      fetchExmill();
    }
  }, [id, isEditMode, methods]);
  const [dollarRate, setDollarRate] = useState<number>(83.50);

  // Fetch live Dollar Rate from backend
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await settingService.getByKey('DOLLAR_RATE');
        if (res.data && res.data.value) {
          setDollarRate(Number(res.data.value));
        }
      } catch (error) {
        console.error("Could not fetch Dollar Rate, using fallback.");
      }
    };
    fetchRate();
  }, []);

  // Watch for changes on the inrPerKg field
  const inrPerKgValue = methods.watch("inrPerKg");

  // Auto-calculate logic
  useEffect(() => {
    const parsedKg = Number(inrPerKgValue);
    if (!isNaN(parsedKg) && parsedKg > 0) {
      // 1. Calculate INR per MT (kg * 1000)
      const mtRate = parsedKg * 1000;
      methods.setValue("inrPerMt", mtRate.toString(), { shouldValidate: true });

      // 2. Calculate USD per MT (mtRate / dollarRate)
      const usdRate = mtRate / dollarRate;
      methods.setValue("usdPerMt", usdRate.toFixed(2), { shouldValidate: true });
    } else {
      methods.setValue("inrPerMt", "");
      methods.setValue("usdPerMt", "");
    }
  }, [inrPerKgValue, dollarRate, methods]);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const payload = {
        variety: data.variety,
        form: data.form,
        inrPerKg: Number(data.inrPerKg),
        inrPerMt: data.inrPerMt ? Number(data.inrPerMt) : undefined,
        usdPerMt: data.usdPerMt ? Number(data.usdPerMt) : undefined,
      };

      if (isEditMode) {
        await exmillService.update(id, payload);
        toast.success("ExMill rate updated successfully!");
      } else {
        await exmillService.create(payload);
        toast.success("ExMill rate added successfully!");
      }
      router.push("/exmill");
    } catch (error) {
      toast.error(isEditMode ? "Failed to update ExMill rate" : "Failed to add ExMill rate");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-8 flex justify-center items-center h-full">Loading...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader
        title={isEditMode ? "Edit ExMill Rate" : "Add ExMill Rate"}
        description={isEditMode ? "Update an existing ex-mill rate entry." : "Create a new ex-mill rate entry."}
        breadcrumbs={[{ label: "ExMill", href: "/exmill" }, { label: isEditMode ? "Edit Rate" : "Add Rate" }]}
      />
      <div className="max-w-2xl mt-6 mx-auto">
        <Card className="p-6">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput name="variety" label="Variety" placeholder="e.g. 1121 Basmati" rules={{ required: "Variety is required" }} />
                <FormInput name="form" label="Form" placeholder="e.g. Sella" rules={{ required: "Form is required" }} />
                <FormInput name="inrPerKg" label="INR/kg" type="number" placeholder="0.00" step="0.01" rules={{ required: "INR/kg is required", min: { value: 0, message: "Must be positive" } }} />
                <FormInput name="inrPerMt" label="INR/MT (Auto)" type="number" placeholder="0.00" step="0.01" readOnly className="bg-slate-50 border-transparent font-semibold text-slate-500" />
                <FormInput name="usdPerMt" label="USD/MT (Auto)" type="number" placeholder="0.00" step="0.01" readOnly className="bg-slate-50 border-transparent font-semibold text-slate-500" />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button variant="outline" type="button" onClick={() => router.push("/exmill")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : (isEditMode ? "Update Rate" : "Save Rate")}
                </Button>
              </div>
            </form>
          </FormProvider>
        </Card>
      </div>
    </AppLayout>
  );
}
