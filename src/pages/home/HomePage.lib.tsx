import {
  fetchBannerImage,
  fetchBannerText,
  fetchFeaturedProjectIds,
  fetchHomeDescription,
  fetchProfileImage,
  updateBannerText,
  updateFeaturedProjectIds,
  updateHomeDescription,
  uploadBannerImage,
  uploadProfileImage,
} from '#/api/banner/banner'
import { fetchGalleries } from '#/api/gallery/gallery'
import { fetchNews } from '#/api/news/news'
import { fetchProjects } from '#/api/projects/projects'
import { fetchPublications } from '#/api/publications/publications'
import {
  createSocialLink,
  deleteSocialLink,
  fetchSocialLinks,
} from '#/api/sociallinks/sociallinks'
import {
  createTechStack,
  deleteTechStack,
  fetchTechStacks,
} from '#/api/techstack/techstack'
import { CONFIG } from '#/config'
import { storage } from '#/lib/firebase'
import { useAuthStore } from '#/stores/use-auth-store'
import type { SocialLinkRequest, SocialPlatform } from '#/types/sociallink'
import type {
  TechStackCategory,
  TechStackIconType,
  TechStackRequest,
} from '#/types/techstack'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

const useHomeViewController = () => {
  const queryClient = useQueryClient()

  const isAdmin = useAuthStore((state) => state.isAdmin)
  const user = useAuthStore((state) => state.user)

  const [isLoaded, setIsLoaded] = useState(false)
  const [showContent, setShowContent] = useState(false)

  const [isEditingBanner, setIsEditingBanner] = useState(false)
  const [bannerTextInput, setBannerTextInput] = useState('')

  const bannerImageInputRef = useRef<HTMLInputElement>(null)

  const profileImageInputRef = useRef<HTMLInputElement>(null)

  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [descriptionInput, setDescriptionInput] = useState('')

  const [showAddTechStack, setShowAddTechStack] = useState(false)
  const [techStackForm, setTechStackForm] = useState<TechStackRequest>({
    name: '',
    iconType: 'emoji' as TechStackIconType,
    icon: '',
    category: 'Language' as TechStackCategory,
  })

  const [showAddSocialLink, setShowAddSocialLink] = useState(false)
  const [socialLinkForm, setSocialLinkForm] = useState<SocialLinkRequest>({
    platform: 'Email' as SocialPlatform,
    url: '',
    label: '',
  })

  const { data: bannerImage, isSuccess } = useQuery({
    queryKey: ['bannerImage'],
    queryFn: fetchBannerImage,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 30,
    enabled: !!storage,
  })

  const { data: bannerText = CONFIG.banner.bannerTextPlaceholder } = useQuery({
    queryKey: ['bannerText'],
    queryFn: fetchBannerText,
    staleTime: 1000 * 60 * 30,
  })

  const { data: profileImage } = useQuery({
    queryKey: ['profileImage'],
    queryFn: fetchProfileImage,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 30,
    enabled: !!storage,
  })

  const { data: homeDescription = '' } = useQuery({
    queryKey: ['homeDescription'],
    queryFn: fetchHomeDescription,
    staleTime: 1000 * 60 * 30,
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

  const { data: socialLinks = [] } = useQuery({
    queryKey: ['socialLinks'],
    queryFn: fetchSocialLinks,
    staleTime: 1000 * 60 * 10,
  })

  const { data: allProjects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    staleTime: 1000 * 60 * 10,
  })

  const { data: featuredProjectIds = [] } = useQuery({
    queryKey: ['featuredProjectIds'],
    queryFn: fetchFeaturedProjectIds,
    staleTime: 1000 * 60 * 10,
  })

  const featuredProjects = featuredProjectIds
    .map((id) => allProjects.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined)

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

  const { mutate: saveBannerImage, isPending: isUploadingBannerImage } =
    useMutation({
      mutationFn: (file: File) => uploadBannerImage(file),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['bannerImage'] })
        toast.success('Banner image updated!')
      },
      onError: (e: any) => {
        toast.error(`Failed to upload banner image: ${e.message}`)
      },
    })

  const { mutate: saveProfileImage, isPending: isUploadingProfileImage } =
    useMutation({
      mutationFn: (file: File) => uploadProfileImage(file),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['profileImage'] })
        toast.success('Profile image updated!')
      },
      onError: (e: any) => {
        toast.error(`Failed to upload profile image: ${e.message}`)
      },
    })

  const { mutate: saveHomeDescription, isPending: isSavingDescription } =
    useMutation({
      mutationFn: (description: string) => updateHomeDescription(description),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['homeDescription'] })
        setIsEditingDescription(false)
        toast.success('Description updated!')
      },
      onError: (e: any) => {
        toast.error(`Failed to update description: ${e.message}`)
      },
    })

  const { mutate: addTechStack, isPending: isAddingTechStack } = useMutation({
    mutationFn: (data: TechStackRequest) => createTechStack(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['techStacks'] })
      setShowAddTechStack(false)
      setTechStackForm({
        name: '',
        iconType: 'emoji',
        icon: '',
        category: 'Language',
      })
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

  const { mutate: addSocialLink, isPending: isAddingSocialLink } = useMutation({
    mutationFn: (data: SocialLinkRequest) => createSocialLink(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialLinks'] })
      setShowAddSocialLink(false)
      setSocialLinkForm({ platform: 'Email', url: '', label: '' })
      toast.success('Social link added!')
    },
    onError: (e: any) => {
      toast.error(`Failed to add social link: ${e.message}`)
    },
  })

  const { mutate: removeSocialLink } = useMutation({
    mutationFn: (id: string) => deleteSocialLink(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialLinks'] })
      toast.success('Social link removed!')
    },
    onError: (e: any) => {
      toast.error(`Failed to remove social link: ${e.message}`)
    },
  })

  const { mutate: saveFeaturedProjectIds, isPending: isSavingFeatured } =
    useMutation({
      mutationFn: (ids: string[]) => updateFeaturedProjectIds(ids),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['featuredProjectIds'] })
        toast.success('Featured projects updated!')
      },
      onError: (e: any) => {
        toast.error(`Failed to update featured projects: ${e.message}`)
      },
    })

  const handleBannerEditStart = () => {
    setBannerTextInput(bannerText)
    setIsEditingBanner(true)
  }
  const handleBannerSave = () => {
    if (bannerTextInput.trim()) saveBannerText(bannerTextInput.trim())
  }
  const handleBannerCancel = () => {
    setIsEditingBanner(false)
    setBannerTextInput('')
  }

  const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) saveBannerImage(file)
    if (bannerImageInputRef.current) bannerImageInputRef.current.value = ''
  }

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) saveProfileImage(file)
    if (profileImageInputRef.current) profileImageInputRef.current.value = ''
  }

  const handleDescriptionEditStart = () => {
    setDescriptionInput(homeDescription)
    setIsEditingDescription(true)
  }
  const handleDescriptionSave = () => {
    if (descriptionInput.trim()) saveHomeDescription(descriptionInput.trim())
  }
  const handleDescriptionCancel = () => {
    setIsEditingDescription(false)
    setDescriptionInput('')
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
    bannerImageInputRef,
    isUploadingBannerImage,
    handleBannerImageChange,
    profileImage,
    profileImageInputRef,
    isUploadingProfileImage,
    handleProfileImageChange,
    homeDescription,
    isEditingDescription,
    descriptionInput,
    setDescriptionInput,
    isSavingDescription,
    handleDescriptionEditStart,
    handleDescriptionSave,
    handleDescriptionCancel,
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
    socialLinks,
    showAddSocialLink,
    setShowAddSocialLink,
    socialLinkForm,
    setSocialLinkForm,
    isAddingSocialLink,
    addSocialLink,
    removeSocialLink,
    allProjects,
    featuredProjects,
    featuredProjectIds,
    isSavingFeatured,
    saveFeaturedProjectIds,
  }
}

export { useHomeViewController }
