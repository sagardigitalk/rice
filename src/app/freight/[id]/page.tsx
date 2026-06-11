"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { FormInput } from "@/components/forms/FormInput";
import { useForm, FormProvider } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { freightService } from "@/services/freightService";
import toast from "react-hot-toast";

export default function FreightAddEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const isEditMode = id && id !== "add";
  const methods = useForm({
    defaultValues: {
      country: "",
      portName: "",
      seaFreightUsd: "",
      cocUsd: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode) {
      const fetchFreight = async () => {
        try {
          const res = await freightService.getById(id);
          methods.reset(res.data);
        } catch (error) {
          toast.error("Failed to load Freight data for editing");
        } finally {
          setIsLoading(false);
        }
      };
      fetchFreight();
    }
  }, [id, isEditMode, methods]);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const payload = {
        country: data.country,
        portName: data.portName,
        seaFreightUsd: Number(data.seaFreightUsd),
        cocUsd: Number(data.cocUsd),
      };

      if (isEditMode) {
        await freightService.update(id, payload);
        toast.success("Freight rate updated successfully!");
      } else {
        await freightService.create(payload);
        toast.success("Freight rate added successfully!");
      }
      router.push("/freight");
    } catch (error) {
      toast.error(isEditMode ? "Failed to update Freight rate" : "Failed to add Freight rate");
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
        title={isEditMode ? "Edit Freight Rate" : "Add Freight Rate"}
        description={isEditMode ? "Update an existing freight rate entry." : "Create a new freight rate entry."}
        breadcrumbs={[{ label: "Freight", href: "/freight" }, { label: isEditMode ? "Edit Freight" : "Add Freight" }]}
      />
      <div className="max-w-2xl mt-6 mx-auto">
        <Card className="p-6">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput name="country" label="Country" placeholder="e.g. India" rules={{ required: "Country is required" }} />
                <FormInput name="portName" label="Port Name" placeholder="e.g. Mundra" rules={{ required: "Port Name is required" }} />
                <FormInput name="seaFreightUsd" label="Sea Freight (USD/container)" type="number" placeholder="0" step="0.01" rules={{ required: "Sea Freight is required", min: { value: 0, message: "Must be positive" } }} />
                <FormInput name="cocUsd" label="COC (USD/MT)" type="number" placeholder="0" step="0.01" rules={{ min: { value: 0, message: "Must be positive" } }} />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button variant="outline" type="button" onClick={() => router.push("/freight")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : (isEditMode ? "Update Freight" : "Save Freight")}
                </Button>
              </div>
            </form>
          </FormProvider>
        </Card>
      </div>
    </AppLayout>
  );
}
