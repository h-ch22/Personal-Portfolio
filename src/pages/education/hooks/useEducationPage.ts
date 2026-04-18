import { deleteEducation, fetchEducation, modifyEducation, uploadEducation, uploadEducationLogo } from "#/api/education/education";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react"

import type { Education, EducationRequest } from "#/types/education";
import { useAlertDialogStore } from "#/stores/use-alert-dialog-store";
import { useForm } from "@tanstack/react-form";
import z from "zod";

const educationSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string(),
    organization: z.string().min(1, "Organization is required"),
    startYear: z.number().min(2000, "Start year must be after your birth year"),
    startMonth: z.number().min(1, "Start month must be between 1 and 12").max(12, "Start month must be between 1 and 12"),
    endYear: z.number(),
    endMonth: z.number(),
    inProgress: z.boolean(),
    type: z.enum(["DEGREE", "BOOTCAMP", "CERTIFICATE", "COURSE"]),
});

const useEducationPageController = () => {
    const queryClient = useQueryClient();

    const [showAddDialog, setShowAddDialog] = useState(false);
    const [selectedData, setSelectedData] = useState<Education | null>(null);
    const [searchText, setSearchText] = useState("");
    const [dateRangeFilter, setDateRangeFilter] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [existingLogoUrl, setExistingLogoUrl] = useState<string | undefined>(undefined);

    const { openDialog } = useAlertDialogStore();

    const form = useForm({
        defaultValues: {
            title: "",
            description: "",
            organization: "",
            startYear: new Date().getFullYear(),
            startMonth: new Date().getMonth() + 1,
            endYear: new Date().getFullYear(),
            endMonth: new Date().getMonth() + 1,
            inProgress: true,
            type: "DEGREE" as EducationRequest["type"]
        },
        validators: {
            onSubmit: educationSchema,
        },
        onSubmit: async ({ value }) => {
            if(!value.inProgress && (value.endYear < value.startYear || (value.endYear === value.startYear && value.endMonth < value.startMonth))) {
                toast.error("End date must be after start date");
                return;
            }

            const operation = async () => {
                let logoUrl = existingLogoUrl;

                if (selectedData) {
                    const docRef = await modifyEducation({ ...value, logoUrl }, selectedData.id);
                    if (logoFile) {
                        logoUrl = await uploadEducationLogo(selectedData.id, logoFile);
                        await modifyEducation({ ...value, logoUrl }, selectedData.id);
                    }
                    return docRef;
                } else {
                    const created = await uploadEducation({ ...value });
                    if (logoFile && created.id) {
                        logoUrl = await uploadEducationLogo(created.id, logoFile);
                        await modifyEducation({ ...value, logoUrl }, created.id);
                    }
                    return created;
                }
            };

            toast.promise(
                operation().then(async () => {
                    await queryClient.invalidateQueries({ queryKey: ["education"] });
                    setSelectedData(null);
                    setLogoFile(null);
                    setExistingLogoUrl(undefined);
                    form.reset();
                    setShowAddDialog(false);
                }),
                {
                    loading: selectedData ? "Modifying education..." : "Adding education...",
                    success: selectedData ? "Education modified successfully!" : "Education added successfully!",
                    error: (e) => `Failed to save education: ${e.message}`
                }
            );
        }
    });

    const { data } = useSuspenseQuery({
        queryKey: ["education"],
        queryFn: async () => fetchEducation()
    });

    const filteredData = data.filter((e) => {
        if (searchText.trim()) {
            const q = searchText.toLowerCase();
            const matches =
                e.title.toLowerCase().includes(q) ||
                e.organization.toLowerCase().includes(q) ||
                e.description?.toLowerCase().includes(q);
            if (!matches) return false;
        }

        if (dateRangeFilter.from) {
            const eduStart = new Date(e.startYear, e.startMonth - 1, 1);
            const eduEnd = e.inProgress || !e.endYear
                ? new Date()
                : new Date(e.endYear, (e.endMonth ?? 12) - 1, 1);
            const filterTo = dateRangeFilter.to ?? new Date();
            if (!(eduStart <= filterTo && eduEnd >= dateRangeFilter.from)) return false;
        }

        return true;
    });

    const currentItems = filteredData.filter((e) => e.inProgress);
    const nonCurrentItems = filteredData.filter((e) => !e.inProgress);

    const groupedData = nonCurrentItems.reduce((acc: Record<number, Education[]>, current) => {
        const key = current.endYear ?? current.startYear;

        if (!acc[key]) {
            acc[key] = [];
        }

        acc[key].push(current);

        return acc;
    }, {});

    const sortedGroupedData = Object.fromEntries(
        Object.entries(groupedData).sort(([a], [b]) => Number(b) - Number(a))
    );

    const onModifyButtonClick = (education: Education) => {
        setSelectedData(education);
        form.setFieldValue("title", education.title);
        form.setFieldValue("description", education.description ?? "");
        form.setFieldValue("organization", education.organization);
        form.setFieldValue("startYear", education.startYear);
        form.setFieldValue("startMonth", education.startMonth);
        form.setFieldValue("endYear", education.endYear || new Date().getFullYear());
        form.setFieldValue("endMonth", education.endMonth || new Date().getMonth() + 1);
        form.setFieldValue("inProgress", education.inProgress);
        form.setFieldValue("type", education.type);
        setExistingLogoUrl(education.logoUrl);
        setLogoFile(null);
        setShowAddDialog(true);
    }

    const onDeleteButtonClick = (data: Education) => {
        openDialog({
            title: "Confirm Deletion",
            description: `Are you sure you want to delete the education content for ${data.title}?`,
            onConfirm: async () => {
                toast.promise(
                    deleteEducation(data.id).then(async () => {
                        await queryClient.invalidateQueries({ queryKey: ["education"] });
                    }),
                    {
                        loading: "Deleting education...",
                        success: "Education deleted successfully!",
                        error: (e) => `Failed to delete education: ${e.message}`
                    }
                );
            },
            isDestructive: true
        })
    }

    const handleDialogClose = (open: boolean) => {
        if (!open) {
            setSelectedData(null);
            setLogoFile(null);
            setExistingLogoUrl(undefined);
            form.reset();
        }
        setShowAddDialog(open);
    }

    return {
        form,
        showAddDialog,
        handleDialogClose,
        selectedData,
        currentItems,
        groupedData: sortedGroupedData,
        searchText,
        setSearchText,
        dateRangeFilter,
        setDateRangeFilter,
        logoFile,
        setLogoFile,
        existingLogoUrl,
        setExistingLogoUrl,
        onModifyButtonClick,
        onDeleteButtonClick
    }
}

export type EducationFormInstance = ReturnType<typeof useEducationPageController>['form']

export { useEducationPageController }
