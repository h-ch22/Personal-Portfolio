import { deleteExperience, fetchExperience, modifyExperience, uploadExperience, uploadExperienceLogo } from "#/api/experience/experience";
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
    const [showDetailDialog, setShowDetailDialog] = useState(false);
    const [selectedData, setSelectedData] = useState<Experience | null>(null);
    const [detailData, setDetailData] = useState<Experience | null>(null);
    const [searchText, setSearchText] = useState("");
    const [techStackFilter, setTechStackFilter] = useState<string[]>([]);
    const [dateRangeFilter, setDateRangeFilter] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });
    const [typeFilter, setTypeFilter] = useState<Experience["type"][]>([]);

    const [richDescription, setRichDescription] = useState("");
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [existingLogoUrl, setExistingLogoUrl] = useState<string | undefined>(undefined);

    const { openDialog } = useAlertDialogStore();

    const form = useForm({
        defaultValues: {
            title: "",
            type: "Work" as Experience["type"],
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
            if (!richDescription || richDescription === '<p></p>') {
                toast.error("Description is required.");
                return;
            }

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

            const operation = async () => {
                let logoUrl = existingLogoUrl;

                if (selectedData) {
                    const docRef = await modifyExperience(
                        { ...value, description: richDescription, logoUrl },
                        selectedData.id
                    );

                    if (logoFile) {
                        logoUrl = await uploadExperienceLogo(selectedData.id, logoFile);
                        await modifyExperience(
                            { ...value, description: richDescription, logoUrl },
                            selectedData.id
                        );
                    }

                    return docRef;
                } else {
                    const created = await uploadExperience({ ...value, description: richDescription });

                    if (logoFile && created.id) {
                        logoUrl = await uploadExperienceLogo(created.id, logoFile);
                        await modifyExperience(
                            { ...value, description: richDescription, logoUrl },
                            created.id
                        );
                    }

                    return created;
                }
            };

            toast.promise(
                operation().then(async () => {
                    await queryClient.invalidateQueries({ queryKey: ["experience"] });
                    setSelectedData(null);
                    setRichDescription("");
                    setLogoFile(null);
                    setExistingLogoUrl(undefined);
                    form.reset();
                    setShowAddDialog(false);
                }),
                {
                    loading: selectedData ? "Modifying experience..." : "Uploading experience...",
                    success: selectedData ? "Experience modified successfully!" : "Experience uploaded successfully!",
                    error: (e) => selectedData ? `Failed to modify experience: ${e.message}` : `Failed to upload experience: ${e.message}`
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

    const currentItems = filteredData.filter((e) => e.isCurrentlyWorking);
    const nonCurrentItems = filteredData.filter((e) => !e.isCurrentlyWorking);

    const groupedData = nonCurrentItems.reduce((acc: Record<number, Experience[]>, current) => {
        const key = (current.endDate ?? current.startDate).getFullYear();
        if (!acc[key]) acc[key] = [];
        acc[key].push(current);
        return acc;
    }, {});

    const onCardClick = (data: Experience) => {
        setDetailData(data);
        setShowDetailDialog(true);
    };

    const onModifyButtonClick = (data: Experience) => {
        setSelectedData(data);
        form.setFieldValue("title", data.title);
        form.setFieldValue("type", data.type);
        form.setFieldValue("company", data.company);
        form.setFieldValue("role", data.role);
        form.setFieldValue("techStack", data.techStack);
        form.setFieldValue("startDate", new Date(data.startDate));
        form.setFieldValue("endDate", data.endDate ? new Date(data.endDate) : null);
        form.setFieldValue("isCurrentlyWorking", data.isCurrentlyWorking);
        setRichDescription(data.description);
        setExistingLogoUrl(data.logoUrl);
        setLogoFile(null);
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
            setRichDescription("");
            setLogoFile(null);
            setExistingLogoUrl(undefined);
            form.reset();
        }
        setShowAddDialog(open);
    }

    return {
        form,
        showAddDialog,
        showDetailDialog,
        setShowDetailDialog,
        handleDialogClose,
        selectedData,
        detailData,
        currentItems,
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
        richDescription,
        setRichDescription,
        logoFile,
        setLogoFile,
        existingLogoUrl,
        setExistingLogoUrl,
        onCardClick,
        onModifyButtonClick,
        onDeleteButtonClick
    }
}

export type ExperienceFormInstance = ReturnType<typeof useExperiencePageController>["form"];

export { useExperiencePageController }
