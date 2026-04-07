import { format } from 'date-fns'
import {
  CalendarIcon,
  ExternalLinkIcon,
  GithubIcon,
  ImagesIcon,
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
import { ScrollArea } from '#/components/ui/scroll-area'
import type { Project } from '#/types/project'

const ProjectDetailDialog = ({
  project,
  open,
  onOpenChange,
}: {
  project: Project | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) => {
  if (!project) return null

  return (
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
              <DialogTitle className="text-2xl font-bold leading-tight">
                {project.title}
              </DialogTitle>
            </DialogHeader>

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

            {project.techStack.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold">Tech Stack</span>
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="flex items-center gap-1.5 px-2 py-1 h-auto"
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
            )}

            <div
              className="prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: project.description }}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export { ProjectDetailDialog }
