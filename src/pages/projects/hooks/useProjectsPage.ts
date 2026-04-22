import {
    createProject,
    deleteProject,
    fetchProjects,
    modifyProject,
    uploadProjectLogo,
    updateProjectLogoUrl,
} from '#/api/projects/projects'
import { fetchExperience } from '#/api/experience/experience'
import { useAlertDialogStore } from '#/stores/use-alert-dialog-store'
import type { Project, ProjectMember } from '#/types/project'
import type { GalleryImage } from '#/types/gallery'
import type { TechStackItem } from '#/types/experience'
import { useForm } from '@tanstack/react-form'
import { useQueryClient, useSuspenseQuery, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'

const useProjectsPageController = () => {
    const queryClient = useQueryClient()

    const [showAddDialog, setShowAddDialog] = useState(false)
    const [showDetailDialog, setShowDetailDialog] = useState(false)
    const [selectedData, setSelectedData] = useState<Project | null>(null)
    const [detailData, setDetailData] = useState<Project | null>(null)
    const [searchText, setSearchText] = useState('')
    const [techFilter, setTechFilter] = useState<string[]>([])
    const [dateRangeFilter, setDateRangeFilter] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null })
    const [experienceFilter, setExperienceFilter] = useState<string>('')

    const [pendingFiles, setPendingFiles] = useState<File[]>([])
    const [existingImages, setExistingImages] = useState<GalleryImage[]>([])
    const [deletedImagePaths, setDeletedImagePaths] = useState<string[]>([])
    const [richDescription, setRichDescription] = useState('')
    const [logoFile, setLogoFile] = useState<File | null>(null)
    const [existingLogoUrl, setExistingLogoUrl] = useState<string | undefined>(undefined)

    const { openDialog } = useAlertDialogStore()

    const form = useForm({
        defaultValues: {
            title: '',
            techStack: [] as TechStackItem[],
            members: [] as ProjectMember[],
            link: '',
            githubUrl: '',
            startDate: new Date(),
            endDate: null as Date | null,
            isOngoing: true,
            isExperimental: false,
            experienceId: '' as string,
        },
        onSubmit: async ({ value }) => {
            if (!value.title.trim()) {
                toast.error('Title is required.')
                return
            }
            if (!richDescription || richDescription === '<p></p>') {
                toast.error('Description is required.')
                return
            }
            if (value.members.length === 0) {
                toast.error('Please add at least one team member.')
                return
            }
            if (!selectedData && pendingFiles.length === 0) {
                toast.error('Please select at least one image.')
                return
            }

            const payload = {
                title: value.title,
                description: richDescription,
                techStack: value.techStack,
                members: value.members,
                link: value.link || undefined,
                githubUrl: value.githubUrl || undefined,
                startDate: value.startDate,
                endDate: value.isOngoing ? null : value.endDate,
                isOngoing: value.isOngoing,
                isExperimental: value.isExperimental,
                logoUrl: existingLogoUrl,
                experienceId: value.experienceId || undefined,
            }

            const operation = async () => {
                if (selectedData) {
                    let logoUrl = existingLogoUrl
                    if (logoFile) {
                        logoUrl = await uploadProjectLogo(selectedData.id, logoFile)
                    }
                    return modifyProject(
                        { ...payload, logoUrl },
                        selectedData.id,
                        existingImages,
                        pendingFiles,
                        deletedImagePaths,
                    )
                } else {
                    const created = await createProject(payload, pendingFiles)
                    if (logoFile) {
                        const logoUrl = await uploadProjectLogo(created.id, logoFile)
                        await updateProjectLogoUrl(created.id, logoUrl)
                    }
                    return created
                }
            }

            toast.promise(
                operation().then(async () => {
                    await queryClient.invalidateQueries({
                        queryKey: ['projects'],
                    })
                    resetForm()
                }),
                {
                    loading: selectedData ? 'Saving project...' : 'Creating project...',
                    success: selectedData
                        ? 'Project updated!'
                        : 'Project created!',
                    error: (e) => `Failed: ${e.message}`,
                },
            )
        },
    })

    const { data } = useSuspenseQuery({
        queryKey: ['projects'],
        queryFn: fetchProjects,
    })

    const { data: allExperiences = [] } = useQuery({
        queryKey: ['experience'],
        queryFn: fetchExperience,
        staleTime: 1000 * 60 * 10,
    })

    const allTechNames = Array.from(
        new Set(data.flatMap((p) => p.techStack.map((t) => t.name))),
    ).sort()

    const filteredData = data.filter((p) => {
        if (searchText.trim()) {
            const q = searchText.toLowerCase()
            const matches =
                p.title.toLowerCase().includes(q) ||
                p.techStack.some((t) => t.name.toLowerCase().includes(q))
            if (!matches) return false
        }
        if (
            techFilter.length > 0 &&
            !techFilter.every((f) => p.techStack.some((t) => t.name === f))
        ) {
            return false
        }
        if (dateRangeFilter.from) {
            const start = new Date(p.startDate)
            const end = p.isOngoing || !p.endDate ? new Date() : new Date(p.endDate)
            const filterTo = dateRangeFilter.to ?? new Date()
            if (!(start <= filterTo && end >= dateRangeFilter.from)) return false
        }
        if (experienceFilter && p.experienceId !== experienceFilter) return false
        return true
    })

    const resetForm = () => {
        setSelectedData(null)
        form.reset({ title: '', techStack: [], members: [], link: '', githubUrl: '', startDate: new Date(), endDate: null, isOngoing: true, isExperimental: false, experienceId: '' })
        setRichDescription('')
        setPendingFiles([])
        setExistingImages([])
        setDeletedImagePaths([])
        setLogoFile(null)
        setExistingLogoUrl(undefined)
        setShowAddDialog(false)
    }

    const onCardClick = (project: Project) => {
        setDetailData(project)
        setShowDetailDialog(true)
    }

    const onModifyButtonClick = (project: Project) => {
        setSelectedData(project)
        form.setFieldValue('title', project.title)
        form.setFieldValue('techStack', project.techStack)
        form.setFieldValue('members', project.members ?? [])
        form.setFieldValue('link', project.link ?? '')
        form.setFieldValue('githubUrl', project.githubUrl ?? '')
        form.setFieldValue('startDate', new Date(project.startDate))
        form.setFieldValue(
            'endDate',
            project.endDate ? new Date(project.endDate) : null,
        )
        form.setFieldValue('isOngoing', project.isOngoing)
        form.setFieldValue('isExperimental', project.isExperimental ?? false)
        form.setFieldValue('experienceId', project.experienceId ?? '')
        setRichDescription(project.description)
        setExistingImages(project.images)
        setDeletedImagePaths([])
        setPendingFiles([])
        setExistingLogoUrl(project.logoUrl)
        setLogoFile(null)
        setShowAddDialog(true)
    }

    const onDeleteButtonClick = (project: Project) => {
        openDialog({
            title: 'Confirm Deletion',
            description: `Are you sure you want to delete "${project.title}"? All images will be permanently removed.`,
            onConfirm: async () => {
                toast.promise(
                    deleteProject(project.id, project.images).then(async () => {
                        await queryClient.invalidateQueries({
                            queryKey: ['projects'],
                        })
                    }),
                    {
                        loading: 'Deleting project...',
                        success: 'Project deleted!',
                        error: (e) => `Failed to delete: ${e.message}`,
                    },
                )
            },
            isDestructive: true,
        })
    }

    const handleAddDialogClose = (open: boolean) => {
        if (!open) resetForm()
        else setShowAddDialog(true)
    }

    const handleDetailDialogClose = (open: boolean) => {
        if (!open) setDetailData(null)
        setShowDetailDialog(open)
    }

    const onMarkImageForDeletion = (path: string) =>
        setDeletedImagePaths((prev) => [...prev, path])

    const onUnmarkImageForDeletion = (path: string) =>
        setDeletedImagePaths((prev) => prev.filter((p) => p !== path))

    return {
        form,
        showAddDialog,
        showDetailDialog,
        handleAddDialogClose,
        handleDetailDialogClose,
        selectedData,
        detailData,
        filteredData,
        allTechNames,
        searchText,
        setSearchText,
        techFilter,
        setTechFilter,
        dateRangeFilter,
        setDateRangeFilter,
        experienceFilter,
        setExperienceFilter,
        allExperiences,
        richDescription,
        setRichDescription,
        pendingFiles,
        setPendingFiles,
        existingImages,
        deletedImagePaths,
        onMarkImageForDeletion,
        onUnmarkImageForDeletion,
        logoFile,
        setLogoFile,
        existingLogoUrl,
        setExistingLogoUrl,
        onCardClick,
        onModifyButtonClick,
        onDeleteButtonClick,
    }
}

export type ProjectFormInstance = ReturnType<
    typeof useProjectsPageController
>['form']

export { useProjectsPageController }
