import {
  createNews,
  deleteNews,
  fetchNews,
  modifyNews,
} from '#/api/news/news'
import { fetchProjects } from '#/api/projects/projects'
import { useAlertDialogStore } from '#/stores/use-alert-dialog-store'
import type { News, NewsCategory } from '#/types/news'
import type { GalleryImage } from '#/types/gallery'
import type { Project } from '#/types/project'
import { useForm } from '@tanstack/react-form'
import { useQueryClient, useSuspenseQuery, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'
import * as z from 'zod'

const useNewsPageController = () => {
  const queryClient = useQueryClient()

  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [selectedData, setSelectedData] = useState<News | null>(null)
  const [detailData, setDetailData] = useState<News | null>(null)
  const [detailProject, setDetailProject] = useState<Project | null>(null)
  const [showProjectDetail, setShowProjectDetail] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<NewsCategory[]>([])
  const [dateRangeFilter, setDateRangeFilter] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null })

  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<GalleryImage[]>([])
  const [deletedImagePaths, setDeletedImagePaths] = useState<string[]>([])

  const { openDialog } = useAlertDialogStore()

  const newsSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    date: z.date(),
    category: z.enum([
      'Award',
      'Research',
      'Publication',
      'Activity',
      'Press',
      'Other',
    ]),
    description: z.string().min(1, 'Description is required'),
    link: z.string(),
    projectId: z.string(),
  })

  const form = useForm({
    defaultValues: {
      title: '',
      date: new Date(),
      category: 'Other' as NewsCategory,
      description: '',
      link: '',
      projectId: '',
    },
    validators: {
      onSubmit: newsSchema,
    },
    onSubmit: async ({ value }) => {
      const newsPayload = {
        title: value.title,
        date: value.date,
        category: value.category,
        description: value.description,
        link: value.link || undefined,
        projectId: value.projectId || undefined,
      }
      const operation = selectedData
        ? modifyNews(newsPayload, selectedData.id, existingImages, pendingFiles, deletedImagePaths)
        : createNews(newsPayload, pendingFiles)

      toast.promise(
        operation.then(async () => {
          await queryClient.invalidateQueries({ queryKey: ['news'] })
          setSelectedData(null)
          form.reset()
          setPendingFiles([])
          setExistingImages([])
          setDeletedImagePaths([])
          setShowAddDialog(false)
        }),
        {
          loading: selectedData ? 'Saving changes...' : 'Uploading news...',
          success: selectedData
            ? 'News updated successfully!'
            : 'News uploaded successfully!',
          error: (e) =>
            selectedData
              ? `Failed to update news: ${e.message}`
              : `Failed to create news: ${e.message}`,
        },
      )
    },
  })

  const { data } = useSuspenseQuery({
    queryKey: ['news'],
    queryFn: async () => fetchNews(),
  })

  const { data: allProjects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    staleTime: 1000 * 60 * 10,
  })

  const filteredData = data.filter((n) => {
    const matchesSearch = searchText.trim()
      ? n.title.toLowerCase().includes(searchText.toLowerCase()) ||
        n.description.toLowerCase().includes(searchText.toLowerCase())
      : true

    const matchesCategory =
      categoryFilter.length === 0 || categoryFilter.includes(n.category)

    if (dateRangeFilter.from) {
      const d = new Date(n.date)
      const filterTo = dateRangeFilter.to ?? new Date()
      if (d < dateRangeFilter.from || d > filterTo) return false
    }

    return matchesSearch && matchesCategory
  })

  const sortedData = [...filteredData].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  const onCardClick = (news: News) => {
    setDetailData(news)
    setShowDetailDialog(true)
  }

  const handleViewProject = (projectId: string) => {
    const project = allProjects.find(p => p.id === projectId)
    if (project) {
      setDetailProject(project)
      setShowProjectDetail(true)
    }
  }

  const onModifyButtonClick = (news: News) => {
    setSelectedData(news)
    form.setFieldValue('title', news.title)
    form.setFieldValue('date', new Date(news.date))
    form.setFieldValue('category', news.category)
    form.setFieldValue('description', news.description)
    form.setFieldValue('link', news.link ?? '')
    form.setFieldValue('projectId', news.projectId ?? '')
    setExistingImages(news.images)
    setDeletedImagePaths([])
    setPendingFiles([])
    setShowAddDialog(true)
  }

  const onDeleteButtonClick = (news: News) => {
    openDialog({
      title: 'Confirm Deletion',
      description: `Are you sure you want to delete "${news.title}"? All images will be permanently removed.`,
      onConfirm: async () => {
        toast.promise(
          deleteNews(news.id, news.images).then(async () => {
            await queryClient.invalidateQueries({ queryKey: ['news'] })
          }),
          {
            loading: 'Deleting news...',
            success: 'News deleted successfully!',
            error: (e) => `Failed to delete news: ${e.message}`,
          },
        )
      },
      isDestructive: true,
    })
  }

  const handleAddDialogClose = (open: boolean) => {
    if (!open) {
      setSelectedData(null)
      form.reset()
      setPendingFiles([])
      setExistingImages([])
      setDeletedImagePaths([])
    }
    setShowAddDialog(open)
  }

  const handleDetailDialogClose = (open: boolean) => {
    if (!open) setDetailData(null)
    setShowDetailDialog(open)
  }

  const onMarkImageForDeletion = (path: string) => {
    setDeletedImagePaths((prev) => [...prev, path])
  }

  const onUnmarkImageForDeletion = (path: string) => {
    setDeletedImagePaths((prev) => prev.filter((p) => p !== path))
  }

  return {
    form,
    showAddDialog,
    showDetailDialog,
    handleAddDialogClose,
    handleDetailDialogClose,
    selectedData,
    detailData,
    sortedData,
    searchText,
    setSearchText,
    categoryFilter,
    setCategoryFilter,
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
    allProjects,
    detailProject,
    showProjectDetail,
    setShowProjectDetail,
    handleViewProject,
  }
}

export type NewsFormInstance = ReturnType<
  typeof useNewsPageController
>['form']

export { useNewsPageController }
