import {
  fetchBannerImage,
  fetchBannerText,
  updateBannerText,
} from '#/api/banner/banner'
import { fetchGalleries } from '#/api/gallery/gallery'
import { fetchNews } from '#/api/news/news'
import { fetchPublications } from '#/api/publications/publications'
import {
  createTechStack,
  deleteTechStack,
  fetchTechStacks,
} from '#/api/techstack/techstack'
import { storage } from '#/lib/firebase'
import { useAuthStore } from '#/stores/use-auth-store'
import type { TechStackCategory, TechStackRequest } from '#/types/techstack'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const useHomeViewController = () => {
  const queryClient = useQueryClient()

  const isAdmin = useAuthStore((state) => state.isAdmin)
  const user = useAuthStore((state) => state.user)

  const [isLoaded, setIsLoaded] = useState(false)
  const [showContent, setShowContent] = useState(false)

  const [isEditingBanner, setIsEditingBanner] = useState(false)
  const [bannerTextInput, setBannerTextInput] = useState('')

  const [showAddTechStack, setShowAddTechStack] = useState(false)
  const [techStackForm, setTechStackForm] = useState<TechStackRequest>({
    name: '',
    icon: '',
    category: 'Language' as TechStackCategory,
  })

  const { data: bannerImage, isSuccess } = useQuery({
    queryKey: ['bannerImage'],
    queryFn: fetchBannerImage,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 30,
    enabled: typeof window !== 'undefined' && !!storage,
  })

  const { data: bannerText = 'Yujee Chang' } = useQuery({
    queryKey: ['bannerText'],
    queryFn: fetchBannerText,
    staleTime: 1000 * 60 * 30,
  })

  const { mutate: saveBannerText, isPending: isSavingBanner } = useMutation({
    mutationFn: (text: string) => updateBannerText(text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bannerText'] })
      setIsEditingBanner(false)
      toast.success('Banner text updated!')
    },
    onError: (e: any) => {
      toast.error(`Failed to update banner text: ${e.message}`)
    },
  })

  const { data: publications = [] } = useQuery({
    queryKey: ['publications'],
    queryFn: fetchPublications,
    staleTime: 1000 * 60 * 10,
    select: (data) =>
      [...data]
        .sort((a, b) =>
          b.publicationYear !== a.publicationYear
            ? b.publicationYear - a.publicationYear
            : b.publicationMonth - a.publicationMonth,
        )
        .slice(0, 5),
  })

  const { data: news = [] } = useQuery({
    queryKey: ['news'],
    queryFn: fetchNews,
    staleTime: 1000 * 60 * 10,
    select: (data) =>
      [...data].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5),
  })

  const { data: galleries = [] } = useQuery({
    queryKey: ['galleries'],
    queryFn: fetchGalleries,
    staleTime: 1000 * 60 * 10,
    select: (data) =>
      [...data].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5),
  })

  const { data: techStacks = [] } = useQuery({
    queryKey: ['techStacks'],
    queryFn: fetchTechStacks,
    staleTime: 1000 * 60 * 10,
  })

  const { mutate: addTechStack, isPending: isAddingTechStack } = useMutation({
    mutationFn: (data: TechStackRequest) => createTechStack(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['techStacks'] })
      setShowAddTechStack(false)
      setTechStackForm({ name: '', icon: '', category: 'Language' })
      toast.success('Tech stack added!')
    },
    onError: (e: any) => {
      toast.error(`Failed to add tech stack: ${e.message}`)
    },
  })

  const { mutate: removeTechStack } = useMutation({
    mutationFn: (id: string) => deleteTechStack(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['techStacks'] })
      toast.success('Tech stack removed!')
    },
    onError: (e: any) => {
      toast.error(`Failed to remove tech stack: ${e.message}`)
    },
  })

  const handleBannerEditStart = () => {
    setBannerTextInput(bannerText)
    setIsEditingBanner(true)
  }

  const handleBannerSave = () => {
    if (bannerTextInput.trim()) {
      saveBannerText(bannerTextInput.trim())
    }
  }

  const handleBannerCancel = () => {
    setIsEditingBanner(false)
    setBannerTextInput('')
  }

  useEffect(() => {
    if (isSuccess) {
      setIsLoaded(true)
      const timer = setTimeout(() => setShowContent(true), 500)
      return () => clearTimeout(timer)
    }
  }, [isSuccess])

  return {
    isLoaded,
    bannerImage,
    showContent,
    bannerText,
    isEditingBanner,
    bannerTextInput,
    setBannerTextInput,
    isSavingBanner,
    handleBannerEditStart,
    handleBannerSave,
    handleBannerCancel,
    publications,
    news,
    galleries,
    techStacks,
    isAdmin,
    user,
    showAddTechStack,
    setShowAddTechStack,
    techStackForm,
    setTechStackForm,
    isAddingTechStack,
    addTechStack,
    removeTechStack,
  }
}

export { useHomeViewController }
