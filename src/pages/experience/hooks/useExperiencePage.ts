import { deleteExperience, fetchExperience, modifyExperience, uploadExperience } from "#/api/experience/experience";
import { useAlertDialogStore } from "#/stores/use-alert-dialog-store";
import type { Experience } from "#/types/experience";
import { useForm } from "@tanstack/react-form";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";

const techStackItemSchema = z.object({
    name: z.string().min(1),
    iconUrl: z.string().optional()
});

const experienceSchema = z.object({
    title: z.string().min(1, "Title is required"),
    type: z.enum(["Work", "Project", "Activity", "Open Source"]),
    description: z.string().min(1, "Description is required"),
    company: z.string().min(1, "Company is required"),
    techStack: z.array(techStackItemSchema),
    role: z.string().min(1, "Role is required"),
    startDate: z.date(),
    endDate: z.date().nullable(),
    isCurrentlyWorking: z.boolean()
})

const useExperiencePageController = () => {
    const queryClient = useQueryClient();

    const [showAddDialog, setShowAddDialog] = useState(false);
    const [selectedData, setSelectedData] = useState<Experience | null>(null);
    const [searchText, setSearchText] = useState("");
    const [techStackFilter, setTechStackFilter] = useState<string[]>([]);
    const [dateRangeFilter, setDateRangeFilter] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });
    const [typeFilter, setTypeFilter] = useState<Experience["type"][]>([]);

    const { openDialog } = useAlertDialogStore();

    const form = useForm({
        defaultValues: {
            title: "",
            type: "Work" as Experience["type"],
            description: "",
            company: "",
            role: "",
            techStack: [] as { name: string; iconUrl?: string }[],
            startDate: new Date(),
            endDate: null as Date | null,
            isCurrentlyWorking: false
        },
        validators: {
            onSubmit: experienceSchema
        },
        onSubmit: async ({ value }) => {
            if(!value.isCurrentlyWorking && !value.endDate) {
                toast.error("Please provide an end date or mark as currently working.");
                return;
            }

            if(!value.isCurrentlyWorking && value.startDate > value.endDate!) {
                toast.error("End date must be after start date.");
                return;
            }

            if(value.startDate.getFullYear() < 2001) {
                toast.error("Start year must be after your birth year.");
                return;
            }

            const operation = selectedData
                ? modifyExperience(value, selectedData.id)
                : uploadExperience(value);

            toast.promise(
                operation.then(async () => {
                    await queryClient.invalidateQueries({ queryKey: ["experience"] });
                    setSelectedData(null);
                    form.reset();
                    setShowAddDialog(false);
                }),
                {
                    loading: selectedData ? "Modifying experience..." : "Uploading experience...",
                    success: selectedData ? "Experience modified successfully!" : "Experience uploaded successfully!",
                    error: selectedData ? "Failed to modify experience." : "Failed to upload experience."
                }
            )
        }
    });

    const { data } = useSuspenseQuery({
        queryKey: ["experience"],
        queryFn: async () => fetchExperience()
    });

    const allTechStacks = Array.from(
        new Set(data.flatMap((e) => e.techStack.map((t) => t.name)))
    ).sort();

    const filteredData = data.filter((e) => {
        if (searchText.trim()) {
            const q = searchText.toLowerCase();
            const matchesSearch =
                e.title.toLowerCase().includes(q) ||
                e.company.toLowerCase().includes(q) ||
                e.role.toLowerCase().includes(q) ||
                e.description.toLowerCase().includes(q) ||
                e.techStack.some((t) => t.name.toLowerCase().includes(q));
            if (!matchesSearch) return false;
        }

        if (typeFilter.length > 0 && !typeFilter.includes(e.type)) return false;

        if (techStackFilter.length > 0) {
            const hasAllTech = techStackFilter.every((name) =>
                e.techStack.some((t) => t.name === name)
            );
            if (!hasAllTech) return false;
        }

        if (dateRangeFilter.from) {
            const expEnd = e.isCurrentlyWorking || !e.endDate ? new Date() : e.endDate;
            const filterTo = dateRangeFilter.to ?? new Date();
            const overlaps = e.startDate <= filterTo && expEnd >= dateRangeFilter.from;
            if (!overlaps) return false;
        }

        return true;
    });

    const groupedData = filteredData
        .reduce((acc: Record<number, Experience[]>, current) => {
            const key = current.startDate.getFullYear();

            if(!acc[key]) {
                acc[key] = [];
            }

            acc[key].push(current);
            return acc;
        }, {});
    
    const onModifyButtonClick = (data: Experience) => {
        setSelectedData(data);
        form.setFieldValue("title", data.title);
        form.setFieldValue("type", data.type);
        form.setFieldValue("description", data.description);
        form.setFieldValue("company", data.company);
        form.setFieldValue("role", data.role);
        form.setFieldValue("techStack", data.techStack);
        form.setFieldValue("startDate", new Date(data.startDate));
        form.setFieldValue("endDate", data.endDate ? new Date(data.endDate) : null);
        form.setFieldValue("isCurrentlyWorking", data.isCurrentlyWorking);
        setShowAddDialog(true);
    };

    const onDeleteButtonClick = (data: Experience) => {
        openDialog({
            title: "Confirm Deletion",
            description: "Are you sure you want to delete this experience?",
            onConfirm: async () => {
                toast.promise(
                    deleteExperience(data.id).then(async () => {
                        await queryClient.invalidateQueries({ queryKey: ["experience"] });
                    }),
                    {
                        loading: "Deleting experience...",
                        success: "Experience deleted successfully!",
                        error: (e) => `Failed to delete experience: ${e.message}`
                    }
                )
            },
            isDestructive: true
        })
    };

    const handleDialogClose = (open: boolean) => {
        if(!open) {
            setSelectedData(null);
            form.reset();
        }

        setShowAddDialog(open);
    }

    return {
        form,
        showAddDialog,
        handleDialogClose,
        selectedData,
        groupedData,
        searchText,
        setSearchText,
        allTechStacks,
        techStackFilter,
        setTechStackFilter,
        typeFilter,
        setTypeFilter,
        dateRangeFilter,
        setDateRangeFilter,
        onModifyButtonClick,
        onDeleteButtonClick
    }
}

export type ExperienceFormInstance = ReturnType<typeof useExperiencePageController>["form"];

export { useExperiencePageController }
