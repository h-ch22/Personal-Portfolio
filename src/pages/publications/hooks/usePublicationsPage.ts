import { deletePublication, fetchPublications, modifyPublication, uploadPublication } from "#/api/publications/publications";
import { useAlertDialogStore } from "#/stores/use-alert-dialog-store";
import { type PublicationType, type Publication } from "#/types/publication";
import { useForm } from "@tanstack/react-form";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";

const publicationSchema = z.object({
    title: z.string().min(1, "Title is required"),
    journal: z.string().min(1, "Journal is required"),
    authors: z.array(z.string()).min(1, "At least one author is required"),
    publicationYear: z.number().int().min(2001, "Publication year must be after your birth year"),
    publicationMonth: z.number().int().min(1, "Publication month must be between 1 and 12").max(12, "Publication month must be between 1 and 12"),
    type: z.enum(["International Journal", "International Conference", "Domestic Journal", "Domestic Conference", "Patent", "Book"]),
    link: z.string()
})

const usePublicationsPageController = () => {
    const queryClient = useQueryClient();

    const [showAddDialog, setShowAddDialog] = useState(false);
    const [selectedData, setSelectedData] = useState<Publication | null>(null);
    const [selectedFilter, setSelectedFilter] = useState<PublicationType>("International Journal");
    const [searchText, setSearchText] = useState("");
    const [dateRangeFilter, setDateRangeFilter] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });
    
    const { openDialog } = useAlertDialogStore();

    const form = useForm({
        defaultValues: {
            title: "",
            journal: "",
            authors: [] as string[],
            publicationYear: new Date().getFullYear(),
            publicationMonth: new Date().getMonth() + 1,
            type: "International Journal" as Publication["type"],
            link: ""
        },
        validators: {
            onSubmit: publicationSchema,
        },
        onSubmit: async ({ value }) => {
            if(value.link !== "" && !value.link.startsWith("http") && !value.link.startsWith("https")) {
                toast.error("Please enter a valid URL for the link field.");
                return;
            }

            const opeartion = selectedData
                ? modifyPublication(value, selectedData.id)
                : uploadPublication(value);

            toast.promise(
                opeartion.then(async () => {
                    await queryClient.invalidateQueries({ queryKey: ["publications"] });
                    setSelectedData(null);
                    form.reset();
                    setShowAddDialog(false);
                }),
                {
                    loading: selectedData ? "Modifying publication..." : "Uploading publication...",
                    success: selectedData ? "Publication modified successfully!" : "Publication uploaded successfully!",
                    error: selectedData ? "Failed to modify publication." : "Failed to upload publication."
                }
            );
        }
    });

    const { data } = useSuspenseQuery({
        queryKey: ["publications"],
        queryFn: async () => fetchPublications()
    });

    const isSearching = searchText.trim() !== "";

    const filteredData = data.filter((p) => {
        if (!isSearching && p.type !== selectedFilter) return false;

        if (isSearching) {
            const q = searchText.toLowerCase();
            const matchesText =
                p.title.toLowerCase().includes(q) ||
                p.journal.toLowerCase().includes(q) ||
                p.authors.some((a) => a.toLowerCase().includes(q));
            if (!matchesText) return false;
        }

        if (dateRangeFilter.from) {
            const pubDate = new Date(p.publicationYear, p.publicationMonth - 1, 1);
            const filterTo = dateRangeFilter.to ?? new Date();
            if (pubDate < dateRangeFilter.from || pubDate > filterTo) return false;
        }

        return true;
    });

    const groupedData = filteredData
        .reduce((acc: Record<number, Publication[]>, current) => {
            const key = current.publicationYear;

            if(!acc[key]) {
                acc[key] = [];
            }

            acc[key].push(current);
            return acc;
        }, {});

    const sortedGroupedData = Object.fromEntries(
        Object.entries(groupedData).sort(([a], [b]) => Number(b) - Number(a))
    );

    const onModifyButtonClick = (publication: Publication) => {
        setSelectedData(publication);
        form.setFieldValue("title", publication.title);
        form.setFieldValue("journal", publication.journal);
        form.setFieldValue("authors", publication.authors);
        form.setFieldValue("publicationYear", publication.publicationYear);
        form.setFieldValue("publicationMonth", publication.publicationMonth);
        form.setFieldValue("type", publication.type);
        form.setFieldValue("link", publication.link);
        setShowAddDialog(true);
    };

    const onDeleteButtonClick = (data: Publication) => {
        openDialog({
            title: "Confirm Deletion",
            description: "Are you sure you want to delete this publication? This action cannot be undone.",
            onConfirm: async () => {
                toast.promise(
                    deletePublication(data.id).then(async () => {
                        await queryClient.invalidateQueries({ queryKey: ["publications"] });
                    }),
                    {
                        loading: "Deleting publication...",
                        success: "Publication deleted successfully!",
                        error: (e) => `Failed to delete publication: ${e.message}`
                    }
                )
            },
            isDestructive: true
        })
    }

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
        groupedData: sortedGroupedData,
        isSearching,
        onModifyButtonClick,
        onDeleteButtonClick,
        selectedFilter,
        setSelectedFilter,
        searchText,
        setSearchText,
        dateRangeFilter,
        setDateRangeFilter,
    }
}

export type PublicationFormInstance = ReturnType<typeof usePublicationsPageController>["form"];

export { usePublicationsPageController }