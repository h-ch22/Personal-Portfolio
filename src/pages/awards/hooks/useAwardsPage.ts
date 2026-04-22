import { deleteAward, fetchAwards, modifyAward, uploadAward } from "#/api/awards/awards";
import { fetchProjects } from "#/api/projects/projects";
import { useAlertDialogStore } from "#/stores/use-alert-dialog-store";
import type { Award, AwardRequest, AwardType } from "#/types/award";
import type { Project } from "#/types/project";
import { useForm } from "@tanstack/react-form";
import { useQueryClient, useSuspenseQuery, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import z from "zod";

const awardSchema = z.object({
    title: z.string().min(1, "Title is required"),
    issuer: z.string().min(1, "Issuer is required"),
    date: z.date().refine(date => date.getFullYear() >= 2001, "Date must be after your birth year"),
    type: z.enum(["Competition", "Academic", "Scholarship", "Recognition", "Other"]),
    description: z.string(),
    projectId: z.string(),
})

const useAwardsPageController = () => {
    const queryClient = useQueryClient();

    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showDetailDialog, setShowDetailDialog] = useState(false);
    const [selectedData, setSelectedData] = useState<Award | null>(null);
    const [detailData, setDetailData] = useState<Award | null>(null);
    const [detailProject, setDetailProject] = useState<Project | null>(null);
    const [showProjectDetail, setShowProjectDetail] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [typeFilter, setTypeFilter] = useState<AwardType[]>([]);
    const [dateRangeFilter, setDateRangeFilter] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });

    const { openDialog } = useAlertDialogStore();

    const form = useForm({
        defaultValues: {
            title: "",
            issuer: "",
            date: new Date(),
            type: "Competition" as AwardType,
            description: "",
            projectId: "",
        },
        validators: {
            onSubmit: awardSchema
        },
        onSubmit: async ({ value }) => {
            const raw = {
                title: value.title,
                issuer: value.issuer,
                date: value.date,
                type: value.type,
                ...(value.description ? { description: value.description } : {}),
                ...(value.projectId ? { projectId: value.projectId } : {}),
            }
            const payload = raw as AwardRequest
            const operation = selectedData
                ? modifyAward(payload, selectedData.id)
                : uploadAward(payload);

            toast.promise(
                operation.then(async () => {
                    await queryClient.invalidateQueries({ queryKey: ["awards"] });
                    setSelectedData(null);
                    form.reset();
                    setShowAddDialog(false);
                }),
                {
                    loading: selectedData ? "Modifying award..." : "Uploading award...",
                    success: selectedData ? "Award modified successfully!" : "Award uploaded successfully!",
                    error: (e) => selectedData ? `Failed to modify award: ${e.message}` : `Failed to upload award: ${e.message}`,
                }
            );
        },
    });

    const { data } = useSuspenseQuery({
        queryKey: ["awards"],
        queryFn: async () => fetchAwards(),
    });

    const { data: allProjects = [] } = useQuery({
        queryKey: ["projects"],
        queryFn: fetchProjects,
        staleTime: 1000 * 60 * 10,
    });

    const filteredData = data.filter((a) => {
        if (searchText.trim()) {
            const q = searchText.toLowerCase();
            const matches =
                a.title.toLowerCase().includes(q) ||
                a.issuer.toLowerCase().includes(q) ||
                a.description?.toLowerCase().includes(q);
            if (!matches) return false;
        }

        if (typeFilter.length > 0 && !typeFilter.includes(a.type)) return false;

        if (dateRangeFilter.from) {
            const filterTo = dateRangeFilter.to ?? new Date();
            if (a.date < dateRangeFilter.from || a.date > filterTo) return false;
        }

        return true;
    });

    const groupedData = filteredData.reduce((acc: Record<number, Award[]>, current) => {
        const key = current.date.getFullYear();
        if (!acc[key]) acc[key] = [];
        acc[key].push(current);
        return acc;
    }, {});

    const onCardClick = (award: Award) => {
        setDetailData(award);
        setShowDetailDialog(true);
    };

    const onModifyButtonClick = (award: Award) => {
        setSelectedData(award);
        form.setFieldValue("title", award.title);
        form.setFieldValue("issuer", award.issuer);
        form.setFieldValue("date", new Date(award.date));
        form.setFieldValue("type", award.type);
        form.setFieldValue("description", award.description ?? "");
        form.setFieldValue("projectId", award.projectId ?? "");
        setShowAddDialog(true);
    };

    const handleViewProject = (projectId: string) => {
        const project = allProjects.find(p => p.id === projectId);
        if (project) {
            setDetailProject(project);
            setShowProjectDetail(true);
        }
    };

    const handleDetailDialogClose = (open: boolean) => {
        if (!open) setDetailData(null);
        setShowDetailDialog(open);
    };

    const onDeleteButtonClick = (award: Award) => {
        openDialog({
            title: "Confirm Deletion",
            description: `Are you sure you want to delete "${award.title}"?`,
            onConfirm: async () => {
                toast.promise(
                    deleteAward(award.id).then(async () => {
                        await queryClient.invalidateQueries({ queryKey: ["awards"] });
                    }),
                    {
                        loading: "Deleting award...",
                        success: "Award deleted successfully!",
                        error: (e) => `Failed to delete award: ${e.message}`,
                    }
                );
            },
            isDestructive: true,
        });
    };

    const handleDialogClose = (open: boolean) => {
        if (!open) {
            setSelectedData(null);
            form.reset();
        }
        setShowAddDialog(open);
    };

    return {
        form,
        showAddDialog,
        handleDialogClose,
        showDetailDialog,
        handleDetailDialogClose,
        selectedData,
        detailData,
        groupedData,
        searchText,
        setSearchText,
        typeFilter,
        setTypeFilter,
        dateRangeFilter,
        setDateRangeFilter,
        onCardClick,
        onModifyButtonClick,
        onDeleteButtonClick,
        allProjects,
        detailProject,
        showProjectDetail,
        setShowProjectDetail,
        handleViewProject,
    };
};

export type AwardFormInstance = ReturnType<typeof useAwardsPageController>["form"];

export { useAwardsPageController };
