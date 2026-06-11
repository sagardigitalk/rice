"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { FormInput } from "@/components/forms/FormInput";
import { FormSelect } from "@/components/forms/FormSelect";
import { useForm, FormProvider } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { leadService } from "@/services/leadService";
import { exmillService } from "@/services/exmillService";
import toast from "react-hot-toast";

export default function LeadAddEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const isEditMode = id && id !== "add";
  const methods = useForm({
    defaultValues: {
      name: "",
      phone: "",
      company: "",
      country: "",
      priceType: "",
      variety: "",
      form: "",
      size: "",
      packType: "",
      cifCountry: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode) {
      const fetchLead = async () => {
        try {
          const res = await leadService.getById(id);
          // Map backend fields to frontend form fields
          methods.reset({
            name: res.data.contactPerson || "",
            company: res.data.companyName || "",
            phone: res.data.phone || "",
            country: res.data.country || "",
            priceType: res.data.priceType || "",
            variety: res.data.variety?._id || res.data.variety || "",
            form: res.data.form || "",
            size: res.data.size || "",
            packType: res.data.packType || "",
            cifCountry: res.data.cifCountry || "",
          });
        } catch (error) {
          toast.error("Failed to load Lead data for editing");
        } finally {
          setIsLoading(false);
        }
      };
      fetchLead();
    }
  }, [id, isEditMode, methods]);

  const [varietyOptions, setVarietyOptions] = useState<{label: string, value: string}[]>([]);
  const [formOptions, setFormOptions] = useState<{label: string, value: string}[]>([]);

  const [allExmillData, setAllExmillData] = useState<any[]>([]);

  // Fetch Exmill data to populate Variety
  useEffect(() => {
    const fetchExmillData = async () => {
      try {
        const res = await exmillService.getAll();
        const exmillData = res.data || [];
        setAllExmillData(exmillData);
        
        // Extract unique varieties initially, storing the _id as the value
        const uniqueVarietiesMap = new Map();
        exmillData.forEach((item: any) => {
          if (!uniqueVarietiesMap.has(item.variety)) {
            uniqueVarietiesMap.set(item.variety, item._id);
          }
        });
        setVarietyOptions(Array.from(uniqueVarietiesMap.entries()).map(([v, id]) => ({ label: String(v), value: String(id) })));
      } catch (error) {
        console.error("Failed to fetch Exmill data for dropdowns", error);
      }
    };
    fetchExmillData();
  }, []);

  const selectedVariety = methods.watch("variety");

  // Update Form options when Variety changes
  useEffect(() => {
    if (selectedVariety && allExmillData.length > 0) {
      // Find the ExMill record matching the selected ID
      const selectedRecord = allExmillData.find((item: any) => item._id === selectedVariety);
      if (selectedRecord) {
        // Find all records that have the SAME variety name as the selected record
        const filtered = allExmillData.filter((item: any) => item.variety === selectedRecord.variety);
        const uniqueForms = Array.from(new Set(filtered.map((item: any) => item.form)));
        setFormOptions(uniqueForms.map(f => ({ label: String(f), value: String(f) })));

        // Clear the selected form if it's no longer valid for the new variety
        const currentForm = methods.getValues("form");
        if (currentForm && !uniqueForms.includes(currentForm)) {
          methods.setValue("form", "");
        }
      }
    } else {
      setFormOptions([]);
    }
  }, [selectedVariety, allExmillData, methods]);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const payload = {
        contactPerson: data.name,
        companyName: data.company,
        phone: data.phone,
        country: data.country,
        priceType: data.priceType,
        variety: data.variety,
        form: data.form,
        size: data.size,
        packType: data.packType,
        cifCountry: data.cifCountry,
        status: 'New', // default
        email: data.name.toLowerCase().replace(/\s/g, '') + '@example.com', // Dummy email
      };

      if (isEditMode) {
        await leadService.update(id, payload);
        toast.success("Lead updated successfully!");
      } else {
        await leadService.create(payload);
        toast.success("Lead created successfully!");
      }
      router.push("/leads");
    } catch (error) {
      toast.error(isEditMode ? "Failed to update lead" : "Failed to create lead");
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
        title={isEditMode ? "Edit Lead" : "Add Lead"}
        description={isEditMode ? "Update an existing lead entry." : "Create a new lead entry."}
        breadcrumbs={[{ label: "Leads", href: "/leads" }, { label: isEditMode ? "Edit Lead" : "Add Lead" }]}
      />
      <div className="max-w-2xl mt-6 mx-auto">
        <Card className="p-6">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput name="name" label="Name" placeholder="Enter full name" rules={{ required: "Name is required" }} />
                <FormInput 
                  name="phone" 
                  label="Phone" 
                  placeholder="Enter 10-digit phone number" 
                  type="number"
                  maxLength={10}
                  onInput={(e: any) => {
                    if (e.target.value.length > 10) {
                      e.target.value = e.target.value.slice(0, 10);
                    }
                  }}
                  rules={{ 
                    required: "Phone is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Phone number must be exactly 10 digits"
                    }
                  }} 
                />
                <FormInput name="company" label="Company" placeholder="Enter company name" rules={{ required: "Company is required" }} />
                <FormInput name="country" label="Country" placeholder="Enter country" />
                
                <FormInput name="priceType" label="Price Type" placeholder="Enter Price Type (e.g. CIF)" />
                <FormSelect name="variety" label="Variety" options={varietyOptions} />
                <FormSelect name="form" label="Form" options={formOptions} />
                <FormInput name="size" label="Size" placeholder="e.g. 10kg" />
                <FormInput name="packType" label="Pack Type" placeholder="e.g. Non-Woven" />
                <FormInput name="cifCountry" label="CIF Country" placeholder="Enter CIF Country (optional)" />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button variant="outline" type="button" onClick={() => router.push("/leads")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : (isEditMode ? "Update Lead" : "Save Lead")}
                </Button>
              </div>
            </form>
          </FormProvider>
        </Card>
      </div>
    </AppLayout>
  );
}
