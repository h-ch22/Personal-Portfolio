import { ScrollArea } from '#/components/ui/scroll-area'
import { useHomeViewController } from './HomePage.lib'

import yujee from '#/assets/images/yujee.png'
import { Spinner } from '#/components/ui/spinner'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '#/components/ui/dialog'
import { format } from 'date-fns'
import {
  BookOpenIcon,
  CalendarIcon,
  CheckIcon,
  ChevronRightIcon,
  CpuIcon,
  GalleryHorizontalEndIcon,
  ImagesIcon,
  NewspaperIcon,
  PencilIcon,
  PlusIcon,
  UsersIcon,
  XIcon,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import type { Publication } from '#/types/publication'
import type { News, NewsCategory } from '#/types/news'
import type { Gallery } from '#/types/gallery'
import type { TechStack, TechStackCategory } from '#/types/techstack'

const CATEGORY_VARIANT: Record<
  NewsCategory,
  'default' | 'secondary' | 'outline'
> = {
  Award: 'default',
  Research: 'secondary',
  Publication: 'secondary',
  Activity: 'outline',
  Press: 'outline',
  Other: 'outline',
}

const TECH_CATEGORIES: TechStackCategory[] = [
  'Language',
  'Framework',
  'Tool',
  'Platform',
  'Database',
  'Other',
]

function PublicationPreviewCard({ data }: { data: Publication }) {
  return (
    <Card className="gap-2">
      <CardHeader className="pb-1">
        <CardTitle className="text-base line-clamp-2 leading-snug">
          {data.title}
        </CardTitle>
        <div className="flex flex-row items-center gap-1 flex-wrap">
          <Badge variant="outline">{data.type}</Badge>
          <Badge>{data.journal}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <div className="flex flex-row items-center gap-1 text-xs text-muted-foreground flex-wrap">
          <UsersIcon className="w-3.5 h-3.5 shrink-0" />
          {data.authors.map((a, i) => (
            <span
              key={i}
              className={a === 'Yujee Chang' ? 'font-semibold' : ''}
            >
              {`${a}${i !== data.authors.length - 1 ? ',' : ''}`}
            </span>
          ))}
        </div>
        <div className="flex flex-row items-center gap-1 text-xs text-muted-foreground">
          <CalendarIcon className="w-3.5 h-3.5" />
          <span>{`${data.publicationYear}.${String(data.publicationMonth).padStart(2, '0')}`}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function NewsPreviewCard({ data }: { data: News }) {
  const thumbnail = data.images[0]?.url
  return (
    <Card className="overflow-hidden gap-0">
      {thumbnail && (
        <div className="w-full h-40 overflow-hidden">
          <img
            src={thumbnail}
            alt={data.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader className="pt-3 pb-1">
        <div className="flex flex-row items-start justify-between gap-2">
          <CardTitle className="text-base line-clamp-2 leading-snug flex-1">
            {data.title}
          </CardTitle>
          <Badge variant={CATEGORY_VARIANT[data.category]} className="shrink-0">
            {data.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3 flex flex-col gap-1">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <CalendarIcon className="w-3.5 h-3.5" />
          <span>{format(data.date, 'MMM yyyy')}</span>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {data.description}
        </p>
      </CardContent>
    </Card>
  )
}

function GalleryPreviewCard({ data }: { data: Gallery }) {
  const thumbnail = data.images[0]?.url
  return (
    <Card className="overflow-hidden gap-0">
      <div className="w-full h-44 bg-muted overflow-hidden">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={data.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <ImagesIcon className="w-8 h-8" />
          </div>
        )}
      </div>
      <CardHeader className="pt-3 pb-1">
        <CardTitle className="text-base line-clamp-1">{data.title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex flex-row items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>{format(data.date, 'MMM yyyy')}</span>
          </div>
          <div className="flex items-center gap-1">
            <ImagesIcon className="w-3.5 h-3.5" />
            <span>{data.images.length}</span>
          </div>
        </div>
        {data.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {data.description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function TechStackCard({
  data,
  isAdmin,
  onDelete,
}: {
  data: TechStack
  isAdmin: boolean
  onDelete: (id: string) => void
}) {
  return (
    <div className="relative group flex flex-col items-center gap-2 p-4 rounded-xl border bg-card hover:shadow-md transition-shadow">
      {isAdmin && (
        <button
          type="button"
          onClick={() => onDelete(data.id)}
          className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded-full bg-destructive text-destructive-foreground"
        >
          <XIcon className="w-3 h-3" />
        </button>
      )}
      <span className="text-4xl">{data.icon}</span>
      <span className="text-sm font-medium text-center">{data.name}</span>
      <Badge variant="outline" className="text-xs">
        {data.category}
      </Badge>
    </div>
  )
}

export default function HomePage() {
  const {
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
  } = useHomeViewController()

  const groupedTechStacks = techStacks.reduce<
    Record<TechStackCategory, TechStack[]>
  >(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = []
      acc[item.category].push(item)
      return acc
    },
    {} as Record<TechStackCategory, TechStack[]>,
  )

  return (
    <ScrollArea className="w-full min-h-screen">
      <div className="flex flex-col gap-4 overflow-hidden">
        <div
          className={`flex w-full h-screen items-center justify-center bg-primary transition-opacity duration-1000 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        >
          {isLoaded ? (
            <div
              className={`flex flex-col items-center gap-6 transition-all duration-1000 transform ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
              <img
                src={bannerImage || yujee}
                className="object-contain w-96 h-96"
              />

              {isEditingBanner ? (
                <div className="flex flex-col items-center gap-3">
                  <Input
                    value={bannerTextInput}
                    onChange={(e) => setBannerTextInput(e.target.value)}
                    className="font-great-vibes text-4xl text-center bg-white/10 text-white border-white/30 placeholder:text-white/50 w-80"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleBannerSave()
                      if (e.key === 'Escape') handleBannerCancel()
                    }}
                    autoFocus
                  />
                  <div className="flex flex-row gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={handleBannerSave}
                      disabled={isSavingBanner}
                    >
                      <CheckIcon className="w-4 h-4" />
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleBannerCancel}
                      className="text-white hover:bg-white/10"
                    >
                      <XIcon className="w-4 h-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="relative group flex items-center gap-2">
                  <div className="font-great-vibes text-7xl text-white text-center">
                    {bannerText}
                  </div>
                  {user && isAdmin && (
                    <button
                      type="button"
                      onClick={handleBannerEditStart}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <Spinner />
          )}
        </div>

        <div className="flex flex-col gap-4 bg-muted text-center py-4">
          <div className="flex flex-row items-center w-full gap-2 text-4xl font-semibold justify-center text-foreground">
            {'👋🏻 Hi there!'}
          </div>

          <div className="flex flex-row items-center justify-center">
            <img src={yujee} className="w-64" />
          </div>

          <div className="text-muted-foreground">
            {
              "Welcome to my personal website! I'm Yujee, a passionate software developer with a love for creating innovative solutions. This website serves as a portfolio of my projects, a blog where I share my thoughts on technology and programming, and a space to connect with like-minded individuals. Feel free to explore and reach out if you'd like to collaborate or just say hi!"
            }
          </div>
        </div>

        <div className="flex flex-col gap-4 px-6 py-8">
          <div className="flex flex-row items-end justify-between">
            <div>
              <div className="flex items-center gap-2 text-3xl font-bold text-foreground">
                <CpuIcon className="w-7 h-7" />
                Tech Stack
              </div>
              <p className="text-muted-foreground mt-1">
                Tools and technologies I work with
              </p>
            </div>
            {user && isAdmin && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowAddTechStack(true)}
              >
                <PlusIcon className="w-4 h-4" />
              </Button>
            )}
          </div>

          {techStacks.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">
              No tech stacks added yet.
            </p>
          ) : (
            <div className="flex flex-col gap-6">
              {TECH_CATEGORIES.filter(
                (cat) => groupedTechStacks[cat]?.length > 0,
              ).map((cat) => (
                <div key={cat} className="flex flex-col gap-3">
                  <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    {cat}
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                    {groupedTechStacks[cat].map((item) => (
                      <TechStackCard
                        key={item.id}
                        data={item}
                        isAdmin={!!(user && isAdmin)}
                        onDelete={removeTechStack}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 px-6 py-8 bg-muted">
          <div className="flex flex-row items-end justify-between">
            <div>
              <div className="flex items-center gap-2 text-3xl font-bold text-foreground">
                <BookOpenIcon className="w-7 h-7" />
                Latest Publications
              </div>
              <p className="text-muted-foreground mt-1">
                Recent research papers and conference proceedings
              </p>
            </div>
            <Button variant="ghost" asChild>
              <Link to="/publications">
                View All
                <ChevronRightIcon className="w-4 h-4" />
              </Link>
            </Button>
          </div>
          <div className="flex flex-col gap-3">
            {publications.map((pub) => (
              <PublicationPreviewCard key={pub.id} data={pub} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 px-6 py-8">
          <div className="flex flex-row items-end justify-between">
            <div>
              <div className="flex items-center gap-2 text-3xl font-bold text-foreground">
                <NewspaperIcon className="w-7 h-7" />
                Latest News
              </div>
              <p className="text-muted-foreground mt-1">
                Recent activities, awards, and updates
              </p>
            </div>
            <Button variant="ghost" asChild>
              <Link to="/news">
                View All
                <ChevronRightIcon className="w-4 h-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {news.map((item) => (
              <NewsPreviewCard key={item.id} data={item} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 px-6 py-8 bg-muted">
          <div className="flex flex-row items-end justify-between">
            <div>
              <div className="flex items-center gap-2 text-3xl font-bold text-foreground">
                <GalleryHorizontalEndIcon className="w-7 h-7" />
                Latest Gallery
              </div>
              <p className="text-muted-foreground mt-1">
                Photos and moments from recent events
              </p>
            </div>
            <Button variant="ghost" asChild>
              <Link to="/gallery">
                View All
                <ChevronRightIcon className="w-4 h-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleries.map((item) => (
              <GalleryPreviewCard key={item.id} data={item} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 bg-secondary text-center py-4">
          <div className="flex flex-row items-center w-full gap-2 text-4xl font-semibold justify-center text-foreground">
            {'🫰🏻 Get in touch!'}
          </div>
        </div>
      </div>

      <Dialog open={showAddTechStack} onOpenChange={setShowAddTechStack}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Tech Stack</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Icon (emoji)</label>
              <Input
                placeholder="e.g. ⚛️"
                value={techStackForm.icon}
                onChange={(e) =>
                  setTechStackForm((prev) => ({
                    ...prev,
                    icon: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Name</label>
              <Input
                placeholder="e.g. React"
                value={techStackForm.name}
                onChange={(e) =>
                  setTechStackForm((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={techStackForm.category}
                onValueChange={(val) =>
                  setTechStackForm((prev) => ({
                    ...prev,
                    category: val as TechStackCategory,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TECH_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {techStackForm.icon && techStackForm.name && (
              <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted">
                <span className="text-3xl">{techStackForm.icon}</span>
                <div>
                  <div className="font-medium">{techStackForm.name}</div>
                  <Badge variant="outline" className="text-xs mt-0.5">
                    {techStackForm.category}
                  </Badge>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddTechStack(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => addTechStack(techStackForm)}
              disabled={
                !techStackForm.name.trim() ||
                !techStackForm.icon.trim() ||
                isAddingTechStack
              }
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ScrollArea>
  )
}
