import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import {
  BookOpenIcon,
  BriefcaseIcon,
  CalendarIcon,
  ExternalLinkIcon,
  GithubIcon,
  ImagesIcon,
  NewspaperIcon,
  TrophyIcon,
  UsersIcon,
} from 'lucide-react'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '#/components/ui/carousel'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { ScrollArea } from '#/components/ui/scroll-area'
import { TECH_STACK_GROUP_COLORS, type TechStackGroup } from '#/types/techstack'
import { groupAndOrderTechStack } from '#/lib/techstack'
import type { Project } from '#/types/project'
import type { Experience } from '#/types/experience'
import type { News } from '#/types/news'
import { fetchExperience } from '#/api/experience/experience'
import { fetchPublications } from '#/api/publications/publications'
import { fetchNews } from '#/api/news/news'
import { fetchAwards } from '#/api/awards/awards'
import { NewsDetailDialog } from '#/pages/news/components/NewsDetailDialog'

const ProjectDetailDialog = ({
  project,
  open,
  onOpenChange,
  linkedExperience: linkedExperienceProp,
}: {
  project: Project | null
  open: boolean
  onOpenChange: (open: boolean) => void
  linkedExperience?: Experience
}) => {
  const [detailNews, setDetailNews] = useState<News | null>(null)
  const [showNewsDetail, setShowNewsDetail] = useState(false)

  const { data: experiences = [] } = useQuery({
    queryKey: ['experience'],
    queryFn: fetchExperience,
    enabled: !!project,
    staleTime: 1000 * 60 * 10,
  })

  const { data: publications = [] } = useQuery({
    queryKey: ['publications'],
    queryFn: fetchPublications,
    enabled: !!project,
    staleTime: 1000 * 60 * 10,
  })

  const { data: allNews = [] } = useQuery({
    queryKey: ['news'],
    queryFn: fetchNews,
    enabled: !!project,
    staleTime: 1000 * 60 * 10,
  })

  const { data: awards = [] } = useQuery({
    queryKey: ['awards'],
    queryFn: fetchAwards,
    enabled: !!project,
    staleTime: 1000 * 60 * 10,
  })

  if (!project) return null

  const linkedExperience =
    linkedExperienceProp ??
    (project.experienceId
      ? experiences.find((e) => e.id === project.experienceId)
      : undefined)

  const linkedPublications = publications.filter((p) => p.projectId === project.id)
  const linkedNews = allNews.filter((n) => n.projectId === project.id)
  const linkedAwards = awards.filter((a) => a.projectId === project.id)
  const hasRelatedContent =
    linkedPublications.length > 0 || linkedNews.length > 0 || linkedAwards.length > 0

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl w-full p-0 overflow-hidden max-h-[90vh] flex flex-col">
          {project.images.length > 0 ? (
            <div className="relative bg-muted">
              {project.images.length === 1 ? (
                <img
                  src={project.images[0].url}
                  alt={project.title}
                  className="w-full max-h-72 object-cover"
                />
              ) : (
                <div className="px-10 py-2">
                  <Carousel opts={{ loop: true }}>
                    <CarouselContent>
                      {project.images.map((img, index) => (
                        <CarouselItem key={img.path}>
                          <div className="flex items-center justify-center bg-muted overflow-hidden">
                            <img
                              src={img.url}
                              alt={`${project.title} - ${index + 1}`}
                              className="max-h-64 w-full object-contain"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                  <p className="text-center text-xs text-muted-foreground mt-1 pb-1">
                    {project.images.length} photos
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 bg-muted text-muted-foreground">
              <ImagesIcon className="w-10 h-10" />
            </div>
          )}

          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="px-6 py-5 flex flex-col gap-5">
              <DialogHeader>
                <div className="flex items-start gap-3">
                  {project.logoUrl && (
                    <img src={project.logoUrl} alt={project.title} className="w-10 h-10 rounded-lg object-contain shrink-0 bg-muted p-1" />
                  )}
                  <div className="flex flex-col gap-1">
                    <DialogTitle className="text-2xl font-bold leading-tight">
                      {project.title}
                    </DialogTitle>
                    {project.isExperimental && (
                      <Badge variant="outline" className="w-fit text-xs border-amber-400 text-amber-600 dark:text-amber-400">
                        Experimental
                      </Badge>
                    )}
                  </div>
                </div>
              </DialogHeader>

              {linkedExperience && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <BriefcaseIcon className="w-4 h-4 shrink-0" />
                  <span>{linkedExperience.company} · {linkedExperience.title}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4" />
                  <span>
                    {format(project.startDate, 'MMM yyyy')}
                    {' – '}
                    {project.isOngoing
                      ? 'Present'
                      : project.endDate
                        ? format(project.endDate, 'MMM yyyy')
                        : '…'}
                  </span>
                </div>

                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLinkIcon className="w-4 h-4" />
                    <span>Live Demo</span>
                  </a>
                )}

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <GithubIcon className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>
                )}
              </div>

              {project.members && project.members.length > 0 && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 text-sm font-semibold">
                    <UsersIcon className="w-4 h-4" />
                    <span>People</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {project.members.map((member, i) => (
                      <div
                        key={i}
                        className="flex flex-col rounded-md border px-3 py-2"
                      >
                        <span className="text-sm font-medium">{member.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {member.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {project.techStack.length > 0 && (() => {
                const { grouped, orderedGroups } = groupAndOrderTechStack(project.techStack)
                return (
                  <div className="flex flex-col gap-3">
                    <span className="text-sm font-semibold">Tech Stack</span>
                    {orderedGroups.map((g) => (
                      <div key={g} className="flex flex-wrap items-center gap-1.5">
                        <span className="text-xs font-medium text-muted-foreground w-16 shrink-0">{g}</span>
                        <div className="flex flex-wrap gap-1.5">
                          {grouped[g].map((tech, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className={`flex items-center gap-1.5 px-2 py-1 h-auto border-0 ${TECH_STACK_GROUP_COLORS[(g as TechStackGroup)] ?? TECH_STACK_GROUP_COLORS.Other}`}
                            >
                              {tech.iconUrl && (
                                <img
                                  src={tech.iconUrl}
                                  alt={tech.name}
                                  className="w-4 h-4 object-contain"
                                />
                              )}
                              <span className="text-xs">{tech.name}</span>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })()}

              <div
                className="prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: project.description }}
              />

              {hasRelatedContent && (
                <div className="flex flex-col gap-3 border-t pt-4">
                  <span className="text-sm font-semibold">Related Content</span>

                  {linkedPublications.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <BookOpenIcon className="w-3.5 h-3.5" />
                        Publications
                      </div>
                      {linkedPublications.map((pub) => (
                        <div key={pub.id} className="flex items-center justify-between gap-2 rounded-md border px-3 py-2">
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <span className="text-sm font-medium line-clamp-1">{pub.title}</span>
                            <span className="text-xs text-muted-foreground">{pub.journal} · {pub.publicationYear}</span>
                          </div>
                          {pub.link && (
                            <a href={pub.link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                              <Button variant="outline" size="sm" className="shrink-0 gap-1">
                                <ExternalLinkIcon className="w-3.5 h-3.5" />
                                Link
                              </Button>
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {linkedNews.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <NewspaperIcon className="w-3.5 h-3.5" />
                        News
                      </div>
                      {linkedNews.map((newsItem) => (
                        <div key={newsItem.id} className="flex items-center justify-between gap-2 rounded-md border px-3 py-2">
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <span className="text-sm font-medium line-clamp-1">{newsItem.title}</span>
                            <span className="text-xs text-muted-foreground">{newsItem.category} · {format(newsItem.date, 'MMM yyyy')}</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="shrink-0"
                            onClick={() => { setDetailNews(newsItem); setShowNewsDetail(true) }}
                          >
                            View Details
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {linkedAwards.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <TrophyIcon className="w-3.5 h-3.5" />
                        Awards
                      </div>
                      {linkedAwards.map((award) => (
                        <div key={award.id} className="rounded-md border px-3 py-2">
                          <span className="text-sm font-medium">{award.title}</span>
                          <span className="block text-xs text-muted-foreground">{award.issuer} · {format(award.date, 'MMM yyyy')}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <NewsDetailDialog
        news={detailNews}
        open={showNewsDetail}
        onOpenChange={setShowNewsDetail}
      />
    </>
  )
}

export { ProjectDetailDialog }
