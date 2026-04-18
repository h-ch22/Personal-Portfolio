import {
    createGallery,
    deleteGallery,
    fetchGalleries,
    modifyGallery,
} from "#/api/gallery/gallery";
import { useAlertDialogStore } from "#/stores/use-alert-dialog-store";
import type { Gallery, GalleryImage } from "#/types/gallery";
import { useForm } from "@tanstack/react-form";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import * as z from 'zod'

const useGalleryPageController = () => {
    const queryClient = useQueryClient();

    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showDetailDialog, setShowDetailDialog] = useState(false);
    const [selectedData, setSelectedData] = useState<Gallery | null>(null);
    const [detailData, setDetailData] = useState<Gallery | null>(null);
    const [searchText, setSearchText] = useState("");
    const [dateRangeFilter, setDateRangeFilter] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });

    const [pendingFiles, setPendingFiles] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<GalleryImage[]>([]);
    const [deletedImagePaths, setDeletedImagePaths] = useState<string[]>([]);

    const { openDialog } = useAlertDialogStore();

    const gallerySchema = z.object({
        title: z.string().min(1, "Title is required"),
        description: z.string(),
        date: z.date(),
    })

    const form = useForm({
        defaultValues: {
            title: "",
            description: "",
            date: new Date(),
        },
        validators: {
            onSubmit: gallerySchema
        },
        onSubmit: async ({ value }) => {
            if (!selectedData && pendingFiles.length === 0) {
                toast.error("Please select at least one image.");
                return;
            }

            const operation = selectedData
                ? modifyGallery(
                      {
                          title: value.title,
                          description: value.description || undefined,
                          date: value.date,
                      },
                      selectedData.id,
                      existingImages,
                      pendingFiles,
                      deletedImagePaths,
                  )
                : createGallery(
                      {
                          title: value.title,
                          description: value.description || undefined,
                          date: value.date,
                      },
                      pendingFiles,
                  );

            toast.promise(
                operation.then(async () => {
                    await queryClient.invalidateQueries({
                        queryKey: ["gallery"],
                    });
                    setSelectedData(null);
                    form.reset();
                    setPendingFiles([]);
                    setExistingImages([]);
                    setDeletedImagePaths([]);
                    setShowAddDialog(false);
                }),
                {
                    loading: selectedData
                        ? "Saving changes..."
                        : "Uploading post...",
                    success: selectedData
                        ? "Post updated successfully!"
                        : "Post uploaded successfully!",
                    error: (e) =>
                        selectedData
                            ? `Failed to update gallery: ${e.message}`
                            : `Failed to create post: ${e.message}`,
                },
            );
        },
    });

    const { data } = useSuspenseQuery({
        queryKey: ["gallery"],
        queryFn: async () => fetchGalleries(),
    });

    const filteredData = data.filter((g) => {
        if (searchText.trim()) {
            const q = searchText.toLowerCase();
            const matchesText =
                g.title.toLowerCase().includes(q) ||
                g.description?.toLowerCase().includes(q);
            if (!matchesText) return false;
        }

        if (dateRangeFilter.from) {
            const d = new Date(g.date);
            const filterTo = dateRangeFilter.to ?? new Date();
            if (d < dateRangeFilter.from || d > filterTo) return false;
        }

        return true;
    });

    const onCardClick = (gallery: Gallery) => {
        setDetailData(gallery);
        setShowDetailDialog(true);
    };

    const onModifyButtonClick = (gallery: Gallery) => {
        setSelectedData(gallery);
        form.setFieldValue("title", gallery.title);
        form.setFieldValue("description", gallery.description ?? "");
        form.setFieldValue("date", new Date(gallery.date));
        setExistingImages(gallery.images);
        setDeletedImagePaths([]);
        setPendingFiles([]);
        setShowAddDialog(true);
    };

    const onDeleteButtonClick = (gallery: Gallery) => {
        openDialog({
            title: "Confirm Deletion",
            description: `Are you sure you want to delete "${gallery.title}"? All images will be permanently removed.`,
            onConfirm: async () => {
                toast.promise(
                    deleteGallery(gallery.id, gallery.images).then(async () => {
                        await queryClient.invalidateQueries({
                            queryKey: ["gallery"],
                        });
                    }),
                    {
                        loading: "Deleting gallery...",
                        success: "Gallery deleted successfully!",
                        error: (e) => `Failed to delete gallery: ${e.message}`,
                    },
                );
            },
            isDestructive: true,
        });
    };

    const handleAddDialogClose = (open: boolean) => {
        if (!open) {
            setSelectedData(null);
            form.reset();
            setPendingFiles([]);
            setExistingImages([]);
            setDeletedImagePaths([]);
        }
        setShowAddDialog(open);
    };

    const handleDetailDialogClose = (open: boolean) => {
        if (!open) setDetailData(null);
        setShowDetailDialog(open);
    };

    const onMarkImageForDeletion = (path: string) => {
        setDeletedImagePaths((prev) => [...prev, path]);
    };

    const onUnmarkImageForDeletion = (path: string) => {
        setDeletedImagePaths((prev) => prev.filter((p) => p !== path));
    };

    return {
        form,
        showAddDialog,
        showDetailDialog,
        handleAddDialogClose,
        handleDetailDialogClose,
        selectedData,
        detailData,
        filteredData,
        searchText,
        setSearchText,
        dateRangeFilter,
        setDateRangeFilter,
        pendingFiles,
        setPendingFiles,
        existingImages,
        deletedImagePaths,
        onMarkImageForDeletion,
        onUnmarkImageForDeletion,
        onCardClick,
        onModifyButtonClick,
        onDeleteButtonClick,
    };
};

export type GalleryFormInstance = ReturnType<
    typeof useGalleryPageController
>["form"];

export { useGalleryPageController };
