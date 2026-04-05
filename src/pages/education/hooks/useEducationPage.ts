import { fetchEducation, uploadEducation } from "#/api/education/education";
import type { EducationRequest } from "#/types/education";
import { useSuspenseQuery } from "@tanstack/react-query";
import React, { useState } from "react"
import { toast } from "sonner";

const useEducationPageController = () => {
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [formData, setFormData] = useState<EducationRequest>({
        title: "",
        description: "",
        organization: "",
        startYear: new Date().getFullYear(),
        startMonth: new Date().getMonth() + 1,
        endYear: new Date().getFullYear(),
        endMonth: new Date().getMonth() + 1,
        inProgress: true,
        type: "DEGREE"
    });

    const { data } = useSuspenseQuery({
        queryKey: ["education"],
        queryFn: async () => fetchEducation()
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const handleSelectionChange = (v: string) => {
        setFormData((prev) => ({
            ...prev,
            type: v as EducationRequest["type"]
        }))
    }

    const toggleInProgress = () => {
        setFormData((prev) => ({
            ...prev,
            inProgress: !prev.inProgress
        }))
    }

    const onAddEducation = () => {
        if(
            formData.title.trim() === "" ||
            formData.organization.trim() === "" ||
            formData.type.trim() === "" ||
            formData.startYear < 2000 ||
            formData.startMonth < 1 ||
            formData.startMonth > 12
        ) {
            toast.error("Please fill in all required fields with valid values.");
            return;
        }

        if(!formData.inProgress && formData.startYear < formData.endYear || (formData.startYear === formData.endYear && formData.startMonth < formData.endMonth)) {
            toast.error("End date must be after start date.");
            return;
        }

        toast.promise(
            uploadEducation(formData),
            {
                loading: "Adding education...",
                success: "Education added successfully!",
                error: "Failed to add education. Please try again."
            }
        )
    }

    return {
        showAddDialog,
        setShowAddDialog,
        formData,
        handleInputChange,
        handleSelectionChange,
        toggleInProgress,
        onAddEducation,
        data
    }
}

export { useEducationPageController }
