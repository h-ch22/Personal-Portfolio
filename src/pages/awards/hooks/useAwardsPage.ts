import { deleteAward, fetchAwards, modifyAward, uploadAward } from "#/api/awards/awards";
import { useAlertDialogStore } from "#/stores/use-alert-dialog-store";
import type { Award, AwardType } from "#/types/award";
import { useForm } from "@tanstack/react-form";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

const useAwardsPageController = () => {
    const queryClient = useQueryClient();

    const [showAddDialog, setShowAddDialog] = useState(false);
    const [selectedData, setSelectedData] = useState<Award | null>(null);
    const [searchText, setSearchText] = useState("");
    const [typeFilter, setTypeFilter] = useState<AwardType[]>([]);

    const { openDialog } = useAlertDialogStore();

    const form = useForm({
        defaultValues: {
            title: "",
            issuer: "",
            date: new Date(),
            type: "Competition" as AwardType,
            description: "",
        },
        onSubmit: async ({ value }) => {
            if (!value.title.trim()) {
                toast.error("Title is required.");
                return;
            }
            if (!value.issuer.trim()) {
                toast.error("Issuer is required.");
                return;
            }
            if (value.date.getFullYear() < 2001) {
                toast.error("Date must be after your birth year.");
                return;
            }

            const operation = selectedData
                ? modifyAward(value, selectedData.id)
                : uploadAward(value);

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

        return true;
    });

    const groupedData = filteredData.reduce((acc: Record<number, Award[]>, current) => {
        const key = current.date.getFullYear();
        if (!acc[key]) acc[key] = [];
        acc[key].push(current);
        return acc;
    }, {});

    const onModifyButtonClick = (award: Award) => {
        setSelectedData(award);
        form.setFieldValue("title", award.title);
        form.setFieldValue("issuer", award.issuer);
        form.setFieldValue("date", new Date(award.date));
        form.setFieldValue("type", award.type);
        form.setFieldValue("description", award.description ?? "");
        setShowAddDialog(true);
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
        selectedData,
        groupedData,
        searchText,
        setSearchText,
        typeFilter,
        setTypeFilter,
        onModifyButtonClick,
        onDeleteButtonClick,
    };
};

export type AwardFormInstance = ReturnType<typeof useAwardsPageController>["form"];

export { useAwardsPageController };
